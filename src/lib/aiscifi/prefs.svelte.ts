// Per-reader conveniences for /aiscifi. Everything is optional; storage can fail.

const KEY = 'perihelion:prefs';
const READ_KEY = 'perihelion:read';
const LAST_KEY = 'perihelion:last';

type Theme = 'dark' | 'light';

export const prefs = $state({
	theme: 'dark' as Theme,
	size: 1, // reading scale step: 0..3
	read: [] as number[],
	last: null as null | { n: number; pct: number }
});

function get<T>(key: string, fallback: T): T {
	try {
		const v = localStorage.getItem(key);
		return v ? (JSON.parse(v) as T) : fallback;
	} catch {
		return fallback;
	}
}

function set(key: string, value: unknown) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		/* private mode, blocked storage — fine */
	}
}

export function loadPrefs() {
	const p = get<{ theme?: Theme; size?: number }>(KEY, {});
	if (p.theme === 'light' || p.theme === 'dark') prefs.theme = p.theme;
	if (typeof p.size === 'number') prefs.size = Math.min(3, Math.max(0, p.size));
	prefs.read = get<number[]>(READ_KEY, []);
	prefs.last = get<null | { n: number; pct: number }>(LAST_KEY, null);
}

export function savePrefs() {
	set(KEY, { theme: prefs.theme, size: prefs.size });
}

export function toggleTheme() {
	prefs.theme = prefs.theme === 'dark' ? 'light' : 'dark';
	savePrefs();
}

export function stepSize(d: number) {
	prefs.size = Math.min(3, Math.max(0, prefs.size + d));
	savePrefs();
}

export function markRead(n: number) {
	if (!prefs.read.includes(n)) {
		prefs.read = [...prefs.read, n].sort((a, b) => a - b);
		set(READ_KEY, prefs.read);
	}
}

export function saveLast(n: number, pct: number) {
	prefs.last = { n, pct };
	set(LAST_KEY, prefs.last);
}
