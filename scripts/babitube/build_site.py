"""Step 4: slim the full dataset down to what /babitube needs.

Usage: python build_site.py <youtube_posts.json> <out_dir> [youtube_comments.json]

Writes videos.json (loaded on every /babitube visit), plus descriptions.json and playlists.json (loaded on demand).
"""
import collections
import json
import os
import re
import sys
from urllib.parse import quote

SIGNATURE = 'dagmawi_babi'


def avatar(url):
    # Channel images come back at 800px; the UI never draws one above 160px.
    return re.sub(r'=s\d+', '=s176', url) if url else None


def compact(d):
    return {k: v for k, v in d.items() if v not in (None, [], '', False)}


def slim_rich(segments, known_videos):
    """Plain text becomes a bare string; YouTube links to videos in the catalog stay on the site."""
    out = []
    for seg in segments:
        if seg['type'] == 'plain':
            if out and isinstance(out[-1], str):
                out[-1] += seg['text']
            else:
                out.append(seg['text'])
            continue
        href = seg.get('href')
        if seg.get('videoId') in known_videos:
            href = f"/babitube/watch?v={seg['videoId']}"
        elif seg['type'] == 'hashtag':
            href = f"/babitube/results?search_query={quote(seg['text'].lstrip('#'))}"
        out.append(compact({'t': seg['text'], 'k': seg['type'], 'h': href}))
    return out


def post_segments(post):
    """What a post said about its video: no tags or signature, and no link to the video itself."""
    single_video = len(post['youtubeLinks']) == 1
    kept = []
    for seg in post['richText']:
        if seg['type'] == 'hashtag' or seg['text'].lower() == f'@{SIGNATURE}':
            continue
        if single_video and seg.get('linkKind') == 'youtube':
            # A bare URL goes, but a link hidden behind words keeps its words.
            if re.search(r'(youtu\.?be|^https?:)', seg['text'], re.I):
                continue
            seg = {'type': 'plain', 'text': seg['text']}
        kept.append(seg)
    merged = []
    for seg in kept:
        if seg['type'] == 'plain' and merged and merged[-1]['type'] == 'plain':
            merged[-1] = {'type': 'plain', 'text': merged[-1]['text'] + seg['text']}
        else:
            merged.append(dict(seg))
    for seg in merged:
        if seg['type'] == 'plain':
            text = re.sub(r'^[ \t]*[•\-–—·][ \t]*$', '', seg['text'], flags=re.M)
            text = re.sub(r'[ \t]+$', '', text, flags=re.M)
            seg['text'] = re.sub(r'\n{3,}', '\n\n', text)
    if merged and merged[0]['type'] == 'plain':
        merged[0]['text'] = merged[0]['text'].lstrip()
    if merged and merged[-1]['type'] == 'plain':
        merged[-1]['text'] = merged[-1]['text'].rstrip()
    return [s for s in merged if s['text']]


def slim_post(post, known_videos):
    return compact({
        'id': post['postId'],
        'at': post['unixTime'],
        'local': post['postedAtLocal'],
        'rich': slim_rich(post_segments(post), known_videos),
        'tags': post['tags'],
        'fwd': post['forwardedFrom'] or post['isForwarded'],
        'rx': [[r['emoji'], r['count']] for r in post['reactions'] if isinstance(r['emoji'], str) and len(r['emoji']) <= 8],
    })


def slim_contents(summary):
    return compact({
        'title': summary['title'],
        'channel': summary['channelTitle'],
        'channelUrl': summary['channelUrl'],
        'items': [
            compact({
                'id': v['videoId'],
                'title': v['title'],
                'channel': v['channelTitle'],
                'channelUrl': v['channelUrl'],
                'channelImg': avatar(v['channelThumbnail']),
                'subs': v['channelSubscriberCount'],
                'published': v['publishedAt'],
                'duration': v['durationSeconds'],
                'views': v['viewCount'],
                'likes': v['likeCount'],
            })
            for v in summary['items']
        ],
    })


def fallback_title(post):
    for line in post['content'].splitlines():
        if line.strip():
            return line.strip()[:100]
    return 'Unavailable video'


def slim_comment(c, known_videos):
    return compact({
        'id': c['commentId'],
        'thread': c['threadId'],
        'by': c['author'],
        'own': c['isChannelOwner'],
        'at': c['unixTime'],
        'local': c['date'],
        'edit': c['edited'],
        'rich': slim_rich(c['richText'], known_videos),
        'media': c['media'],
        'sticker': c['stickerEmoji'],
        'rx': [[r['emoji'], r['count']] for r in c['reactions'] if isinstance(r['emoji'], str) and len(r['emoji']) <= 8],
    })


