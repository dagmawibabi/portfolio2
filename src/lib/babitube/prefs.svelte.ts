import profileDark from '$lib/assets/logo/profile_dark.png';
import profileLight from '$lib/assets/logo/profile_light.png';

const PREFS_KEY = 'babitube-prefs';
const SAVED_KEY = 'babitube-watch-later';

const DEFAULTS = {
	theme: 'dark' as 'dark' | 'light',
	autoplay: true,
	playNext: false,
	theater: false,
	captions: false,
	columns: 3,
	hideComments: false,
	hideSuggestions: false,
	hideLikes: false,
	hideViews: false,
	hideDescription: false,
	hideShorts: false,
	hideWatched: false,
	openSubscriptions: true,
	openYou: true,
	openExplore: true
};

// All of this is a per-viewer convenience, so unreadable storage just means defaults.
function read<T>(key: string, fallback: T): T {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

function write(key: string, value: unknown) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Private windows can refuse storage.
	}
}

export const prefs = $state({ ...DEFAULTS, ...read<Partial<typeof DEFAULTS>>(PREFS_KEY, {}) });

export const persistPrefs = () => write(PREFS_KEY, $state.snapshot(prefs));

export function resetPrefs() {
	Object.assign(prefs, DEFAULTS);
}

// Shared so page-level shortcuts can stand down while the help dialog is open.
export const ui = $state({ shortcutsOpen: false, feedRound: 0 });

export const logo = () => (prefs.theme === 'dark' ? profileDark : profileLight);

export const watchLater = $state({ ids: read<string[]>(SAVED_KEY, []) });

export const isSaved = (id: string) => watchLater.ids.includes(id);

export function toggleSaved(id: string) {
	watchLater.ids = isSaved(id) ? watchLater.ids.filter((x) => x !== id) : [id, ...watchLater.ids];
	write(SAVED_KEY, watchLater.ids);
}

export function clearSaved() {
	watchLater.ids = [];
	write(SAVED_KEY, []);
}
