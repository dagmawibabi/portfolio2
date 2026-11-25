<script lang="ts">
	// Monochrome header plates, one per part. Pure SVG, drawn in currentColor so they follow the theme.
	// `thumb`: compact version for lists — no caption, no labels, no reveal.
	let { n, thumb = false }: { n: number; thumb?: boolean } = $props();
	const uid = $derived(`${thumb ? 't' : 'p'}${n}`);

	const W = 960;
	const H = 400;

	function rng(seed: number) {
		let a = seed >>> 0;
		return () => {
			a |= 0;
			a = (a + 0x6d2b79f5) | 0;
			let t = Math.imul(a ^ (a >>> 15), 1 | a);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}
	const f = (v: number) => v.toFixed(1);

	const captions: Record<number, string> = {
		1: 'FIG. 01 — THE RAIL, 04:00:00 UTC',
		2: 'FIG. 02 — RESIDUALS, 2185–2193, FILTERED',
		3: 'FIG. 03 — CMV-4471, CERES → PSYCHE',
		4: 'FIG. 04 — DEBRIS FIELD, DAY 061',
		5: 'FIG. 05 — 31 SESSIONS, NO DECISION',
		6: 'FIG. 06 — 16 PSYCHE AND THE CROWN',
		7: 'FIG. 07 — AUDIT, ALL CHANNELS',
		8: 'FIG. 08 — CLOSEST APPROACH, 526 KM'
	};

	// ── I. The Rail bends: parallel streams that all turn at one instant toward one point.
	const rail = (() => {
		const P = { x: 880, y: 200 };
		const lanes = 15;
		return {
			P,
			lines: Array.from({ length: lanes }, (_, i) => {
				const y = 36 + (i * (H - 72)) / (lanes - 1);
				return {
					d: `M0 ${f(y)} L470 ${f(y)} Q690 ${f(y)} ${P.x} ${P.y}`,
					ghost: `M470 ${f(y)} L${W} ${f(y)}`,
					o: 0.35 + 0.5 * (1 - Math.abs(i - (lanes - 1) / 2) / (lanes / 2))
				};
			})
		};
	})();

	// ── II. Residuals: a field of tiny arrows, all leaning toward an empty point.
	const field = (() => {
		const r = rng(2);
		const T = { x: 650, y: 185 };
		const out: { x1: number; y1: number; x2: number; y2: number; o: number }[] = [];
		for (let gx = 0; gx < 34; gx++) {
			for (let gy = 0; gy < 14; gy++) {
				const x = 18 + gx * 28 + (r() - 0.5) * 10;
				const y = 18 + gy * 28 + (r() - 0.5) * 10;
				const dx = T.x - x;
				const dy = T.y - y;
				const d = Math.hypot(dx, dy);
				if (d < 26) continue;
				const pull = Math.min(1, 90 / d);
				const na = r() * Math.PI * 2;
				const ux = (dx / d) * pull + Math.cos(na) * (1 - pull) * 0.6;
				const uy = (dy / d) * pull + Math.sin(na) * (1 - pull) * 0.6;
				const len = 4 + 12 * pull;
				out.push({ x1: x, y1: y, x2: x + ux * len, y2: y + uy * len, o: 0.18 + 0.75 * pull });
			}
		}
		return { T, arrows: out };
	})();

	// ── III. The tug on its long, lazy transfer arc.
	const transfer = {
		path: 'M120 320 C 300 380, 620 360, 840 110',
		tug: { x: 470, y: 352, a: -8 }
	};

	// ── IV. Eleven drones come apart; one fragment crosses four hundred kilometres.
	const debris = (() => {
		const r = rng(4);
		const C = { x: 300, y: 180 };
		const frags = Array.from({ length: 170 }, () => {
			const a = r() * Math.PI * 2;
			const d = 20 + Math.pow(r(), 0.7) * 150;
			return { x: C.x + Math.cos(a) * d, y: C.y + Math.sin(a) * d * 0.9, s: 0.6 + r() * 1.4, o: 0.25 + r() * 0.7 };
		});
		const rays = Array.from({ length: 28 }, () => {
			const a = r() * Math.PI * 2;
			const d0 = 10 + r() * 30;
			const d1 = d0 + 20 + r() * 70;
			return `M${f(C.x + Math.cos(a) * d0)} ${f(C.y + Math.sin(a) * d0)}L${f(C.x + Math.cos(a) * d1)} ${f(C.y + Math.sin(a) * d1)}`;
		});
		const storm = Array.from({ length: 22 }, (_, i) => {
			const x = 600 + i * 22;
			return `M${x} 0 L${x - 160} ${H}`;
		});
		const streams = Array.from({ length: 5 }, (_, i) => 60 + i * 72);
		return { C, frags, rays, storm, streams, ship: { x: 700, y: 236 } };
	})();

	// ── V. Thirty-one sessions, then the gap.
	const sessions = Array.from({ length: 31 }, (_, i) => 96 + i * 18);

	// ── VI. Psyche and the Crown.
	const crown = (() => {
		const r = rng(6);
		const C = { x: 480, y: 200 };
		const blob = Array.from({ length: 48 }, (_, i) => {
			const a = (i / 48) * Math.PI * 2;
			const rad = 64 + Math.sin(a * 3 + 1) * 6 + Math.sin(a * 7) * 3 + (r() - 0.5) * 3;
			return `${f(C.x + Math.cos(a) * rad)},${f(C.y + Math.sin(a) * rad * 0.9)}`;
		}).join(' ');
		const fins = Array.from({ length: 140 }, (_, i) => {
			const a = (i / 140) * Math.PI * 2;
			const r0 = 84;
			const r1 = 84 + 70 + (i % 2 ? 0 : 14) + (r() - 0.5) * 6;
			return {
				d: `M${f(C.x + Math.cos(a) * r0)} ${f(C.y + Math.sin(a) * r0)}L${f(C.x + Math.cos(a) * r1)} ${f(C.y + Math.sin(a) * r1)}`,
				o: 0.35 + 0.5 * (0.5 + 0.5 * Math.cos(a + 0.6))
			};
		});
		const plume = Array.from({ length: 90 }, () => {
			const t = r();
			return {
				x: C.x - 70 - t * 420,
				y: C.y + 40 + t * 120 + (r() - 0.5) * (20 + t * 110),
				s: 0.5 + r() * 1.1,
				o: (1 - t) * 0.7
			};
		});
		return { C, blob, fins, plume };
	})();

	// ── VII. The audit goes out on every channel; ships turn toward the source.
	const broadcast = (() => {
		const r = rng(7);
		const C = { x: 480, y: 200 };
		const ships = Array.from({ length: 140 }, () => {
			const a = r() * Math.PI * 2;
			const d = 90 + Math.pow(r(), 0.8) * 420;
			const x = C.x + Math.cos(a) * d;
			const y = C.y + Math.sin(a) * d * 0.62;
			const ux = (C.x - x) / Math.hypot(C.x - x, C.y - y);
			const uy = (C.y - y) / Math.hypot(C.x - x, C.y - y);
			return { x, y, tx: x - ux * 9, ty: y - uy * 9, o: 0.3 + r() * 0.6 };
		}).filter((s) => s.x > 4 && s.x < W - 4 && s.y > 4 && s.y < H - 4);
		return { C, ships, rings: [28, 62, 104, 154, 212, 278, 352] };
	})();

	// ── VIII. Psyche stretched, streaming into a point that is finally visible.
	const approach = (() => {
		const r = rng(8);
		const L = { x: 660, y: 196 };
		const P = { x: 420, y: 214 };
		const filament = Array.from({ length: 160 }, () => {
			const t = Math.pow(r(), 0.6);
			const x = P.x + 58 + t * (L.x - P.x - 64);
			const y = P.y - 6 + t * (L.y - P.y + 6) + (r() - 0.5) * 22 * (1 - t);
			return { x, y, s: 0.5 + r() * 1.3 * (1 - t * 0.6), o: 0.25 + t * 0.7 };
		});
		const shards = Array.from({ length: 9 }, () => {
			const x = P.x + 30 + r() * 150;
			const y = P.y - 60 + r() * 40;
			const a = r() * Math.PI;
			return `M${f(x)} ${f(y)}L${f(x + Math.cos(a) * 16)} ${f(y + Math.sin(a) * 16)}`;
		});
		return { L, P, filament, shards };
	})();
</script>

<figure class="plate" class:thumb aria-label={captions[n]}>
	<div class="frame">
		<svg viewBox="0 0 {W} {H}" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
			<defs>
				<radialGradient id="glow-{uid}">
					<stop offset="0" stop-color="currentColor" stop-opacity="0.9" />
					<stop offset="0.25" stop-color="currentColor" stop-opacity="0.25" />
					<stop offset="1" stop-color="currentColor" stop-opacity="0" />
				</radialGradient>
				<pattern id="grid-{uid}" width="40" height="40" patternUnits="userSpaceOnUse">
					<path d="M40 0H0V40" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.07" />
				</pattern>
			</defs>
			<rect width={W} height={H} fill="url(#grid-{uid})" />

			{#if n === 1}
				<line x1="470" y1="0" x2="470" y2={H} stroke="currentColor" stroke-dasharray="2 5" opacity="0.5" />
				<text x="478" y="22" class="t">04:00:00.000</text>
				{#each rail.lines as l}
					<path d={l.ghost} fill="none" stroke="currentColor" stroke-dasharray="1 6" opacity="0.18" />
					<path d={l.d} fill="none" stroke="currentColor" stroke-width="0.9" opacity={l.o} class="draw" pathLength="1" />
				{/each}
				<circle cx={rail.P.x} cy={rail.P.y} r="22" fill="url(#glow-{uid})" class="pulse" />
				<circle cx={rail.P.x} cy={rail.P.y} r="4.5" fill="currentColor" />
				<text x={rail.P.x - 22} y={rail.P.y + 34} class="t">PSYCHE</text>
			{:else if n === 2}
				<path d="M120 -10 Q 520 120 650 185 T 980 330" fill="none" stroke="currentColor" stroke-dasharray="1 5" opacity="0.35" />
				{#each field.arrows as a}
					<line x1={f(a.x1)} y1={f(a.y1)} x2={f(a.x2)} y2={f(a.y2)} stroke="currentColor" stroke-width="0.9" opacity={a.o} />
					<circle cx={f(a.x2)} cy={f(a.y2)} r="0.9" fill="currentColor" opacity={a.o} />
				{/each}
				<circle cx={field.T.x} cy={field.T.y} r="16" fill="none" stroke="currentColor" stroke-dasharray="2 3" class="spin" />
				<path d="M{field.T.x - 30} {field.T.y}h8M{field.T.x + 22} {field.T.y}h8M{field.T.x} {field.T.y - 30}v8M{field.T.x} {field.T.y + 22}v8" stroke="currentColor" />
				<text x={field.T.x + 26} y={field.T.y - 24} class="t">∅ · 4.1 × 10²⁰ KG</text>
			{:else if n === 3}
				<path d={transfer.path} fill="none" stroke="currentColor" stroke-dasharray="3 6" opacity="0.55" />
				<circle cx="120" cy="320" r="26" fill="none" stroke="currentColor" opacity="0.8" />
				<circle cx="120" cy="320" r="38" fill="none" stroke="currentColor" stroke-dasharray="1 4" opacity="0.4" />
				<text x="80" y="376" class="t">CERES · DAY 012</text>
				<circle cx="840" cy="110" r="5" fill="currentColor" />
				<circle cx="840" cy="110" r="14" fill="none" stroke="currentColor" stroke-dasharray="1 3" opacity="0.6" />
				<text x="790" y="86" class="t">PSYCHE · DAY 138</text>
				<g transform="translate(480 200) scale(3.1) rotate(-14)" stroke="currentColor" fill="none" stroke-width="0.35">
					<rect x="40" y="-7" width="16" height="14" fill="var(--bg)" />
					<path d="M44 -7v14M52 -3h4" opacity="0.6" />
					<path d="M-40 -2.2H40M-40 2.2H40" />
					<path d="M-40 -2.2 L-32 2.2 L-24 -2.2 L-16 2.2 L-8 -2.2 L0 2.2 L8 -2.2 L16 2.2 L24 -2.2 L32 2.2 L40 -2.2" opacity="0.5" />
					<rect x="-34" y="-5.4" width="62" height="2" opacity="0.8" />
					<rect x="-34" y="3.4" width="62" height="2" opacity="0.8" />
					<path d="M-42 -10V10" stroke-width="1.1" />
					<path d="M-42 -3 L-50 -6 V6 L-42 3" />
					<path d="M46 -3 q2 -2 4 0 q-2 2 -4 0z" opacity="0.4" />
				</g>
				<text x="400" y="292" class="t">CMV-4471 SMALL MERCIES</text>
			{:else if n === 4}
				{#each debris.streams as y}
					<line x1="0" y1={y} x2={W} y2={y + 30} stroke="currentColor" stroke-dasharray="1 9" opacity="0.25" />
				{/each}
				{#each debris.storm as d}
					<path {d} stroke="currentColor" stroke-width="0.6" opacity="0.12" />
				{/each}
				<circle cx={debris.C.x} cy={debris.C.y} r="60" fill="none" stroke="currentColor" stroke-dasharray="1 4" opacity="0.4" class="grow" />
				<circle cx={debris.C.x} cy={debris.C.y} r="120" fill="none" stroke="currentColor" stroke-dasharray="1 6" opacity="0.25" class="grow" />
				{#each debris.rays as d}
					<path {d} stroke="currentColor" stroke-width="0.7" opacity="0.6" />
				{/each}
				{#each debris.frags as p}
					<circle cx={f(p.x)} cy={f(p.y)} r={f(p.s)} fill="currentColor" opacity={p.o} />
				{/each}
				<line x1={debris.C.x + 60} y1={debris.C.y + 10} x2={debris.ship.x} y2={debris.ship.y} stroke="currentColor" stroke-width="0.8" class="draw" pathLength="1" />
				<rect x={debris.ship.x - 4} y={debris.ship.y - 4} width="8" height="8" fill="var(--bg)" stroke="currentColor" />
				<text x={debris.ship.x + 12} y={debris.ship.y + 4} class="t">4 G · 400 KM</text>
				<text x="800" y="380" class="t">X4.1 · T+28 MIN</text>
			{:else if n === 5}
				<line x1="60" y1="200" x2="900" y2="200" stroke="currentColor" stroke-width="0.6" opacity="0.4" />
				{#each sessions as x, i}
					<line x1={x} y1={170} x2={x} y2={230} stroke="currentColor" stroke-width="1" opacity={0.25 + (i / 30) * 0.7} />
				{/each}
				<text x="88" y="256" class="t">S01 · OCT 2190</text>
				<text x="586" y="256" class="t">S31 · JAN 2193</text>
				<path d="M660 200 H820" stroke="currentColor" stroke-dasharray="2 5" />
				<g stroke="currentColor" opacity="0.6">
					<path d="M732 192 l16 16 M748 192 l-16 16" />
				</g>
				<text x="700" y="160" class="t">S32 · 15 MAR 2193</text>
				<circle cx="840" cy="200" r="18" fill="url(#glow-{uid})" class="pulse" />
				<circle cx="840" cy="200" r="5" fill="currentColor" />
				<text x="822" y="240" class="t">DAY 000</text>
				<text x="60" y="60" class="t big">RESOLUTION 2190/41</text>
				<rect x="60" y="74" width="210" height="7" fill="currentColor" opacity="0.85" />
				<rect x="60" y="88" width="150" height="7" fill="currentColor" opacity="0.85" />
				<rect x="60" y="102" width="180" height="7" fill="currentColor" opacity="0.85" />
			{:else if n === 6}
				{#each crown.plume as p}
					<circle cx={f(p.x)} cy={f(p.y)} r={f(p.s)} fill="currentColor" opacity={f(p.o)} />
				{/each}
				<circle cx={crown.C.x} cy={crown.C.y} r="176" fill="none" stroke="currentColor" stroke-dasharray="1 5" opacity="0.3" />
				{#each crown.fins as fin}
					<path d={fin.d} stroke="currentColor" stroke-width="0.8" opacity={fin.o} />
				{/each}
				<polygon points={crown.blob} fill="var(--bg)" stroke="currentColor" stroke-width="1" />
				<path d="M440 180 q20 -6 34 4 M492 228 q16 6 30 -6 M450 230 q8 -10 18 -4" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.5" />
				<text x="680" y="70" class="t">140 FINS · 30 KM</text>
				<text x="80" y="370" class="t">IRON · ~10⁶ T/S</text>
			{:else if n === 7}
				{#each broadcast.rings as r, i}
					<ellipse cx={broadcast.C.x} cy={broadcast.C.y} rx={r} ry={r * 0.62} fill="none" stroke="currentColor" stroke-width="0.7" opacity={0.7 - i * 0.09} class="ripple" style="--d:{i * 0.35}s" />
				{/each}
				{#each broadcast.ships as s}
					<line x1={f(s.tx)} y1={f(s.ty)} x2={f(s.x)} y2={f(s.y)} stroke="currentColor" stroke-width="0.7" opacity={s.o * 0.6} />
					<circle cx={f(s.x)} cy={f(s.y)} r="1.4" fill="currentColor" opacity={s.o} />
				{/each}
				<circle cx={broadcast.C.x} cy={broadcast.C.y} r="5" fill="currentColor" />
				<text x={broadcast.C.x + 14} y={broadcast.C.y - 10} class="t">AUDITED. SIGNED.</text>
				<text x="40" y="380" class="t">340 VESSELS · NO ORDERS</text>
			{:else if n === 8}
				<path d="M560 -10 C 640 120, 660 180, 664 200 S 700 320, 820 420" fill="none" stroke="currentColor" stroke-dasharray="2 5" opacity="0.4" />
				{#each approach.filament as p}
					<circle cx={f(p.x)} cy={f(p.y)} r={f(p.s)} fill="currentColor" opacity={f(p.o)} />
				{/each}
				{#each approach.shards as d}
					<path {d} stroke="currentColor" stroke-width="1" opacity="0.55" />
				{/each}
				<g transform="translate({approach.P.x} {approach.P.y}) rotate(-4)">
					<ellipse rx="66" ry="36" fill="var(--bg)" stroke="currentColor" />
					<path d="M18 -35 L8 -12 L20 4 L10 35" fill="none" stroke="currentColor" stroke-width="0.8" />
					<path d="M-30 -20 q10 8 4 20" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.5" />
				</g>
				<circle cx={approach.L.x} cy={approach.L.y} r="70" fill="url(#glow-{uid})" class="pulse" />
				<circle cx={approach.L.x} cy={approach.L.y} r="3.5" fill="currentColor" />
				<text x={approach.L.x + 18} y={approach.L.y - 30} class="t">LACUNA</text>
				<text x="40" y="380" class="t">17:41:08 UTC · DAY 191</text>
			{/if}

			<g class="corners" stroke="currentColor" fill="none" stroke-width="1">
				<path d="M8 22V8H22M{W - 22} 8H{W - 8}V22M{W - 8} {H - 22}V{H - 8}H{W - 22}M22 {H - 8}H8V{H - 22}" />
			</g>
		</svg>
	</div>
	{#if !thumb}
	<figcaption>
		<span>{captions[n]}</span>
		<span class="rule" aria-hidden="true"></span>
		<span>{String(n).padStart(2, '0')}/08</span>
	</figcaption>
	{/if}
</figure>

<style>
	.plate {
		margin: 0 0 clamp(36px, 6vh, 56px);
	}
	.frame {
		color: var(--fg);
		background: var(--bg-2, transparent);
		border: 1px solid var(--line);
		overflow: hidden;
		aspect-ratio: 12 / 5;
		animation: scan 1.6s cubic-bezier(0.2, 0.7, 0.1, 1) both;
	}
	svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	.t {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.12em;
		fill: currentColor;
		opacity: 0.7;
	}
	.t.big {
		font-size: 12px;
		opacity: 0.85;
	}
	.corners {
		opacity: 0.5;
	}
	figcaption {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 10px;
		font-family: var(--mono);
		font-size: 0.58rem;
		letter-spacing: 0.1em;
		color: var(--mute);
		white-space: nowrap;
	}
	figcaption span:first-child {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.rule {
		flex: 1;
		height: 1px;
		background: var(--line-2);
		min-width: 12px;
	}

	.draw {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 2.2s cubic-bezier(0.3, 0.6, 0.1, 1) 0.4s forwards;
	}
	.pulse {
		transform-box: fill-box;
		transform-origin: center;
		animation: pulse 4s ease-in-out infinite;
	}
	.spin {
		transform-box: fill-box;
		transform-origin: center;
		animation: spin 24s linear infinite;
	}
	.grow {
		transform-box: fill-box;
		transform-origin: center;
		animation: grow 6s ease-out infinite;
	}
	.ripple {
		transform-box: fill-box;
		transform-origin: center;
		animation: ripple 5s ease-in-out var(--d) infinite;
	}

	@keyframes scan {
		from {
			clip-path: inset(0 100% 0 0);
		}
		to {
			clip-path: inset(0 0 0 0);
		}
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 0.55;
			transform: scale(0.9);
		}
		50% {
			opacity: 1;
			transform: scale(1.12);
		}
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes grow {
		from {
			transform: scale(0.85);
		}
		to {
			transform: scale(1.08);
		}
	}
	@keyframes ripple {
		0%,
		100% {
			opacity: 0.25;
		}
		50% {
			opacity: 0.8;
		}
	}

	.thumb {
		margin: 0;
	}
	.thumb .frame {
		animation: none;
	}
	.thumb .t,
	.thumb .corners {
		display: none;
	}
	.thumb .draw {
		animation: none;
		stroke-dashoffset: 0;
	}
	@media (max-width: 640px) {
		figcaption {
			font-size: 0.52rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.frame,
		.draw,
		.pulse,
		.spin,
		.grow,
		.ripple {
			animation: none;
			stroke-dashoffset: 0;
			clip-path: none;
		}
	}
</style>
