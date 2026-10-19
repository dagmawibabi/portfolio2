import { error } from '@sveltejs/kit';
import type { EntryGenerator, RequestHandler } from './$types';
import { getAllBlogs, getBlog } from '$lib/blogs';
import { renderOgCard } from '$lib/server/og';

export const prerender = true;

export const entries: EntryGenerator = () => getAllBlogs().map(({ slug }) => ({ blog: slug }));

export const GET: RequestHandler = async ({ params }) => {
	const blog = getBlog(params.blog);
	if (!blog) error(404, `Blog not found: ${params.blog}`);

	const png = await renderOgCard({
		title: blog.title,
		description: blog.description,
		date: blog.date,
		category: blog.category
	});

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=86400, s-maxage=604800'
		}
	});
};
