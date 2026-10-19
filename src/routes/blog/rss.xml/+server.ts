import type { RequestHandler } from './$types';
import config from '$lib/blog-config.json';
import { getAllBlogs } from '$lib/blogs';
import { blogDateToUtc } from '$lib/blog-date';

export const prerender = true;

const escapeXml = (text: string) =>
	text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

export const GET: RequestHandler = async () => {
	const blogs = getAllBlogs();
	const blogUrl = `${config.siteUrl}/blog`;

	const items = blogs
		.map((blog) => {
			const url = `${blogUrl}/${blog.slug}`;
			const published = blogDateToUtc(blog.date);
			return `
		<item>
			<title>${escapeXml(blog.title)}</title>
			<link>${url}</link>
			<guid isPermaLink="true">${url}</guid>
			<description>${escapeXml(blog.description)}</description>
			<category>${escapeXml(blog.category)}</category>${
				published ? `\n\t\t\t<pubDate>${published.toUTCString()}</pubDate>` : ''
			}
		</item>`;
		})
		.join('');

	const lastBuild = blogDateToUtc(blogs[0]?.date ?? null) ?? new Date();

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escapeXml(`${config.name}'s Blog`)}</title>
		<link>${blogUrl}</link>
		<description>${escapeXml(config.description)}</description>
		<language>en</language>
		<lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
		<atom:link href="${blogUrl}/rss.xml" rel="self" type="application/rss+xml" />
		<image>
			<url>${blogUrl}/og.png</url>
			<title>${escapeXml(`${config.name}'s Blog`)}</title>
			<link>${blogUrl}</link>
		</image>${items}
	</channel>
</rss>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
