// Per-reader conveniences for /aiscifi. Everything is optional; storage can fail.
// Theme and text size are shared across every series; progress is kept per series.

const KEY = 'aiscifi:prefs';
const PROGRESS_KEY = 'aiscifi:progress';

type Theme = 'dark' | 'light';
export type Progress = { read: number[]; last: null | { n: number; pct: number } };

export const prefs = $state({
	theme: 'dark' as Theme,
	size: 1, // reading scale step: 0..3
	progress: {} as Record<string, Progress>
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
	// carry over settings saved before the collection existed
	const p = get<{ theme?: Theme; size?: number }>(KEY, get('perihelion:prefs', {}));
	if (p.theme === 'light' || p.theme === 'dark') prefs.theme = p.theme;
	if (typeof p.size === 'number') prefs.size = Math.min(3, Math.max(0, p.size));
	const progress = get<Record<string, Progress>>(PROGRESS_KEY, {});
	if (!progress.perihelion) {
		const read = get<number[]>('perihelion:read', []);
		const last = get<Progress['last']>('perihelion:last', null);
		if (read.length || last) progress.perihelion = { read, last };
	}
	prefs.progress = progress;
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

export function progressFor(series: string): Progress {
	return prefs.progress[series] ?? { read: [], last: null };
}

function update(series: string, next: Progress) {
	prefs.progress = { ...prefs.progress, [series]: next };
	set(PROGRESS_KEY, prefs.progress);
}

export function markRead(series: string, n: number) {
	const p = progressFor(series);
	if (!p.read.includes(n)) update(series, { ...p, read: [...p.read, n].sort((a, b) => a - b) });
}

export function saveLast(series: string, n: number, pct: number) {
	update(series, { ...progressFor(series), last: { n, pct } });
}
