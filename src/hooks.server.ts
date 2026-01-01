import { dbConnect } from '$lib/db/db';
// import { type Handle } from "@sveltejs/kit";

// Connect DB
// export const handle: Handle = async ({ event, resolve }) => {
export async function handle({ event, resolve }) {
	try {
		await dbConnect();
	} catch (error) {
		console.error('DB connection error:', error);
	}

	return resolve(event);
}
