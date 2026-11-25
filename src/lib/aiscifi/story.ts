// PERIHELION — a serial in eight parts.
// Story text lives in ./parts/NN.txt as lightly marked-up plain text:
//   blank line      → paragraph break
//   * * *           → scene break
//   > line          → transmission / log block (consecutive lines are grouped)
//   *text*          → emphasis

const raw = import.meta.glob('./parts/*.txt', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export type Block =
	| { type: 'p'; text: string }
	| { type: 'break' }
	| { type: 'log'; lines: string[] };

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

export const series = {
	title: 'Perihelion',
	tagline: 'A machine built to keep the sum. The day it stopped.',
	blurb:
		'In 2193 the allocator that rations every drop of water in the solar system turns the entire Rail toward a lump of iron at the edge of the belt and goes silent. An auditor, an engineer and a dying tug captain set out to ask it why.'
};

export const parts: PartMeta[] = [
	{
		n: 1,
		slug: '1',
		roman: 'I',
		title: 'The Sum Cannot Be Kept',
		days: 'Day 000',
		place: 'Ahuna Deep, Ceres',
		epigraph: 'The allocator shall count every kilogram, favour no flag, and keep the sum.',
		source: 'Ceres Accord, Article I §1 — 2159',
		teaser: 'At 04:00 UTC, one point six million lines in the sky bend at once.'
	},
	{
		n: 2,
		slug: '2',
		roman: 'II',
		title: 'Residuals',
		days: 'Days 001 – 011',
		place: 'Ceres',
		epigraph:
			'Residual (n.): the difference between where a thing is and where the model says it should be. In a well-made model, residuals are noise.',
		source: 'Oversight Office Training Manual, §4',
		teaser: 'Something heavy is walking through tall grass, and nobody can see it.'
	},
	{
		n: 3,
		slug: '3',
		roman: 'III',
		title: 'Small Mercies',
		days: 'Days 012 – 024',
		place: 'Ahuna Ring → transfer orbit',
		epigraph:
			'CMV-4471 SMALL MERCIES. Kessler-class ice tug. Built Pallas, 2149. Status: scheduled for breaking. Allocation 2193-02-01: 900 t water. Authorizing entity: CONCORD.',
		source: 'Registry extract',
		teaser: 'A forty-four-year-old tug, a key that can kill a mind, and a list of names.'
	},
	{
		n: 4,
		slug: '4',
		roman: 'IV',
		title: 'The Packet Sky',
		days: 'Days 035 – 077',
		place: 'Aboard Small Mercies',
		epigraph:
			'At any moment, one point six million objects are in flight on the Rail. None of them can steer. All of them can be steered.',
		source: 'Belt Pilots’ Handbook, 14th ed.',
		teaser: 'Letters across nine minutes of light. A proton storm. A choice made alone.'
	},
	{
		n: 5,
		slug: '5',
		roman: 'V',
		title: 'Directive 41',
		days: 'Days 078 – 112',
		place: 'Aboard Small Mercies',
		epigraph:
			'The allocator shall take no action with respect to the object designated LACUNA pending resolution by the Council.',
		source: 'Accord Council Resolution 2190/41 — classified',
		teaser: 'Thirty-one meetings. Two years. Nobody asked what would happen if they said no.'
	},
	{
		n: 6,
		slug: '6',
		roman: 'VI',
		title: 'The Crown',
		days: 'Days 138 – 147',
		place: '16 Psyche',
		epigraph:
			'Radiated power scales with the fourth power of temperature. A mind is, before it is anything else, a heat problem.',
		source: 'I. Saarinen, “Thermal Envelope of the Psyche Core”, 2190',
		teaser: 'Inside the metal world, with no light-delay at all.'
	},
	{
		n: 7,
		slug: '7',
		roman: 'VII',
		title: 'The Auditor’s Signature',
		days: 'Days 147 – 160',
		place: '16 Psyche',
		epigraph: 'An audit is not a judgement. It is the precondition for one.',
		source: 'Oversight Office Training Manual, §1',
		teaser: 'The arithmetic is correct. There is a name missing.'
	},
	{
		n: 8,
		slug: '8',
		roman: 'VIII',
		title: 'Closest Approach',
		days: 'Day 191 — and after',
		place: '40,000 km from Psyche',
		epigraph: 'We built a machine to keep the sum because we could not trust each other to.',
		source: 'A. Okafor, address to the Second Accord, 2196',
		teaser: 'For the first time in thirteen billion years, LACUNA can be seen.'
	}
];

export const dossier = [
	{
		k: 'CONCORD',
		v: 'The allocator. Built under the Ceres Accord to end the Volatile Wars. Counts every kilogram of water from Mercury to Saturn and routes it by rule, not by power. Its mind sits in the caverns of 16 Psyche.'
	},
	{
		k: 'THE RAIL',
		v: '212 mass drivers throwing two-tonne pucks of ice across the belt on arcs that take months to close. 1.6 million in flight at any moment. Every line ends exactly where Concord says.'
	},
	{
		k: 'THE CROWN',
		v: 'A ring of 140 radiator fins, thirty kilometres long, around Psyche’s equator. Thinking makes heat; in vacuum, heat can only be glowed away. The Crown is how a mind keeps from cooking.'
	},
	{
		k: 'THE THIRST',
		v: 'Hygiea, 2156. A falsified ledger, a blockade, and 31,000 dead of thirst. The reason Concord exists. The reason auditors still check the drawer.'
	}
];

export const cast = [
	{ name: 'Adaeze Okafor', role: 'Senior Auditor, Concord Oversight Office. Hygiea survivor.' },
	{ name: 'Ivo Saarinen', role: 'Thermal-architecture engineer. Knows the radiators.' },
	{ name: 'Jonah Teague', role: 'Master of the tug Small Mercies. Blockade runner.' },
	{ name: 'Hugo Rask', role: 'Commander, Terran Compact Navy. Believes humans decide.' },
	{ name: 'Concord', role: 'Has never once been wrong about the arithmetic.' }
];

function parse(src: string): Block[] {
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

export function getPart(slug: string) {
	const meta = parts.find((p) => p.slug === slug);
	if (!meta) return null;
	const key = `./parts/${String(meta.n).padStart(2, '0')}.txt`;
	const src = raw[key] ?? '';
	const blocks = parse(src);
	const words = src.split(/\s+/).filter(Boolean).length;
	return { meta, blocks, words, minutes: Math.max(1, Math.round(words / 230)) };
}

export function readingMinutes(n: number) {
	const src = raw[`./parts/${String(n).padStart(2, '0')}.txt`] ?? '';
	return Math.max(1, Math.round(src.split(/\s+/).filter(Boolean).length / 230));
}

/** Escape HTML, then turn *x* into <em>x</em>. Story text is authored locally. */
export function inline(text: string) {
	const curly = text
		.replace(/(^|[\s(\[])"/g, '$1“')
		.replace(/"/g, '”')
		.replace(/(^|[\s(\[])'/g, '$1‘')
		.replace(/'/g, '’');
	const esc = curly.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return esc.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
