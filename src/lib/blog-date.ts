// Blog dates are calendar days, not moments in time. They're normalized to `YYYY-MM-DD`
// and always read/formatted in UTC so every reader (and the server) sees the same day.

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Front matter gives either a string ("2026-9-4") or, for padded ISO dates, a Date at UTC midnight
export const normalizeBlogDate = (value: unknown): string | null => {
	if (value instanceof Date) {
		return isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
	}
	if (typeof value !== 'string') return null;

	const match = value.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
	if (!match) return null;
	const [, year, month, day] = match;
	return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const blogDateToUtc = (date: string | null): Date | null => {
	if (!date) return null;
	const parsed = new Date(`${date}T00:00:00Z`);
	return isNaN(parsed.getTime()) ? null : parsed;
};

// Same shape as Date#toDateString ("Mon Oct 19 2026"), but timezone-independent
export const formatBlogDate = (date: string | null): string => {
	const parsed = blogDateToUtc(date);
	if (!parsed) return '';
	const day = String(parsed.getUTCDate()).padStart(2, '0');
	return `${DAYS[parsed.getUTCDay()]} ${MONTHS[parsed.getUTCMonth()]} ${day} ${parsed.getUTCFullYear()}`;
};
