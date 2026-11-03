"""Step 2: attach YouTube metadata to every extracted link.

Usage: python enrich.py <extracted.json> <out.json> <cache.json>

Two official sources are supported and share a cache, so this can be re-run safely:
  * YOUTUBE_API_KEY set -> YouTube Data API v3 (date, description, duration, stats, tags, ...)
  * otherwise           -> public oEmbed endpoint (title, channel, thumbnail only)
"""
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

API = 'https://www.googleapis.com/youtube/v3'
OEMBED = 'https://www.youtube.com/oembed'
UA = {'User-Agent': 'portfolio-babitube-enrich/1.0'}
MAX_THROTTLES = 5
MAX_PLAYLIST_ITEMS = 500

# https://developers.google.com/youtube/v3/docs/videoCategories/list
CATEGORY_NAMES = {
    '1': 'Film & Animation', '2': 'Autos & Vehicles', '10': 'Music', '15': 'Pets & Animals',
    '17': 'Sports', '19': 'Travel & Events', '20': 'Gaming', '22': 'People & Blogs',
    '23': 'Comedy', '24': 'Entertainment', '25': 'News & Politics', '26': 'Howto & Style',
    '27': 'Education', '28': 'Science & Technology', '29': 'Nonprofits & Activism',
}


class Throttled(Exception):
    pass


def get_json(url, attempts=4):
    """Fetch JSON, retrying dropped connections and server errors but not client errors."""
    for attempt in range(attempts):
        try:
            with urlopen(Request(url, headers=UA), timeout=30) as res:
                return json.load(res)
        except HTTPError as e:
            if e.code < 500 or attempt == attempts - 1:
                raise
        except OSError:
            if attempt == attempts - 1:
                raise
        time.sleep(2 ** attempt)


def now():
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def iso_duration_to_seconds(value):
    m = re.fullmatch(r'P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', value or '')
    if not m:
        return None
    d, h, mins, s = (int(x or 0) for x in m.groups())
    return d * 86400 + h * 3600 + mins * 60 + s


def int_or_none(value):
    return int(value) if value is not None else None


def best_thumb(thumbs):
    for size in ('maxres', 'standard', 'high', 'medium', 'default'):
        if size in (thumbs or {}):
            return thumbs[size]['url']
    return None


# --- oEmbed ---------------------------------------------------------------


def oembed_fetch(target):
    url = f'https://www.youtube.com/watch?v={target}' if len(target) == 11 else f'https://www.youtube.com/playlist?list={target}'
    try:
        data = get_json(f'{OEMBED}?{urlencode({"url": url, "format": "json"})}')
    except HTTPError as e:
        if e.code == 429:
            raise Throttled() from e
        reason = {401: 'embedding disabled or private', 403: 'embedding disabled or private', 404: 'unavailable', 400: 'unavailable'}
        return {'source': 'oembed', 'available': e.code in (401, 403), 'error': reason.get(e.code, f'http {e.code}'), 'fetchedAt': now()}
    return {
        'source': 'oembed',
        'available': True,
        'title': data.get('title'),
        'channelTitle': data.get('author_name'),
        'channelUrl': data.get('author_url'),
        'thumbnail': data.get('thumbnail_url'),
        'fetchedAt': now(),
    }


def run_oembed(targets, cache, cache_path):
    todo = [t for t in targets if t not in cache]
    print(f'oembed: {len(todo)} to fetch, {len(targets) - len(todo)} cached')
    throttles = 0

    def task(target):
        time.sleep(0.15)
        for attempt in range(3):
            try:
                return target, oembed_fetch(target)
            except Throttled:
                return target, 'throttled'
            except (URLError, TimeoutError):
                time.sleep(2 * (attempt + 1))
        return target, None

    with ThreadPoolExecutor(max_workers=3) as pool:
        for i, (target, result) in enumerate(pool.map(task, todo), 1):
            if result == 'throttled':
                throttles += 1
                if throttles >= MAX_THROTTLES:
                    print('oembed: throttled by YouTube, stopping. Re-run later to resume.')
                    pool.shutdown(wait=False, cancel_futures=True)
                    break
            elif result:
                cache[target] = result
            if i % 50 == 0:
                save(cache, cache_path)
                print(f'  {i}/{len(todo)}')
    save(cache, cache_path)


