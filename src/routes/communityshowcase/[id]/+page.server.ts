import { error } from '@sveltejs/kit';
import { posts, listPosts } from '$lib/channel/showcase';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => posts.map((p) => ({ id: String(p.id) }));

export const load: PageServerLoad = ({ params }) => {
	const i = posts.findIndex((p) => String(p.id) === params.id);
	if (i < 0) error(404, 'No showcase with that id');
	const post = posts[i];
	const light = listPosts();
	const makers = new Set(post.creators.map((c) => c.toLowerCase()));
	const byMakers = light.filter((p) => p.id !== post.id && p.creators.some((c) => makers.has(c.toLowerCase()))).slice(0, 6);
	const seen = new Set([post.id, ...byMakers.map((p) => p.id)]);
	const related = light
		.filter((p) => !seen.has(p.id) && p.categories.some((c) => post.categories.includes(c)))
		// nearest in time first, so "related" feels like the same era of the community
		.sort((a, b) => Math.abs(+new Date(a.date) - +new Date(post.date)) - Math.abs(+new Date(b.date) - +new Date(post.date)))
		.slice(0, 3);
	const brief = (p?: (typeof posts)[number]) => (p ? { id: p.id, title: p.title, date: p.date } : null);
	return {
		post,
		newer: brief(posts[i - 1]),
		older: brief(posts[i + 1]),
		byMakers,
		related,
		index: posts.length - i,
		total: posts.length
	};
};
