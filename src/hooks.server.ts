import { dbConnect } from '$lib/db/db';
// import { type Handle } from "@sveltejs/kit";

// /babitube renders on the client and defaults to dark, so paint its background before the app loads.
const BABITUBE_THEME_SCRIPT = `<script>try{if(JSON.parse(localStorage.getItem('babitube-prefs')||'{}').theme!=='light')document.documentElement.style.background='#0f0f0f'}catch(e){document.documentElement.style.background='#0f0f0f'}</script>`;

// Connect DB
// export const handle: Handle = async ({ event, resolve }) => {
export async function handle({ event, resolve }) {
	try {
		await dbConnect();
	} catch (error) {
		console.error('DB connection error:', error);
	}

	if (event.url.pathname === '/babitube' || event.url.pathname.startsWith('/babitube/')) {
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('</head>', `${BABITUBE_THEME_SCRIPT}</head>`)
		});
	}

	return resolve(event);
}
