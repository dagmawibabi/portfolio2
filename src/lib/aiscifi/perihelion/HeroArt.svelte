<script lang="ts">
	// Static hero image: streams of ice pucks crossing the frame, bent around an unseen mass.
	// The trajectories are integrated once under a point-mass pull, so the picture is "real" gravity,
	// not a drawing of it. Monochrome; drawn in currentColor so it follows the theme.
	const W = 1600;
	const H = 900;
	const M = { x: 1060, y: 380 }; // LACUNA
	const GM = 1500;

	function rng(seed: number) {
		let a = seed >>> 0;
		return () => {
			a = (a + 0x6d2b79f5) | 0;
			let t = Math.imul(a ^ (a >>> 15), 1 | a);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	type Stream = { d: string; o: number; w: number };

	const streams: Stream[] = (() => {
		const r = rng(193);
		const out: Stream[] = [];
		const N = 150;
		for (let i = 0; i < N; i++) {
			// Lanes cluster into a few braided "streams", like the Rail.
			const lane = Math.floor(r() * 9);
			let y = 40 + lane * 100 + (r() - 0.5) * 70;
			let x = -40 - r() * 200;
			let vx = 5.2 + r() * 1.6;
			let vy = (r() - 0.5) * 0.4;
			const pts: string[] = [`M${x.toFixed(0)} ${y.toFixed(0)}`];
			let minD = 1e9;
			for (let s = 0; s < 900; s++) {
				const dx = M.x - x;
				const dy = M.y - y;
				const d2 = dx * dx + dy * dy + 900;
				const d = Math.sqrt(d2);
				minD = Math.min(minD, d);
				if (d < 9) break; // swallowed
				const a = GM / d2;
				vx += (a * dx) / d;
				vy += (a * dy) / d;
				x += vx;
				y += vy;
				if (s % 3 === 0) pts.push(`L${x.toFixed(0)} ${y.toFixed(0)}`);
				if (x > W + 60 || x < -260 || y < -80 || y > H + 80) break;
				if (vx < 0.5) break; // stop before paths loop back on themselves
			}
			const near = Math.max(0, 1 - minD / 520);
			out.push({ d: pts.join(''), o: 0.035 + 0.32 * near * near + r() * 0.03, w: 0.5 + near * 0.5 });
		}
		return out;
	})();

	const stars = (() => {
		const r = rng(7);
		return Array.from({ length: 160 }, () => ({
			x: r() * W,
			y: r() * H,
			s: 0.4 + r() * 0.9,
			o: 0.1 + r() * 0.35
		}));
	})();
</script>

<div class="art" aria-hidden="true">
	<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">
		<defs>
			<radialGradient id="hero-glow">
				<stop offset="0" stop-color="currentColor" stop-opacity="0.85" />
				<stop offset="0.12" stop-color="currentColor" stop-opacity="0.22" />
				<stop offset="1" stop-color="currentColor" stop-opacity="0" />
			</radialGradient>
		</defs>

		{#each stars as s}
			<circle cx={s.x.toFixed(0)} cy={s.y.toFixed(0)} r={s.s.toFixed(1)} fill="currentColor" opacity={s.o.toFixed(2)} />
		{/each}

		<!-- LACUNA's open orbit: in from the dark, out again. -->
		<path
			d="M760 -40 C 940 200, 1020 330, 1060 380 S 1240 640, 1660 900"
			fill="none"
			stroke="currentColor"
			stroke-dasharray="2 7"
			opacity="0.28"
		/>

		{#each [60, 130, 220, 330] as r, i}
			<circle cx={M.x} cy={M.y} {r} fill="none" stroke="currentColor" stroke-dasharray="1 6" opacity={0.22 - i * 0.04} />
		{/each}

		{#each streams as s}
			<path d={s.d} fill="none" stroke="currentColor" stroke-width={s.w.toFixed(2)} opacity={s.o.toFixed(3)} />
		{/each}

		<circle cx={M.x} cy={M.y} r="150" fill="url(#hero-glow)" />
		<circle cx={M.x} cy={M.y} r="4" fill="currentColor" />
		<path d="M{M.x - 28} {M.y}h12M{M.x + 16} {M.y}h12M{M.x} {M.y - 28}v12M{M.x} {M.y + 16}v12" stroke="currentColor" opacity="0.7" />
		<line x1={M.x + 8} y1={M.y + 8} x2={M.x + 70} y2={M.y + 120} stroke="currentColor" opacity="0.5" />
		<text x={M.x + 78} y={M.y + 126} class="t">UNRESOLVED MASS</text>
		<text x={M.x + 78} y={M.y + 144} class="t dim">4.11 × 10²⁰ KG · 0.6 µm</text>

		<!-- Psyche, small and far, on the path. -->
		<circle cx="1272" cy="600" r="5" fill="none" stroke="currentColor" opacity="0.8" />
		<text x="1286" y="604" class="t dim">16 PSYCHE</text>
	</svg>
</div>

<style>
	.art {
		position: absolute;
		inset: 0;
		color: var(--fg);
		pointer-events: none;
		animation: in 2.2s ease-out both;
	}
	svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.t {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.14em;
		fill: currentColor;
		opacity: 0.85;
	}
	.t.dim {
		opacity: 0.5;
	}
	@keyframes in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	/* Narrow screens crop to the middle of the image; slide it so the mass stays in frame. */
	@media (max-width: 760px) {
		svg {
			width: 180%;
			margin-left: -70%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.art {
			animation: none;
		}
	}
</style>
