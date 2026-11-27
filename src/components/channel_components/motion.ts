// Tiny motion helpers for the channel pages: reveal-on-scroll and a cursor-follow glow.

const reduced = () =>
	typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

let io: IntersectionObserver | null = null;
function observer() {
	io ??= new IntersectionObserver(
		(entries) => {
			for (const e of entries)
				if (e.isIntersecting) {
					(e.target as HTMLElement).dataset.shown = '';
					io!.unobserve(e.target);
				}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
	);
	return io;
}

/** Fades/lifts an element in the first time it scrolls into view. `delay` is in ms. */
export function reveal(node: HTMLElement, delay = 0) {
	node.dataset.reveal = '';
	node.style.setProperty('--reveal-delay', `${delay}ms`);
	if (reduced()) {
		node.dataset.shown = '';
		return {};
	}
	observer().observe(node);
	return { destroy: () => io?.unobserve(node) };
}

/** Writes the pointer position into --mx / --my so CSS can draw a soft spotlight. */
export function spotlight(node: HTMLElement) {
	const move = (e: PointerEvent) => {
		const r = node.getBoundingClientRect();
		node.style.setProperty('--mx', `${e.clientX - r.left}px`);
		node.style.setProperty('--my', `${e.clientY - r.top}px`);
	};
	node.addEventListener('pointermove', move);
	return { destroy: () => node.removeEventListener('pointermove', move) };
}

/** Counts a number up from 0 when it first comes into view. */
export function countUp(node: HTMLElement, opts: { to: number; format?: (n: number) => string }) {
	const fmt = opts.format ?? ((n: number) => Math.round(n).toLocaleString());
	if (reduced()) {
		node.textContent = fmt(opts.to);
		return {};
	}
	node.textContent = fmt(0);
	let raf = 0;
	const obs = new IntersectionObserver(([e]) => {
		if (!e.isIntersecting) return;
		obs.disconnect();
		const start = performance.now();
		const dur = 1400;
		const tick = (t: number) => {
			const p = Math.min(1, (t - start) / dur);
			const eased = 1 - Math.pow(1 - p, 4);
			node.textContent = fmt(opts.to * eased);
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
	});
	obs.observe(node);
	return {
		destroy() {
			obs.disconnect();
			cancelAnimationFrame(raf);
		}
	};
}
