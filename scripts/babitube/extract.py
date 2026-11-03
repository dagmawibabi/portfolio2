"""Step 1: pull every post containing a YouTube link out of the Telegram export.

Usage: python extract.py <result.json> <out.json>
"""
import json
import re
import sys
from datetime import datetime, timezone
from urllib.parse import parse_qs, quote, unquote, urlsplit

CHANNEL = 'Dagmawi_Babi'
OWN_HANDLES = {'@dagmawi_babi'}
HOSTS = r'(?:(?:www\.|m\.|music\.|gaming\.|studio\.|tv\.|consent\.)?(?:youtube\.com|youtube-nocookie\.com)|youtu\.be|y2u\.be|yt\.be)'
# The lookbehind stops `notyoutube.com` or `addons.mozilla.org/.../youtube.com` from matching.
URL_RE = re.compile(r'(?<![\w.\-/@])(?:https?://)?' + HOSTS + r'(?:/[^\s<>"\'\\\)\]\}»”’]*)?', re.I)
VIDEO_ID = r'[\w-]{11}'


def clean_url(raw):
    return raw.rstrip('.,;:!?*_|…')


def classify(raw):
    """Turn a raw URL into a structured description of what it points at."""
    url = raw if re.match(r'https?://', raw, re.I) else 'https://' + raw
    parts = urlsplit(url)
    host = parts.netloc.lower().removeprefix('www.')
    path = parts.path.rstrip('/')
    qs = parse_qs(parts.query)
    first = lambda k: (qs.get(k) or [None])[0]

    info = {
        'url': raw,
        'normalizedUrl': None,
        'kind': 'other',
        'videoId': None,
        'playlistId': first('list'),
        'isPlaylist': False,
        'isShort': False,
        'isLive': False,
        'isMusicDomain': host.startswith('music.'),
        'channelRef': None,
        'startAt': first('t') or first('start'),
    }

    # Redirect wrappers and attribution links hide the real target in the query string.
    if path == '/redirect' and first('q'):
        info['kind'] = 'redirect'
        info['redirectTarget'] = unquote(first('q'))
        return info
    if path == '/attribution_link' and first('u'):
        inner = classify('https://youtube.com' + unquote(first('u')))
        inner['url'] = raw
        return inner

    vid = None
    if host in ('youtu.be', 'y2u.be', 'yt.be'):
        m = re.fullmatch(rf'/({VIDEO_ID})', path)
        vid = m.group(1) if m else None
        if not vid and path.startswith('/addme'):
            info['kind'] = 'channel'
            info['channelRef'] = path
    else:
        if path == '/watch':
            # Tolerates hand-typed urls such as watch?v=ID?t=218
            value, _, extra = (first('v') or '').partition('?')
            vid = value
            if extra.startswith('t=') and not info['startAt']:
                info['startAt'] = extra[2:]
        m = re.fullmatch(rf'/(embed|v|e|shorts|live)/({VIDEO_ID})', path)
        if m:
            vid = m.group(2)
            info['isShort'] = m.group(1) == 'shorts'
            info['isLive'] = m.group(1) == 'live'

    if vid and re.fullmatch(VIDEO_ID, vid):
        info['kind'] = 'short' if info['isShort'] else 'live' if info['isLive'] else 'video'
        info['videoId'] = vid
        info['normalizedUrl'] = f'https://www.youtube.com/watch?v={vid}'
        if info['playlistId']:
            info['isPlaylist'] = True
            info['normalizedUrl'] += f"&list={info['playlistId']}"
        return info

    if path == '/playlist' and info['playlistId']:
        info['kind'] = 'playlist'
        info['isPlaylist'] = True
        info['normalizedUrl'] = f"https://www.youtube.com/playlist?list={info['playlistId']}"
        return info

    m = re.match(r'/(@[^/]+)|/(c|channel|user)/([^/]+)', path)
    if m:
        info['kind'] = 'channel'
        info['channelRef'] = unquote(m.group(1)) if m.group(1) else f'{m.group(2)}/{m.group(3)}'
        info['normalizedUrl'] = f"https://www.youtube.com/{info['channelRef']}"
        return info

    if path == '/results':
        info['kind'] = 'search'
    elif path == '':
        info['kind'] = 'home'
    elif re.match(r'/(post|community)', path):
        info['kind'] = 'community_post'
    elif re.fullmatch(r'/[^/]+', path) and host.endswith('youtube.com'):
        # Legacy vanity urls such as youtube.com/LinusTechTips
        reserved = {'/feed', '/premium', '/account', '/trending', '/shorts', '/live', '/gaming', '/music', '/watch'}
        if path.lower() not in reserved:
            info['kind'] = 'channel'
            info['channelRef'] = path[1:]
            info['normalizedUrl'] = f'https://www.youtube.com{path}'
    return info


