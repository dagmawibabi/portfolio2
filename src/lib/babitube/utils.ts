import type { Component } from 'svelte';
import Atom from '@lucide/svelte/icons/atom';
import Bot from '@lucide/svelte/icons/bot';
import Briefcase from '@lucide/svelte/icons/briefcase';
import CalendarDays from '@lucide/svelte/icons/calendar-days';
import Camera from '@lucide/svelte/icons/camera';
import Church from '@lucide/svelte/icons/church';
import Clapperboard from '@lucide/svelte/icons/clapperboard';
import CodeXml from '@lucide/svelte/icons/code-xml';
import Compass from '@lucide/svelte/icons/compass';
import Cpu from '@lucide/svelte/icons/cpu';
import Gamepad2 from '@lucide/svelte/icons/gamepad-2';
import Globe from '@lucide/svelte/icons/globe';
import GraduationCap from '@lucide/svelte/icons/graduation-cap';
import Heart from '@lucide/svelte/icons/heart';
import Laugh from '@lucide/svelte/icons/laugh';
import Mic from '@lucide/svelte/icons/mic';
import Music2 from '@lucide/svelte/icons/music-2';
import Newspaper from '@lucide/svelte/icons/newspaper';
import Palette from '@lucide/svelte/icons/palette';
import Sparkles from '@lucide/svelte/icons/sparkles';
import Tv from '@lucide/svelte/icons/tv';

export type RichSegment = string | { t: string; k: string; h?: string };

export type TubePost = {
	id: number;
	at: number;
	local: string;
	rich?: RichSegment[];
	tags?: string[];
	fwd?: string | boolean;
	rx?: [string, number][];
};

export type TubeVideo = {
	id: string;
	title: string;
	url: string;
	channel?: string;
	channelUrl?: string;
	channelImg?: string;
	subs?: number;
	published?: string;
	duration?: number;
	views?: number;
	likes?: number;
	comments?: number;
	discussion?: number;
	category?: string;
	list?: string;
	start?: string;
	short?: boolean;
	live?: boolean;
	missing?: boolean;
	cats: string[];
	posts: TubePost[];
};

export type TubePlaylist = {
	id: string;
	title: string;
	channel?: string;
	channelUrl?: string;
	thumb?: string;
	count?: number;
	missing?: boolean;
	cats: string[];
	posts: TubePost[];
};

export type TubeChannel = {
	ref: string;
	name: string;
	url: string;
	img?: string;
	subs?: number;
	own?: boolean;
	mentions: number;
	lastAt: number;
	lastPost: number;
};

export type TubeData = {
	meta: {
		generatedAt: string;
		metadataSource: string;
		postCount: number;
		linkCount: number;
		uniqueVideoCount: number;
		uniquePlaylistCount: number;
		uniqueChannelCount: number;
		categoryCounts: Record<string, number>;
		firstPostAt: string;
		lastPostAt: string;
		exportLastPostAt: string;
		exportLastPostUrl: string;
		commentCount?: number;
		commenterCount?: number;
		postsWithComments?: number;
		firstCommentAt?: string;
	};
	channel: { name: string; url: string };
	videos: TubeVideo[];
	playlists: TubePlaylist[];
	channels: TubeChannel[];
};

export type TubePlaylistItem = Omit<TubeVideo, 'cats' | 'posts' | 'url'>;

export type TubePlaylistContents = {
	title?: string;
	channel?: string;
	channelUrl?: string;
	items: TubePlaylistItem[];
};

export type TubeComment = {
	id: number;
	thread: number;
	by: string;
	own?: boolean;
	at: number;
	local: string;
	edit?: boolean;
	rich?: RichSegment[];
	media?: string;
	sticker?: string;
	rx?: [string, number][];
};

export const TELEGRAM = 'https://t.me/Dagmawi_Babi';

export function richToText(segments: RichSegment[] = []) {
	return segments.map((s) => (typeof s === 'string' ? s : s.t)).join('');
}