# --- Data API -------------------------------------------------------------


def api_list(resource, key, parts, ids):
    """Yield items for ids, 50 at a time. Each batch costs one quota unit."""
    for i in range(0, len(ids), 50):
        qs = urlencode({'part': parts, 'id': ','.join(ids[i : i + 50]), 'maxResults': 50, 'key': key})
        yield from get_json(f'{API}/{resource}?{qs}').get('items', [])


def from_video(item):
    sn, cd, st = item.get('snippet', {}), item.get('contentDetails', {}), item.get('statistics', {})
    status, live = item.get('status', {}), item.get('liveStreamingDetails', {})
    return {
        'source': 'data-api-v3',
        'available': True,
        'title': sn.get('title'),
        'description': sn.get('description'),
        'publishedAt': sn.get('publishedAt'),
        'durationSeconds': iso_duration_to_seconds(cd.get('duration')),
        'viewCount': int_or_none(st.get('viewCount')),
        'likeCount': int_or_none(st.get('likeCount')),
        'commentCount': int_or_none(st.get('commentCount')),
        'channelTitle': sn.get('channelTitle'),
        'channelId': sn.get('channelId'),
        'channelUrl': f"https://www.youtube.com/channel/{sn['channelId']}" if sn.get('channelId') else None,
        'thumbnail': best_thumb(sn.get('thumbnails')),
        'tags': sn.get('tags') or [],
        'categoryId': sn.get('categoryId'),
        'category': CATEGORY_NAMES.get(sn.get('categoryId')),
        'topics': item.get('topicDetails', {}).get('topicCategories') or [],
        'language': sn.get('defaultLanguage') or sn.get('defaultAudioLanguage'),
        'liveStatus': sn.get('liveBroadcastContent'),
        'liveStartedAt': live.get('actualStartTime'),
        'definition': cd.get('definition'),
        'hasCaptions': cd.get('caption') == 'true',
        'license': status.get('license'),
        'embeddable': status.get('embeddable'),
        'madeForKids': status.get('madeForKids'),
        'privacyStatus': status.get('privacyStatus'),
        'fetchedAt': now(),
    }


def from_playlist(item):
    sn = item.get('snippet', {})
    return {
        'source': 'data-api-v3',
        'available': True,
        'title': sn.get('title'),
        'description': sn.get('description'),
        'publishedAt': sn.get('publishedAt'),
        'channelTitle': sn.get('channelTitle'),
        'channelId': sn.get('channelId'),
        'channelUrl': f"https://www.youtube.com/channel/{sn['channelId']}" if sn.get('channelId') else None,
        'thumbnail': best_thumb(sn.get('thumbnails')),
        'videoCount': item.get('contentDetails', {}).get('itemCount'),
        'fetchedAt': now(),
    }


def from_channel(item):
    sn, st = item.get('snippet', {}), item.get('statistics', {})
    return {
        'source': 'data-api-v3',
        'available': True,
        'title': sn.get('title'),
        'description': sn.get('description'),
        'publishedAt': sn.get('publishedAt'),
        'handle': sn.get('customUrl'),
        'channelId': item.get('id'),
        'channelUrl': f"https://www.youtube.com/channel/{item.get('id')}",
        'thumbnail': best_thumb(sn.get('thumbnails')),
        'country': sn.get('country'),
        'subscriberCount': int_or_none(st.get('subscriberCount')),
        'viewCount': int_or_none(st.get('viewCount')),
        'videoCount': int_or_none(st.get('videoCount')),
        'fetchedAt': now(),
    }


