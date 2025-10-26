import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const load = async ({ params }) => {
	const blogTitle = params.blog;
	const filePath = path.resolve('src/lib/blogs', `${blogTitle}.md`);
	const raw = fs.readFileSync(filePath, 'utf-8');

	const { data, content } = matter(raw);

	return {
		content, // markdown content only
		meta: {
			title: data.title || blogTitle,
			date: data.date || null,
			description: data.description || '',
			category: data.category || 'Uncategorized'
		}
	};
};
