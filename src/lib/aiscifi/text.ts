// Shared story-text helpers for every series under /aiscifi.
//
// Story parts are lightly marked-up plain text (.txt, imported with ?raw):
//   blank line      → paragraph break
//   * * *           → scene break
//   > line          → transmission / log block (consecutive lines are grouped)
//   *text*          → emphasis

export type Block =
	| { type: 'p'; text: string }
	| { type: 'break' }
	| { type: 'log'; lines: string[] };

export function parse(src: string): Block[] {
	const blocks: Block[] = [];
	const chunks = src.replace(/\r\n/g, '\n').trim().split(/\n\s*\n/);
	for (const chunk of chunks) {
		const c = chunk.trim();
		if (!c) continue;
		if (c === '* * *') {
			blocks.push({ type: 'break' });
			continue;
		}
		const lines = c.split('\n');
		if (lines.every((l) => l.startsWith('>'))) {
			blocks.push({ type: 'log', lines: lines.map((l) => l.replace(/^>\s?/, '')) });
			continue;
		}
		blocks.push({ type: 'p', text: lines.join(' ') });
	}
	return blocks;
}

export const countWords = (src: string) => src.split(/\s+/).filter(Boolean).length;

export const minutesFor = (words: number) => Math.max(1, Math.round(words / 230));

/** Curl quotes, escape HTML, then turn *x* into <em>x</em>. Story text is authored locally. */
export function inline(text: string) {
	const curly = text
		.replace(/(^|[\s([])"/g, '$1“')
		.replace(/"/g, '”')
		.replace(/(^|[\s([])'/g, '$1‘')
		.replace(/'/g, '’');
	const esc = curly.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return esc.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export type PartMeta = {
	n: number;
	slug: string;
	roman: string;
	title: string;
	days: string;
	place: string;
	epigraph: string;
	source: string;
	teaser: string;
};

/** Wire a series' part metadata to its raw text files (keys like ./parts/01.txt). */
export function makeSeries(raw: Record<string, string>, parts: PartMeta[]) {
	const src = (n: number) => raw[`./parts/${String(n).padStart(2, '0')}.txt`] ?? '';
	return {
		getPart(slug: string) {
			const meta = parts.find((p) => p.slug === slug);
			if (!meta) return null;
			const text = src(meta.n);
			const words = countWords(text);
			return { meta, blocks: parse(text), words, minutes: minutesFor(words) };
		},
		readingMinutes: (n: number) => minutesFor(countWords(src(n))),
		totalWords: parts.reduce((t, p) => t + countWords(src(p.n)), 0)
	};
}
