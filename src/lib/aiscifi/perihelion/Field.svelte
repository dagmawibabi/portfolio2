<script lang="ts">
	// The packet sky: streams of ice pucks crossing the frame, bent by a mass nobody can see.
	import { onMount } from 'svelte';

	type Probe = { x: number; y: number; dist: number; pull: number; count: number };

	let {
		theme = 'dark',
		onprobe
	}: { theme?: 'dark' | 'light'; onprobe?: (p: Probe) => void } = $props();

	let canvas: HTMLCanvasElement;
	const colors = { fg: '233,232,228', bg: '11,11,11', dirty: true };

	$effect(() => {
		if (theme === 'light') {
			colors.fg = '18,18,18';
			colors.bg = '239,238,233';
		} else {
			colors.fg = '233,232,228';
			colors.bg = '11,11,11';
		}
		colors.dirty = true;
	});

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		type P = { x: number; y: number; vx: number; vy: number; a: number; base: number };
		let ps: P[] = [];
		let w = 0;
		let h = 0;
		let target = 0;
		let running = true;
		let visible = true;
		let raf = 0;
		let lastProbe = 0;
		const mouse = { x: -1e4, y: -1e4, on: false };
		const L = { x: 0, y: 0 };

		const LANES = 9;

		function spawn(initial = false): P {
			const lane = (Math.random() * LANES) | 0;
			const y = h * (0.08 + (lane / (LANES - 1)) * 0.84) + (Math.random() - 0.5) * h * 0.035;
			const base = 0.45 + Math.random() * 0.5 + lane * 0.04;
			return {
				x: initial ? Math.random() * w : -10 - Math.random() * 60,
				y,
				vx: base,
				vy: (0.5 - y / h) * 0.06,
				a: 0.18 + Math.random() * 0.62,
				base
			};
		}

		function resize() {
			const r = canvas.getBoundingClientRect();
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			w = r.width;
			h = r.height;
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			target = Math.min(1100, Math.floor((w * h) / 1300));
			ps = Array.from({ length: target }, () => spawn(true));
			colors.dirty = true;
		}

		function lacuna(t: number) {
			// a slow diagonal fall across the frame, looping every ~80 s
			const k = (t / 80000) % 1;
			L.x = w * (0.92 - 0.62 * k) + Math.sin(t / 9000) * w * 0.02;
			L.y = h * (0.18 + 0.6 * k) + Math.cos(t / 11000) * h * 0.03;
		}

		function frame(t: number) {
			if (!running) return;
			raf = requestAnimationFrame(frame);
			if (!visible) return;

			lacuna(t);
			const fg = colors.fg;
			if (colors.dirty) {
				ctx!.fillStyle = `rgb(${colors.bg})`;
				ctx!.fillRect(0, 0, w, h);
				colors.dirty = false;
			}
			ctx!.fillStyle = `rgba(${colors.bg},0.075)`;
			ctx!.fillRect(0, 0, w, h);

			const G = Math.min(w, h) * 2.4;
			const Gm = Math.min(w, h) * 0.9;
			let near = 0;

			ctx!.lineWidth = 1;
			for (let i = 0; i < ps.length; i++) {
				const p = ps[i];
				let dx = L.x - p.x;
				let dy = L.y - p.y;
				let r2 = dx * dx + dy * dy + 900;
				let r = Math.sqrt(r2);
				let f = G / r2;
				p.vx += (f * dx) / r;
				p.vy += (f * dy) / r;
				if (r < 120) near++;

				if (mouse.on) {
					dx = mouse.x - p.x;
					dy = mouse.y - p.y;
					r2 = dx * dx + dy * dy + 1600;
					r = Math.sqrt(r2);
					f = Gm / r2;
					p.vx += (f * dx) / r;
					p.vy += (f * dy) / r;
				}

				// gentle relaxation back toward the lane's drift
				p.vx += (p.base - p.vx) * 0.004;
				p.vy *= 0.996;
				const sp = Math.hypot(p.vx, p.vy);
				if (sp > 3.2) {
					p.vx *= 3.2 / sp;
					p.vy *= 3.2 / sp;
				}

				const ox = p.x;
				const oy = p.y;
				p.x += p.vx;
				p.y += p.vy;

				ctx!.strokeStyle = `rgba(${fg},${p.a})`;
				ctx!.beginPath();
				ctx!.moveTo(ox, oy);
				ctx!.lineTo(p.x, p.y);
				ctx!.stroke();

				if (p.x > w + 20 || p.x < -80 || p.y < -40 || p.y > h + 40) ps[i] = spawn();
			}

			// a faint marker where the residuals converge
			const pulse = 0.5 + 0.5 * Math.sin(t / 700);
			ctx!.strokeStyle = `rgba(${fg},${0.1 + pulse * 0.12})`;
			ctx!.setLineDash([2, 4]);
			ctx!.beginPath();
			ctx!.arc(L.x, L.y, 18 + pulse * 4, 0, Math.PI * 2);
			ctx!.stroke();
			ctx!.setLineDash([]);
			ctx!.beginPath();
			ctx!.moveTo(L.x - 4, L.y);
			ctx!.lineTo(L.x + 4, L.y);
			ctx!.moveTo(L.x, L.y - 4);
			ctx!.lineTo(L.x, L.y + 4);
			ctx!.stroke();
			ctx!.fillStyle = `rgba(${fg},0.32)`;
			ctx!.font = '10px "JetBrains Mono", ui-monospace, monospace';
			ctx!.fillText('UNRESOLVED MASS', L.x + 28, L.y - 4);
			ctx!.fillText('4.11E20 KG', L.x + 28, L.y + 9);

			if (onprobe && t - lastProbe > 90) {
				lastProbe = t;
				const mx = mouse.on ? mouse.x : w / 2;
				const my = mouse.on ? mouse.y : h / 2;
				const d = Math.hypot(L.x - mx, L.y - my);
				onprobe({ x: mx / w, y: my / h, dist: d, pull: G / (d * d + 900), count: near });
			}
		}

		function staticFrame() {
			ctx!.fillStyle = `rgb(${colors.bg})`;
			ctx!.fillRect(0, 0, w, h);
			lacuna(30000);
			for (let s = 0; s < 220; s++) {
				for (const p of ps) {
					const dx = L.x - p.x;
					const dy = L.y - p.y;
					const r2 = dx * dx + dy * dy + 900;
					const r = Math.sqrt(r2);
					const f = (Math.min(w, h) * 2.4) / r2;
					p.vx += (f * dx) / r;
					p.vy += (f * dy) / r;
					p.x += p.vx;
					p.y += p.vy;
					if (s > 200) {
						ctx!.fillStyle = `rgba(${colors.fg},${p.a * 0.6})`;
						ctx!.fillRect(p.x, p.y, 1, 1);
					}
				}
			}
		}

		const onMove = (e: PointerEvent) => {
			const r = canvas.getBoundingClientRect();
			mouse.x = e.clientX - r.left;
			mouse.y = e.clientY - r.top;
			mouse.on = mouse.y >= 0 && mouse.y <= r.height;
		};
		const onLeave = () => (mouse.on = false);
		const onVis = () => {
			running = !document.hidden;
			cancelAnimationFrame(raf);
			if (running) raf = requestAnimationFrame(frame);
		};

		resize();
		const ro = new ResizeObserver(() => {
			resize();
			if (reduce) staticFrame();
		});
		ro.observe(canvas);

		const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
		io.observe(canvas);

		if (reduce) {
			staticFrame();
		} else {
			window.addEventListener('pointermove', onMove, { passive: true });
			document.addEventListener('pointerleave', onLeave);
			document.addEventListener('visibilitychange', onVis);
			raf = requestAnimationFrame(frame);
		}

		return () => {
			running = false;
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
			window.removeEventListener('pointermove', onMove);
			document.removeEventListener('pointerleave', onLeave);
			document.removeEventListener('visibilitychange', onVis);
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
