// Share cards for /scripture verses, drawn on a <canvas> in the browser so every template,
// size, palette and toggle previews instantly and exports as a PNG without a server.
// Fonts come from the page's own Google Fonts stylesheet (Newsreader, Geist, Geist Mono,
// Noto Serif/Sans Ethiopic); loadCardFonts() makes sure the glyphs a verse needs are loaded.

export const SITE_HOST = 'dagmawibabi.com';
export const SITE_PATH = '/scripture';
export const TELEGRAM_HOST = 't.me/Dagmawi_Babi';
export const SIGNATURE = 'Dagmawi Babi';

export type CardTemplate =
	| 'quiet'
	| 'editorial'
	| 'poster'
	| 'night'
	| 'frame'
	| 'split'
	| 'card'
	| 'margin';
export type CardRatio = 'story' | 'portrait' | 'square' | 'landscape' | 'wide';
export type CardFont = 'serif' | 'sans' | 'italic';
export type CardAlign = 'left' | 'center';
export type CardLink = 'site' | 'telegram' | 'both' | 'none';

export const CARD_TEMPLATES: { id: CardTemplate; label: string }[] = [
	{ id: 'quiet', label: 'Quiet' },
	{ id: 'night', label: 'Night' },
	{ id: 'editorial', label: 'Editorial' },
	{ id: 'poster', label: 'Poster' },
	{ id: 'frame', label: 'Frame' },
	{ id: 'split', label: 'Split' },
	{ id: 'card', label: 'Card' },
	{ id: 'margin', label: 'Margin' }
];

export const CARD_RATIOS: Record<
	CardRatio,
	{ label: string; hint: string; width: number; height: number }
> = {
	story: { label: 'Story', hint: '9:16', width: 1080, height: 1920 },
	portrait: { label: 'Portrait', hint: '4:5', width: 1080, height: 1350 },
	square: { label: 'Square', hint: '1:1', width: 1080, height: 1080 },
	landscape: { label: 'Link', hint: '1.91:1', width: 1200, height: 630 },
	wide: { label: 'Wide', hint: '16:9', width: 1920, height: 1080 }
};

export const PALETTES: { id: string; label: string; bg: string }[] = [
	{ id: 'ink', label: 'Ink', bg: '#0a0a0a' },
	{ id: 'snow', label: 'Snow', bg: '#ffffff' },
	{ id: 'paper', label: 'Paper', bg: '#f3efe6' },
	{ id: 'night', label: 'Night', bg: '#0c1226' },
	{ id: 'dusk', label: 'Dusk', bg: '#271d3a' },
	{ id: 'forest', label: 'Forest', bg: '#13241d' },
	{ id: 'sand', label: 'Sand', bg: '#e6d8bd' },
	{ id: 'clay', label: 'Clay', bg: '#a8533a' }
];

export interface CardOptions {
	template: CardTemplate;
	ratio: CardRatio;
	palette: string; // a PALETTES id, or 'custom'
	custom: string; // hex background for 'custom'
	font: CardFont;
	align: CardAlign;
	scale: number; // text size multiplier, 0.7 – 1.3
	showRef: boolean;
	showDate: boolean;
	showNumber: boolean;
	showGreeting: boolean;
	showSignature: boolean;
	showStars: boolean;
	link: CardLink;
}

export const DEFAULT_OPTIONS: CardOptions = {
	template: 'quiet',
	ratio: 'portrait',
	palette: 'ink',
	custom: '#1e3a5f',
	font: 'serif',
	align: 'left',
	scale: 1,
	showRef: true,
	showDate: true,
	showNumber: false,
	showGreeting: true,
	showSignature: true,
	showStars: true,
	link: 'site'
};

export interface CardVerse {
	id: number;
	text: string;
	ref: string | null;
	date: string; // already formatted
	lang: 'am' | 'en';
	n: number; // № on the wall
}

// ---------------------------------------------------------------------------------------------
// Fonts

const SERIF = '"Newsreader", "Noto Serif Ethiopic", Georgia, serif';
const SANS = '"Geist", "Noto Sans Ethiopic", system-ui, sans-serif';
const MONO = '"Geist Mono", ui-monospace, monospace';

