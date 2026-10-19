import type { RequestHandler } from './$types';
import config from '$lib/blog-config.json';
import { getAllBlogs } from '$lib/blogs';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const blogs = getAllBlogs();

	const pages = [
		{ path: '/', lastmod: null },
		{ path: '/blog', lastmod: blogs[0]?.date ?? null },
		...blogs.map((blog) => ({ path: `/blog/${blog.slug}`, lastmod: blog.date }))
	];

	const urls = pages
		.map(
			({ path, lastmod }) => `
	<url>
		<loc>${config.siteUrl}${path}</loc>${lastmod ? `\n\t\t<lastmod>${lastmod}</lastmod>` : ''}
	</url>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
