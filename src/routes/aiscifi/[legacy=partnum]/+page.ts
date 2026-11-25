import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// Perihelion's parts used to live at /aiscifi/N before the collection existed.
export const load: PageLoad = ({ params, url }) => {
	redirect(308, `/aiscifi/perihelion/${params.legacy}${url.search}`);
};