def fetch_playlist_items(pid, key):
    """Return the video ids in a playlist, in order."""
    ids, token = [], None
    # Bounded by pages, not videos: some playlists return page after page of nothing.
    for _ in range(MAX_PLAYLIST_ITEMS // 50):
        params = {'part': 'contentDetails', 'playlistId': pid, 'maxResults': 50, 'key': key}
        if token:
            params['pageToken'] = token
        try:
            data = get_json(f'{API}/playlistItems?{urlencode(params)}')
        except HTTPError as e:
            # Malformed, private, deleted and auto-generated playlists can't be listed.
            if e.code in (400, 403, 404):
                return []
            raise
        ids += [i['contentDetails']['videoId'] for i in data.get('items', [])]
        token = data.get('nextPageToken')
        if not token:
            break
    return ids[:MAX_PLAYLIST_ITEMS]


def run_playlist_items(key, playlists, cache, cache_path):
    todo = [p for p in playlists if f'list:{p}' not in cache]
    print(f'api: contents of {len(todo)} playlists')
    failed = 0

    def task(pid):
        try:
            return pid, fetch_playlist_items(pid, key)
        except OSError as e:
            print(f'  playlist {pid} failed: {type(e).__name__} {getattr(e, "code", "")}', flush=True)
            return pid, None

    with ThreadPoolExecutor(max_workers=4) as pool:
        # Recorded as they finish, so one slow playlist can't hold back the others.
        for i, future in enumerate(as_completed([pool.submit(task, p) for p in todo]), 1):
            pid, ids = future.result()
            if ids is None:
                # Left uncached so the next run tries it again.
                failed += 1
                continue
            cache[f'list:{pid}'] = {'items': ids, 'fetchedAt': now()}
            save(cache, cache_path)
            print(f'  {i}/{len(todo)} {pid}: {len(ids)} videos', flush=True)
    save(cache, cache_path)
    if failed:
        print(f'api: {failed} playlists failed, re-run to retry them')

    unknown = sorted({v for p in playlists for v in cache.get(f'list:{p}', {}).get('items', [])
                      if cache.get(v, {}).get('source') != 'data-api-v3'})
    print(f'api: {len(unknown)} videos inside playlists')
    for item in api_list('videos', key, 'snippet,contentDetails,statistics,status,topicDetails,liveStreamingDetails', unknown):
        cache[item['id']] = from_video(item)
    for vid in unknown:
        if cache.get(vid, {}).get('source') != 'data-api-v3':
            cache[vid] = {'source': 'data-api-v3', 'available': False, 'error': 'deleted or private', 'fetchedAt': now()}
    save(cache, cache_path)


def playlist_summary(pid, cache):
    """A playlist's title and its playable videos, without their long descriptions."""
    contents = cache.get(f'list:{pid}')
    if not contents:
        return None
    meta = cache.get(pid) or {}
    fields = ('title', 'channelTitle', 'channelUrl', 'channelThumbnail', 'channelSubscriberCount',
              'publishedAt', 'durationSeconds', 'viewCount', 'likeCount')
    items = []
    for vid in contents['items']:
        video = cache.get(vid) or {}
        if video.get('available') and video.get('title'):
            items.append({'videoId': vid, **{f: video.get(f) for f in fields}})
    return {
        'title': meta.get('title'),
        'channelTitle': meta.get('channelTitle'),
        'channelUrl': meta.get('channelUrl'),
        'items': items,
    }


def run_api(key, videos, playlists, channels, cache, cache_path):
    missing = lambda ids: [i for i in ids if cache.get(i, {}).get('source') != 'data-api-v3']
    todo = missing(videos)
    print(f'api: {len(todo)} videos')
    for item in api_list('videos', key, 'snippet,contentDetails,statistics,status,topicDetails,liveStreamingDetails', todo):
        cache[item['id']] = from_video(item)
    # Anything videos.list did not return has been deleted or made private.
    for vid in todo:
        if cache.get(vid, {}).get('source') != 'data-api-v3':
            cache[vid] = {'source': 'data-api-v3', 'available': False, 'error': 'deleted or private', 'fetchedAt': now()}
    save(cache, cache_path)

    todo = missing(playlists)
    print(f'api: {len(todo)} playlists')
    for item in api_list('playlists', key, 'snippet,contentDetails', todo):
        cache[item['id']] = from_playlist(item)
    for pid in todo:
        if cache.get(pid, {}).get('source') != 'data-api-v3':
            cache[pid] = {'source': 'data-api-v3', 'available': False, 'error': 'deleted or private', 'fetchedAt': now()}
    save(cache, cache_path)

    run_playlist_items(key, playlists, cache, cache_path)

    # Avatars and subscriber counts live on the channel, not the video.
    wanted = sorted({v['channelId'] for v in cache.values() if v.get('channelId') and 'channelThumbnail' not in v})
    owners = {item['id']: item for item in api_list('channels', key, 'snippet,statistics', wanted)}
    for entry in cache.values():
        owner = owners.get(entry.get('channelId'))
        if owner:
            entry['channelThumbnail'] = best_thumb(owner['snippet'].get('thumbnails'))
            entry['channelHandle'] = owner['snippet'].get('customUrl')
            entry['channelSubscriberCount'] = int_or_none(owner.get('statistics', {}).get('subscriberCount'))
    save(cache, cache_path)

    todo = missing(channels)
    print(f'api: {len(todo)} channels')
    failed = 0
    for i, ref in enumerate(todo, 1):
        if ref.startswith('@'):
            param = {'forHandle': ref}
        elif ref.startswith('channel/'):
            param = {'id': ref.split('/', 1)[1]}
        else:
            param = {'forUsername': ref.split('/')[-1]}
        qs = urlencode({'part': 'snippet,statistics', **param, 'key': key})
        try:
            items = get_json(f'{API}/channels?{qs}').get('items') or []
        except OSError as e:
            # Left uncached so the next run tries it again.
            failed += 1
            print(f'  channel {ref} failed: {type(e).__name__} {getattr(e, "code", "")}')
            continue
        if items:
            cache[ref] = from_channel(items[0])
        else:
            cache[ref] = {'source': 'data-api-v3', 'available': False, 'error': 'not found', 'fetchedAt': now()}
        if i % 10 == 0:
            save(cache, cache_path)
            print(f'  {i}/{len(todo)}', flush=True)
    save(cache, cache_path)
    if failed:
        print(f'api: {failed} channels failed, re-run to retry them')


def save(cache, path):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False)


