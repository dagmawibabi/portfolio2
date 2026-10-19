import type { RequestHandler } from './$types';
import config from '$lib/blog-config.json';
import { renderOgCard } from '$lib/server/og';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const png = await renderOgCard({
		title: `Blogs by ${config.name}`,
		description: 'Writings on faith, tech, creativity and life.'
	});

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=86400, s-maxage=604800'
		}
	});
};
