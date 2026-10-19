import { dbConnect } from '$lib/db/db';
import Pass from '$lib/db/models/pass';
import {
	ADMIN_COOKIE,
	adminCookieOptions,
	adminSecret,
	expectedToken,
	isAdmin,
	secretMatches
} from '$lib/pass/admin';
import { sendPassEmail } from '$lib/pass/mail';
import { toAdmin } from '$lib/pass/serialize';
import type { PassStatus } from '$lib/pass/event';
import { fail, redirect } from '@sveltejs/kit';
import mongoose from 'mongoose';

const statuses = ['pending', 'approved', 'declined'] as const;

export async function load({ cookies }) {
	const secret = adminSecret();
	if (!secret) return { mode: 'unset' as const, applicants: [] };
	if (!isAdmin(cookies)) return { mode: 'locked' as const, applicants: [] };

	try {
		await dbConnect();
		const docs = await Pass.find().sort({ createdAt: -1 });
		return {
			mode: 'open' as const,
			applicants: docs.map((doc) => toAdmin(doc)),
			problem: null as string | null
		};
	} catch {
		return {
			mode: 'open' as const,
			applicants: [],
			problem: 'The list is unavailable right now.'
		};
	}
}

export const actions = {
	login: async ({ request, cookies }) => {
		const secret = adminSecret();
		if (!secret) {
			return fail(503, { error: 'Set PASS_ADMIN_SECRET on the server, then unlock this list.' });
		}
		const key = String((await request.formData()).get('key') ?? '');
		if (!key || !secretMatches(key, secret)) {
			return fail(401, { error: 'That key does not unlock this list.' });
		}
		cookies.set(ADMIN_COOKIE, expectedToken(secret), adminCookieOptions());
		redirect(303, '/pass/admin');
	},

	logout: async ({ cookies }) => {
		cookies.delete(ADMIN_COOKIE, { path: '/pass/admin' });
		redirect(303, '/pass/admin');
	},

	decide: async ({ request, cookies, url }) => {
		if (!isAdmin(cookies)) return fail(401, { flash: 'Unlock the list first.' });

		const fd = await request.formData();
		const id = String(fd.get('id') ?? '');
		const status = String(fd.get('status') ?? '');
		if (!mongoose.Types.ObjectId.isValid(id) || !statuses.includes(status as PassStatus)) {
			return fail(400, { flash: 'That update could not be applied.' });
		}

		let doc = null;
		try {
			await dbConnect();
			doc = await Pass.findById(id);
		} catch {
			return fail(503, { flash: 'The list is unavailable right now.' });
		}
		if (!doc) return fail(404, { flash: 'That applicant is no longer on the list.' });

		const previous = doc.status as PassStatus;
		doc.status = status;
		await doc.save();

		if (status === 'approved' && previous !== 'approved') {
			const emailed = await sendPassEmail({
				to: doc.email,
				name: doc.fullname,
				href: `${url.origin}/pass/${doc._id}?key=${doc.accessKey}`,
				kind: 'approved'
			});
			return {
				flash: emailed
					? 'Approved, and the pass email is sent.'
					: 'Approved. The email did not send, so tell them another way.'
			};
		}

		if (status === 'declined') {
			return { flash: 'Declined. Their pass updates, and no email is sent.' };
		}

		return { flash: 'Moved back to review.' };
	}
};
