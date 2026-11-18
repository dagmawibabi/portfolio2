// Fetches the podcast from the YouTube Data API and shapes it for the /podcast page.
// Kept free of SvelteKit imports (and to erasable TypeScript) so scripts/podcast-snapshot.ts
// can run it directly with Node to refresh the bundled fallback.

export type Chapter = { start: number; label: string };

export type Episode = {
	id: string;
	number: number | null;
	title: string;
	guest: string;
	role: string;
	topics: string[];
	summary: string;
	chapters: Chapter[];
	lang: 'en' | 'am';
	published: string;
	duration: number;
	views: number;
	likes: number;
	thumb: string;
};

export type Extra = { id: string; title: string; duration: number; thumb: string };

export type PodcastData = {
	channel: { subscribers: number; views: number; videos: number; url: string };
	episodes: Episode[];
	extras: Extra[];
	source: 'live' | 'snapshot';
	fetchedAt: string;
};

export const CHANNEL_ID = 'UCV9BVFTBYnIETqbT6eWgAeg';
export const CHANNEL_URL = 'https://www.youtube.com/@dagmawi_babi';
const PLAYLISTS = {
	en: 'PLGWU3MSkRXDoF7Gu1ElVhP-cbXXpqjI_t',
	am: 'PLGWU3MSkRXDqqKDkPX8jJkJfBT2Aagn-2'
} as const;

// Anything shorter than this in the podcast playlists is a trailer or update, not an episode.
const MIN_EPISODE_SECONDS = 15 * 60;

const API = 'https://www.googleapis.com/youtube/v3';

type Fetch = typeof fetch;

async function api(fetcher: Fetch, path: string, key: string) {
	const res = await fetcher(`${API}/${path}&key=${key}`);
	if (!res.ok) throw new Error(`YouTube API ${res.status} on ${path.split('?')[0]}`);
	return res.json();
}

export function parseDuration(iso: string): number {
	const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
	if (!m) return 0;
	return (Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0)) * 60 + Number(m[3] ?? 0);
}

function toSeconds(stamp: string): number {
	return stamp.split(':').reduce((acc, part) => acc * 60 + Number(part), 0);
}

// Themes every episode covers; the page states them once instead of tagging each row.
const GENERIC_TOPICS =
	/^(and )?more$|^mor$|^upbringings?$|^early life$|^career$|^education$|^hobbies$|^faith$|^family$|^advises$|^beliefs$/i;

export function parseEpisode(
	video: any,
	lang: 'en' | 'am'
): Episode {
	const s = video.snippet;
	const description: string = s.description ?? '';
	const lines = description.split(/\r?\n/).map((l: string) => l.trim());

	const [titleGuest, titleTopics = ''] = s.title.split(/\s+—\s+/);
	let number: number | null = null;
	let guest = titleGuest.trim();
	let role = '';
	let bodyStart = 0;

	const epIndex = lines.findIndex((l) => /^Episode\s+\d+/i.test(l));
	if (epIndex !== -1) {
		number = Number(/\d+/.exec(lines[epIndex])![0]);
		// The next two non-empty lines are the guest's name and a one-line role.
		let i = epIndex + 1;
		const next = () => {
			while (i < lines.length && lines[i] === '') i++;
			return i < lines.length ? lines[i++] : '';
		};
		const name = next();
		if (name) guest = name;
		const roleLine = next();
		if (roleLine.length < 90) role = roleLine;
		else i--;
		bodyStart = i;
	}

	// The summary is the first real paragraph after the guest block.
	const chaptersAt = lines.findIndex((l) => /^chapters/i.test(l));
	const body = lines.slice(bodyStart, chaptersAt === -1 ? undefined : chaptersAt);
	const summary =
		body
			.join('\n')
			.split(/\n{2,}/)
			.map((p) => p.replace(/\n/g, ' ').trim())
			.find((p) => p.length > 60) ?? '';

	const chapters: Chapter[] = [];
	const stamp = /^(\d{1,2}(?::\d{2}){1,2})\s*(?:[-–]\s*\d{1,2}(?::\d{2}){1,2})?\s*[-–:]?\s*(.+)$/;
	for (const line of chaptersAt === -1 ? lines : lines.slice(chaptersAt + 1)) {
		const m = stamp.exec(line);
		if (m && m[2]) chapters.push({ start: toSeconds(m[1]), label: m[2].trim() });
	}
	chapters.sort((a, b) => a.start - b.start);

	const topics = titleTopics
		.split(/,\s*|\s+and\s+/)
		.map((t: string) => t.trim())
		.filter((t: string) => t && !GENERIC_TOPICS.test(t))
		.slice(0, 6);

	const thumbs = s.thumbnails ?? {};
	const thumb = (thumbs.maxres ?? thumbs.standard ?? thumbs.high ?? thumbs.medium)?.url ?? '';

	return {
		id: video.id,
		number,
		title: s.title,
		guest,
		role,
		topics,
		summary,
		chapters,
		lang,
		published: s.publishedAt,
		duration: parseDuration(video.contentDetails.duration),
		views: Number(video.statistics?.viewCount ?? 0),
		likes: Number(video.statistics?.likeCount ?? 0),
		thumb
	};
}

export async function fetchPodcast(key: string, fetcher: Fetch = fetch): Promise<PodcastData> {
	const ids: Record<'en' | 'am', string[]> = { en: [], am: [] };
	for (const lang of ['en', 'am'] as const) {
		const data = await api(
			fetcher,
			`playlistItems?part=contentDetails&maxResults=50&playlistId=${PLAYLISTS[lang]}`,
			key
		);
		ids[lang] = data.items.map((i: any) => i.contentDetails.videoId);
	}

	const all = [...new Set([...ids.en, ...ids.am])];
	const [videos, channel] = await Promise.all([
		api(fetcher, `videos?part=snippet,contentDetails,statistics&id=${all.join(',')}`, key),
		api(fetcher, `channels?part=statistics&id=${CHANNEL_ID}`, key)
	]);

	const episodes: Episode[] = [];
	const extras: Extra[] = [];
	for (const v of videos.items) {
		const duration = parseDuration(v.contentDetails.duration);
		if (duration < MIN_EPISODE_SECONDS) {
			if (duration > 30) {
				const t = v.snippet.thumbnails;
				extras.push({
					id: v.id,
					title: v.snippet.title,
					duration,
					thumb: (t.maxres ?? t.high ?? t.medium).url
				});
			}
			continue;
		}
		const lang = ids.am.includes(v.id) && !ids.en.includes(v.id) ? 'am' : 'en';
		episodes.push(parseEpisode(v, lang));
	}
	episodes.sort((a, b) => b.published.localeCompare(a.published));

	const stats = channel.items?.[0]?.statistics ?? {};
	return {
		channel: {
			subscribers: Number(stats.subscriberCount ?? 0),
			views: Number(stats.viewCount ?? 0),
			videos: Number(stats.videoCount ?? 0),
			url: CHANNEL_URL
		},
		episodes,
		extras,
		source: 'live',
		fetchedAt: new Date().toISOString()
	};
}
