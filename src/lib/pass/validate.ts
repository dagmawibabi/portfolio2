import { ATTENDANCE, type Attendance } from './event';
import { canonicalProgram } from './program';

export type PassInput = {
	fullname: string;
	email: string;
	phone: string;
	occupation: string;
	attendanceType: string;
	link: string;
	note: string;
	program: string;
};

export function readPassForm(fd: FormData): PassInput {
	return {
		fullname: String(fd.get('fullname') ?? '').trim(),
		email: String(fd.get('email') ?? '')
			.trim()
			.toLowerCase(),
		phone: String(fd.get('phone') ?? '').trim(),
		occupation: String(fd.get('occupation') ?? '').trim(),
		attendanceType: String(fd.get('attendanceType') ?? '').trim(),
		link: String(fd.get('link') ?? '').trim(),
		note: String(fd.get('note') ?? '').trim(),
		program: String(fd.get('program') ?? '')
	};
}

export function validatePass(input: PassInput): { error: string | null; program: string } {
	const parsed = canonicalProgram(input.program);
	if (
		/[\u0000-\u001F]/.test(input.fullname) ||
		input.fullname.length < 2 ||
		input.fullname.length > 80
	) {
		return { error: 'Enter your name.', program: parsed.source };
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) || input.email.length > 160) {
		return { error: 'Enter a valid email.', program: parsed.source };
	}
	const digits = input.phone.replace(/\D/g, '');
	if (digits.length < 8 || input.phone.length > 30) {
		return { error: 'Enter a phone number.', program: parsed.source };
	}
	if (input.occupation.length < 2 || input.occupation.length > 80) {
		return { error: 'Enter what you do.', program: parsed.source };
	}
	if (!ATTENDANCE.includes(input.attendanceType as Attendance)) {
		return { error: 'Choose how you are coming.', program: parsed.source };
	}
	if (input.link) {
		if (input.link.length > 300) {
			return { error: 'That link is too long.', program: parsed.source };
		}
		try {
			const url = new URL(input.link);
			if (url.protocol !== 'http:' && url.protocol !== 'https:') {
				return { error: 'Links need to start with https://', program: parsed.source };
			}
		} catch {
			return { error: 'That link is not a full URL.', program: parsed.source };
		}
	}
	if (input.note.length > 400) {
		return { error: 'Keep the note under 400 characters.', program: parsed.source };
	}
	if (parsed.error) return { error: parsed.error, program: parsed.source };
	return { error: null, program: parsed.source };
}
