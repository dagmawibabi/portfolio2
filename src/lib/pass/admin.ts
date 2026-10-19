import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';

export const ADMIN_COOKIE = 'meetup_pass_admin';

export function adminCookieOptions() {
	return {
		path: '/pass/admin',
		httpOnly: true,
		sameSite: 'lax' as const,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 30
	};
}

export function adminSecret() {
	return process.env.PASS_ADMIN_SECRET?.trim() || '';
}

export function expectedToken(secret: string) {
	return createHmac('sha256', secret).update('meetup-pass-admin-v1').digest('hex');
}

export function safeEqual(a: string, b: string) {
	const left = Buffer.from(a);
	const right = Buffer.from(b);
	if (left.length === 0 || left.length !== right.length) return false;
	return timingSafeEqual(left, right);
}

export function secretMatches(key: string, secret: string) {
	const given = createHmac('sha256', 'meetup-pass-login').update(key).digest();
	const actual = createHmac('sha256', 'meetup-pass-login').update(secret).digest();
	return timingSafeEqual(given, actual);
}

export function isAdmin(cookies: Cookies) {
	const secret = adminSecret();
	if (!secret) return false;
	const got = cookies.get(ADMIN_COOKIE);
	if (!got) return false;
	return safeEqual(got, expectedToken(secret));
}
