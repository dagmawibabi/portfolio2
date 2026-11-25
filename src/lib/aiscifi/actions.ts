// Small DOM actions for /aiscifi micro-interactions.

const GLYPHS = '▓▒░█<>/\\|=+*#%_01ΔΣΛ';

const reduced = () =>
	typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Decode effect: characters resolve left-to-right out of noise.
 * Use on monospace text so widths stay stable.
 */
export function scramble(
	node: HTMLElement,
	opts: { delay?: number; duration?: number; hover?: boolean; onMount?: boolean } = {}
) {
	const final = node.textContent ?? '';
	node.setAttribute('aria-label', final);
	let raf = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;

	function run() {
		if (reduced()) {
			node.textContent = final;
			return;
		}
		cancelAnimationFrame(raf);
		const dur = opts.duration ?? 650;
		const start = performance.now();
		const step = (t: number) => {
			const p = Math.min(1, (t - start) / dur);
			let out = '';
			for (let i = 0; i < final.length; i++) {
				const ch = final[i];
				if (ch === ' ' || p >= 0.15 + (i / final.length) * 0.85) out += ch;
				else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
			}
			node.textContent = out;
			if (p < 1) raf = requestAnimationFrame(step);
		};
		raf = requestAnimationFrame(step);
	}

	if (opts.onMount !== false) timer = setTimeout(run, opts.delay ?? 0);
	const target = (node.closest('a, button') as HTMLElement | null) ?? node;
	const onEnter = () => run();
	if (opts.hover) target.addEventListener('pointerenter', onEnter);

	return {
		destroy() {
			cancelAnimationFrame(raf);
			clearTimeout(timer);
			if (opts.hover) target.removeEventListener('pointerenter', onEnter);
			node.textContent = final;
		}
	};
}

/** Adds `.in` once the element scrolls into view. */
export function reveal(node: HTMLElement, opts: { margin?: string } = {}) {
	if (reduced() || typeof IntersectionObserver === 'undefined') {
		node.classList.add('in');
		return {};
	}
	const done = () => {
		node.classList.add('in');
		io.disconnect();
		window.removeEventListener('scroll', check);
	};
	// Also catch elements the reader jumped past (resume, anchors, fast scroll).
	const check = () => {
		if (node.getBoundingClientRect().top < window.innerHeight * 0.92) done();
	};
	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) if (e.isIntersecting) done();
		},
		{ rootMargin: opts.margin ?? '0px 0px -8% 0px' }
	);
	io.observe(node);
	window.addEventListener('scroll', check, { passive: true });
	return {
		destroy() {
			io.disconnect();
			window.removeEventListener('scroll', check);
		}
	};
}
