export type PigmentName = 'copper' | 'tide' | 'violet' | 'ink';
export type MotionName = 'ribbons' | 'orbits' | 'lattice' | 'embers';

export type FoilUniforms = {
	pigment: PigmentName;
	motion: MotionName;
	tempo: number;
	grain: number;
	waves: number;
	colorA: [number, number, number];
	colorB: [number, number, number];
};

const PIGMENT_COLORS: Record<
	PigmentName,
	{ a: [number, number, number]; b: [number, number, number] }
> = {
	copper: { a: [0.52, 0.24, 0.12], b: [0.96, 0.78, 0.46] },
	tide: { a: [0.05, 0.32, 0.34], b: [0.64, 0.9, 0.82] },
	violet: { a: [0.28, 0.14, 0.48], b: [0.95, 0.66, 0.78] },
	ink: { a: [0.12, 0.18, 0.2], b: [0.78, 0.84, 0.78] }
};

const MOTIONS: MotionName[] = ['ribbons', 'orbits', 'lattice', 'embers'];

export const DEFAULT_SOURCE = `pigment copper
motion ribbons
tempo 0.55
grain 0.28
waves 6`;

export const PRESETS: { name: string; source: string }[] = [
	{ name: 'Copper ribbons', source: DEFAULT_SOURCE },
	{
		name: 'Tide orbits',
		source: `pigment tide
motion orbits
tempo 0.4
grain 0.2
waves 7`
	},
	{
		name: 'Violet embers',
		source: `pigment violet
motion embers
tempo 0.7
grain 0.4
waves 10`
	}
];

export function rgbHex(c: [number, number, number]) {
	return (
		'#' +
		c
			.map((n) =>
				Math.round(Math.min(1, Math.max(0, n)) * 255)
					.toString(16)
					.padStart(2, '0')
			)
			.join('')
	);
}

export function motionIndex(motion: MotionName) {
	return MOTIONS.indexOf(motion);
}

function baseUniforms(): FoilUniforms {
	return {
		pigment: 'copper',
		motion: 'ribbons',
		tempo: 0.55,
		grain: 0.28,
		waves: 6,
		colorA: PIGMENT_COLORS.copper.a,
		colorB: PIGMENT_COLORS.copper.b
	};
}

export function canonicalProgram(raw: string): {
	source: string;
	uniforms: FoilUniforms;
	error: string | null;
} {
	const source = raw.trim();
	const uniforms = baseUniforms();
	let error: string | null = null;

	const finish = () => {
		const colors = PIGMENT_COLORS[uniforms.pigment];
		uniforms.colorA = colors.a;
		uniforms.colorB = colors.b;
		return { source: source || DEFAULT_SOURCE, uniforms, error };
	};

	if (!source) return finish();

	if (source.length > 400) {
		error = 'Keep the program under 400 characters.';
		return finish();
	}

	const lines = source.split(/\r?\n/);
	if (lines.length > 20) {
		error = 'Keep the program under 20 lines.';
		return finish();
	}

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line || line.startsWith('#') || line.startsWith('//')) continue;

		const parts = line.split(/\s+/);
		if (parts.length !== 2) {
			error = `Line ${i + 1} needs one instruction, like motion orbits.`;
			return finish();
		}

		const key = parts[0].toLowerCase();
		const value = parts[1].toLowerCase();

		if (key === 'pigment') {
			if (!(value in PIGMENT_COLORS)) {
				error = 'pigment can be copper, tide, violet, or ink.';
				return finish();
			}
			uniforms.pigment = value as PigmentName;
			continue;
		}

		if (key === 'motion') {
			if (!MOTIONS.includes(value as MotionName)) {
				error = 'motion can be ribbons, orbits, lattice, or embers.';
				return finish();
			}
			uniforms.motion = value as MotionName;
			continue;
		}

		if (key === 'tempo' || key === 'grain' || key === 'waves') {
			const n = Number(value);
			if (!Number.isFinite(n)) {
				error = `${key} needs a number.`;
				return finish();
			}
			if (key === 'tempo' && (n < 0 || n > 1.5)) {
				error = 'tempo is a number from 0 to 1.5.';
				return finish();
			}
			if (key === 'grain' && (n < 0 || n > 1)) {
				error = 'grain is a number from 0 to 1.';
				return finish();
			}
			if (key === 'waves' && (!Number.isInteger(n) || n < 1 || n > 16)) {
				error = 'waves is a whole number from 1 to 16.';
				return finish();
			}
			if (key === 'tempo') uniforms.tempo = n;
			if (key === 'grain') uniforms.grain = n;
			if (key === 'waves') uniforms.waves = n;
			continue;
		}

		error = `Unknown instruction "${parts[0]}". Use pigment, motion, tempo, grain, or waves.`;
		return finish();
	}

	return finish();
}
