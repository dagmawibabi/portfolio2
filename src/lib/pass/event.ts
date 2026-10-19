/** Edit this when the next meetup has a date and a room. */
export const meetupEvent = {
	name: "Dagmawi Babi's Meetup",
	edition: '2027',
	place: 'Addis Ababa',
	when: 'Date to be announced'
};

export const ATTENDANCE = ['Attending', 'Speaking', 'Showcasing', 'Volunteering'] as const;
export type Attendance = (typeof ATTENDANCE)[number];

export type PassStatus = 'pending' | 'approved' | 'declined';

export const statusLabel: Record<PassStatus, string> = {
	pending: 'In review',
	approved: 'Approved',
	declined: 'Declined'
};

export const ownerStatusCopy: Record<PassStatus, string> = {
	pending: 'You are on the list. Approval shows up on this pass.',
	approved: 'You are approved. Bring this pass.',
	declined: 'This seat did not come through. The card is still yours.'
};

export function publicStatusCopy(name: string, status: PassStatus) {
	if (status === 'approved') return `${name} is approved.`;
	if (status === 'declined') return `${name} does not have a seat this time.`;
	return `${name} is on the list.`;
}
