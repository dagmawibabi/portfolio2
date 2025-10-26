import type { PageServerLoad } from './$types';
import fm from 'front-matter';

export const load: PageServerLoad = async ({ params }) => {
	const { blog: slug } = params;

	interface FrontMatter {
		title?: string;
		date?: string;
		description?: string;
		category?: string;
	}

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
	const { attributes, body } = fm<FrontMatter>(raw as string);

	return {
		content: body,
		meta: {
			title: attributes.title ?? slug,
			date: attributes.date ?? null,
			description: attributes.description ?? '',
			category: attributes.category ?? 'Uncategorized'
		}
	};
};