/** Turns bare URLs in plain text, such as YouTube descriptions, into link segments. */
export function linkify(text: string): RichSegment[] {
	return text
		.split(/(https?:\/\/[^\s<>"')\]]+)/g)
		.filter(Boolean)
		.map((part) => (/^https?:\/\//.test(part) ? { t: part, k: 'link', h: part } : part));
}

let commentsFile: Promise<Record<string, TubeComment[]>> | undefined;

export function loadComments() {
	commentsFile ??= fetch('/babitube-data/comments.json')
		.then((r) => r.json())
		.catch(() => ({}));
	return commentsFile;
}

let playlistContents: Promise<Record<string, TubePlaylistContents>> | undefined;

export function loadPlaylistContents() {
	playlistContents ??= fetch('/babitube-data/playlists.json')
		.then((r) => r.json())
		.catch(() => ({}));
	return playlistContents;
}

export function itemToVideo(item: TubePlaylistItem): TubeVideo {
	return { ...item, url: youtubeUrl(item.id), cats: [], posts: [] };
}

export const watchHref = (video: { id: string; list?: string }) =>
	`/babitube/watch?v=${video.id}${video.list ? `&list=${video.list}` : ''}`;

// Fixed per page load: a refresh deals a new order, but going back to a page keeps your place.
const SEED = Math.random().toString(36);

/** A stable pseudo-random number in [0, 1) for this page load. */
export function seededRandom(key: string) {
	let hash = 2166136261;
	for (const ch of SEED + key) {
		hash ^= ch.charCodeAt(0);
		hash = Math.imul(hash, 16777619);
	}
	return (hash >>> 0) / 4294967296;
}

export function shuffled<T>(items: T[], keyOf: (item: T) => string, salt = '') {
	return items
		.map((item) => ({ item, rank: seededRandom(salt + keyOf(item)) }))
		.sort((a, b) => a.rank - b.rank)
		.map(({ item }) => item);
}

export const LENGTH_FILTERS: { key: string; label: string; test: (seconds: number) => boolean }[] = [
	{ key: 'short', label: 'Under 4 minutes', test: (s) => s < 240 },
	{ key: 'medium', label: '4 to 20 minutes', test: (s) => s >= 240 && s <= 1200 },
	{ key: 'long', label: 'Over 20 minutes', test: (s) => s > 1200 },
	{ key: 'hour', label: 'Over 1 hour', test: (s) => s > 3600 }
];

const uploadTime = (v: TubeVideo) => (v.published ? new Date(v.published).getTime() : null);

// Videos missing the sorted value (mostly deleted ones) always go last, whichever direction.
function byValue(value: (v: TubeVideo) => number | null, direction: 1 | -1) {
	return (a: TubeVideo, b: TubeVideo) => {
		const [x, y] = [value(a), value(b)];
		if (x === null) return y === null ? 0 : 1;
		if (y === null) return -1;
		return (x - y) * direction;
	};
}

export const SORT_OPTIONS: {
	key: string;
	label: string;
	compare: (a: TubeVideo, b: TubeVideo) => number;
}[] = [
	{ key: 'shared', label: 'Recently shared', compare: byValue(latestAt, -1) },
	{ key: 'newest', label: 'Upload date (newest)', compare: byValue(uploadTime, -1) },
	{ key: 'oldest', label: 'Upload date (oldest)', compare: byValue(uploadTime, 1) },
	{ key: 'views', label: 'Most viewed', compare: byValue((v) => v.views ?? null, -1) },
	{ key: 'likes', label: 'Most liked', compare: byValue((v) => v.likes ?? null, -1) },
	{ key: 'comments', label: 'Most commented', compare: byValue((v) => v.discussion ?? 0, -1) },
	{ key: 'reacted', label: 'Most reacted', compare: byValue(reactionTotal, -1) },
	{ key: 'longest', label: 'Longest', compare: byValue((v) => v.duration ?? null, -1) },
	{ key: 'shortest', label: 'Shortest', compare: byValue((v) => v.duration ?? null, 1) }
];

/** Applies the `len` and `sort` URL params, keeping the given order when no sort is chosen. */
export function applyFilters(videos: TubeVideo[], params: URLSearchParams) {
	const length = LENGTH_FILTERS.find((f) => f.key === params.get('len'));
	const sort = SORT_OPTIONS.find((s) => s.key === params.get('sort'));
	const kept = length ? videos.filter((v) => v.duration != null && length.test(v.duration)) : videos;
	return sort ? kept.toSorted(sort.compare) : kept;
}

/** The active `len` and `sort` params, for links that should keep them. */
export function filterParams(params: URLSearchParams) {
	return ['len', 'sort']
		.filter((key) => params.get(key))
		.map((key) => `${key}=${params.get(key)}`)
		.join('&');
}

let cachedFeed: { source: TubeVideo[]; round: number; feed: TubeVideo[] } | undefined;

// These describe how a video was shared rather than what it's about, so they say nothing about taste.
const NOT_INTERESTS = new Set(['my-channel', 'playlists', 'shorts', 'community', 'general']);

/**
 * The home feed: shuffled, leaning towards recent and well-received videos and the categories you've
 * been watching, with videos you've seen pushed down. Each round deals a new order.
 */
export function homeFeed(videos: TubeVideo[], round = 0) {
	if (cachedFeed?.source === videos && cachedFeed.round === round) return cachedFeed.feed;
	const now = Date.now() / 1000;
	const byId = new Map(videos.map((v) => [v.id, v]));
	const history = readHistory();
	const watched = new Set(history);

	const interest = new Map<string, number>();
	const recent = history.slice(0, 30).flatMap((id) => byId.get(id) ?? []);
	for (const v of recent) {
		for (const cat of v.cats) {
			if (!NOT_INTERESTS.has(cat)) interest.set(cat, (interest.get(cat) ?? 0) + 1 / recent.length);
		}
	}

	const feed = videos
		.filter((v) => !v.missing)
		.map((v) => {
			const ageDays = (now - latestAt(v)) / 86400;
			const affinity = v.cats.reduce((sum, cat) => sum + (interest.get(cat) ?? 0), 0);
			let weight =
				1 + 4 * Math.exp(-ageDays / 365) + Math.min(reactionTotal(v) / 40, 2) + 6 * Math.min(affinity, 1);
			if (watched.has(v.id)) weight *= 0.1;
			return { v, rank: seededRandom(`home${round}${v.id}`) ** (1 / weight) };
		})
		.sort((a, b) => b.rank - a.rank)
		.map(({ v }) => v);
	cachedFeed = { source: videos, round, feed };
	return feed;
}

export const CATEGORIES: { key: string; label: string; icon: Component<{ size?: number; strokeWidth?: number }> }[] = [
	{ key: 'music', label: 'Music', icon: Music2 },
	{ key: 'gaming', label: 'Gaming', icon: Gamepad2 },
	{ key: 'faith', label: 'Faith', icon: Church },
	{ key: 'programming', label: 'Programming', icon: CodeXml },
	{ key: 'ai', label: 'AI', icon: Bot },
	{ key: 'tech', label: 'Tech', icon: Cpu },
	{ key: 'science', label: 'Science', icon: Atom },
	{ key: 'podcasts', label: 'Podcasts', icon: Mic },
	{ key: 'film-tv', label: 'Film & TV', icon: Clapperboard },
	{ key: 'entertainment', label: 'Entertainment', icon: Tv },
	{ key: 'events', label: 'Events', icon: CalendarDays },
	{ key: 'education', label: 'Learning', icon: GraduationCap },
	{ key: 'community', label: 'Community', icon: Heart },
	{ key: 'vlogs', label: 'Vlogs', icon: Camera },
	{ key: 'motivation', label: 'Motivation', icon: Sparkles },
	{ key: 'design', label: 'Design', icon: Palette },
	{ key: 'news', label: 'News', icon: Newspaper },
	{ key: 'business', label: 'Business', icon: Briefcase },
	{ key: 'comedy', label: 'Comedy', icon: Laugh },
	{ key: 'general', label: 'Everything else', icon: Globe }
];

export const categoryIcon = (key: string) => CATEGORIES.find((c) => c.key === key)?.icon ?? Compass;
const EXTRA_LABELS: Record<string, string> = {
	'my-channel': 'My videos',
	shorts: 'Shorts',
	playlists: 'Playlists'
};
export const categoryLabel = (key: string) =>
	CATEGORIES.find((c) => c.key === key)?.label ?? EXTRA_LABELS[key] ?? key;

export const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const youtubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const postUrl = (id: number) => `${TELEGRAM}/${id}`;
export const channelHref = (name: string) => `/babitube/channel?name=${encodeURIComponent(name)}`;

export function latestAt(item: { posts: TubePost[] }) {
	return Math.max(...item.posts.map((p) => p.at));
}

export function reactionTotal(item: { posts: TubePost[] }) {
	return item.posts.reduce(
		(sum, p) => sum + (p.rx ?? []).reduce((s, [, count]) => s + count, 0),
		0
	);
}

export function compactNumber(n: number) {
	return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function timeAgo(seconds: number) {
	const diff = Math.max(0, Date.now() / 1000 - seconds);
	const units: [string, number][] = [
		['year', 31536000],
		['month', 2592000],
		['week', 604800],
		['day', 86400],
		['hour', 3600],
		['minute', 60]
	];
	for (const [name, size] of units) {
		const value = Math.floor(diff / size);
		if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
	}
	return 'just now';
}

export function formatDuration(total: number) {
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	const s = String(total % 60).padStart(2, '0');
	return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

// Export dates are local wall-clock strings, so parse the parts rather than shifting by the viewer's timezone.
export function formatPostDate(local: string, withTime = false) {
	const [date, time] = local.split('T');
	const [y, m, d] = date.split('-').map(Number);
	const label = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC'
	});
	return withTime ? `${label}, ${time.slice(0, 5)}` : label;
}

export function avatarColor(name: string) {
	let hash = 0;
	for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
	return `hsl(${Math.abs(hash) % 360} 45% 42%)`;
}

export function initial(name: string) {
	return (name.trim().replace(/^@+[._]*/, '')[0] ?? '?').toUpperCase();
}

/** Accepts the forms YouTube uses for a start time: 218, 218s, 1h2m3s. */
export function startSeconds(value?: string) {
	if (!value) return 0;
	if (/^\d+s?$/.test(value)) return parseInt(value, 10);
	const m = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
	return m ? Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0) : 0;
}

export function matchVideos(videos: TubeVideo[], query: string) {
	const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
	if (!terms.length) return [];
	const scored: [number, TubeVideo][] = [];
	for (const v of videos) {
		const title = v.title.toLowerCase();
		const channel = (v.channel ?? '').toLowerCase();
		const rest = v.posts
			.map((p) => `${richToText(p.rich)} ${(p.tags ?? []).join(' ')}`)
			.join(' ')
			.toLowerCase();
		let score = 0;
		for (const term of terms) {
			if (title.includes(term)) score += 3;
			else if (channel.includes(term)) score += 2;
			else if (rest.includes(term)) score += 1;
			else {
				score = -1;
				break;
			}
		}
		if (score > 0) scored.push([score, v]);
	}
	return scored.sort((a, b) => b[0] - a[0]).map(([, v]) => v);
}

/** Calls back whenever the element scrolls near the viewport. */
export function nearViewport(node: Element, callback: () => void) {
	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) callback();
		},
		{ rootMargin: '800px' }
	);
	observer.observe(node);
	return { destroy: () => observer.disconnect() };
}

const HISTORY_KEY = 'babitube-history';

export function readHistory(): string[] {
	try {
		return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
	} catch {
		return [];
	}
}

export function pushHistory(id: string) {
	try {
		const next = [id, ...readHistory().filter((x) => x !== id)].slice(0, 200);
		localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
	} catch {
		// History is a convenience; private windows can refuse storage.
	}
}

export function clearHistory() {
	try {
		localStorage.removeItem(HISTORY_KEY);
	} catch {
		// See pushHistory.
	}
}