FORMATS = {'bold', 'italic', 'underline', 'strikethrough', 'spoiler', 'code', 'pre', 'blockquote'}
TELEGRAM_HOSTS = {'t.me', 'telegram.me', 'telegram.dog'}


def resolve_link(raw):
    """Classify a link's target. Returns None for anything but http(s), since text links can be
    written by anyone and a `javascript:` target must never become clickable."""
    url = raw.strip()
    if not re.match(r'[a-z][a-z0-9+.-]*://', url, re.I) and not re.match(r'(javascript|data|vbscript|tg|file):', url, re.I):
        url = 'https://' + url
    if not re.match(r'https?://', url, re.I):
        return None
    try:
        host = (urlsplit(url).hostname or '').lower().removeprefix('www.')
    except ValueError:
        return None
    if not host:
        return None
    if host in TELEGRAM_HOSTS:
        return {'href': url, 'linkKind': 'telegram'}
    if URL_RE.fullmatch(host):
        video = classify(url).get('videoId')
        return {'href': url, 'linkKind': 'youtube', **({'videoId': video} if video else {})}
    return {'href': url, 'linkKind': 'external'}


def rich_text(entities):
    """Normalize Telegram's entities into text segments that keep formatting and resolved links."""
    segments = []

    def plain(text):
        if segments and segments[-1]['type'] == 'plain':
            segments[-1]['text'] += text
        else:
            segments.append({'type': 'plain', 'text': text})

    for ent in entities or []:
        kind, text = ent.get('type'), ent.get('text') or ''
        if not text:
            continue
        if kind in FORMATS:
            segments.append({'type': kind, 'text': text})
        elif kind in ('link', 'text_link'):
            target = resolve_link(ent.get('href') if kind == 'text_link' else text)
            if target:
                segments.append({'type': 'link', 'text': text, **target})
            else:
                plain(text)
        elif kind == 'mention' and re.fullmatch(r'@\w+', text):
            segments.append({'type': 'mention', 'text': text, 'href': f'https://t.me/{text[1:]}', 'linkKind': 'telegram'})
        elif kind == 'hashtag':
            segments.append({'type': 'hashtag', 'text': text})
        elif kind == 'email':
            segments.append({'type': 'email', 'text': text, 'href': f"mailto:{quote(text, safe='@')}"})
        elif kind == 'phone':
            segments.append({'type': 'phone', 'text': text, 'href': 'tel:' + re.sub(r'[^\d+]', '', text)})
        else:
            plain(text)
    return segments


def walk_strings(node):
    """Yield every string nested inside a JSON value."""
    if isinstance(node, str):
        yield node
    elif isinstance(node, list):
        for item in node:
            yield from walk_strings(item)
    elif isinstance(node, dict):
        for value in node.values():
            yield from walk_strings(value)


def find_links(msg):
    """Return (url, source, displayText) for each YouTube link, in post order."""
    found = []
    for ent in msg.get('text_entities') or []:
        kind, text = ent.get('type'), ent.get('text') or ''
        if kind == 'text_link':
            match = URL_RE.search(ent.get('href') or '')
            if match:
                found.append((clean_url(match.group(0)), 'embedded', text.strip() or None))
                continue
        source = 'plain' if kind == 'link' else f'text:{kind}'
        for m in URL_RE.finditer(text):
            found.append((clean_url(m.group(0)), source, None))
    for field in ('inline_bot_buttons', 'poll', 'rich_message'):
        if field in msg:
            for s in walk_strings(msg[field]):
                for m in URL_RE.finditer(s):
                    found.append((clean_url(m.group(0)), field, None))
    return found


def own_comment(msg):
    """The post text minus links, hashtags and the channel signature."""
    out = []
    for ent in msg.get('text_entities') or []:
        kind, text = ent.get('type'), ent.get('text') or ''
        if kind in ('link', 'hashtag') or (kind == 'mention' and text.lower() == f'@{CHANNEL.lower()}'):
            continue
        out.append(text)
    text = ''.join(out)
    text = re.sub(r'^[ \t]*[•\-–—·][ \t]*$', '', text, flags=re.M)
    text = re.sub(r'[ \t]+$', '', text, flags=re.M)
    return re.sub(r'\n{3,}', '\n\n', text).strip()


