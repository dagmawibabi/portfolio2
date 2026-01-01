import Rsvp from '$lib/db/models/rsvp';

export async function POST({ request }) {
	const { rsvp } = await request.json();

	const doc = await Rsvp.create(rsvp);

	console.log(doc);

	return Response.json(doc, { status: 201 });
}
