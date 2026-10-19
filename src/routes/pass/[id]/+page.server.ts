import { dbConnect } from '$lib/db/db';
import Pass from '$lib/db/models/pass';
import { safeEqual } from '$lib/pass/admin';
import { toOwner, toPublic } from '$lib/pass/serialize';
import { readPassForm, validatePass } from '$lib/pass/validate';
import { error, fail } from '@sveltejs/kit';
import mongoose from 'mongoose';

async function loadDoc(id: string) {
	if (!mongoose.Types.ObjectId.isValid(id)) error(404, 'No pass found');
	let doc = null;
	try {
		await dbConnect();
		doc = await Pass.findById(id);
	} catch {
		error(503, 'The list is unavailable right now.');
	}
	if (!doc) error(404, 'No pass found');
	return doc;
}

export async function load({ params, url }) {
	const doc = await loadDoc(params.id);
	const key = url.searchParams.get('key') ?? '';
	const isOwner = key.length > 0 && safeEqual(key, doc.accessKey);
	return {
		pass: isOwner ? toOwner(doc) : toPublic(doc),
		isOwner,
		key: isOwner ? key : ''
	};
}

export const actions = {
	save: async ({ request, params }) => {
		const fd = await request.formData();
		const key = String(fd.get('key') ?? '');
		const doc = await loadDoc(params.id);
		if (!safeEqual(key, doc.accessKey)) {
			return fail(403, { error: 'Open the private pass link to save changes.' });
		}

		const input = readPassForm(fd);
		const checked = validatePass(input);
		if (checked.error) return fail(400, { error: checked.error });

		if (input.email !== doc.email) {
			const clash = await Pass.exists({ email: input.email, _id: { $ne: doc._id } });
			if (clash) return fail(409, { error: 'That email already has a pass.' });
		}

		doc.fullname = input.fullname;
		doc.email = input.email;
		doc.phone = input.phone;
		doc.occupation = input.occupation;
		doc.attendanceType = input.attendanceType;
		doc.link = input.link;
		doc.note = input.note;
		doc.program = checked.program;
		await doc.save();
		return { ok: true };
	}
};
