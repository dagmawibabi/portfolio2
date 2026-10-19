import type { PageServerLoad } from './$types';
import { getAllBlogs } from '$lib/blogs';

// Blogs are markdown files bundled at build time, so the list can be static
export const prerender = true;

export const load: PageServerLoad = async () => {
	const blogs = getAllBlogs().map(({ slug, title, date, description, category }) => ({
		slug,
		title,
		date,
		description,
		category
	}));

	const grouped: Record<string, typeof blogs> = {};
	for (const blog of blogs) {
		if (!grouped[blog.category]) grouped[blog.category] = [];
		grouped[blog.category].push(blog);
	}

	return { grouped };
};
