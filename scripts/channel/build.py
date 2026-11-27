"""Build the /scripture, /communityshowcase and /cinema data from a Telegram channel export
and a Letterboxd export.

    python -I -X utf8 scripts/channel/build.py <telegram result.json> <letterboxd export dir>

Film/series metadata (posters, directors, genres...) is looked up once and cached in
scripts/channel/meta_cache.json: Letterboxd's film pages for films, TVmaze's API for series.
Writes src/lib/channel/{goodnight,showcase,movies}.json.
"""
import csv
import json
import os
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from titles import CATEGORY_TAGS, TITLES  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'src', 'lib', 'channel')
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'meta_cache.json')
SELF = {'@dagmawi_babi', '@dagmawj_babi'}
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'

tg_path, lb_dir = sys.argv[1], sys.argv[2]
messages = json.load(open(tg_path, encoding='utf-8'))['messages']
os.makedirs(OUT, exist_ok=True)


# ---------------------------------------------------------------- helpers
def plain(m):
    t = m.get('text', '')
    return t if isinstance(t, str) else ''.join(p if isinstance(p, str) else p.get('text', '') for p in t)


def tags(m):
    return [p['text'][1:] for p in m.get('text_entities', []) if p['type'] == 'hashtag']


def reactions(m):
    return sum(r.get('count', 0) for r in m.get('reactions', []))


def media(m):
    if 'photo' in m:
        return 'photo'
    return m.get('media_type') or ('file' if m.get('file') else None)


def segments(m):
    """Message body as [kind, text, href?] runs: hashtags and the channel signature removed."""
    out = []
    for p in m.get('text_entities', []):
        t, s = p['type'], p['text']
        if t == 'hashtag':
            continue
        if t == 'mention':
            if s.lower() in SELF:
                continue
            out.append(['a', s, 'https://t.me/' + s[1:]])
        elif t == 'mention_name':
            out.append(['t', s])
        elif t == 'link':
            out.append(['a', s, s if re.match(r'^https?://', s) else 'https://' + s])
        elif t == 'text_link':
            out.append(['a', s, p.get('href', '')])
        elif t == 'email':
            out.append(['a', s, 'mailto:' + s])
        elif t == 'bold':
            out.append(['b', s])
        elif t in ('italic', 'blockquote'):
            out.append(['i', s])
        elif t in ('code', 'pre'):
            out.append(['c', s])
        else:
            out.append(['t', s])
    # merge adjacent text runs, then trim the whitespace the removed tags left behind
    merged = []
    for seg in out:
        if merged and seg[0] == 't' and merged[-1][0] == 't':
            merged[-1][1] += seg[1]
        else:
            merged.append(seg)
    for seg in merged:
        if seg[0] == 't':
            seg[1] = re.sub(r'[ \t]+\n', '\n', seg[1])
            seg[1] = re.sub(r'\n{3,}', '\n\n', seg[1])
    while merged and merged[-1][0] == 't' and not merged[-1][1].strip():
        merged.pop()
    if merged and merged[-1][0] == 't':
        merged[-1][1] = merged[-1][1].rstrip()
    if merged and merged[0][0] == 't':
        merged[0][1] = merged[0][1].lstrip()
    return merged


def seg_text(segs):
    return ''.join(s[1] for s in segs)


ETHIOPIC = re.compile(r'[ሀ-᎟]')


# ---------------------------------------------------------------- /scripture
GREETING = re.compile(
    r'^(good\s*night|good\s*morning|good\s*day|gm|gn|have a .{0,40}(day|night|week|weekend|sunday|evening))\b', re.I)
REF_LINE = re.compile(r'^\s*(?:[—–\-~]+|―)\s*(.+)$')
REF_ANY = re.compile(r'^\s*((?:[1-3]\s*)?[A-Za-zሀ-᎟][A-Za-zሀ-᎟\.\s]{1,30}\s*\d{1,3}\s*[:፥፡]\s*\d{1,3}(?:\s*[-–,]\s*\d{1,3})*)\s*$')