export async function loadCardFonts(sample: string) {
	if (typeof document === 'undefined' || !document.fonts) return;
	await document.fonts.ready;
	const text = `${sample} 0123456789 №·—GOODNIGHTgoodnight Dagmawi Babi t.me/${SITE_HOST}`;
	const specs = [
		'300 40px "Newsreader"',
		'400 40px "Newsreader"',
		'italic 300 40px "Newsreader"',
		'italic 400 40px "Newsreader"',
		'300 40px "Geist"',
		'400 40px "Geist"',
		'500 40px "Geist"',
		'400 40px "Geist Mono"',
		'400 40px "Noto Serif Ethiopic"',
		'300 40px "Noto Sans Ethiopic"',
		'400 40px "Noto Sans Ethiopic"',
		'500 40px "Noto Sans Ethiopic"'
	];
	await Promise.all(specs.map((s) => document.fonts.load(s, text).catch(() => [])));
}

// ---------------------------------------------------------------------------------------------
// Colour

const hexToRgb = (hex: string): [number, number, number] => {
	const h = hex.replace('#', '');
	const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h.padEnd(6, '0');
	return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) || 0) as [number, number, number];
};

const luminance = ([r, g, b]: [number, number, number]) => {
	const f = (v: number) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	};
	return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

interface Colors {
	bg: string;
	fg: string;
	dark: boolean;
	a: (alpha: number) => string; // the ink colour at some opacity
	mix: (t: number) => string; // a solid colour t of the way from bg to ink
	surface: string; // a raised surface: a touch lighter on dark, near-white on light
}

function colorsFor(bg: string): Colors {
	const rgb = hexToRgb(bg);
	const dark = luminance(rgb) < 0.4;
	const ink: [number, number, number] = dark ? [246, 244, 239] : [18, 18, 18];
	return {
		bg,
		fg: `rgb(${ink.join(',')})`,
		dark,
		a: (alpha) => `rgba(${ink.join(',')},${alpha})`,
		mix: (t) => `rgb(${rgb.map((c, i) => Math.round(c + (ink[i] - c) * t)).join(',')})`,
		surface: dark
			? `rgb(${rgb.map((c) => Math.round(c + (255 - c) * 0.07)).join(',')})`
			: `rgb(${rgb.map((c) => Math.round(c + (255 - c) * 0.7)).join(',')})`
	};
}

export const paletteBg = (o: Pick<CardOptions, 'palette' | 'custom'>) =>
	o.palette === 'custom' ? o.custom : (PALETTES.find((p) => p.id === o.palette)?.bg ?? '#0a0a0a');

// ---------------------------------------------------------------------------------------------
// Text layout

interface Style {
	family: string;
	size: number;
	minSize?: number;
	weight?: number;
	italic?: boolean;
	color: string;
	lh?: number; // line height factor
	tracking?: number; // em
	upper?: boolean;
}

interface Block {
	lines: string[];
	style: Style;
	size: number;
	lh: number;
	height: number;
	width: number;
}

const setFont = (ctx: CanvasRenderingContext2D, s: Style, size: number) => {
	ctx.font = `${s.italic ? 'italic ' : ''}${s.weight ?? 400} ${size}px ${s.family}`;
	const tracked = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
	if ('letterSpacing' in tracked) tracked.letterSpacing = `${(s.tracking ?? 0) * size}px`;
};

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
	const out: string[] = [];
	const paragraphs = text.replace(/\n{3,}/g, '\n\n').split('\n');
	for (const para of paragraphs) {
		const words = para.split(/\s+/).filter(Boolean);
		if (!words.length) {
			if (out.length && out.at(-1) !== '') out.push('');
			continue;
		}
		let line = '';
		for (const w of words) {
			const next = line ? `${line} ${w}` : w;
			if (!line || ctx.measureText(next).width <= maxW) line = next;
			else {
				out.push(line);
				line = w;
			}
		}
		if (line) out.push(line);
	}
	while (out.at(-1) === '') out.pop();
	return out;
}

