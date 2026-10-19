import { meetupEvent, type PassStatus } from './event';

type PassDoc = {
	_id: { toString(): string };
	fullname: string;
	email?: string | null;
	phone?: string | null;
	occupation: string;
	attendanceType: string;
	link?: string | null;
	note?: string | null;
	status?: string | null;
	program?: string | null;
	ticket: string;
	createdAt?: Date | string | null;
};

function asStatus(value: string | null | undefined): PassStatus {
	if (value === 'approved' || value === 'declined' || value === 'pending') return value;
	return 'pending';
}

export function toPublic(doc: PassDoc) {
	return {
		id: doc._id.toString(),
		fullname: doc.fullname,
		occupation: doc.occupation,
		attendanceType: doc.attendanceType,
		link: doc.link || '',
		status: asStatus(doc.status),
		program: doc.program || '',
		ticket: doc.ticket,
		place: meetupEvent.place,
		edition: meetupEvent.edition,
		when: meetupEvent.when
	};
}

export function toOwner(doc: PassDoc) {
	return {
		...toPublic(doc),
		email: doc.email || '',
		phone: doc.phone || '',
		note: doc.note || ''
	};
}

export function toAdmin(doc: PassDoc) {
	return {
		...toOwner(doc),
		createdAt:
			doc.createdAt instanceof Date
				? doc.createdAt.toISOString()
				: doc.createdAt
					? String(doc.createdAt)
					: ''
	};
}