def main(src, out_dir, comments_path=None):
    with open(src, encoding='utf-8') as f:
        doc = json.load(f)
    comments, comment_meta = {}, {}
    if comments_path:
        with open(comments_path, encoding='utf-8') as f:
            loaded = json.load(f)
        comments, comment_meta = loaded['posts'], loaded['meta']
    known = {l['videoId'] for p in doc['posts'] for l in p['youtubeLinks'] if l['videoId']}
    comment_count = lambda item: sum(comments.get(str(p['id']), {}).get('commentCount', 0) for p in item['posts'])

    videos, playlists, channels, descriptions, contents = {}, {}, {}, {}, {}
    for post in doc['posts']:
        for link in post['youtubeLinks']:
            yt = link.get('youtube') or {}
            summary = link.get('playlist')
            if summary and summary['items'] and link['playlistId'] not in contents:
                contents[link['playlistId']] = slim_contents(summary)
            if link['videoId']:
                vid = link['videoId']
                entry = videos.setdefault(vid, compact({
                    'id': vid,
                    'title': yt.get('title') or link.get('displayText') or fallback_title(post),
                    'channel': yt.get('channelTitle'),
                    'channelUrl': yt.get('channelUrl'),
                    'channelImg': avatar(yt.get('channelThumbnail')),
                    'subs': yt.get('channelSubscriberCount'),
                    'published': yt.get('publishedAt'),
                    'duration': yt.get('durationSeconds'),
                    'views': yt.get('viewCount'),
                    'likes': yt.get('likeCount'),
                    'comments': yt.get('commentCount'),
                    'category': yt.get('category'),
                    'list': link['playlistId'],
                    'start': link['startAt'],
                    'short': link['isShort'],
                    'live': link['isLive'],
                    'missing': not yt.get('title'),
                    'url': link['url'] if link['url'].startswith('http') else 'https://' + link['url'],
                }))
                entry.setdefault('cats', [])
                entry.setdefault('posts', [])
                entry['cats'] = list(dict.fromkeys(entry['cats'] + link['categories']))
                if post['postId'] not in [p['id'] for p in entry['posts']]:
                    entry['posts'].append(slim_post(post, known))
                if yt.get('description'):
                    descriptions[vid] = yt['description']
            elif link['kind'] == 'playlist':
                pid = link['playlistId']
                entry = playlists.setdefault(pid, compact({
                    'id': pid,
                    'title': yt.get('title') or link.get('displayText') or fallback_title(post),
                    'channel': yt.get('channelTitle'),
                    'channelUrl': yt.get('channelUrl'),
                    'thumb': yt.get('thumbnail'),
                    'count': yt.get('videoCount'),
                    'published': yt.get('publishedAt'),
                    'cats': [c for c in link['categories'] if c != 'playlists'],
                    'missing': not yt.get('title'),
                }))
                entry.setdefault('posts', [])
                if post['postId'] not in [p['id'] for p in entry['posts']]:
                    entry['posts'].append(slim_post(post, known))
            elif link['kind'] == 'channel' and link['normalizedUrl']:
                ref = link['channelRef']
                entry = channels.setdefault(ref.lower(), compact({
                    'ref': ref,
                    'name': yt.get('title') or ref.split('/')[-1],
                    'url': link['normalizedUrl'],
                    'img': avatar(yt.get('thumbnail')),
                    'subs': yt.get('subscriberCount'),
                    'own': link['isOwnChannel'],
                }))
                entry['mentions'] = entry.get('mentions', 0) + 1
                entry['lastAt'] = max(entry.get('lastAt', 0), post['unixTime'])
                entry['lastPost'] = post['postId']

    latest = lambda item: max(p['at'] for p in item['posts'])
    for video in videos.values():
        count = comment_count(video)
        if count:
            video['discussion'] = count
    for pid, playlist in playlists.items():
        count = comment_count(playlist)
        if count:
            playlist['discussion'] = count
        runtime = sum(i.get('duration', 0) for i in contents.get(pid, {}).get('items', []))
        if runtime:
            playlist['duration'] = runtime
    # The chips filter unique videos, so their counts must too.
    counts = collections.Counter(cat for v in videos.values() for cat in v['cats'])
    site = {
        'meta': {
            **doc['meta'],
            'categoryCounts': dict(counts.most_common()),
            **({
                'commentCount': comment_meta['commentCount'],
                'commenterCount': comment_meta['commenterCount'],
                'postsWithComments': comment_meta['postsWithComments'],
                'firstCommentAt': comment_meta['firstCommentAt'],
            } if comment_meta else {}),
        },
        'channel': doc['channel'],
        'videos': sorted(videos.values(), key=latest, reverse=True),
        'playlists': sorted(playlists.values(), key=latest, reverse=True),
        'channels': sorted(channels.values(), key=lambda c: c['lastAt'], reverse=True),
    }
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, 'videos.json'), 'w', encoding='utf-8') as f:
        json.dump(site, f, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(out_dir, 'descriptions.json'), 'w', encoding='utf-8') as f:
        json.dump(descriptions, f, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(out_dir, 'playlists.json'), 'w', encoding='utf-8') as f:
        json.dump(contents, f, ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(out_dir, 'comments.json'), 'w', encoding='utf-8') as f:
        slim = {post: [slim_comment(c, known) for c in entry['comments']] for post, entry in comments.items()}
        json.dump(slim, f, ensure_ascii=False, separators=(',', ':'))
    print(f"{len(contents)} playlists with contents, comments on {len(comments)} posts")
    print(f"{len(site['videos'])} videos, {len(site['playlists'])} playlists, {len(site['channels'])} channels, {len(descriptions)} descriptions")


if __name__ == '__main__':
    main(*sys.argv[1:4])
