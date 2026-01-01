import Rsvp from '$lib/db/models/rsvp';
import { json } from '@sveltejs/kit';
import mongoose from 'mongoose';

export async function GET({ url }) {
	try {
		const id = url.searchParams.get('id');

		if (!id) {
			return json({ error: 'Missing id' }, { status: 400 });
		}

		// Validate ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return json({ error: 'Invalid id' }, { status: 400 });
		}

		// const rsvpInfo = await Rsvp.findById({ _id: ObjectId(id) });
		const rsvpInfo = await Rsvp.findById(id);
		const rsvpCount = await Rsvp.countDocuments();

		if (!rsvpInfo) {
			return json({ error: 'Not found' }, { status: 404 });
		}

		return json({ rsvpCount, rsvpInfo });
	} catch (e) {
		return json({ rsvpCount: 0, rsvpInfo: [] });
	}
}

export async function POST({ request }) {
	const { rsvp } = await request.json();

	const doc = await Rsvp.create(rsvp);

	console.log(doc);

	return Response.json(doc, { status: 201 });
}
