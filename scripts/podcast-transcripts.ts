// Saves the podcast's YouTube captions as transcripts in static/podcast/transcripts/.
// Uses yt-dlp to fetch YouTube's captions, so no Google sign-in is needed.
//
// Run with: node scripts/podcast-transcripts.ts
// Needs yt-dlp (`pip install yt-dlp`). Already-downloaded captions are reused from the cache
// folder, so rerunning after a new episode only fetches the new one.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

type Cue = [number, string]; // [start seconds, text]

const ROOT = new URL('..', import.meta.url);
const OUT_DIR = new URL('static/podcast/transcripts/', ROOT);
const CACHE = process.argv[2] ?? join(tmpdir(), 'podcast-subs');
const snapshot = JSON.parse(readFileSync(new URL('src/lib/podcast/snapshot.json', ROOT), 'utf8')) as {
	episodes: { id: string; guest: string; lang: string }[];
};

// Auto-captions mishear the host's name. Fixes run word by word across the whole episode,
// because the two halves of the name often land in different caption cues.
const FIRST = /^Dag(?:u?mm?)(?:awi|oy|away|ow|ah|ay|ai|ar)?$/i;
const LAST = /^(?:Babi|Bobby|Baby|Bob|Bobbi|Barbie|BBI)$/i;
const ALONE: [RegExp, string][] = [
	[/^Dag(?:umawi|mai|may)$/, 'Dagmawi'],
	[/^Dougy$/, 'Dagi']
];

function toSeconds(stamp: string) {
	const [h, m, s] = stamp.split(':');
	return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

const splitPunct = (w: string) => /^(.*?)([.,!?;:"”']*)$/.exec(w)!.slice(1) as [string, string];

function fixNames(cues: Cue[]): Cue[] {
	const words: { cue: number; core: string; tail: string }[] = [];
	cues.forEach(([, text], cue) => {
		for (const w of text.split(' ')) {
			const [core, tail] = splitPunct(w);
			words.push({ cue, core, tail });
		}
	});
	for (let i = 0; i < words.length; i++) {
		const w = words[i];
		const next = words[i + 1];
		if (next && FIRST.test(w.core) && LAST.test(next.core)) {
			w.core = 'Dagmawi';
			next.core = 'Babi';
			i++;
			continue;
		}
		for (const [re, to] of ALONE) if (re.test(w.core)) w.core = to;
	}
	const out = cues.map(([t]) => [t, [] as string[]] as [number, string[]]);
	for (const w of words) out[w.cue][1].push(w.core + w.tail);
	return out.map(([t, ws]) => [t, ws.join(' ')]);
}

// YouTube's auto-caption VTT repeats each line in the next cue. The words a cue adds are the
// line carrying inline <c> word timings, so keep only those. Cues stay at YouTube's own timing
// (a few seconds each), so the page can follow speech closely.
export function parseVtt(vtt: string): Cue[] {
	const cues: Cue[] = [];
	for (const block of vtt.replace(/\r/g, '').split(/\n{2,}/)) {
		const rows = block.split('\n');
		const timing = rows.findIndex((r) => r.includes('-->'));
		if (timing === -1) continue;
		const fresh = rows.slice(timing + 1).find((r) => r.includes('<c>'));
		if (!fresh) continue;
		const start = toSeconds(rows[timing].split('-->')[0].trim());
		const text = fresh
			.replace(/<[^>]+>/g, '')
			.replace(/\[(music|applause|laughter)\]/gi, '')
			.replace(/\s+/g, ' ')
			.trim();
		if (text) cues.push([Math.round(start * 10) / 10, text]);
	}
	return fixNames(cues);
}

function download(id: string): string | null {
	const file = join(CACHE, `${id}.en-orig.vtt`);
	if (existsSync(file)) return file;
	const args = [
		'-m', 'yt_dlp', '--skip-download', '--write-auto-subs', '--write-subs',
		'--sub-langs', 'en-orig', '--sub-format', 'vtt', '--sleep-requests', '2',
		'-o', join(CACHE, '%(id)s.%(ext)s'), `https://www.youtube.com/watch?v=${id}`
	];
	spawnSync('python', args, { stdio: 'ignore' });
	return existsSync(file) ? file : null;
}

mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

const saved: string[] = [];
for (const ep of snapshot.episodes) {
	if (ep.lang !== 'en') continue; // YouTube has no Amharic captions for these episodes
	const file = download(ep.id);
	if (!file) {
		console.log(`- ${ep.guest}: no captions on YouTube, skipped`);
		continue;
	}
	const cues = parseVtt(readFileSync(file, 'utf8'));
	writeFileSync(new URL(`${ep.id}.json`, OUT_DIR), JSON.stringify({ id: ep.id, kind: 'auto', cues }));
	saved.push(ep.id);
	console.log(`✓ ${ep.guest}: ${cues.length} cues`);
}

writeFileSync(new URL('index.json', OUT_DIR), JSON.stringify(saved));
console.log(`\nSaved ${saved.length} transcripts to static/podcast/transcripts/.`);
