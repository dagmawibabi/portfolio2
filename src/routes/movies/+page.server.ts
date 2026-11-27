import data from '$lib/channel/movies.json';
import type { Segment } from '$lib/channel';
import type { PageServerLoad } from './$types';

export const prerender = true;

export type Kind = 'movie' | 'series' | 'documentary' | 'short' | 'anime';

export type ChannelPost = { id: number; date: string; segments: Segment[]; reactions: number; media: string | null };

export type Meta = {
	source: 'letterboxd' | 'tvmaze';
	url: string | null;
	name: string | null;
	year: number | null;
	poster: string | null;
	backdrop: string | null;
	directors: string[];
	cast: string[];
	genres: string[];
	countries: string[];
	network?: string | null;
	runtime: number | null;
	synopsis: string | null;
	tagline: string | null;
	avg: number | null;
	votes: number | null;
	status?: string;
};

export type Film = {
	key: string;
	title: string;
	year: number | null;
	kind: Kind;
	uri: string | null;
	watched: boolean;
	watchedOn: string | null;
	rating: number | null;
	liked: boolean;
	rewatch: boolean;
	review: string | null;
	reviewDate: string | null;
	lists: string[];
	watchlist: boolean;
	favorite: boolean;
	diary: { date: string; rating: number | null; rewatch: boolean }[];
	posts: ChannelPost[];
	meta: Meta | null;
};

export type FilmList = { slug: string; name: string; description: string; date: string; films: string[] };

export type LogPost = ChannelPost & { kind: Kind; tags: string[] };

export const load: PageServerLoad = () => ({
	films: data.films as unknown as Film[],
	lists: data.lists as FilmList[],
	channelLog: data.channelLog as unknown as LogPost[],
	profile: data.profile as { username: string; joined: string; location: string }
});
