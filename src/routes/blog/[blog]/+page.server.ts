import type { PageServerLoad } from './$types';
import fm from 'front-matter';
import { compile } from 'mdsvex';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import html from 'remark-html';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

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

	// const result = await compile(body, {
	// 	// @ts-ignore
	// 	rehypePlugins: [rehypeSanitize, rehypeKatex]
	// });

	// return {
	// 	// content: String(html),
	// 	content: result!.code,
	// 	meta: {
	// 		title: attributes.title ?? slug,
	// 		date: attributes.date ?? null,
	// 		description: attributes.description ?? '',
	// 		category: attributes.category ?? 'Uncategorized'
	// 	}
	// };

	// Proper Markdown → HTML pipeline
	const processed = await remark()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeKatex)
		.use(rehypeHighlight)
		.use(rehypeSanitize)
		.use(rehypeStringify)
		.process(body);

	return {
		// content: String(html),
		content: processed.toString(),
		meta: {
			title: attributes.title ?? slug,
			date: attributes.date ?? null,
			description: attributes.description ?? '',
			category: attributes.category ?? 'Uncategorized'
		}
	};
};
