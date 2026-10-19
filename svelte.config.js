// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	extensions: ['.svelte', '.svx'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.svx', '.md'],
			rehypePlugins: [rehypeSanitize, rehypeKatex]
		})
	],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		prerender: {
			// Blog posts are prerendered; a broken link inside a post shouldn't break the build
			handleHttpError: ({ path, referrer, message }) => {
				if (referrer?.startsWith('/blog/')) {
					console.warn(`[prerender] broken link in ${referrer}: ${path}`);
					return;
				}
				throw new Error(message);
			},
			handleMissingId: ({ path, id, referrers }) => {
				console.warn(`[prerender] missing #${id} on ${path} (linked from ${referrers.join(', ')})`);
			}
		},
		alias: {
			'@/*': './path/to/lib/*'
		}
	}
};

export default config;
