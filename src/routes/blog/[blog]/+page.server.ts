import type { PageServerLoad } from './$types';
import fm from 'front-matter';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

type HastNode = {
	type: string;
	tagName?: string;
	value?: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
};

const headingTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

const slugifyHeading = (text: string) =>
	text
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');

const extractText = (node: HastNode): string => {
	if (node.type === 'text') {
		return node.value ?? '';
	}

	if (!node.children) {
		return '';
	}

	return node.children.map(extractText).join('');
};

const addHeadingIds = () => {
	return (tree: HastNode) => {
		const seenSlugs = new Map<string, number>();

		const visit = (node: HastNode) => {
			if (node.type === 'element' && node.tagName && headingTags.has(node.tagName)) {
				const properties = node.properties ?? {};
				const existingId = typeof properties.id === 'string' ? properties.id : null;

				if (!existingId) {
					const baseSlug = slugifyHeading(extractText(node)) || 'section';
					const duplicateCount = seenSlugs.get(baseSlug) ?? 0;
					const slug = duplicateCount === 0 ? baseSlug : `${baseSlug}-${duplicateCount + 1}`;

					seenSlugs.set(baseSlug, duplicateCount + 1);
					node.properties = { ...properties, id: slug };
				}
			}

			node.children?.forEach(visit);
		};

		visit(tree);
	};
};

const headingSanitizeSchema = structuredClone(defaultSchema);
headingSanitizeSchema.attributes ??= {};

for (const tagName of headingTags) {
	headingSanitizeSchema.attributes[tagName] = [
		...(headingSanitizeSchema.attributes[tagName] ?? []),
		'id'
	];
}

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

	// Proper Markdown → HTML pipeline
	const processed = await remark()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeKatex)
		.use(rehypeHighlight)
		.use(addHeadingIds)
		.use(rehypeSanitize, headingSanitizeSchema)
		.use(rehypeStringify)
		.process(body);

	return {
		content: processed.toString(),
		meta: {
			title: attributes.title ?? slug,
			date: attributes.date ?? null,
			description: attributes.description ?? '',
			category: attributes.category ?? 'Uncategorized'
		}
	};
};
