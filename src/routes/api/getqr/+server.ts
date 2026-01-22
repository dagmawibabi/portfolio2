import Rsvp from '$lib/db/models/rsvp';
import { json } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { Resend } from 'resend';

export async function GET({ url }) {
	try {
		const number = url.searchParams.get('number');

		if (!number) {
			return json({ error: 'Missing number' }, { status: 400 });
		}

		// const rsvpInfo = await Rsvp.findById({ _id: ObjectId(id) });
		const rsvpInfo = await Rsvp.findOne({ phone: number });
		const rsvpCount = await Rsvp.countDocuments();

		if (!rsvpInfo) {
			return json({ error: 'Not found' }, { status: 404 });
		}

		return json({ rsvpCount, rsvpInfo });
	} catch (e) {
		return json({ rsvpCount: 0, rsvpInfo: [] });
	}
}
