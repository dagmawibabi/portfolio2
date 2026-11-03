import type { LayoutLoad } from './$types';
import type { TubeData } from '$lib/babitube/utils';

// The catalog is a static file, so the whole section renders on the client.
export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
	const res = await fetch('/babitube-data/videos.json');
	const babitube: TubeData = await res.json();
	return { babitube };
};
