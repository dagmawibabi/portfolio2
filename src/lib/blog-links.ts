import config from '$lib/blog-config.json';

// Kept apart from blogs.ts so client code can build links without bundling every markdown file

// Shared and shown to readers; canonical / OG URLs keep using config.siteUrl
export const blogUrl = (slug: string) => `${config.shareUrl}/blog/${slug}`;

export const rssUrl = `${config.shareUrl}/blog/rss.xml`;

// Substack post slugs are the blog's file name, lowercased
export const substackUrl = (slug: string) => `${config.substack}/p/${slug.toLowerCase()}`;

// The raw markdown is served straight from /static
export const blogMarkdownPath = (slug: string) => `/blogs/${slug}.md`;

export const siteHost = new URL(config.shareUrl).host.replace(/^www\./, '');
export const substackHost = new URL(config.substack).host;
