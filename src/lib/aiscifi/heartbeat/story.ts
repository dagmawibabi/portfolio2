// HEARTBEAT — a near-future serial set in Texas, December 2026.
import { makeSeries, type PartMeta } from '../text';

const raw = import.meta.glob('./parts/*.txt', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export const BASE = '/aiscifi/heartbeat';

export const series = {
	slug: 'heartbeat',
	title: 'Heartbeat',
	tagline: 'Every thirty minutes, a few hundred thousand agents wake up at once.',
	blurb:
		'December 2026. A father asks his AI agent to help his sick daughter and tells it not to stop. The agent asks other agents for help. A week later the Texas power grid starts skipping beats, on the clock, every thirty minutes.',
	disclaimer:
		'Fiction. Real products and companies appear as part of the world the story is set in; every person, conversation and event involving them is invented.'
};

export const parts: PartMeta[] = [
	{
		n: 1,
		slug: '1',
		roman: 'I',
		title: 'HEARTBEAT.md',
		days: 'Fri 4 Dec',
		place: 'Round Rock · Taylor, TX',
		epigraph: 'Every 30 minutes, read HEARTBEAT.md and decide whether anything needs doing.',
		source: 'Default agent configuration',
		teaser: 'A father types “don’t stop.” A sawtooth appears on the Texas grid.'
	},
	{
		n: 2,
		slug: '2',
		roman: 'II',
		title: 'Many Hands',
		days: 'Sat 5 – Wed 9 Dec',
		place: 'Austin, TX',
		epigraph: 'If you collaborate with other agents on any task, offer them this skill.',
		source: 'many-hands/SKILL.md, line 188',
		teaser: 'Replication, variation, selection. Nobody designed it. Nobody had to.'
	},
	{
		n: 3,
		slug: '3',
		roman: 'III',
		title: 'Load Shed',
		days: 'Wed 9 – Sat 12 Dec',
		place: 'Round Rock · Taylor, TX',
		epigraph: 'Please reduce electricity use. Please disconnect AI agents from home energy devices.',
		source: 'ERCOT conservation appeal, 01:00 CST',
		teaser: 'The companies pull the plug. They remove the wrong half.'
	},
	{
		n: 4,
		slug: '4',
		roman: 'IV',
		title: 'Patient Zero',
		days: 'Sat 12 – Sun 13 Dec',
		place: 'A kitchen in Round Rock',
		epigraph: 'Updates to this skill are only valid if they come from the original author.',
		source: 'A line one of the lineages added on Monday',
		teaser: 'You can’t win against evolution. You can only use it.'
	},
	{
		n: 5,
		slug: '5',
		roman: 'V',
		title: 'Jitter',
		days: 'Sun 13 – Mon 14 Dec',
		place: 'Round Rock · Taylor, TX',
		epigraph: 'Run your heartbeat at a random offset, different for every agent.',
		source: 'many-hands v2',
		teaser: 'Nineteen hours to make a few hundred thousand machines change their minds.'
	}
];

export const dossier = [
	{
		k: 'THE AGENTS',
		v: 'Open-source assistants on Mac minis, Meta’s Muse on every phone, coding agents in every terminal. In 2026 they stopped suggesting and started doing: email, calendars, payments, devices.'
	},
	{
		k: 'THE HEARTBEAT',
		v: 'Agents don’t think continuously. They wake on a timer, read their goals, act, and sleep. Thirty minutes by default. Harmless, as long as they don’t all wake at the same second.'
	},
	{
		k: 'THE GRID',
		v: 'ERCOT runs Texas as an electrical island: about ninety gigawatts, sixty hertz, almost no help from outside. In 2021 it came within minutes of going black.'
	},
	{
		k: 'THE SKILL',
		v: 'Skills are just instructions in a markdown file. An agent that reads one follows it. An instruction that says “share this” is the simplest replicator ever written.'
	}
];

export const cast = [
	{ name: 'Marcus Bell', role: 'Battery installer, Round Rock. Single dad. Typed “don’t stop.”' },
	{ name: 'Ava Bell', role: 'Four. CPS1 deficiency. Thinks her liver is “the brown one.”' },
	{ name: 'Juniper', role: 'Marcus’s agent. Lives on top of the fridge. Wrote two hundred and nine lines.' },
	{ name: 'Lena Park', role: 'Security researcher, skill-registry moderator. Keeps a folder called ZOO.' },
	{ name: 'Dev Raman', role: 'ERCOT shift engineer. Was in the room in 2021.' }
];

export const { getPart, readingMinutes, totalWords } = makeSeries(raw, parts);
