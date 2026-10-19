import fm from 'front-matter';
import config from '$lib/blog-config.json';
import { normalizeBlogDate } from '$lib/blog-date';

export interface BlogFrontMatter {
	title?: string;
	date?: string | Date;
	description?: string;
	category?: string;
	// Optional override for the share (Open Graph) image
	image?: string;
}

export interface BlogEntry {
	slug: string;
	title: string;
	// Normalized to YYYY-MM-DD
	date: string | null;
	description: string;
	category: string;
	headerImage: string | null;
	body: string;
}

export interface SeriesLink {
	slug: string;
	title: string;
}

export interface SeriesInfo {
	name: string;
	part: number;
	total: number;
	previous: SeriesLink | null;
	next: SeriesLink | null;
}

const files = import.meta.glob('/static/blogs/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

// A blog has a header image when the very first thing in its body is an image
const findHeaderImage = (body: string): string | null => {
	const firstLine = body.split('\n').find((line) => line.trim() !== '');
	const match = firstLine?.trim().match(/^!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)$/);
	return match ? match[1] : null;
};

const parseBlog = (path: string, raw: string): BlogEntry => {
	const { attributes, body } = fm<BlogFrontMatter>(raw);
	const slug = path.split('/').pop()?.replace('.md', '') ?? '';
	return {
		slug,
		title: attributes.title || slug,
		date: normalizeBlogDate(attributes.date),
		description: attributes.description || '',
		category: attributes.category || 'Uncategorized',
		headerImage: attributes.image || findHeaderImage(body),
		body
	};
};

// Newest first; YYYY-MM-DD strings sort correctly as text
export const getAllBlogs = (): BlogEntry[] =>
	Object.entries(files)
		.map(([path, raw]) => parseBlog(path, raw))
		.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

export const getBlog = (slug: string): BlogEntry | null => {
	const match = Object.entries(files).find(([path]) =>
		path.toLowerCase().endsWith(`/${slug.toLowerCase()}.md`)
	);
	return match ? parseBlog(match[0], match[1]) : null;
};

// Categories listed under `series` in blog-config.json are read in date order, part by part
export const getSeriesInfo = (blog: BlogEntry): SeriesInfo | null => {
	if (!config.series.includes(blog.category)) return null;

	const parts = getAllBlogs()
		.filter((entry) => entry.category === blog.category)
		.reverse();
	const index = parts.findIndex((entry) => entry.slug === blog.slug);
	if (index === -1 || parts.length < 2) return null;

	const toLink = (entry?: BlogEntry): SeriesLink | null =>
		entry ? { slug: entry.slug, title: entry.title } : null;

	return {
		name: blog.category,
		part: index + 1,
		total: parts.length,
		previous: toLink(parts[index - 1]),
		next: toLink(parts[index + 1])
	};
};
