// Server-side assembly of the community showcase: posts from the channel export joined with
// the link previews fetched by scripts/channel/link_previews.py.
import data from './showcase.json';
import previewData from './link_previews.json';
import type { Segment } from './index';

export type LinkPreview = { title?: string; description?: string; image?: string; site?: string; final?: string };

export type Embed =
	| { kind: 'youtube'; id: string; src: string; thumb: string }
	| { kind: 'spotify' | 'soundcloud' | 'vimeo' | 'figma'; src: string; height: number };

export type ShowcaseLink = { url: string; host: string; label: string; preview?: LinkPreview; embed?: Embed };

export type ShowcasePost = {
	id: number;
	date: string;
	title: string | null;
	segments: Segment[];
	creators: string[];
	links: ShowcaseLink[];
	tags: string[];
	categories: string[];
	media: string | null;
	reactions: number;
	forwarded: string | null;
	/** The best picture we have for the card: a video thumbnail, a repo card or a site's OG image. */
	cover: { image: string; youtube?: string; host: string; icon?: boolean } | null;
};

const previews = previewData as Record<string, LinkPreview>;

export function youtubeId(url: string) {
	try {
		const u = new URL(url);
		const host = u.hostname.replace(/^(www|m|music)\./, '');
		if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null;
		if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
			if (u.searchParams.get('v')) return u.searchParams.get('v');
			const m = u.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]{6,})/);
			return m?.[1] ?? null;
		}
	} catch {
		/* not a URL */
	}
	return null;
}

export function embedFor(url: string): Embed | undefined {
	const yt = youtubeId(url);
	if (yt)
		return {
			kind: 'youtube',
			id: yt,
			src: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`,
			thumb: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`
		};
	let u: URL;
	try {
		u = new URL(url);
	} catch {
		return undefined;
	}
	const host = u.hostname.replace(/^www\./, '');
	if (host === 'open.spotify.com') {
		const m = u.pathname.match(/^\/(?:intl-\w+\/)?(track|album|playlist|episode|show|artist)\/(\w+)/);
		if (m) return { kind: 'spotify', src: `https://open.spotify.com/embed/${m[1]}/${m[2]}`, height: m[1] === 'track' ? 152 : 352 };
	}
	if (host === 'soundcloud.com' && u.pathname.split('/').filter(Boolean).length >= 2)
		return {
			kind: 'soundcloud',
			src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23000000&visual=true`,
			height: 300
		};
	if (host === 'vimeo.com') {
		const m = u.pathname.match(/^\/(\d+)/);
		if (m) return { kind: 'vimeo', src: `https://player.vimeo.com/video/${m[1]}`, height: 0 };
	}
	if (host === 'figma.com' && /^\/(file|design|proto|board)\//.test(u.pathname))
		return { kind: 'figma', src: `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`, height: 450 };
	return undefined;
}

/** GitHub renders a social card for any repo, even when the page fetch was blocked. */
function githubCard(url: string) {
	const m = url.match(/^https?:\/\/(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)/);
	return m ? `https://opengraph.githubassets.com/1/${m[1]}/${m[2].replace(/\.git$/, '')}` : undefined;
}

function enrich(l: { url: string; host: string; label: string }): ShowcaseLink {
	const preview: LinkPreview = { ...previews[l.url] };
	const gh = githubCard(l.url);
	if (gh) preview.image = gh;
	const embed = embedFor(l.url);
	if (embed?.kind === 'youtube') preview.image ??= embed.thumb;
	return { ...l, preview: Object.keys(preview).length ? preview : undefined, embed };
}

// Platform placeholder images that say nothing about the project itself.
const DULL = /(?:youtube\.com\/img\/desktop|instagram\.com\/static|static\.licdn\.com\/aero|abs\.twimg\.com\/(?:rweb|responsive))/;
const SKIP_COVER = new Set(['t.me', 'telegram.me']);
/** Hosts whose og:image is an avatar or app icon: shown whole, not cropped to fill. */
const ICON_HOSTS = new Set(['youtube.com', 'youtu.be', 'instagram.com', 'play.google.com', 'apps.apple.com', 'tiktok.com', 'pub.dev', 'npmjs.com']);

function pickCover(links: ShowcaseLink[]): ShowcasePost['cover'] {
	const video = links.find((l) => l.embed?.kind === 'youtube');
	if (video?.embed?.kind === 'youtube') return { image: video.embed.thumb, youtube: video.embed.id, host: video.host };
	const ranked = links
		.filter((l) => l.preview?.image && !SKIP_COVER.has(l.host) && !DULL.test(l.preview.image))
		// a project's own site first, then its repo, then profiles/stores
		.sort((a, b) => rank(a.host) - rank(b.host));
	const l = ranked[0];
	return l ? { image: l.preview!.image!, host: l.host, icon: ICON_HOSTS.has(l.host) || undefined } : null;
}
const rank = (host: string) => (ICON_HOSTS.has(host) ? 2 : host === 'github.com' ? 1 : 0);
export const isIconHost = (host: string) => ICON_HOSTS.has(host);

type RawPost = Omit<ShowcasePost, 'links' | 'cover'> & { links: { url: string; host: string; label: string }[] };

export const posts: ShowcasePost[] = (data.posts as unknown as RawPost[]).map((p) => {
	const links = p.links.map(enrich);
	return { ...p, links, cover: pickCover(links) };
});

/** A lighter copy for the index page: link previews are only needed on a project's own page. */
export const listPosts = (): ShowcasePost[] =>
	posts.map((p) => ({
		...p,
		links: p.links.map(({ url, host, label, embed }) => ({ url, host, label, embed: embed?.kind === 'youtube' ? embed : undefined }))
	}));
