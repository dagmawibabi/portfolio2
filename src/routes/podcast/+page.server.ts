import { env } from '$env/dynamic/private';
import { fetchPodcast, type PodcastData } from '$lib/podcast/youtube';
import snapshot from '$lib/podcast/snapshot.json';
import type { PageServerLoad } from './$types';

// On Vercel the page is cached and rebuilt in the background at most once an hour,
// so visitors never wait on the YouTube API and the quota stays tiny.
export const config = { isr: { expiration: 3600 } };

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=600, s-maxage=3600' });

	const key = env.YOUTUBE_API_KEY;
	if (key) {
		try {
			return { podcast: await fetchPodcast(key, fetch) };
		} catch (err) {
			console.error('[podcasts] YouTube API failed, using snapshot:', err);
		}
	}
	return { podcast: snapshot as PodcastData };
};
