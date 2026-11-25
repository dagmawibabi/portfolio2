<script lang="ts">
	// A network of agents that all wake on the same beat, and a grid trace that dips each time they do.
	// Moving the cursor through the network jitters the nodes it touches; jitter spreads along links.
	import { onMount } from 'svelte';

	type PulseProbe = { sync: number; hz: number; awake: number; next: number };

	let {
		theme = 'dark',
		onprobe
	}: { theme?: 'dark' | 'light'; onprobe?: (p: PulseProbe) => void } = $props();

	let canvas: HTMLCanvasElement;
	const colors = { fg: '233,232,228', bg: '11,11,11' };
	$effect(() => {
		colors.fg = theme === 'light' ? '18,18,18' : '233,232,228';
		colors.bg = theme === 'light' ? '239,238,233' : '11,11,11';
	});

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const P = 4200; // one "heartbeat" — thirty minutes, compressed

		type N = { x: number; y: number; off: number; jit: boolean; links: number[] };
		let nodes: N[] = [];
		let w = 0;
		let h = 0;
		let raf = 0;
		let visible = true;
		let trace: number[] = [];
		let lastBeat = -1;
		let lowSince = 0;
		let lastProbe = 0;
		const mouse = { x: -1e4, y: -1e4 };

		function build() {
			const count = Math.max(60, Math.min(230, Math.floor((w * h) / 7000)));
			const bandTop = h * 0.08;
			const bandBot = h - 110;
			nodes = Array.from({ length: count }, () => ({
				x: Math.random() * w,
				y: bandTop + Math.random() * (bandBot - bandTop),
				off: 0,
				jit: false,
				links: []
			}));
			for (let i = 0; i < nodes.length; i++) {
				const d = nodes
					.map((n, j) => ({ j, d: (n.x - nodes[i].x) ** 2 + (n.y - nodes[i].y) ** 2 }))
					.filter((o) => o.j !== i)
					.sort((a, b) => a.d - b.d)
					.slice(0, 3)
					.map((o) => o.j);
				nodes[i].links = d;
			}
			trace = new Array(Math.ceil(w / 2)).fill(0);
		}

		function resize() {
			const r = canvas.getBoundingClientRect();
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			w = r.width;
			h = r.height;
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			build();
		}

		const flash = (t: number, n: N) => {
			const ph = (((t + n.off) % P) + P) % P;
			return Math.exp(-ph / 140);
		};

		function jitter(n: N) {
			if (n.jit) return;
			n.jit = true;
			n.off = Math.random() * P;
		}

		function step(t: number) {
			// cursor jitters what it touches
			for (const n of nodes) {
				if ((n.x - mouse.x) ** 2 + (n.y - mouse.y) ** 2 < 70 * 70) jitter(n);
			}
			// on each synced beat, jitter spreads a little along links
			const beat = Math.floor(t / P);
			if (beat !== lastBeat) {
				lastBeat = beat;
				const seeds = nodes.filter((n) => n.jit);
				if (!seeds.length && beat > 2) jitter(nodes[(Math.random() * nodes.length) | 0]);
				for (const n of seeds) for (const j of n.links) if (Math.random() < 0.22) jitter(nodes[j]);
			}
			const synced = nodes.filter((n) => !n.jit).length / nodes.length;
			// a new outbreak once the network has fully desynchronized for a while
			if (synced < 0.03) {
				if (!lowSince) lowSince = t;
				else if (t - lowSince > 7000) {
					for (const n of nodes) {
						n.jit = false;
						n.off = 0;
					}
					lowSince = 0;
				}
			} else lowSince = 0;
			return synced;
		}

		function draw(t: number) {
			const synced = step(t);
			const fg = colors.fg;
			ctx!.fillStyle = `rgb(${colors.bg})`;
			ctx!.fillRect(0, 0, w, h);

			// links
			ctx!.lineWidth = 1;
			for (const n of nodes) {
				const fa = flash(t, n);
				for (const j of n.links) {
					const m = nodes[j];
					const a = 0.06 + ((fa + flash(t, m)) / 2) * 0.32;
					ctx!.strokeStyle = `rgba(${fg},${a})`;
					ctx!.beginPath();
					ctx!.moveTo(n.x, n.y);
					ctx!.lineTo(m.x, m.y);
					ctx!.stroke();
				}
			}
			// nodes
			let awake = 0;
			for (const n of nodes) {
				const f = flash(t, n);
				if (f > 0.25) awake++;
				ctx!.fillStyle = `rgba(${fg},${0.35 + f * 0.65})`;
				const r = 1.4 + f * 2.6;
				if (n.jit) ctx!.fillRect(n.x - r, n.y - r, r * 2, r * 2);
				else {
					ctx!.beginPath();
					ctx!.arc(n.x, n.y, r, 0, Math.PI * 2);
					ctx!.fill();
				}
			}

			// grid trace: synced load swings pull frequency down on every beat
			const ph = (t % P) / P;
			const swing = synced * Math.exp(-ph * 9) * 1;
			const noise = (1 - synced) * (Math.random() - 0.5) * 0.08;
			const hz = 60 - swing * 0.55 + noise;
			trace.push(60 - hz);
			if (trace.length > Math.ceil(w / 2)) trace.shift();

			const base = h - 52;
			ctx!.setLineDash([2, 5]);
			ctx!.strokeStyle = `rgba(${fg},0.22)`;
			ctx!.beginPath();
			ctx!.moveTo(0, base);
			ctx!.lineTo(w, base);
			ctx!.stroke();
			ctx!.setLineDash([]);
			ctx!.strokeStyle = `rgba(${fg},0.85)`;
			ctx!.lineWidth = 1.25;
			ctx!.beginPath();
			for (let i = 0; i < trace.length; i++) {
				const y = base + trace[i] * 60;
				if (i === 0) ctx!.moveTo(i * 2, y);
				else ctx!.lineTo(i * 2, y);
			}
			ctx!.stroke();
			ctx!.fillStyle = `rgba(${fg},0.4)`;
			ctx!.font = '10px "JetBrains Mono", ui-monospace, monospace';
			ctx!.fillText('60.00 HZ', 8, base - 8);

			if (onprobe && t - lastProbe > 120) {
				lastProbe = t;
				onprobe({ sync: synced, hz, awake, next: P - (t % P) });
			}
		}

		function frame(t: number) {
			raf = requestAnimationFrame(frame);
			if (visible && !document.hidden) draw(t);
		}

		const onMove = (e: PointerEvent) => {
			const r = canvas.getBoundingClientRect();
			mouse.x = e.clientX - r.left;
			mouse.y = e.clientY - r.top;
		};
		const onLeave = () => {
			mouse.x = -1e4;
			mouse.y = -1e4;
		};

		resize();
		const ro = new ResizeObserver(() => {
			resize();
			if (reduce) draw(0);
		});
		ro.observe(canvas);
		const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
		io.observe(canvas);

		if (reduce) draw(0);
		else {
			window.addEventListener('pointermove', onMove, { passive: true });
			document.addEventListener('pointerleave', onLeave);
			raf = requestAnimationFrame(frame);
		}

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
			window.removeEventListener('pointermove', onMove);
			document.removeEventListener('pointerleave', onLeave);
		};
	});
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
