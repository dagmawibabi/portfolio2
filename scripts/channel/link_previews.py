"""Fetch Open Graph previews for every link in the community showcase.

Reads src/lib/channel/showcase.json, fetches each unique (non-Telegram) URL once and
writes src/lib/channel/link_previews.json:

    { "<url>": { "title", "description", "image", "site", "final" } }

Results (failures included) are cached in scripts/channel/preview_cache.json, so re-runs
only fetch new links. Delete an entry there to refetch it.

    python scripts/channel/link_previews.py
"""
import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SHOWCASE = os.path.join(ROOT, 'src', 'lib', 'channel', 'showcase.json')
OUT = os.path.join(ROOT, 'src', 'lib', 'channel', 'link_previews.json')
CACHE = os.path.join(HERE, 'preview_cache.json')
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'
SKIP_HOSTS = {'t.me', 'telegram.me'}


def meta(doc, *names):
    for n in names:
        for pat in (
            rf'<meta[^>]+(?:property|name)=["\']{re.escape(n)}["\'][^>]*content=["\']([^"\']*)["\']',
            rf'<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name)=["\']{re.escape(n)}["\']',
        ):
            m = re.search(pat, doc, re.I)
            if m and m.group(1).strip():
                return html.unescape(m.group(1).strip())
    return None


def fetch(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'en', 'Accept': 'text/html'})
        with urllib.request.urlopen(req, timeout=15) as r:
            if 'html' not in (r.headers.get('Content-Type') or 'text/html'):
                return {'final': r.geturl()}
            doc = r.read(600_000).decode('utf-8', 'replace')
            final = r.geturl()
    except Exception as e:  # noqa: BLE001 - any network failure just means "no preview"
        return {'error': type(e).__name__}
    title = meta(doc, 'og:title', 'twitter:title')
    if not title:
        m = re.search(r'<title[^>]*>(.*?)</title>', doc, re.I | re.S)
        title = html.unescape(m.group(1).strip()) if m else None
    image = meta(doc, 'og:image', 'og:image:url', 'twitter:image', 'twitter:image:src')
    if image:
        image = urllib.parse.urljoin(final, image)
    out = {
        'title': title,
        'description': meta(doc, 'og:description', 'twitter:description', 'description'),
        'image': image,
        'site': meta(doc, 'og:site_name'),
        'final': final,
    }
    return {k: (v[:400] if isinstance(v, str) else v) for k, v in out.items() if v}


def main():
    posts = json.load(open(SHOWCASE, encoding='utf-8'))['posts']
    urls = sorted({l['url'] for p in posts for l in p['links'] if l['host'].lower() not in SKIP_HOSTS})
    cache = json.load(open(CACHE, encoding='utf-8')) if os.path.exists(CACHE) else {}
    todo = [u for u in urls if u not in cache]
    print(f'{len(urls)} links, {len(todo)} to fetch', file=sys.stderr)
    with ThreadPoolExecutor(16) as ex:
        for i, (u, res) in enumerate(zip(todo, ex.map(fetch, todo))):
            cache[u] = res
            print(f'[{i + 1}/{len(todo)}] {"ok " if res.get("title") else "-- "} {u}', file=sys.stderr)
    json.dump(cache, open(CACHE, 'w', encoding='utf-8'), ensure_ascii=False, indent=0, sort_keys=True)
    out = {u: {k: v for k, v in cache[u].items() if k != 'error'} for u in urls if cache.get(u) and 'error' not in cache[u]}
    out = {u: v for u, v in out.items() if v.get('title') or v.get('image')}
    json.dump(out, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f'wrote {len(out)} previews -> {OUT}', file=sys.stderr)


if __name__ == '__main__':
    main()
