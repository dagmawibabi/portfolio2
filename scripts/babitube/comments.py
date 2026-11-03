"""Step 3b: link the channel's discussion group export to the channel posts that have videos.

Usage: python comments.py <channel result.json> <comments result.json> <youtube_posts.json> <out.json>

A channel post is auto-forwarded into its discussion group, and comments are replies to that copy.
The export doesn't record which post a copy came from, so copies are matched by time and text.
"""
import collections
import json
import sys

from extract import reaction_emoji, rich_text

CHANNEL = 'Dagmawi_Babi'
CHANNEL_ID = 'channel1260415932'
# Copies arrive a few seconds after the post; the widest gap seen in practice is about 15s.
WINDOW = range(-3, 16)
MEDIA_LABELS = {
    'sticker': 'Sticker',
    'animation': 'GIF',
    'video_file': 'Video',
    'video_message': 'Video message',
    'voice_message': 'Voice message',
    'audio_file': 'Audio',
}


def plain_text(msg):
    return ''.join(e.get('text') or '' for e in msg.get('text_entities') or []).strip()


def match_copies(channel, copies):
    """Return {group message id: channel post id}, trusting exact text matches first."""
    by_time = collections.defaultdict(list)
    for copy in copies:
        by_time[int(copy['date_unixtime'])].append(copy)
    used, links, pending = set(), {}, []

    def candidates(post):
        when = int(post['date_unixtime'])
        return [c for d in WINDOW for c in by_time.get(when + d, []) if c['id'] not in used]

    for post in channel:
        text = plain_text(post)
        exact = [c for c in candidates(post) if plain_text(c) == text]
        if exact:
            used.add(exact[0]['id'])
            links[exact[0]['id']] = (post['id'], 'text')
        else:
            pending.append(post)
    # Text can differ when a post was edited after it was forwarded, so time alone has to do here.
    for post in pending:
        remaining = candidates(post)
        if remaining:
            used.add(remaining[0]['id'])
            links[remaining[0]['id']] = (post['id'], 'time')
    return links


def media_label(msg):
    if 'photo' in msg:
        return 'Photo'
    if 'poll' in msg:
        return 'Poll'
    if msg.get('media_type') or 'file' in msg:
        return MEDIA_LABELS.get(msg.get('media_type'), 'File')
    return None


def main(channel_path, group_path, posts_path, out_path):
    sys.stdout.reconfigure(encoding='utf-8')
    with open(channel_path, encoding='utf-8') as f:
        channel = [m for m in json.load(f)['messages'] if m.get('type') == 'message']
    with open(group_path, encoding='utf-8') as f:
        group_doc = json.load(f)
    group = group_doc['messages']
    with open(posts_path, encoding='utf-8') as f:
        wanted = {p['postId'] for p in json.load(f)['posts']}

    copies = [m for m in group if m.get('forwarded_from_id') == CHANNEL_ID]
    links = match_copies(channel, copies)
    by_id = {m['id']: m for m in group}

    threads = collections.defaultdict(list)
    # Only ever counted: user ids don't go into the output.
    authors = set()
    skipped = collections.Counter()
    for msg in group:
        if msg.get('type') != 'message' or 'reply_to_message_id' not in msg or msg['id'] in links:
            continue
        # Walk up the replies to the post copy. The step before it is the top-level comment.
        node, top, hops = msg, msg['id'], 0
        while 'reply_to_message_id' in node and hops < 500:
            parent = by_id.get(node['reply_to_message_id'])
            if parent is None:
                node = None
                break
            if parent['id'] in links:
                node = parent
                break
            top, node, hops = parent['id'], parent, hops + 1
        link = links.get(node['id']) if node else None
        if not link:
            skipped['not a reply to a channel post'] += 1
            continue
        post_id, _ = link
        if post_id not in wanted:
            continue
        text = plain_text(msg)
        media = media_label(msg)
        if not text and not media:
            skipped['empty'] += 1
            continue
        authors.add(msg.get('from_id'))
        parent_id = msg['reply_to_message_id']
        threads[post_id].append({
            'commentId': msg['id'],
            'url': f'https://t.me/{CHANNEL}/{post_id}?comment={msg["id"]}',
            'threadId': top,
            'replyToId': None if parent_id == node['id'] else parent_id,
            'author': msg.get('from') or 'Deleted Account',
            'isChannelOwner': msg.get('from_id') == CHANNEL_ID,
            'date': msg['date'],
            'unixTime': int(msg['date_unixtime']),
            'edited': 'edited' in msg,
            'text': text,
            'richText': rich_text(msg.get('text_entities')),
            'media': media,
            'stickerEmoji': msg.get('sticker_emoji'),
            'reactions': [
                {'emoji': reaction_emoji(r), 'count': r.get('count', 0)}
                for r in msg.get('reactions') or []
            ],
        })

    posts = {}
    time_only = 0
    copy_of = {post: (cid, how) for cid, (post, how) in links.items()}
    for post_id in sorted(threads):
        cid, how = copy_of[post_id]
        time_only += how == 'time'
        posts[str(post_id)] = {
            'postUrl': f'https://t.me/{CHANNEL}/{post_id}',
            'groupCopyId': cid,
            'matchedBy': how,
            'commentCount': len(threads[post_id]),
            'comments': threads[post_id],
        }

    total = sum(p['commentCount'] for p in posts.values())
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(
            {
                'meta': {
                    'group': group_doc['name'],
                    'groupId': group_doc['id'],
                    'commentCount': total,
                    'commenterCount': len(authors),
                    'firstCommentAt': min((c['date'] for p in posts.values() for c in p['comments']), default=None),
                    'lastCommentAt': max((c['date'] for p in posts.values() for c in p['comments']), default=None),
                    'postsWithComments': len(posts),
                    'postsMatchedByTimeOnly': time_only,
                    'channelCopies': len(copies),
                    'channelCopiesLinked': len(links),
                },
                'posts': posts,
            },
            f,
            ensure_ascii=False,
            indent=2,
        )
    print(f'{total} comments on {len(posts)} video posts ({time_only} posts matched by time only)')
    print('skipped', dict(skipped))


if __name__ == '__main__':
    main(*sys.argv[1:5])