function ellipsize(ctx: CanvasRenderingContext2D, line: string, maxW: number) {
	let t = line;
	while (t && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
	return `${t.trimEnd().replace(/[\s,.;:፣።፤–-]+$/, '')}…`;
}

/** Shrinks toward minSize until the text fits maxH, then truncates what is left. */
function fit(ctx: CanvasRenderingContext2D, text: string, s: Style, maxW: number, maxH = Infinity): Block {
	const content = s.upper ? text.toUpperCase() : text;
	const factor = s.lh ?? 1.25;
	const min = s.minSize ?? s.size;
	let size = s.size;
	let lines: string[];
	for (;;) {
		setFont(ctx, s, size);
		lines = wrap(ctx, content, maxW);
		if (lines.length * size * factor <= maxH || size <= min) break;
		size = Math.max(min, size * 0.94);
	}
	const lh = size * factor;
	const maxLines = Math.max(1, Math.floor(maxH / lh));
	if (lines.length > maxLines) {
		lines = lines.slice(0, maxLines);
		lines[maxLines - 1] = ellipsize(ctx, lines[maxLines - 1], maxW);
	}
	const width = Math.max(0, ...lines.map((l) => ctx.measureText(l).width));
	return { lines, style: s, size, lh, height: lines.length * lh, width };
}

function drawBlock(ctx: CanvasRenderingContext2D, b: Block, x: number, y: number, align: CanvasTextAlign) {
	setFont(ctx, b.style, b.size);
	ctx.fillStyle = b.style.color;
	ctx.textAlign = align;
	ctx.textBaseline = 'middle';
	b.lines.forEach((l, i) => ctx.fillText(l, x, y + i * b.lh + b.lh / 2));
}

// A vertical column of pieces; one `flex` piece (the verse) gets whatever height is left
interface Piece {
	gap: number;
	text?: string;
	style?: Style;
	flex?: boolean;
	rule?: { w: number; color: string };
	diamond?: { r: number; color: string };
	block?: Block;
	height?: number;
}

function layoutColumn(ctx: CanvasRenderingContext2D, pieces: Piece[], maxW: number, maxH: number) {
	const list = pieces.filter(Boolean);
	let used = list.reduce((a, p, i) => a + (i ? p.gap : 0), 0);
	for (const p of list) {
		if (p.flex) continue;
		if (p.text != null && p.style) p.block = fit(ctx, p.text, p.style, maxW);
		p.height = p.block ? p.block.height : p.diamond ? p.diamond.r * 2 : 2;
		used += p.height;
	}
	for (const p of list) {
		if (!p.flex || p.text == null || !p.style) continue;
		p.block = fit(ctx, p.text, p.style, maxW, Math.max(p.style.size, maxH - used));
		p.height = p.block.height;
	}
	return list;
}

const columnHeight = (pieces: Piece[]) =>
	pieces.reduce((a, p, i) => a + (p.height ?? 0) + (i ? p.gap : 0), 0);

function drawColumn(d: Draw, pieces: Piece[], x: number, y: number, align: CanvasTextAlign) {
	const { ctx, u } = d;
	let cy = y;
	pieces.forEach((p, i) => {
		if (i) cy += p.gap;
		if (p.block) drawBlock(ctx, p.block, x, cy, align);
		else if (p.rule) {
			const rx = align === 'center' ? x - p.rule.w / 2 : align === 'right' ? x - p.rule.w : x;
			ctx.fillStyle = p.rule.color;
			ctx.fillRect(rx, cy, p.rule.w, Math.max(1, 2 * u));
		} else if (p.diamond) {
			const dx = align === 'center' ? x : align === 'right' ? x - p.diamond.r : x + p.diamond.r;
			diamond(ctx, dx, cy + p.diamond.r, p.diamond.r, p.diamond.color);
		}
		cy += p.height ?? 0;
	});
	return cy;
}

/** Lays out and draws a column inside [top, bottom], aligned to top, center or bottom. */
function column(
	d: Draw,
	pieces: (Piece | false | '' | null | undefined)[],
	x: number,
	top: number,
	bottom: number,
	maxW: number,
	align: CanvasTextAlign,
	valign: 'top' | 'center' | 'bottom' = 'center'
) {
	const list = layoutColumn(d.ctx, pieces.filter(Boolean) as Piece[], maxW, bottom - top);
	const h = columnHeight(list);
	const y = valign === 'top' ? top : valign === 'bottom' ? bottom - h : top + (bottom - top - h) / 2;
	drawColumn(d, list, x, Math.max(top, y), align);
	return { top: Math.max(top, y), height: h };
}

// ---------------------------------------------------------------------------------------------
// Drawing helpers

function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
	ctx.save();
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(x, y - r);
	ctx.lineTo(x + r * 0.62, y);
	ctx.lineTo(x, y + r);
	ctx.lineTo(x - r * 0.62, y);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

function moon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, glow = 0) {
	ctx.save();
	// clip away a second, offset disc so only a crescent of the first one is filled
	ctx.beginPath();
	ctx.rect(x - r * 2, y - r * 2, r * 4, r * 4);
	ctx.arc(x + r * 0.42, y - r * 0.28, r * 0.86, 0, Math.PI * 2, true);
	ctx.clip();
	if (glow) {
		ctx.shadowColor = color;
		ctx.shadowBlur = glow;
	}
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

function rng(seed: number) {
	let s = seed >>> 0 || 1;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function stars(d: Draw, density = 1, x0 = 0, y0 = 0, w = d.W, h = d.H) {
	const { ctx, c, u } = d;
	const rand = rng(d.v.id * 9973);
	const count = Math.round(((w * h) / 9000) * density);
	for (let i = 0; i < count; i++) {
		const x = x0 + rand() * w;
		const y = y0 + rand() * h;
		const r = (0.8 + rand() * 1.8) * u;
		ctx.fillStyle = c.a(0.08 + rand() * (c.dark ? 0.5 : 0.25));
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fill();
	}
}

function grain(d: Draw, amount = 0.035) {
	const { ctx, W, H } = d;
	const size = 160;
	const n = document.createElement('canvas');
	n.width = n.height = size;
	const nctx = n.getContext('2d');
	if (!nctx) return;
	const img = nctx.createImageData(size, size);
	const rand = rng(7);
	for (let i = 0; i < img.data.length; i += 4) {
		const v = rand() * 255;
		img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
		img.data[i + 3] = 255 * amount;
	}
	nctx.putImageData(img, 0, 0);
	ctx.save();
	ctx.fillStyle = ctx.createPattern(n, 'repeat')!;
	ctx.fillRect(0, 0, W, H);
	ctx.restore();
}

// ---------------------------------------------------------------------------------------------
// Shared pieces

interface Draw {
	ctx: CanvasRenderingContext2D;
	W: number;
	H: number;
	u: number; // 1 unit = 1px on a 1080-wide card
	c: Colors;
	o: CardOptions;
	v: CardVerse;
	am: boolean;
	tall: boolean;
	wide: boolean;
	pad: number;
	vpad: number;
}

/** The verse itself, sized by its length, the template's base size and the user's scale. */
function verseStyle(d: Draw, base: number, extra: Partial<Style> = {}): Style {
	const n = d.v.text.length;
	const byLength = n < 60 ? 1.35 : n < 120 ? 1.12 : n < 220 ? 0.92 : n < 400 ? 0.78 : 0.66;
	const size = base * byLength * d.u * d.o.scale * (d.am ? 0.84 : 1);
	const sans = d.o.font === 'sans';
	return {
		family: sans ? SANS : SERIF,
		weight: sans ? (d.am ? 400 : 400) : d.am ? 400 : 300,
		italic: d.o.font === 'italic' && !d.am,
		size,
		minSize: 18 * d.u,
		lh: d.am ? 1.58 : sans ? 1.2 : 1.22,
		tracking: d.am ? 0 : sans ? -0.02 : -0.01,
		color: d.c.fg,
		...extra
	};
}

const refStyle = (d: Draw, size = 34, extra: Partial<Style> = {}): Style => ({
	family: d.o.font === 'sans' ? SANS : SERIF,
	italic: d.o.font !== 'sans' && !d.am,
	weight: d.o.font === 'sans' ? 400 : 400,
	size: size * d.u * (d.am ? 0.86 : 1),
	color: d.c.a(0.62),
	lh: 1.3,
	...extra
});

const monoStyle = (d: Draw, size = 21, alpha = 0.5, extra: Partial<Style> = {}): Style => ({
	family: MONO,
	size: size * d.u,
	color: d.c.a(alpha),
	tracking: 0.14,
	upper: true,
	lh: 1.3,
	...extra
});

const greetingStyle = (d: Draw, size = 30): Style => ({
	family: SERIF,
	italic: true,
	weight: 300,
	size: size * d.u,
	color: d.c.a(0.62),
	lh: 1.2
});

const numberText = (d: Draw) => `№ ${String(d.v.n).padStart(4, '0')}`;
const metaText = (d: Draw) =>
	[d.o.showNumber && numberText(d), d.o.showDate && d.v.date].filter(Boolean).join('  ·  ');

export const linkText = (link: CardLink) =>
	link === 'site'
		? `${SITE_HOST}${SITE_PATH}`
		: link === 'telegram'
			? TELEGRAM_HOST
			: link === 'both'
				? `${SITE_HOST}  ·  ${TELEGRAM_HOST}`
				: '';

const refText = (d: Draw) => (d.o.showRef && d.v.ref ? d.v.ref : '');

function signature(d: Draw, x: number, y: number, align: CanvasTextAlign, size = 26) {
	const { ctx, u, c } = d;
	const s: Style = { family: SANS, weight: 500, size: size * u, color: c.fg, tracking: -0.01 };
	setFont(ctx, s, s.size);
	const tw = ctx.measureText(SIGNATURE).width;
	const r = size * 0.42 * u;
	const gap = size * 0.5 * u;
	const total = r * 2 + gap + tw;
	const left = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
	moon(ctx, left + r, y, r, c.fg);
	ctx.fillStyle = c.fg;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'middle';
	ctx.fillText(SIGNATURE, left + r * 2 + gap, y);
}

/** Signature on one side, link on the other; centred when only one is shown and align is center. */
function footer(d: Draw, y: number, left = d.pad, right = d.W - d.pad, center = d.o.align === 'center') {
	const { ctx, o } = d;
	const link = linkText(o.link);
	const showSig = o.showSignature;
	const ls = monoStyle(d, 20, 0.55, { upper: false, tracking: 0.02 });
	if (showSig && link && !center) {
		signature(d, left, y, 'left');
		drawBlock(ctx, fit(ctx, link, ls, (right - left) * 0.6), right, y - (20 * d.u * 1.3) / 2, 'right');
	} else if (showSig && link) {
		const mid = (left + right) / 2;
		signature(d, mid, y - 22 * d.u, 'center');
		drawBlock(ctx, fit(ctx, link, ls, right - left), mid, y + 10 * d.u, 'center');
	} else if (showSig) {
		signature(d, center ? (left + right) / 2 : left, y, center ? 'center' : 'left');
	} else if (link) {
		const b = fit(ctx, link, ls, right - left);
		drawBlock(ctx, b, center ? (left + right) / 2 : left, y - b.height / 2, center ? 'center' : 'left');
	}
}

const hasFooter = (o: CardOptions) => o.showSignature || o.link !== 'none';
const anchor = (d: Draw, left: number, right: number): [number, CanvasTextAlign] =>
	d.o.align === 'center' ? [(left + right) / 2, 'center'] : [left, 'left'];

// ---------------------------------------------------------------------------------------------
// Templates

const TEMPLATES: Record<CardTemplate, (d: Draw) => void> = {
	quiet(d) {
		const { W, H, u, pad, vpad, o, c } = d;
		if (o.showStars) stars(d, 0.6);
		const fh = hasFooter(o) ? 90 * u : 0;
		const [x, align] = anchor(d, pad, W - pad);
		const ref = refText(d);
		const meta = metaText(d);
		column(
			d,
			[
				o.showGreeting && { gap: 0, text: 'Good night', style: greetingStyle(d) },
				{ gap: 40 * u, text: d.v.text, style: verseStyle(d, 64), flex: true },
				ref && { gap: 44 * u, rule: { w: 56 * u, color: c.a(0.3) } },
				ref && { gap: 26 * u, text: ref, style: refStyle(d) },
				meta && { gap: ref ? 16 * u : 44 * u, text: meta, style: monoStyle(d, 19, 0.4) }
			],
			x,
			vpad,
			H - vpad - fh,
			W - pad * 2,
			align
		);
		if (fh) footer(d, H - vpad - 14 * u);
	},

	night(d) {
		const { ctx, W, H, u, pad, vpad, o, c } = d;
		// a soft pool of light where the moon is
		const mx = o.align === 'center' ? W / 2 : pad + 48 * u;
		const my = vpad + 50 * u;
		const g = ctx.createRadialGradient(mx, my, 0, mx, my, Math.max(W, H) * 0.6);
		g.addColorStop(0, c.a(c.dark ? 0.09 : 0.06));
		g.addColorStop(1, c.a(0));
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, W, H);
		if (o.showStars) stars(d, 1.4);
		moon(ctx, mx, my, 44 * u, c.fg, c.dark ? 40 * u : 0);
		const fh = hasFooter(o) ? 90 * u : 0;
		const [x, align] = anchor(d, pad, W - pad);
		const ref = refText(d);
		const meta = metaText(d);
		column(
			d,
			[
				o.showGreeting && { gap: 0, text: 'Good night', style: greetingStyle(d, 40) },
				meta && { gap: 14 * u, text: meta, style: monoStyle(d, 18, 0.4) },
				{ gap: 48 * u, text: d.v.text, style: verseStyle(d, 62), flex: true },
				ref && { gap: 40 * u, text: ref, style: refStyle(d) }
			],
			x,
			my + 110 * u,
			H - vpad - fh,
			W - pad * 2,
			align
		);
		if (fh) footer(d, H - vpad - 14 * u);
	},

	editorial(d) {
		const { ctx, W, H, u, pad, vpad, o, c } = d;
		if (o.showStars) stars(d, 0.35);
		// top rule with a label on each side
		const top = vpad;
		drawBlock(ctx, fit(ctx, o.showGreeting ? 'Good night' : 'Scripture', monoStyle(d, 20, 0.7), W), pad, top, 'left');
		const right = [o.showNumber && numberText(d), o.showDate && d.v.date].filter(Boolean).join('  ·  ');
		if (right) drawBlock(ctx, fit(ctx, right, monoStyle(d, 20, 0.45), W), W - pad, top, 'right');
		ctx.fillStyle = c.a(0.22);
		ctx.fillRect(pad, top + 52 * u, W - pad * 2, Math.max(1, 1.5 * u));
		// big quote mark
		const qs: Style = { family: SERIF, weight: 300, size: 220 * u, color: c.a(0.16), lh: 1 };
		const qx = o.align === 'center' ? W / 2 : pad - 8 * u;
		drawBlock(ctx, fit(ctx, '“', qs, W), qx, top + 70 * u, o.align === 'center' ? 'center' : 'left');
		const fh = hasFooter(o) ? 110 * u : 0;
		const [x, align] = anchor(d, pad, W - pad);
		const ref = refText(d);
		column(
			d,
			[
				{ gap: 0, text: d.v.text, style: verseStyle(d, 66), flex: true },
				ref && { gap: 40 * u, text: `— ${ref}`, style: refStyle(d, 34, { color: c.a(0.75) }) }
			],
			x,
			top + 250 * u,
			H - vpad - fh,
			W - pad * 2,
			align,
			d.tall ? 'center' : 'top'
		);
		if (fh) {
			ctx.fillStyle = c.a(0.22);
			ctx.fillRect(pad, H - vpad - 64 * u, W - pad * 2, Math.max(1, 1.5 * u));
			footer(d, H - vpad - 14 * u, pad, W - pad, false);
		}
	},

	poster(d) {
		const { ctx, W, H, u, pad, vpad, o, c } = d;
		if (o.showStars) stars(d, 0.4);
		const meta = metaText(d);
		if (o.showGreeting) drawBlock(ctx, fit(ctx, 'Good night', monoStyle(d, 22, 0.8), W), pad, vpad, 'left');
		if (meta) drawBlock(ctx, fit(ctx, meta, monoStyle(d, 22, 0.45), W), W - pad, vpad, 'right');
		const fh = hasFooter(o) ? 90 * u : 0;
		const [x, align] = anchor(d, pad, W - pad);
		const ref = refText(d);
		const sans = o.font === 'sans';
		column(
			d,
			[
				{
					gap: 0,
					text: d.v.text,
					style: verseStyle(d, 96, {
						weight: sans ? 500 : 400,
						lh: d.am ? 1.45 : 1.04,
						tracking: d.am ? 0 : -0.035
					}),
					flex: true
				},
				ref && { gap: 48 * u, text: ref, style: monoStyle(d, 28, 0.85, { tracking: 0.08 }) }
			],
			x,
			vpad + 100 * u,
			H - vpad - fh - 30 * u,
			W - pad * 2,
			align,
			'bottom'
		);
		if (fh) footer(d, H - vpad - 14 * u);
	},

	frame(d) {
		const { ctx, W, H, u, pad, vpad, o, c } = d;
		if (o.showStars) stars(d, 0.5);
		const inset = Math.min(W, H) * 0.045;
		ctx.strokeStyle = c.a(0.45);
		ctx.lineWidth = 2 * u;
		ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);
		ctx.strokeStyle = c.a(0.2);
		ctx.lineWidth = 1 * u;
		ctx.strokeRect(inset + 14 * u, inset + 14 * u, W - inset * 2 - 28 * u, H - inset * 2 - 28 * u);
		const meta = metaText(d);
		const ref = refText(d);
		const fh = hasFooter(o) ? 80 * u : 0;
		const [x, align] = anchor(d, pad + 30 * u, W - pad - 30 * u);
		column(
			d,
			[
				(o.showGreeting || meta) && {
					gap: 0,
					text: [o.showGreeting && 'Good night', meta].filter(Boolean).join('  ·  '),
					style: monoStyle(d, 18, 0.5)
				},
				{ gap: 36 * u, diamond: { r: 9 * u, color: c.a(0.5) } },
				{ gap: 40 * u, text: d.v.text, style: verseStyle(d, 60), flex: true },
				{ gap: 40 * u, diamond: { r: 9 * u, color: c.a(0.5) } },
				ref && { gap: 30 * u, text: ref, style: refStyle(d) }
			],
			x,
			vpad + 20 * u,
			H - vpad - fh,
			W - pad * 2 - 60 * u,
			align
		);
		if (fh) footer(d, H - vpad - 6 * u, pad + 30 * u, W - pad - 30 * u, true);
	},

	split(d) {
		const { ctx, W, H, u, pad, vpad, o, c } = d;
		const side = d.wide;
		const bandW = side ? W * 0.4 : W;
		const bandH = side ? H : H * (d.tall ? 0.36 : 0.4);
		// inverted band
		ctx.fillStyle = c.fg;
		ctx.fillRect(0, 0, bandW, bandH);
		const inv: Colors = colorsFor(c.dark ? '#f6f4ef' : '#121212');
		const bd: Draw = { ...d, c: inv };
		if (o.showStars) stars(bd, 0.6, 0, 0, bandW, bandH);
		const head = refText(d) || 'Good night';
		const meta = metaText(d);
		const bp = side ? pad : pad;
		column(
			bd,
			[
				meta && { gap: 0, text: meta, style: monoStyle(bd, 19, 0.55) },
				{
					gap: 24 * u,
					text: head,
					style: {
						family: SANS,
						weight: 300,
						size: (side ? 92 : 110) * u * (d.am ? 0.8 : 1),
						minSize: 36 * u,
						color: inv.fg,
						lh: d.am ? 1.3 : 1.02,
						tracking: d.am ? 0 : -0.04
					},
					flex: true
				}
			],
			bp,
			side ? vpad : vpad,
			bandH - (side ? vpad : 56 * u),
			bandW - bp * 2,
			'left',
			'bottom'
		);
		// the verse
		const fh = hasFooter(o) ? 90 * u : 0;
		const left = side ? bandW + pad : pad;
		const [x, align] = anchor(d, left, W - pad);
		column(
			d,
			[
				o.showGreeting && { gap: 0, text: 'Good night', style: greetingStyle(d, 28) },
				{ gap: 28 * u, text: d.v.text, style: verseStyle(d, 56), flex: true }
			],
			x,
			side ? vpad : bandH + 64 * u,
			H - vpad - fh,
			W - left - pad,
			align
		);
		if (fh) footer(d, H - vpad - 14 * u, left, W - pad);
	},

	card(d) {
		const { ctx, W, H, u, pad, vpad, o, c } = d;
		if (o.showStars) stars(d, 1);
		const link = linkText(o.link);
		const below = link ? 70 * u : 0;
		const cx = pad * 0.8;
		const cy = vpad * (d.tall ? 1.1 : 0.8);
		const cw = W - cx * 2;
		const ch = H - cy * 2 - below;
		const r = 34 * u;
		ctx.save();
		ctx.shadowColor = 'rgba(0,0,0,0.35)';
		ctx.shadowBlur = 70 * u;
		ctx.shadowOffsetY = 24 * u;
		ctx.fillStyle = c.surface;
		ctx.beginPath();
		ctx.roundRect(cx, cy, cw, ch, r);
		ctx.fill();
		ctx.restore();
		ctx.strokeStyle = c.a(0.12);
		ctx.lineWidth = 1.5 * u;
		ctx.beginPath();
		ctx.roundRect(cx, cy, cw, ch, r);
		ctx.stroke();
		const ip = Math.min(cw, ch) * 0.09;
		// card header
		const hy = cy + ip + 10 * u;
		if (o.showSignature) signature(d, cx + ip, hy, 'left', 24);
		const meta = metaText(d);
		if (meta) drawBlock(ctx, fit(ctx, meta, monoStyle(d, 18, 0.45), cw), cx + cw - ip, hy - 12 * u, 'right');
		const [x, align] = anchor(d, cx + ip, cx + cw - ip);
		const ref = refText(d);
		column(
			d,
			[
				o.showGreeting && { gap: 0, text: 'Good night', style: greetingStyle(d, 28) },
				{ gap: 28 * u, text: d.v.text, style: verseStyle(d, 56), flex: true },
				ref && { gap: 36 * u, text: ref, style: refStyle(d, 30) }
			],
			x,
			hy + 60 * u,
			cy + ch - ip,
			cw - ip * 2,
			align
		);
		if (link)
			drawBlock(
				ctx,
				fit(ctx, link, monoStyle(d, 20, 0.55, { upper: false, tracking: 0.02 }), W),
				W / 2,
				cy + ch + below / 2,
				'center'
			);
	},

	margin(d) {
		const { ctx, W, H, u, pad, vpad, o, c } = d;
		if (o.showStars) stars(d, 0.5);
		const rail = pad + 70 * u;
		ctx.fillStyle = c.a(0.2);
		ctx.fillRect(rail, vpad - 20 * u, Math.max(1, 1.5 * u), H - vpad * 2 + 40 * u);
		// rotated label up the rail
		const label = [o.showGreeting && 'Good night', metaText(d)].filter(Boolean).join('  ·  ');
		if (label) {
			ctx.save();
			ctx.translate(pad + 24 * u, H - vpad);
			ctx.rotate(-Math.PI / 2);
			drawBlock(ctx, fit(ctx, label, monoStyle(d, 20, 0.5), H), 0, -14 * u, 'left');
			ctx.restore();
		}
		moon(ctx, pad + 34 * u, vpad + 20 * u, 18 * u, c.fg);
		const left = rail + 60 * u;
		const fh = hasFooter(o) ? 90 * u : 0;
		const [x, align] = anchor(d, left, W - pad);
		const ref = refText(d);
		column(
			d,
			[
				{ gap: 0, text: d.v.text, style: verseStyle(d, 60), flex: true },
				ref && { gap: 40 * u, text: ref, style: refStyle(d) }
			],
			x,
			vpad,
			H - vpad - fh,
			W - left - pad,
			align
		);
		if (fh) footer(d, H - vpad - 14 * u, left, W - pad);
	}
};

// ---------------------------------------------------------------------------------------------

export function drawCard(canvas: HTMLCanvasElement, v: CardVerse, o: CardOptions, scale = 1) {
	const { width: W, height: H } = CARD_RATIOS[o.ratio];
	canvas.width = Math.round(W * scale);
	canvas.height = Math.round(H * scale);
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	ctx.setTransform(scale, 0, 0, scale, 0, 0);
	const u = Math.min(W, H) / 1080;
	const tall = H / W > 1.6;
	const wide = W / H > 1.5;
	const c = colorsFor(paletteBg(o));
	const pad = (wide ? 80 : 96) * u;
	const d: Draw = {
		ctx,
		W,
		H,
		u,
		c,
		o,
		v,
		am: v.lang === 'am',
		tall,
		wide,
		pad,
		vpad: tall ? 210 * u : pad
	};
	ctx.fillStyle = c.bg;
	ctx.fillRect(0, 0, W, H);
	TEMPLATES[o.template](d);
	if (scale >= 0.5) grain(d, c.dark ? 0.04 : 0.03);
}
