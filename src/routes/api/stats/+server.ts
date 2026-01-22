import Rsvp from '$lib/db/models/rsvp';
import { json } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { Resend } from 'resend';

export async function GET({ url }) {
	const isAccepted = await Rsvp.find({ isAccepted: true });
	const hasConfirmed = await Rsvp.find({ hasConfirmed: true });
	const rsvpCount = await Rsvp.countDocuments();

	return json({ isAccepted: isAccepted.length, hasConfirmed: hasConfirmed.length, rsvpCount });
}