def reaction_emoji(reaction):
    # Telegram Star reactions are exported as type `paid`, with no emoji of their own.
    if reaction.get('type') == 'paid':
        return '⭐'
    return reaction.get('emoji') or reaction.get('document_id') or reaction.get('type')


def build_post(msg, links):
    dt = datetime.fromisoformat(msg['date'])
    entities = msg.get('text_entities') or []
    utc = datetime.fromtimestamp(int(msg['date_unixtime']), timezone.utc)

    media = None
    if any(k in msg for k in ('photo', 'file', 'media_type')):
        media = {
            'type': msg.get('media_type') or ('photo' if 'photo' in msg else 'file'),
            'mimeType': msg.get('mime_type'),
            'fileName': msg.get('file_name'),
            'fileSize': msg.get('file_size') or msg.get('photo_file_size'),
            'width': msg.get('width'),
            'height': msg.get('height'),
            'durationSeconds': msg.get('duration_seconds'),
            'title': msg.get('title'),
            'performer': msg.get('performer'),
        }

    reactions = [
        {'emoji': reaction_emoji(r), 'count': r.get('count', 0)}
        for r in msg.get('reactions') or []
    ]
    other_links = []
    for ent in entities:
        kind = ent.get('type')
        target = ent.get('href') if kind == 'text_link' else ent.get('text') if kind == 'link' else None
        if target and not URL_RE.search(target):
            other_links.append(target)

    signature = f'@{CHANNEL.lower()}'
    return {
        'postId': msg['id'],
        'postUrl': f'https://t.me/{CHANNEL}/{msg["id"]}',
        'date': dt.strftime('%Y-%m-%d'),
        'time': dt.strftime('%H:%M:%S'),
        'hour': dt.hour,
        'dayOfWeek': dt.strftime('%A'),
        'postedAtLocal': msg['date'],
        'postedAtUtc': utc.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'unixTime': int(msg['date_unixtime']),
        'editedAtLocal': msg.get('edited'),
        'content': own_comment(msg),
        'fullText': ''.join(e.get('text') or '' for e in entities),
        'richText': rich_text(entities),
        'tags': list(dict.fromkeys(e['text'].lstrip('#') for e in entities if e.get('type') == 'hashtag')),
        'isForwarded': 'forwarded_from' in msg or 'forwarded_from_id' in msg,
        'forwardedFrom': msg.get('forwarded_from'),
        'forwardedFromId': msg.get('forwarded_from_id'),
        'isPlaylist': any(l['isPlaylist'] for l in links),
        'isReply': 'reply_to_message_id' in msg,
        'replyToPostId': msg.get('reply_to_message_id'),
        'viaBot': msg.get('via_bot'),
        'author': msg.get('from'),
        'media': media,
        'reactions': reactions,
        'reactionCount': sum(r['count'] for r in reactions),
        'mentions': list(dict.fromkeys(
            e['text'] for e in entities if e.get('type') == 'mention' and e['text'].lower() != signature
        )),
        'otherLinks': other_links,
        'poll': msg.get('poll'),
        'youtubeLinks': links,
    }


def main(src, dst):
    with open(src, encoding='utf-8') as f:
        export = json.load(f)
    posts = []
    for msg in export['messages']:
        if msg.get('type') != 'message':
            continue
        seen, links = set(), []
        for url, source, display in find_links(msg):
            key = url.lower()
            if key in seen:
                continue
            seen.add(key)
            link = classify(url)
            # Tutorial posts show the literal placeholder `youtu.be/VIDEOID`
            if 'VIDEOID' in url:
                continue
            link['source'] = source
            link['displayText'] = display
            link['isOwnChannel'] = (link.get('channelRef') or '').lower() in OWN_HANDLES
            links.append(link)
        if links:
            posts.append(build_post(msg, links))
    last = export['messages'][-1]
    with open(dst, 'w', encoding='utf-8') as f:
        json.dump(
            {
                'channel': {
                    'name': export['name'],
                    'id': export['id'],
                    'url': f'https://t.me/{CHANNEL}',
                    'lastPostId': last['id'],
                    'lastPostUrl': f"https://t.me/{CHANNEL}/{last['id']}",
                    'lastPostAt': last['date'],
                },
                'posts': posts,
            },
            f,
            ensure_ascii=False,
            indent=2,
        )
    print(f'{len(posts)} posts written to {dst}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
