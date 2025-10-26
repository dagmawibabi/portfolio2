import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const matter = (await import('gray-matter')).default;
	const { blog: slug } = params;

	// Import all markdown files at build time
	const files = import.meta.glob('/static/blogs/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	});

	const match = Object.entries(files).find(([path]) =>
		path.toLowerCase().endsWith(`/${slug.toLowerCase()}.md`)
	);

	if (!match) {
		return {
			status: 404,
			error: new Error(`Blog not found: ${slug}`)
		};
	}

	const [, raw] = match;
	const { data, content } = matter(raw as string);

	return {
		content,
		meta: {
			title: data.title ?? slug,
			date: data.date ?? null,
			description: data.description ?? '',
			category: data.category ?? 'Uncategorized'
		}
	};
};
