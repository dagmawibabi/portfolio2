import data from '$lib/channel/goodnight.json';
import type { PageServerLoad } from './$types';

export const prerender = true;

export type Verse = {
	id: number;
	date: string;
	text: string;
	ref: string | null;
	greeting: string | null;
	lang: 'am' | 'en';
	media: string | null;
	reactions: number;
};

// Only posts with written words make the wall: image posts (with or without a reference
// caption) and emoji-only goodnights are left out.
const hasWords = (v: Verse) => !!v.text && /\p{L}/u.test(v.text);

export const load: PageServerLoad = () => ({
	verses: (data.verses as Verse[]).filter(hasWords)
});