verses = []
for m in messages:
    if 'scripture' not in [t.lower() for t in tags(m)]:
        continue
    raw = plain(m)
    raw = re.sub(r'#\w+', '', raw)
    raw = re.sub(r'@\w+', '', raw)
    lines = [l.strip() for l in raw.split('\n')]
    greeting, ref, body = None, None, []
    for l in lines:
        if not l:
            body.append('')
            continue
        bare = l.strip('✨🌙☀️⭐🌟💫 ').strip()
        if not body and not greeting and GREETING.match(bare) and len(bare) < 60:
            greeting = l
            continue
        r = REF_LINE.match(l)
        if r and len(r.group(1)) < 50 and re.search(r'\d', r.group(1)):
            ref = r.group(1).strip()
            continue
        if REF_ANY.match(l) and len(l) < 45:
            ref = l.strip()
            continue
        body.append(l)
    text = '\n'.join(body).strip()
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip().strip('"“”«»\'').strip()
    verses.append({
        'id': m['id'],
        'date': m['date'],
        'text': text,
        'ref': ref,
        'greeting': greeting,
        'lang': 'am' if ETHIOPIC.search(text + (ref or '')) else 'en',
        'media': media(m),
        'reactions': reactions(m),
    })
verses.reverse()  # newest first
json.dump({'verses': verses}, open(os.path.join(OUT, 'goodnight.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, separators=(',', ':'))
print('verses', len(verses), 'with text', sum(1 for v in verses if v['text']),
      'image-only', sum(1 for v in verses if not v['text'] and not v['ref']))


# ---------------------------------------------------------------- /communityshowcase
SHOWCASE_TAGS = {'communityshowcase', 'commmunityshowcase'}
CATEGORIES = [
    ('Apps & Sites', {'apps', 'app', 'websites', 'website', 'webapps', 'portfolio', 'vibecoding', 'uiux', 'chatapp',
                      'extensions', 'tools', 'opensource', 'saas', 'startups', 'mobileapps', 'flutter', 'react'}),
    ('Bots', {'bots', 'bot', 'telegrambots', 'miniapps'}),
    ('Games', {'games', 'game', 'gamedev'}),
    ('AI', {'ai', 'aimusic', 'llm', 'ml', 'agents'}),
    ('Art & Design', {'art', 'digitalart', 'canvasart', 'sketches', 'fanart', 'comics', 'blender', 'animations',
                      'motiongraphics', 'design', 'fonts', 'threejs', 'photography', 'fashion', '3d', 'illustrations'}),
    ('Music', {'songs', 'covers', 'music', 'instrumentals', 'aimusic'}),
    ('Writing', {'blogs', 'poetry', 'poems', 'books', 'articles', 'writing', 'stories'}),
    ('Video & Podcasts', {'youtube', 'podcasts', 'vlogs', 'shortfilms', 'videos', 'channels'}),
    ('Clubs & Events', {'clubs', 'hackthons', 'hackathons', 'events', 'communities', 'meetups'}),
]
LINK_HOST_CAT = [
    (re.compile(r'github\.com|vercel\.app|netlify|\.dev\b|play\.google|apps\.apple'), 'Apps & Sites'),
    (re.compile(r'youtube|youtu\.be'), 'Video & Podcasts'),
    (re.compile(r'behance|dribbble|instagram'), 'Art & Design'),
    (re.compile(r'telegra\.ph|medium\.com|substack'), 'Writing'),
]


def showcase_title(text):
    lines = [l.strip() for l in text.split('\n')]
    for i, l in enumerate(lines):
        if l.startswith('•') and i > 0:
            cand = lines[i - 1]
            if cand and len(cand) <= 48 and not cand.startswith('•') and not cand.endswith(('.', ':', '!', '?')):
                return cand
    first = next((l for l in lines if l), '')
    if len(first) <= 40 and not first.startswith(('@', '•', 'http')) and not first.endswith(('.', ':')):
        return first
    return None


showcase = []
for m in messages:
    tl = [t.lower() for t in tags(m)]
    if not SHOWCASE_TAGS & set(tl):
        continue
    segs = segments(m)
    text = seg_text(segs)
    links = []
    creators = []
    for s in segs:
        if s[0] == 'a':
            if s[1].startswith('@'):
                if s[1] not in creators:
                    creators.append(s[1])
            elif s[2] and not s[2].startswith('mailto:') and s[2] not in [l['url'] for l in links]:
                host = urllib.parse.urlparse(s[2]).netloc.replace('www.', '') or s[1]
                links.append({'url': s[2], 'host': host, 'label': s[1]})
    own = [t for t in tags(m) if t.lower() not in SHOWCASE_TAGS]
    cats = []
    for name, keys in CATEGORIES:
        if keys & {t.lower() for t in own}:
            cats.append(name)
    if not cats:
        for rx, name in LINK_HOST_CAT:
            if any(rx.search(l['url']) for l in links):
                cats.append(name)
                break
    if not cats and any(c.lower().endswith('bot') for c in creators):
        cats.append('Bots')
    if not cats and any(l['host'] not in ('t.me', 'telegram.me') and '@' not in l['url'] for l in links):
        cats.append('Apps & Sites')
    if not cats and media(m) in ('audio_file', 'voice_message'):
        cats.append('Music')
    if not cats and media(m) in ('video_file', 'video_message'):
        cats.append('Video & Podcasts')
    showcase.append({
        'id': m['id'],
        'date': m['date'],
        'title': showcase_title(text),
        'segments': segs,
        'creators': creators,
        'links': links,
        'tags': own,
        'categories': cats or ['Other'],
        'media': media(m),
        'reactions': reactions(m),
        'forwarded': m.get('forwarded_from'),
    })
showcase.reverse()
json.dump({'posts': showcase}, open(os.path.join(OUT, 'showcase.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, separators=(',', ':'))
print('showcase', len(showcase), Counter(c for p in showcase for c in p['categories']))


# ---------------------------------------------------------------- /cinema: Letterboxd
def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    s = s.replace('&', 'and')
    return re.sub(r'[^a-z0-9]', '', s)


def read_csv(path):
    if not os.path.exists(path):
        return []
    return list(csv.DictReader(open(path, encoding='utf-8')))


films = {}  # key -> record


def key_of(name, year):
    return f'{norm(name)}-{year or ""}'


def film(name, year, uri=None):
    k = key_of(name, year)
    if k not in films:
        films[k] = {'key': k, 'title': name, 'year': int(year) if year else None, 'kind': 'movie',
                    'uri': uri, 'watched': False, 'watchedOn': None, 'rating': None, 'liked': False,
                    'rewatch': False, 'review': None, 'reviewDate': None, 'lists': [], 'watchlist': False,
                    'favorite': False, 'diary': [], 'posts': []}
    if uri and not films[k]['uri']:
        films[k]['uri'] = uri
    return films[k]


for r in read_csv(os.path.join(lb_dir, 'watched.csv')):
    f = film(r['Name'], r['Year'], r['Letterboxd URI'])
    f['watched'] = True
    f['watchedOn'] = r['Date']
for r in read_csv(os.path.join(lb_dir, 'ratings.csv')):
    f = film(r['Name'], r['Year'], r['Letterboxd URI'])
    f['rating'] = float(r['Rating']) if r['Rating'] else None
    f['watched'] = True
for r in read_csv(os.path.join(lb_dir, 'likes', 'films.csv')):
    film(r['Name'], r['Year'], r['Letterboxd URI'])['liked'] = True
for r in read_csv(os.path.join(lb_dir, 'diary.csv')):
    f = film(r['Name'], r['Year'])
    f['watched'] = True
    f['diary'].append({'date': r['Watched Date'] or r['Date'], 'rating': float(r['Rating']) if r['Rating'] else None,
                       'rewatch': r['Rewatch'] == 'Yes'})
    if r['Rewatch'] == 'Yes':
        f['rewatch'] = True
for r in read_csv(os.path.join(lb_dir, 'reviews.csv')):
    f = film(r['Name'], r['Year'])
    f['review'] = r['Review']
    f['reviewDate'] = r['Watched Date'] or r['Date']
    if r['Rating']:
        f['rating'] = float(r['Rating'])
for r in read_csv(os.path.join(lb_dir, 'watchlist.csv')):
    f = film(r['Name'], r['Year'], r['Letterboxd URI'])
    if not f['watched']:
        f['watchlist'] = True

lists = []
list_dir = os.path.join(lb_dir, 'lists')
for fn in sorted(os.listdir(list_dir)) if os.path.isdir(list_dir) else []:
    rows = open(os.path.join(list_dir, fn), encoding='utf-8').read().split('\n')
    # "Letterboxd list export v7", list header + row, blank line, then the films table
    head = next(csv.DictReader(rows[1:3]))
    blank = rows.index('', 3)
    items = list(csv.DictReader(rows[blank + 1:]))
    slug = fn[:-4]
    keys = []
    for it in items:
        f = film(it['Name'], it['Year'], it['URL'])
        if slug not in f['lists']:
            f['lists'].append(slug)
        keys.append(f['key'])
    lists.append({'slug': slug, 'name': head['Name'].strip(), 'description': head.get('Description') or '',
                  'date': head['Date'], 'films': keys})

profile = (read_csv(os.path.join(lb_dir, 'profile.csv')) or [{}])[0]
fav_uris = [u.strip() for u in (profile.get('Favorite Films') or '').split(',') if u.strip()]
for f in films.values():
    if f['uri'] in fav_uris:
        f['favorite'] = True

# ---------------------------------------------------------------- /cinema: channel posts
channel_log = []
for m in messages:
    tg = tags(m)
    tl = {t.lower() for t in tg}
    if not tl & CATEGORY_TAGS:
        continue
    titles = []
    for t in tg:
        if t in TITLES and TITLES[t][0] not in [x[0] for x in titles]:
            titles.append(TITLES[t])
    post = {'id': m['id'], 'date': m['date'], 'segments': segments(m), 'reactions': reactions(m),
            'media': media(m)}
    if not titles:
        cat = 'series' if tl & {'series', 'shows', 'webseries', 'amharicshows', 'showsuggestions',
                                'seriessuggestions', 'seriessuggestion'} else \
            'anime' if 'anime' in tl else 'short' if 'shortfilms' in tl else \
            'documentary' if tl & {'documentary', 'documentaries'} else 'movie'
        channel_log.append({**post, 'kind': cat, 'tags': [t for t in tg if t.lower() not in CATEGORY_TAGS]})
        continue
    for name, kind, year in titles:
        # attach to a Letterboxd film if the name matches one (any year within 1)
        match = None
        for f in films.values():
            if norm(f['title']) == norm(name) and (not year or not f['year'] or abs(f['year'] - year) <= 1):
                match = f
                break
        f = match or film(name, year)
        if not match:
            f['kind'] = kind
        elif kind in ('documentary', 'short', 'anime'):
            f['kind'] = kind
        f['posts'].append(post)


# ---------------------------------------------------------------- metadata lookups (cached)
cache = json.load(open(CACHE, encoding='utf-8')) if os.path.exists(CACHE) else {}


def get(url, as_json=False):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'en'})
    with urllib.request.urlopen(req, timeout=25) as r:
        body = r.read().decode('utf-8', 'replace')
        return (json.loads(body) if as_json else body), r.geturl()


def parse_letterboxd(html, final_url):
    m = re.search(r'<script type="application/ld\+json">\s*(?:/\*.*?\*/)?\s*(\{.*?\})\s*(?:/\*.*?\*/)?\s*</script>',
                  html, re.S)
    if not m:
        return None
    d = json.loads(m.group(1))
    og = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    desc = re.search(r'<meta name="description" content="([^"]*)"', html)
    tagline = re.search(r'<h4 class="tagline">([^<]+)</h4>', html)
    year = re.search(r'/films/year/(\d{4})/', html)
    runtime = re.search(r'(\d+)&nbsp;mins', html)
    agg = d.get('aggregateRating') or {}
    import html as h
    return {
        'source': 'letterboxd',
        'url': final_url,
        'name': d.get('name'),
        'year': int(year.group(1)) if year else (int(d['dateCreated'][:4]) if d.get('dateCreated') else None),
        'poster': d.get('image'),
        'backdrop': og.group(1) if og and 'film-poster' not in og.group(1) else None,
        'directors': [p['name'] for p in d.get('director', [])][:3],
        'cast': [p['name'] for p in d.get('actor', [])][:6],
        'genres': d.get('genre', [])[:4],
        'countries': [c['name'] for c in d.get('countryOfOrigin', [])][:3],
        'runtime': int(runtime.group(1)) if runtime else None,
        'synopsis': h.unescape(desc.group(1)) if desc else None,
        'tagline': h.unescape(tagline.group(1)) if tagline else None,
        'avg': agg.get('ratingValue'),
        'votes': agg.get('ratingCount') or agg.get('reviewCount'),
    }


def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    s = s.replace('&', 'and').replace("'", '')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def tvmaze(name, year):
    try:
        res, _ = get('https://api.tvmaze.com/search/shows?q=' + urllib.parse.quote(name), True)
    except Exception:
        return None
    best = None
    for r in res:
        sh = r['show']
        y = int(sh['premiered'][:4]) if sh.get('premiered') else None
        score = r['score'] + (2 if year and y and abs(y - year) <= 1 else 0) + (1 if norm(sh['name']) == norm(name) else 0)
        if not best or score > best[0]:
            best = (score, sh)
    if not best:
        return None
    sh = best[1]
    img = sh.get('image') or {}
    summary = re.sub(r'<[^>]+>', '', sh.get('summary') or '').strip() or None
    return {
        'source': 'tvmaze', 'url': sh.get('url'), 'name': sh['name'],
        'year': int(sh['premiered'][:4]) if sh.get('premiered') else None,
        'poster': img.get('original') or img.get('medium'), 'backdrop': None,
        'directors': [], 'cast': [], 'genres': sh.get('genres', [])[:4],
        'countries': [((sh.get('network') or sh.get('webChannel') or {}).get('country') or {}).get('name')] if (sh.get('network') or {}).get('country') else [],
        'network': (sh.get('network') or sh.get('webChannel') or {}).get('name'),
        'runtime': sh.get('averageRuntime'), 'synopsis': summary, 'tagline': None,
        'avg': round(sh['rating']['average'] / 2, 2) if (sh.get('rating') or {}).get('average') else None,
        'votes': None, 'status': sh.get('status'),
    }


def lookup(f):
    k = f['key']
    if k in cache:
        return
    meta = None
    try:
        if f['kind'] in ('series', 'anime') and not f['uri']:
            meta = tvmaze(f['title'], f['year'])
        else:
            urls = [f['uri']] if f['uri'] else []
            if not urls:
                s = slugify(f['title'])
                urls = ([f'https://letterboxd.com/film/{s}-{f["year"]}/'] if f['year'] else []) + \
                       [f'https://letterboxd.com/film/{s}/']
            for u in urls:
                try:
                    html, final = get(u)
                except Exception:
                    continue
                cand = parse_letterboxd(html, final)
                if not cand:
                    continue
                if not f['uri'] and f['year'] and cand['year'] and abs(cand['year'] - f['year']) > 1:
                    continue
                meta = cand
                break
            if not meta and f['kind'] in ('documentary', 'series') and not f['uri']:
                meta = tvmaze(f['title'], f['year'])
    except Exception as e:  # keep going; the page shows a typographic poster instead
        print('lookup failed', f['title'], e)
    cache[k] = meta
    time.sleep(0.8)


todo = [f for f in films.values() if f['key'] not in cache]
print('looking up', len(todo), 'titles')
done = 0
with ThreadPoolExecutor(max_workers=2) as ex:
    for _ in ex.map(lookup, todo):
        done += 1
        if done % 25 == 0:
            print(' ', done, '/', len(todo), flush=True)
            json.dump(cache, open(CACHE, 'w', encoding='utf-8'), ensure_ascii=False)
json.dump(cache, open(CACHE, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

out_films = []
for f in films.values():
    meta = cache.get(f['key'])
    if meta and meta.get('source') == 'tvmaze' and f['kind'] == 'movie':
        f['kind'] = 'series'
    if meta and f['kind'] == 'movie' and any(g.lower() == 'documentary' for g in meta.get('genres', [])):
        f['kind'] = 'documentary'
    f['meta'] = meta
    f['diary'].sort(key=lambda d: d['date'])
    f['posts'].sort(key=lambda p: p['date'])
    out_films.append(f)

missing = [f['title'] for f in out_films if not (f['meta'] or {}).get('poster')]
print('films', len(out_films), 'no poster:', len(missing), missing[:40])

json.dump({
    'profile': {'username': profile.get('Username'), 'joined': profile.get('Date Joined'),
                'location': profile.get('Location')},
    'films': out_films,
    'lists': lists,
    'channelLog': list(reversed(channel_log)),
}, open(os.path.join(OUT, 'movies.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('wrote', OUT)
