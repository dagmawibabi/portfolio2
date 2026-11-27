import { listPosts } from '$lib/channel/showcase';
import type { PageServerLoad } from './$types';

export const prerender = true;

export type { ShowcasePost } from '$lib/channel/showcase';

export const load: PageServerLoad = () => ({ posts: listPosts() });
