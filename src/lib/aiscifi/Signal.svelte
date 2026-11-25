<script lang="ts">
	// A slow terrain of signal lines. The cursor raises a ridge where it passes.
	import { onMount } from 'svelte';

	let { theme = 'dark' }: { theme?: 'dark' | 'light' } = $props();

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
		let w = 0;
		let h = 0;
		let raf = 0;
		let visible = true;
		const mouse = { x: -1e4, y: -1e4, k: 0, tk: 0 };

		function resize() {
			const r = canvas.getBoundingClientRect();
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			w = r.width;
			h = r.height;
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		function draw(t: number) {
			const s = t / 1000;
			ctx!.fillStyle = `rgb(${colors.bg})`;
			ctx!.fillRect(0, 0, w, h);

			const gap = w < 640 ? 11 : 14;
			const top = h * 0.16;
			const bottom = h * 0.98;
			const rows = Math.floor((bottom - top) / gap);
			const step = w < 640 ? 5 : 6;
			const cx = w * 0.62;
			const spread = w * 0.26;
			mouse.k += (mouse.tk - mouse.k) * 0.06;

			ctx!.lineWidth = 1;
			for (let r = 0; r < rows; r++) {
				const base = top + r * gap;
				const depth = r / rows;
				const amp = gap * (2.2 + depth * 3.2);
				ctx!.beginPath();
				let first = true;
				for (let x = -step; x <= w + step; x += step) {
					const env = Math.exp(-((x - cx) ** 2) / (2 * spread * spread));
					const n =
						Math.sin(x * 0.011 + s * 0.5 + r * 0.31) * 0.45 +
						Math.sin(x * 0.027 - s * 0.8 + r * 0.17) * 0.3 +
						Math.sin(x * 0.053 + s * 1.1 - r * 0.53) * 0.25;
					let y = base - Math.max(0, n + 0.35) * amp * env;
					// cursor ridge
					const dx = x - mouse.x;
					const dy = base - mouse.y;
					const bump = Math.exp(-(dx * dx) / 2600 - (dy * dy) / 5200) * gap * 3.4 * mouse.k;
					y -= bump;
					if (first) {
						ctx!.moveTo(x, y);
						first = false;
					} else ctx!.lineTo(x, y);
				}
				// occlude the rows behind
				ctx!.lineTo(w + step, h);
				ctx!.lineTo(-step, h);
				ctx!.closePath();
				ctx!.fillStyle = `rgb(${colors.bg})`;
				ctx!.fill();
				ctx!.strokeStyle = `rgba(${colors.fg},${0.12 + depth * 0.5})`;
				ctx!.stroke();
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
			mouse.tk = mouse.y > 0 && mouse.y < r.height ? 1 : 0;
		};
		const onLeave = () => (mouse.tk = 0);

		resize();
		const ro = new ResizeObserver(() => {
			resize();
			if (reduce) draw(12000);
		});
		ro.observe(canvas);
		const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
		io.observe(canvas);

		if (reduce) draw(12000);
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
