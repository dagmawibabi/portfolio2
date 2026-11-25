import { error } from '@sveltejs/kit';
import { getPart, parts } from '$lib/aiscifi/story';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => parts.map((p) => ({ part: p.slug }));

export const load: PageLoad = ({ params }) => {
	const data = getPart(params.part);
	if (!data) error(404, 'No such transmission');
	const i = parts.findIndex((p) => p.slug === params.part);
	return {
		...data,
		prev: i > 0 ? parts[i - 1] : null,
		next: i < parts.length - 1 ? parts[i + 1] : null,
		total: parts.length
	};
};
