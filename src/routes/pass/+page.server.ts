import { dbConnect } from '$lib/db/db';
import Pass from '$lib/db/models/pass';
import { sendPassEmail } from '$lib/pass/mail';
import { makeAccessKey, makeTicket } from '$lib/pass/ticket';
import { readPassForm, validatePass } from '$lib/pass/validate';
import { fail, redirect } from '@sveltejs/kit';

export async function load() {
	try {
		await dbConnect();
		const count = await Pass.countDocuments();
		return { count };
	} catch {
		return { count: null as number | null };
	}
}

function duplicateEmail(error: unknown) {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code?: number }).code === 11000 &&
		'keyPattern' in error &&
		Boolean((error as { keyPattern?: { email?: unknown } }).keyPattern?.email)
	);
}

export const actions = {
	signup: async ({ request, url }) => {
		const input = readPassForm(await request.formData());
		const checked = validatePass(input);
		if (checked.error) return fail(400, { error: checked.error, ...input, program: input.program });

		let existing = null;
		try {
			await dbConnect();
			existing = await Pass.findOne({ email: input.email }).select('_id');
		} catch {
			return fail(503, {
				error: 'The list is unavailable right now. Try again in a moment.',
				...input
			});
		}
		if (existing) {
			return fail(409, {
				error: 'That email already has a pass. Use Find my pass.',
				...input
			});
		}

		let doc = null;
		for (let attempt = 0; attempt < 5; attempt++) {
			try {
				doc = await Pass.create({
					fullname: input.fullname,
					email: input.email,
					phone: input.phone,
					occupation: input.occupation,
					attendanceType: input.attendanceType,
					link: input.link,
					note: input.note,
					program: checked.program,
					ticket: makeTicket(),
					accessKey: makeAccessKey(),
					status: 'pending'
				});
				break;
			} catch (error) {
				if (duplicateEmail(error)) {
					return fail(409, {
						error: 'That email already has a pass. Use Find my pass.',
						...input
					});
				}
				const ticketTaken =
					typeof error === 'object' &&
					error !== null &&
					'code' in error &&
					(error as { code?: number }).code === 11000;
				if (!ticketTaken || attempt === 4) {
					console.error('pass signup failed');
					return fail(500, {
						error: 'The pass could not be saved. Try again.',
						...input
					});
				}
			}
		}

		if (!doc) return fail(500, { error: 'The pass could not be saved. Try again.', ...input });

		const href = `${url.origin}/pass/${doc._id}?key=${doc.accessKey}`;
		await sendPassEmail({
			to: doc.email,
			name: doc.fullname,
			href,
			kind: 'registered'
		});

		redirect(303, href);
	},

	lookup: async ({ request, url }) => {
		const email = String((await request.formData()).get('lookupEmail') ?? '')
			.trim()
			.toLowerCase();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, { lookupError: 'Enter the email you signed up with.', lookupEmail: email });
		}

		let doc = null;
		try {
			await dbConnect();
			doc = await Pass.findOne({ email });
		} catch {
			return fail(503, {
				lookupError: 'The list is unavailable right now. Try again in a moment.',
				lookupEmail: email
			});
		}
		if (!doc) {
			return fail(404, {
				lookupError: 'No pass is saved under that email.',
				lookupEmail: email
			});
		}

		redirect(303, `${url.origin}/pass/${doc._id}?key=${doc.accessKey}`);
	}
};
