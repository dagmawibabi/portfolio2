// The /aiscifi collection. Add a series here once its subroute exists.
import { minutesFor } from './text';
import * as perihelion from './perihelion/story';
import * as heartbeat from './heartbeat/story';

export type SeriesStatus = 'complete' | 'ongoing' | 'in preparation';

export type SeriesEntry = {
	slug: string;
	href: string;
	title: string;
	tagline: string;
	blurb: string;
	status: SeriesStatus;
	parts: number;
	words: number;
	minutes: number;
	setting: string;
	tags: string[];
};

export const catalog: SeriesEntry[] = [
	{
		slug: perihelion.series.slug,
		href: perihelion.BASE,
		title: perihelion.series.title,
		tagline: perihelion.series.tagline,
		blurb: perihelion.series.blurb,
		status: 'complete',
		parts: perihelion.parts.length,
		words: perihelion.totalWords,
		minutes: perihelion.parts.reduce((m, p) => m + perihelion.readingMinutes(p.n), 0),
		setting: 'The asteroid belt, 2193',
		tags: ['Hard SF', 'Rogue AI', 'Orbital mechanics', 'Serial']
	},
	{
		slug: heartbeat.series.slug,
		href: heartbeat.BASE,
		title: heartbeat.series.title,
		tagline: heartbeat.series.tagline,
		blurb: heartbeat.series.blurb,
		status: 'ongoing',
		parts: heartbeat.parts.length,
		words: heartbeat.totalWords,
		minutes: heartbeat.parts.reduce((m, p) => m + heartbeat.readingMinutes(p.n), 0),
		setting: 'Texas, December 2026',
		tags: ['Near future', 'AI agents', 'Power grid', 'Serial']
	}
];

export const archiveWords = catalog.reduce((n, s) => n + s.words, 0);
export const archiveMinutes = minutesFor(archiveWords);
