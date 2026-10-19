import { randomBytes } from 'node:crypto';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function makeTicket() {
	const bytes = randomBytes(4);
	let code = '';
	for (const byte of bytes) code += alphabet[byte % alphabet.length];
	return `MB-${code}`;
}

export function makeAccessKey() {
	return randomBytes(24).toString('hex');
}
