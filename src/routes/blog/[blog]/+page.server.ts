import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { error } from '@sveltejs/kit';
import { imageSize } from 'image-size';
import type { EntryGenerator, PageServerLoad } from './$types';
import config from '$lib/blog-config.json';
import { getAllBlogs, getBlog, getSeriesInfo } from '$lib/blogs';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';

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

// Runs after sanitizing, so the `user-content-` prefixed ids are final
const addHeadingAnchors = () => {
	return (tree: HastNode) => {
		const visit = (node: HastNode) => {
			if (node.type === 'element' && node.tagName && headingTags.has(node.tagName)) {
				const id = node.properties?.id;
				if (typeof id === 'string') {
					node.children = [
						...(node.children ?? []),
						{
							type: 'element',
							tagName: 'a',
							properties: {
								href: `#${id}`,
								className: ['heading-anchor'],
								ariaLabel: `Link to “${extractText(node).trim()}”`
							},
							children: [{ type: 'text', value: '#' }]
						}
					];
				}
				return;
			}

			node.children?.forEach(visit);
		};

		visit(tree);
	};
};

// Image dimensions are read from /static at build time (pages are prerendered).
// If a file can't be read (e.g. at runtime on the server) the image just goes without them.
const imageSizeCache = new Map<string, { width: number; height: number } | null>();
const getStaticImageSize = (src: string) => {
	if (!src.startsWith('/') || src.startsWith('//')) return null;
	if (!imageSizeCache.has(src)) {
		let size = null;
		try {
			const filePath = resolve('static', decodeURIComponent(src.split(/[?#]/)[0]).slice(1));
			const { width, height } = imageSize(readFileSync(filePath));
			size = width && height ? { width, height } : null;
		} catch {
			size = null;
		}
		imageSizeCache.set(src, size);
	}
	return imageSizeCache.get(src) ?? null;
};

// Lazy-load every image except the first (usually the header, which should show right away)
// and add width/height so the page doesn't jump around while images load
const optimizeImages = () => {
	return (tree: HastNode) => {
		let isFirstImage = true;

		const visit = (node: HastNode) => {
			if (node.type === 'element' && node.tagName === 'img') {
				const properties = (node.properties ??= {});
				const src = typeof properties.src === 'string' ? properties.src : '';
				const size = getStaticImageSize(src);

				if (size && properties.width === undefined && properties.height === undefined) {
					properties.width = size.width;
					properties.height = size.height;
				}
				properties.decoding = 'async';
				if (isFirstImage) {
					properties.fetchPriority = 'high';
				} else {
					properties.loading = 'lazy';
				}
				isFirstImage = false;
			}

			node.children?.forEach(visit);
		};

		visit(tree);
	};
};

// Every known blog is prerendered; anything else is still handled at runtime so it can 404
export const prerender = 'auto';

export const entries: EntryGenerator = () => getAllBlogs().map(({ slug }) => ({ blog: slug }));

export const load: PageServerLoad = async ({ params }) => {
	const blog = getBlog(params.blog);
	if (!blog) error(404, 'Blog not found');

	// Proper Markdown → HTML pipeline
	const processed = await remark()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeKatex)
		.use(rehypeHighlight)
		.use(addHeadingIds)
		.use(rehypeSanitize, headingSanitizeSchema)
		.use(addHeadingAnchors)
		.use(optimizeImages)
		.use(rehypeStringify)
		.process(blog.body);

	const url = `${config.siteUrl}/blog/${blog.slug}`;

	return {
		content: processed.toString(),
		meta: {
			slug: blog.slug,
			headerImage: blog.headerImage,
			title: blog.title,
			date: blog.date,
			description: blog.description,
			category: blog.category
		},
		series: getSeriesInfo(blog),
		og: {
			url,
			image: new URL(blog.headerImage ?? `/blog/${blog.slug}/og.png`, config.siteUrl).href,
			isGenerated: !blog.headerImage
		}
	};
};
