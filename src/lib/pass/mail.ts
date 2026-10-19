import { Resend } from 'resend';

function escapeHtml(value: string) {
	return value.replace(/[&<>"']/g, (ch) => {
		const map: Record<string, string> = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;'
		};
		return map[ch] ?? ch;
	});
}

export async function sendPassEmail(opts: {
	to: string;
	name: string;
	href: string;
	kind: 'registered' | 'approved';
}) {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) return false;

	const safeName = escapeHtml(opts.name);
	const safeHref = escapeHtml(opts.href);
	const subject = opts.kind === 'approved' ? "You're approved for the Meetup" : 'Your Meetup pass';
	const lead =
		opts.kind === 'approved'
			? "You are approved for Dagmawi Babi's Meetup. Your pass is ready."
			: "You are signed up for Dagmawi Babi's Meetup. Open your pass to check your details, see if you are approved, and program your card.";

	try {
		const resend = new Resend(apiKey);
		const { error } = await resend.emails.send({
			from: 'meetup@dagmawi.dev',
			to: [opts.to],
			subject,
			html: `<div style="font-family:Georgia,serif;line-height:1.5;color:#1b1916"><p>Hi ${safeName},</p><p>${lead}</p><p><a href="${safeHref}">${safeHref}</a></p><p>Keep this link. It is how you get back to your pass.</p></div>`
		});
		if (error) {
			console.error('pass email failed');
			return false;
		}
		return true;
	} catch {
		console.error('pass email failed');
		return false;
	}
}
