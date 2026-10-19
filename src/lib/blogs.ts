import fm from 'front-matter';

export interface BlogFrontMatter {
	title?: string;
	date?: string;
	description?: string;
	category?: string;
	// Optional override for the share (Open Graph) image
	image?: string;
}

export interface BlogEntry {
	slug: string;
	title: string;
	date: string | null;
	description: string;
	category: string;
	headerImage: string | null;
	body: string;
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
		date: attributes.date || null,
		description: attributes.description || '',
		category: attributes.category || 'Uncategorized',
		headerImage: attributes.image || findHeaderImage(body),
		body
	};
};

export const getAllBlogs = (): BlogEntry[] =>
	Object.entries(files).map(([path, raw]) => parseBlog(path, raw));

export const getBlog = (slug: string): BlogEntry | null => {
	const match = Object.entries(files).find(([path]) =>
		path.toLowerCase().endsWith(`/${slug.toLowerCase()}.md`)
	);
	return match ? parseBlog(match[0], match[1]) : null;
};
