// Client-safe helpers for presenting a showcase post (no JSON imports here).
import type { Segment } from './index';
import type { ShowcasePost } from './showcase';

export const plainText = (p: ShowcasePost) => p.segments.map((s) => s[1]).join('');

/** The post's product name, or its first sentence when it has none. */
export function headlineOf(p: ShowcasePost) {
	if (p.title) return p.title;
	const first = plainText(p).split(/(?<=[.!?])\s|\n/)[0]?.trim() ?? '';
	if (first && first.length <= 90) return first;
	return p.creators[0] ? `Shared by ${p.creators[0]}` : 'From the community';
}

/** The body without its leading headline, so it isn't said twice. */
export function bodyOf(p: ShowcasePost, headline = headlineOf(p)): Segment[] {
	const text = plainText(p);
	const lead = text.trimStart();
	if (!lead.startsWith(headline)) return p.segments;
	let drop = text.length - lead.length + headline.length;
	const out: Segment[] = [];
	for (const s of p.segments) {
		if (drop >= s[1].length) {
			drop -= s[1].length;
			continue;
		}
		out.push(drop ? ([s[0], s[1].slice(drop), s[2]] as Segment) : s);
		drop = 0;
	}
	if (out[0]) out[0] = [out[0][0], out[0][1].replace(/^[\s:,.—-]+/, ''), out[0][2]];
	// "Name\n• link" — the link is already shown as a chip, so drop the bullet line too
	if (out[0]?.[0] === 't' && /^•\s*$/.test(out[0][1]) && out[1]?.[0] === 'a') {
		out.splice(0, 2);
		if (out[0]?.[0] === 't') out[0] = ['t', out[0][1].replace(/^\s+/, '')];
	}
	return out.filter((s) => s[1]);
}

export const favicon = (host: string, size = 32) => `https://www.google.com/s2/favicons?domain=${host}&sz=${size}`;
export const tgProfile = (handle: string) => `https://t.me/${handle.replace(/^@/, '')}`;
export const showcaseHref = (id: number) => `/communityshowcase/${id}`;
