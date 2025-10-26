import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const blogsDir = path.resolve('src/lib/blogs');
	const files = fs.readdirSync(blogsDir).filter((f) => f.endsWith('.md'));

	const blogs = files.map((file) => {
		const filePath = path.join(blogsDir, file);
		const content = fs.readFileSync(filePath, 'utf-8');
		const { data } = matter(content);

		return {
			slug: file.replace('.md', ''),
			title: data.title || file.replace('.md', ''),
			date: data.date || null,
			description: data.description || '',
			category: data.category || 'Uncategorized'
		};
	});

	// Group by category
	const grouped: Record<string, typeof blogs> = {};
	for (const blog of blogs) {
		if (!grouped[blog.category]) grouped[blog.category] = [];
		grouped[blog.category].push(blog);
	}

	return { grouped };
};