def main(src, dst, cache_path):
    with open(src, encoding='utf-8') as f:
        doc = json.load(f)
    cache = {}
    if os.path.exists(cache_path):
        with open(cache_path, encoding='utf-8') as f:
            cache = json.load(f)

    links = [l for p in doc['posts'] for l in p['youtubeLinks']]
    videos = sorted({l['videoId'] for l in links if l['videoId']})
    playlists = sorted({l['playlistId'] for l in links if l['kind'] == 'playlist'})
    # Handles are case-insensitive, and posts spell the same one several ways.
    refs = {}
    for l in links:
        if l['kind'] == 'channel' and l['channelRef'] and not l['channelRef'].startswith('/'):
            refs.setdefault(l['channelRef'].lower(), l['channelRef'])
    channels = sorted(refs.values())
    # Includes watch?v=...&list=... links, not just links to the playlist page itself.
    all_lists = sorted({l['playlistId'] for l in links if l['playlistId']})

    key = os.environ.get('YOUTUBE_API_KEY')
    if key:
        run_api(key, videos, all_lists, channels, cache, cache_path)
    else:
        run_oembed(videos + playlists, cache, cache_path)

    for link in links:
        if link['videoId']:
            target = link['videoId']
        elif link['kind'] == 'playlist':
            target = link['playlistId']
        else:
            target = refs.get((link['channelRef'] or '').lower())
        link['youtube'] = cache.get(target)
        if link['playlistId']:
            link['playlist'] = playlist_summary(link['playlistId'], cache)

    doc['meta'] = {
        'generatedAt': now(),
        'metadataSource': 'data-api-v3' if key else 'oembed',
        'postCount': len(doc['posts']),
        'linkCount': len(links),
        'uniqueVideoCount': len(videos),
        'uniquePlaylistCount': len(playlists),
        'uniqueChannelCount': len(channels),
    }
    with open(dst, 'w', encoding='utf-8') as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
    have = sum(1 for t in videos if cache.get(t, {}).get('title'))
    print(f'{have}/{len(videos)} videos have a title. Written to {dst}')


if __name__ == '__main__':
    main(*sys.argv[1:4])
