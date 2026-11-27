<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { postUrl, fmtDate, hash, compact, parseDate } from '$lib/channel';
	import type { Verse } from './+page.server';
	import ShareDialog from '../../components/goodnight/share_dialog.svelte';
	import type { CardVerse } from '$lib/goodnight/share-card';

	let { data } = $props();
	const verses = $derived(data.verses as Verse[]);
	const tonight = $derived(verses.find((v) => v.text) ?? verses[0]);
	// № of each verse, counting up from the very first one
	const number = $derived(new Map(verses.map((v, i) => [v.id, verses.length - i])));

	// ---------- stats ----------
	const firstYear = $derived(verses.at(-1)?.date.slice(0, 4) ?? '');
	const amPct = $derived(
		Math.round((verses.filter((v) => v.lang === 'am').length / Math.max(verses.length, 1)) * 100)
	);
	const loves = $derived(verses.reduce((a, v) => a + v.reactions, 0));

	// Count-up on load. SSR renders the final values; the client rewinds and counts.
	let countT = $state(1);
	const ease = (t: number) => 1 - Math.pow(1 - t, 4);
	const stats = $derived([
		{ label: 'Verses', value: Math.round(verses.length * ease(countT)).toLocaleString() },
		{ label: 'Since', value: firstYear },
		{ label: 'Amharic', value: `${Math.round(amPct * ease(countT))}%` },
		{ label: 'Reactions', value: compact.format(Math.round(loves * ease(countT))) }
	]);

	// ---------- nights calendar: one cell per week, one row per year ----------
	type Cell = { count: number; first: Verse | null; week: number; future: boolean; label: string };
	const calendar = $derived.by(() => {
		const now = new Date();
		const rows = new Map<string, Cell[]>();
		const weekOf = (d: Date) => {
			const jan1 = new Date(d.getFullYear(), 0, 1);
			const doy = Math.floor((d.getTime() - jan1.getTime()) / 86400000);
			return Math.min(52, Math.floor((doy + jan1.getDay()) / 7));
		};
		const blank = (year: number): Cell[] =>
			Array.from({ length: 53 }, (_, w) => {
				const jan1 = new Date(year, 0, 1);
				const start = new Date(year, 0, 1 + w * 7 - jan1.getDay());
				return {
					count: 0,
					first: null,
					week: w,
					future: start > now,
					label: start.toLocaleDateString('en', { month: 'short', day: 'numeric' })
				};
			});
		for (const v of verses) {
			const d = parseDate(v.date);
			const y = String(d.getFullYear());
			if (!rows.has(y)) rows.set(y, blank(d.getFullYear()));
			const cell = rows.get(y)![weekOf(d)];
			cell.count++;
			cell.first = v; // verses are newest-first, so this ends on the week's first night
		}
		return [...rows.entries()].sort((a, b) => +b[0] - +a[0]);
	});
	const level = (n: number) => (n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n < 5 ? 3 : 4);
	let tip = $state<{ text: string; x: number; y: number } | null>(null);
	let calEl: HTMLDivElement | undefined = $state();
	function showTip(e: Event, cell: Cell, year: string) {
		if (!calEl) return;
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const box = calEl.getBoundingClientRect();
		const n = cell.count;
		tip = {
			text: `${n} verse${n === 1 ? '' : 's'} · week of ${cell.label}, ${year}`,
			x: r.left - box.left + r.width / 2,
			y: r.top - box.top
		};
	}

	// ---------- ticker of recent references ----------
	const ticker = $derived(verses.filter((v) => v.ref).slice(0, 36));

	let ago = $state('');
	let heroLabel = $state('Tonight');

	// ---------- hero words ----------
	const words = $derived((tonight?.text ?? '').split(/\s+/).filter(Boolean));

	// ---------- filters ----------
	let lang = $state<'all' | 'am' | 'en'>('all');
	let query = $state('');
	let searchOpen = $state(false);
	let searchEl: HTMLInputElement | undefined = $state();

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return verses.filter(
			(v) =>
				(lang === 'all' || v.lang === lang) &&
				(!q || v.text.toLowerCase().includes(q) || (v.ref ?? '').toLowerCase().includes(q))
		);
	});
	const byYear = $derived.by(() => {
		const groups: { year: string; items: Verse[] }[] = [];
		for (const v of filtered) {
			const y = v.date.slice(0, 4);
			if (groups.at(-1)?.year !== y) groups.push({ year: y, items: [] });
			groups.at(-1)!.items.push(v);
		}
		return groups;
	});

	// Masonry that reads across rows: verse i goes to column i % n.
	let ncols = $state(3);
	function columnsOf<T>(items: T[], n: number) {
		const cols: T[][] = Array.from({ length: n }, () => []);
		items.forEach((it, i) => cols[i % n].push(it));
		return cols;
	}
	function measure() {
		const w = window.innerWidth;
		ncols = w < 680 ? 1 : w < 1080 ? 2 : w < 1600 ? 3 : 4;
	}

	// Shorter verses get bigger type, so the wall has rhythm.
	function size(v: Verse) {
		const n = v.text.length;
		if (n < 70) return 'xl';
		if (n < 140) return 'lg';
		if (n < 260) return 'md';
		return 'sm';
	}

	// ---------- sky: a few deterministic stars, so SSR and client agree ----------
	const stars = Array.from({ length: 64 }, (_, i) => {
		const h = hash(i * 7919 + 17);
		return {
			x: (h % 1000) / 10,
			y: ((h >>> 10) % 1000) / 10,
			s: 1 + ((h >>> 4) % 3) * 0.5,
			delay: ((h >>> 7) % 90) / 10,
			dur: 3 + ((h >>> 3) % 50) / 10
		};
	});

	// ---------- segmented control: sliding pill ----------
	let segEl: HTMLDivElement | undefined = $state();
	let pill = $state({ x: 0, w: 0 });
	function placePill() {
		const b = segEl?.querySelector<HTMLElement>(`[data-v="${lang}"]`);
		if (b) pill = { x: b.offsetLeft, w: b.offsetWidth };
	}
	$effect(() => {
		lang;
		placePill();
	});
	// re-measure whenever the control's size changes (fonts arriving, layout settling)
	$effect(() => {
		if (!segEl || typeof ResizeObserver === 'undefined') return;
		const ro = new ResizeObserver(placePill);
		ro.observe(segEl);
		return () => ro.disconnect();
	});

	// ---------- reveal on scroll (one shared observer) ----------
	let io: IntersectionObserver | undefined;
	function reveal(node: HTMLElement) {
		if (typeof IntersectionObserver === 'undefined') return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		io ??= new IntersectionObserver(
			(entries) => {
				for (const e of entries)
					if (e.isIntersecting) {
						e.target.classList.add('in');
						io!.unobserve(e.target);
					}
			},
			{ rootMargin: '0px 0px -8% 0px' }
		);
		node.classList.add('rv');
		io.observe(node);
		return { destroy: () => io?.unobserve(node) };
	}

	// ---------- current year in the bar ----------
	let currentYear = $state('');
	let yearIo: IntersectionObserver | undefined;
	function trackYear(node: HTMLElement, year: string) {
		if (typeof IntersectionObserver === 'undefined') return;
		yearIo ??= new IntersectionObserver(
			(entries) => {
				for (const e of entries)
					if (e.isIntersecting) currentYear = (e.target as HTMLElement).dataset.year ?? '';
			},
			{ rootMargin: '-45% 0px -55% 0px' }
		);
		node.dataset.year = year;
		yearIo.observe(node);
		return { destroy: () => yearIo?.unobserve(node) };
	}

	// ---------- drift (slow auto-scroll) ----------
	let drifting = $state(false);
	let raf = 0;
	let acc = 0;
	function step() {
		acc += 0.45;
		if (acc >= 1) {
			window.scrollBy(0, Math.floor(acc));
			acc -= Math.floor(acc);
		}
		if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) drifting = false;
		if (drifting) raf = requestAnimationFrame(step);
	}
	function toggleDrift() {
		drifting = !drifting;
		cancelAnimationFrame(raf);
		if (drifting) raf = requestAnimationFrame(step);
	}
	function stopDrift() {
		if (!drifting) return;
		drifting = false;
		cancelAnimationFrame(raf);
	}

	// ---------- random verse ----------
	let highlighted = $state<number | null>(null);
	let hlTimer: ReturnType<typeof setTimeout>;
	function surprise() {
		const pool = filtered.filter((v) => v.text);
		if (!pool.length) return;
		const v = pool[Math.floor(Math.random() * pool.length)];
		stopDrift();
		const el = document.getElementById(`v${v.id}`);
		el?.classList.add('in');
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		highlighted = null;
		tick().then(() => (highlighted = v.id));
		clearTimeout(hlTimer);
		hlTimer = setTimeout(() => (highlighted = null), 3200);
	}

	// ---------- jump to a verse (from the calendar, ticker or a link) ----------
	async function jumpTo(id: number) {
		stopDrift();
		if (!filtered.some((v) => v.id === id)) {
			query = '';
			lang = 'all';
			searchOpen = false;
			await tick();
		}
		const el = document.getElementById(`v${id}`);
		el?.classList.add('in');
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		highlighted = null;
		await tick();
		highlighted = id;
		clearTimeout(hlTimer);
		hlTimer = setTimeout(() => (highlighted = null), 3200);
	}

	// ---------- years menu ----------
	let yearsOpen = $state(false);
	let yearsEl: HTMLDivElement | undefined = $state();
	const yearMax = $derived(Math.max(1, ...byYear.map((g) => g.items.length)));
	function goYear(y: string) {
		yearsOpen = false;
		stopDrift();
		document.getElementById(`y${y}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
	function onDocClick(e: MouseEvent) {
		if (yearsOpen && yearsEl && !yearsEl.contains(e.target as Node)) yearsOpen = false;
	}

	// ---------- share card ----------
	let shareOpen = $state(false);
	let shareVerse = $state<CardVerse | null>(null);
	function openShare(v: Verse) {
		stopDrift();
		shareVerse = {
			id: v.id,
			text: v.text,
			ref: v.ref,
			date: fmtDate(v.date),
			lang: v.lang,
			n: number.get(v.id) ?? 0
		};
		shareOpen = true;
	}

	// ---------- copy ----------
	let copied = $state<number | null>(null);
	let toast = $state('');
	let toastTimer: ReturnType<typeof setTimeout>;
	async function copy(v: Verse) {
		const body = [v.text, v.ref && `— ${v.ref}`].filter(Boolean).join('\n');
		try {
			await navigator.clipboard.writeText(body);
			copied = v.id;
			toast = 'Copied to clipboard';
		} catch {
			toast = 'Couldn’t copy';
		}
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => ((toast = ''), (copied = null)), 1800);
	}

	// ---------- scroll + pointer ----------
	let scrolled = $state(false);
	let progress = $state(0);

	onMount(() => {
		const prev = document.body.style.background;
		document.body.style.background = '#0a0a0a';
		measure();
		placePill();
		if (tonight) {
			const posted = parseDate(tonight.date);
			const today = new Date();
			const days = Math.round(
				(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() -
					new Date(posted.getFullYear(), posted.getMonth(), posted.getDate()).getTime()) /
					86400000
			);
			ago = days <= 0 ? '' : days === 1 ? 'last night' : `${days} nights ago`;
			heroLabel = days <= 0 ? 'Tonight' : 'Latest';
		}
		document.fonts?.ready.then(placePill);

		const onResize = () => (measure(), placePill());
		const onScroll = () => {
			const y = window.scrollY;
			scrolled = y > window.innerHeight * 0.55;
			const max = document.documentElement.scrollHeight - window.innerHeight;
			progress = max > 0 ? y / max : 0;
		};
		onScroll();
		window.addEventListener('resize', onResize);
		window.addEventListener('scroll', onScroll, { passive: true });

		// count the stats up
		let countRaf = 0;
		if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
			countT = 0;
			const start = performance.now() + 700;
			const run = (now: number) => {
				countT = Math.min(1, Math.max(0, (now - start) / 1600));
				if (countT < 1) countRaf = requestAnimationFrame(run);
			};
			countRaf = requestAnimationFrame(run);
		}

		// a hash like #v44731 jumps to and highlights that verse
		const m = location.hash.match(/^#v(\d+)$/);
		if (m) {
			highlighted = +m[1];
			setTimeout(() => {
				const el = document.getElementById(`v${m[1]}`);
				el?.classList.add('in');
				el?.scrollIntoView({ block: 'center' });
			}, 50);
		}

		return () => {
			document.body.style.background = prev;
			window.removeEventListener('resize', onResize);
			window.removeEventListener('scroll', onScroll);
			cancelAnimationFrame(raf);
			cancelAnimationFrame(countRaf);
			io?.disconnect();
			yearIo?.disconnect();
		};
	});

	function openSearch() {
		searchOpen = true;
		setTimeout(() => searchEl?.focus(), 0);
	}
	function clearAll() {
		query = '';
		lang = 'all';
		searchOpen = false;
	}
	function onKey(e: KeyboardEvent) {
		const typing = (e.target as HTMLElement)?.tagName === 'INPUT';
		if (shareOpen) return;
		if (e.key === '/' && !typing) {
			e.preventDefault();
			openSearch();
		} else if (e.key === 'Escape') {
			stopDrift();
			yearsOpen = false;
			if (typing) {
				query = '';
				searchOpen = false;
				(e.target as HTMLInputElement).blur();
			}
		} else if (e.key === ' ' && !typing && e.shiftKey) {
			e.preventDefault();
			toggleDrift();
		} else if (e.key.toLowerCase() === 'r' && !typing && !e.metaKey && !e.ctrlKey) {
			surprise();
		}
	}
</script>

<svelte:window onkeydown={onKey} onwheel={stopDrift} ontouchstart={stopDrift} onclick={onDocClick} />

<svelte:head>
	<title>Good night — {verses.length.toLocaleString()} verses · Dagmawi Babi</title>
	<meta
		name="description"
		content="Every #Scripture verse shared on Dagmawi Babi's Telegram channel since {firstYear}, one good night at a time."
	/>
	<meta name="theme-color" content="#0a0a0a" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400&family=Noto+Sans+Ethiopic:wght@300;400;500&family=Noto+Serif+Ethiopic:wght@300;400&display=swap"
	/>
</svelte:head>

<div class="gn">
	<div class="sky" aria-hidden="true">
		{#each stars as s, i (i)}
			<span
				class="star"
				style="left:{s.x}%;top:{s.y}%;--s:{s.s}px;animation-delay:-{s.delay}s;animation-duration:{s.dur}s"
			></span>
		{/each}
		<div class="grain"></div>
	</div>

	<!-- top bar -->
	<header class="bar" class:solid={scrolled} style="--p:{progress}">
		<div class="brand">
			<a href="/" class="home" aria-label="Back to dagmawibabi.com">
				<svg class="arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"
					><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.4" /></svg
				>
				<span>Dagmawi Babi</span>
			</a>
			<span class="crumb">
				<span class="slash">/</span>
				<span class="crumb-roll">
					{#key scrolled && currentYear ? currentYear : 'goodnight'}
						<span in:fly={{ y: 10, duration: 380, easing: cubicOut }}
							>{scrolled && currentYear ? currentYear : 'goodnight'}</span
						>
					{/key}
				</span>
			</span>
		</div>

		<div class="controls">
			<div class="seg" role="group" aria-label="Language" bind:this={segEl}>
				<span class="pill" style="--x:{pill.x}px;--w:{pill.w}px" class:ready={pill.w > 0}></span>
				<button data-v="all" class:on={lang === 'all'} onclick={() => (lang = 'all')}>All</button>
				<button data-v="am" class:on={lang === 'am'} onclick={() => (lang = 'am')} class="eth"
					>አማ</button
				>
				<button data-v="en" class:on={lang === 'en'} onclick={() => (lang = 'en')}>En</button>
			</div>

			<div class="years" bind:this={yearsEl}>
				<button
					class="years-btn"
					class:open={yearsOpen}
					onclick={() => (yearsOpen = !yearsOpen)}
					aria-expanded={yearsOpen}
					aria-haspopup="true"
					title="Jump to a year"
				>
					<span class="crumb-roll">
						{#key currentYear && scrolled ? currentYear : 'Years'}
							<span in:fly={{ y: 10, duration: 380, easing: cubicOut }}
								>{currentYear && scrolled ? currentYear : 'Years'}</span
							>
						{/key}
					</span>
					<svg class="chev" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"
						><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" /></svg
					>
				</button>
				{#if yearsOpen}
					<div class="years-menu" role="menu" transition:fly={{ y: -6, duration: 260, easing: cubicOut }}>
						{#each byYear as g, i (g.year)}
							<button
								role="menuitem"
								class:on={g.year === currentYear && scrolled}
								onclick={() => goYear(g.year)}
								style="--i:{i}"
							>
								<span class="y">{g.year}</span>
								<span class="ybar"><span style="--w:{(g.items.length / yearMax) * 100}%"></span></span>
								<span class="yn">{g.items.length}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<div class="search" class:open={searchOpen || query}>
				<button class="search-btn" onclick={openSearch} aria-label="Search (/)" title="Search (/)">
					<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"
						><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg
					>
				</button>
				<input
					bind:this={searchEl}
					bind:value={query}
					onblur={() => !query && (searchOpen = false)}
					placeholder="Search verses or books"
					aria-label="Search verses"
					tabindex={searchOpen || query ? 0 : -1}
				/>
				{#if query}
					<button class="x" onclick={clearAll} aria-label="Clear search">×</button>
				{:else}
					<kbd>/</kbd>
				{/if}
			</div>

			<button class="icon dice" onclick={surprise} aria-label="Random verse (R)" title="Random verse (R)">
				<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5"
					><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="9" cy="9" r="1" fill="currentColor" /><circle
						cx="15"
						cy="15"
						r="1"
						fill="currentColor"
					/><circle cx="15" cy="9" r="1" fill="currentColor" /><circle cx="9" cy="15" r="1" fill="currentColor" /></svg
				>
			</button>

			<button
				class="drift"
				class:on={drifting}
				onclick={toggleDrift}
				aria-pressed={drifting}
				title="Slowly drift through the wall (Shift + Space)"
			>
				<span class="dot"></span><span class="drift-label">{drifting ? 'Drifting' : 'Drift'}</span>
			</button>
		</div>
		<span class="progress" aria-hidden="true"></span>
	</header>

	<!-- hero: tonight's verse + every night so far -->
	{#if tonight}
		<section class="hero">
			<div class="hero-grid">
				<div class="hero-main">
					<p class="eyebrow">
						<span class="live"></span>
						{heroLabel} <span class="sep">—</span>
						{fmtDate(tonight.date)}
						{#if ago}<span class="sep">·</span> <span class="ago">{ago}</span>{/if}
					</p>

					<blockquote class="tonight" class:eth={tonight.lang === 'am'}>
						{#each words as w, i (i)}<span class="w" style="--i:{Math.min(i, 40)}">{w}</span>{' '}{/each}
					</blockquote>

					<div class="hero-foot" style="--i:{Math.min(words.length, 40)}">
						{#if tonight.ref}<p class="tonight-ref" class:eth={tonight.lang === 'am'}>{tonight.ref}</p>{/if}
						<div class="hero-acts">
							<button class="chip solid" onclick={() => openShare(tonight)}>
								<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4"
									><path d="M8 2v8M5 5l3-3 3 3M3 9v4h10V9" /></svg
								>
								Share card
							</button>
							<button class="chip" onclick={() => copy(tonight)}>
								{copied === tonight.id ? 'Copied' : 'Copy'}
							</button>
							<a class="chip" href={postUrl(tonight.id)} target="_blank" rel="noopener noreferrer">
								Telegram <span class="ne">↗</span>
							</a>
						</div>
					</div>
				</div>

				<aside class="nights" aria-label="Every night a verse was shared">
					<header class="nights-head">
						<p>Every night since {firstYear}</p>
						<span class="legend" aria-hidden="true">
							less
							{#each [0, 1, 2, 3, 4] as l (l)}<i class="cell l{l}"></i>{/each}
							more
						</span>
					</header>

					<div class="cal" bind:this={calEl} onpointerleave={() => (tip = null)} role="presentation">
						{#each calendar as [year, cells], r (year)}
							<div class="cal-row">
								<button class="cal-year" onclick={() => goYear(year)} title="Jump to {year}">{year}</button>
								<div class="cells">
									{#each cells as cell (cell.week)}
										{#if cell.count && cell.first}
											{@const first = cell.first}
											<button
												class="cell l{level(cell.count)}"
												style="--c:{cell.week};--r:{r}"
												onpointerenter={(e) => showTip(e, cell, year)}
												onfocus={(e) => showTip(e, cell, year)}
												onblur={() => (tip = null)}
												onclick={() => jumpTo(first.id)}
												aria-label="{cell.count} verses, week of {cell.label} {year}"
											></button>
										{:else}
											<span class="cell l0" class:future={cell.future} style="--c:{cell.week};--r:{r}"></span>
										{/if}
									{/each}
								</div>
							</div>
						{/each}
						{#if tip}
							<div class="tip" style="left:{tip.x}px;top:{tip.y}px">{tip.text}</div>
						{/if}
					</div>

					<dl class="stats">
						{#each stats as s (s.label)}
							<div><dt>{s.label}</dt><dd>{s.value}</dd></div>
						{/each}
					</dl>
				</aside>
			</div>

			<div class="ticker" aria-label="Recent references">
				<div class="ticker-track">
					{#each [0, 1] as k (k)}
						{#each ticker as v (`${k}-${v.id}`)}
							<button
								class:eth={v.lang === 'am'}
								onclick={() => jumpTo(v.id)}
								tabindex={k ? -1 : 0}
								aria-hidden={k ? 'true' : undefined}>{v.ref}</button
							><span class="tdot" aria-hidden="true">✦</span>
						{/each}
					{/each}
				</div>
			</div>

			<a class="cue" href="#wall" aria-label="Scroll to all verses">
				<span>All verses</span>
				<span class="cue-line"></span>
			</a>
		</section>
	{/if}

	<!-- the wall -->
	<main class="wall" id="wall">
		{#if query || lang !== 'all'}
			<p class="result">
				<span class="n">{filtered.length.toLocaleString()}</span>
				verse{filtered.length === 1 ? '' : 's'}
				{#if query}matching “{query}”{/if}
				<button onclick={clearAll}>Clear</button>
			</p>
		{/if}

		{#each byYear as g (g.year)}
			<section class="year" id="y{g.year}" use:trackYear={g.year}>
				<h2 class="year-head" use:reveal>
					<span class="yr">{g.year}</span>
					<span class="rule"></span>
					<small>{g.items.length} {g.items.length === 1 ? 'verse' : 'verses'}</small>
				</h2>
				<div class="cols">
					{#each columnsOf(g.items, ncols) as col, ci (ci)}
						<div class="col">
							{#each col as v (v.id)}
								<article
									id="v{v.id}"
									class="verse {size(v)}"
									class:eth={v.lang === 'am'}
									class:hl={highlighted === v.id}
									style="--d:{ci * 70}ms"
									use:reveal
								>
									<header class="v-top">
										<span>№ {String(number.get(v.id)).padStart(4, '0')}</span>
										<time datetime={v.date}>{fmtDate(v.date)}</time>
									</header>
									<p class="text">{v.text}</p>
									<footer class="v-foot">
										<span class="ref">{v.ref ?? ''}</span>
										<span class="acts">
											<button
												onclick={() => openShare(v)}
												aria-label="Make a share card"
												title="Share card"
											>
												<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"
													><path d="M8 2v8M5 5l3-3 3 3M3 9v4h10V9" /></svg
												>
											</button>
											<button
													onclick={() => copy(v)}
													aria-label="Copy verse"
													title="Copy"
													class:done={copied === v.id}
												>
													{#if copied === v.id}
														<svg viewBox="0 0 16 16" width="13" height="13"
															><path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.5" /></svg
														>
													{:else}
														<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"
															><rect x="5" y="5" width="8" height="8" rx="1.5" /><path d="M3 10.5V4a1 1 0 0 1 1-1h6.5" /></svg
														>
													{/if}
												</button>
											<a
												href={postUrl(v.id)}
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Open post on Telegram"
												title="Open on Telegram"
											>
												<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"
													><path d="M5 11 11 5M6 5h5v5" /></svg
												>
											</a>
										</span>
									</footer>
								</article>
							{/each}
						</div>
					{/each}
				</div>
			</section>
		{:else}
			<p class="empty">Nothing matches that. Try a book like “መዝሙር” or “Psalm”.</p>
		{/each}

		<footer class="end" use:reveal>
			<div class="moon" aria-hidden="true"></div>
			<p class="eth bye">ደህና እደሩ</p>
			<p class="credit">
				Every verse here was first a good-night post on
				<a href="https://t.me/Dagmawi_Babi" target="_blank" rel="noopener noreferrer">@Dagmawi_Babi</a>
			</p>
		</footer>
	</main>

	<ShareDialog bind:open={shareOpen} verse={shareVerse} />

	{#if toast}
		<div class="toast" role="status" transition:fly={{ y: 16, duration: 260, easing: cubicOut }}>
			<svg viewBox="0 0 16 16" width="13" height="13"
				><path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.6" /></svg
			>
			{toast}
		</div>
	{/if}
</div>

<style>
	.gn {
		--bg: #0a0a0a;
		--ink: #f2f2f2;
		--ink-2: #c8c8c8;
		--mute: #7a7a7a;
		--faint: #3a3a3a;
		--line: #1c1c1c;
		--line-2: #2a2a2a;
		--sans: 'Geist', ui-sans-serif, system-ui, sans-serif;
		--mono: 'Geist Mono', ui-monospace, monospace;
		--serif: 'Newsreader', Georgia, serif;
		--out: cubic-bezier(0.22, 1, 0.36, 1);
		position: relative;
		min-height: 100vh;
		color: var(--ink);
		background: var(--bg);
		font-family: var(--serif);
		overflow-x: clip;
		-webkit-font-smoothing: antialiased;
	}
	.gn ::selection {
		background: var(--ink);
		color: var(--bg);
	}
	.eth {
		font-family: 'Noto Serif Ethiopic', var(--serif);
	}
	button {
		cursor: pointer;
	}
	:focus-visible {
		outline: 1px solid var(--ink);
		outline-offset: 3px;
	}

	/* ---------- sky ---------- */
	.sky {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}
	.star {
		position: absolute;
		width: var(--s);
		height: var(--s);
		border-radius: 50%;
		background: #fff;
		opacity: 0.08;
		animation: twinkle ease-in-out infinite;
	}
	@keyframes twinkle {
		50% {
			opacity: 0.55;
		}
	}
	.grain {
		position: absolute;
		inset: -50%;
		opacity: 0.05;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
	}

	/* ---------- bar ---------- */
	.bar {
		position: fixed;
		inset: 0 0 auto 0;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		height: 60px;
		padding: 0 clamp(14px, 3vw, 40px);
		font-family: var(--sans);
		transition:
			background 0.4s var(--out),
			border-color 0.4s var(--out);
		border-bottom: 1px solid transparent;
	}
	.bar.solid {
		background: rgba(10, 10, 10, 0.7);
		backdrop-filter: blur(16px) saturate(1.2);
		border-color: var(--line);
	}
	.progress {
		position: absolute;
		left: 0;
		bottom: -1px;
		height: 1px;
		width: 100%;
		background: var(--ink);
		transform-origin: left;
		transform: scaleX(var(--p));
		opacity: 0;
		transition: opacity 0.4s;
	}
	.bar.solid .progress {
		opacity: 0.7;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13.5px;
		letter-spacing: -0.005em;
		min-width: 0;
	}
	.home {
		display: flex;
		align-items: center;
		gap: 6px;
		color: var(--ink);
		white-space: nowrap;
	}
	.home .arrow {
		color: var(--mute);
		transition:
			transform 0.3s var(--out),
			color 0.3s;
	}
	.home:hover .arrow {
		transform: translateX(-3px);
		color: var(--ink);
	}
	.crumb {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--mute);
	}
	.slash {
		color: var(--faint);
	}
	.crumb-roll {
		display: inline-grid;
		overflow: hidden;
		height: 1.3em;
		line-height: 1.3em;
		font-variant-numeric: tabular-nums;
	}
	.crumb-roll > span {
		grid-area: 1 / 1;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
	}
	.seg {
		position: relative;
		display: flex;
		height: 32px;
		padding: 3px;
		border: 1px solid var(--line-2);
		border-radius: 999px;
	}
	.pill {
		position: absolute;
		top: 3px;
		bottom: 3px;
		left: 0;
		width: var(--w);
		transform: translateX(var(--x));
		border-radius: 999px;
		background: var(--ink);
		opacity: 0;
		transition:
			transform 0.45s var(--out),
			width 0.45s var(--out);
	}
	.pill.ready {
		opacity: 1;
	}
	.seg button {
		position: relative;
		padding: 0 11px;
		border-radius: 999px;
		color: var(--mute);
		transition: color 0.3s var(--out);
	}
	.seg button:hover {
		color: var(--ink);
	}
	.seg button.on {
		color: var(--bg);
	}
	.seg button.eth {
		font-size: 12.5px;
	}

	.years {
		position: relative;
	}
	.years-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 32px;
		padding: 0 11px 0 13px;
		border: 1px solid var(--line-2);
		border-radius: 999px;
		color: var(--mute);
		font-variant-numeric: tabular-nums;
		transition:
			color 0.2s,
			border-color 0.2s;
	}
	.years-btn:hover,
	.years-btn.open {
		color: var(--ink);
		border-color: var(--faint);
	}
	.chev {
		transition: transform 0.35s var(--out);
	}
	.years-btn.open .chev {
		transform: rotate(180deg);
	}
	.years-menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		z-index: 30;
		display: flex;
		flex-direction: column;
		width: 230px;
		padding: 6px;
		border: 1px solid var(--line-2);
		border-radius: 14px;
		background: rgba(14, 14, 14, 0.92);
		backdrop-filter: blur(16px);
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
	}
	.years-menu button {
		display: grid;
		grid-template-columns: 42px 1fr 34px;
		align-items: center;
		gap: 10px;
		height: 34px;
		padding: 0 10px;
		border-radius: 8px;
		color: var(--mute);
		font-variant-numeric: tabular-nums;
		animation: rise 0.4s var(--out) both;
		animation-delay: calc(var(--i) * 25ms);
		transition:
			background 0.2s,
			color 0.2s;
	}
	.years-menu button:hover,
	.years-menu button.on {
		background: rgba(255, 255, 255, 0.06);
		color: var(--ink);
	}
	.years-menu .y {
		text-align: left;
		font-size: 13px;
	}
	.years-menu .yn {
		text-align: right;
		font-family: var(--mono);
		font-size: 10.5px;
	}
	.ybar {
		height: 2px;
		border-radius: 2px;
		background: var(--line-2);
		overflow: hidden;
	}
	.ybar span {
		display: block;
		height: 100%;
		width: var(--w);
		background: currentColor;
		transform-origin: left;
		animation: grow 0.6s var(--out) both;
		animation-delay: calc(80ms + var(--i) * 25ms);
	}
	@keyframes grow {
		from {
			transform: scaleX(0);
		}
	}

	.search {
		display: flex;
		align-items: center;
		height: 32px;
		width: 32px;
		border: 1px solid var(--line-2);
		border-radius: 999px;
		overflow: hidden;
		transition:
			width 0.5s var(--out),
			border-color 0.3s;
	}
	.search:hover {
		border-color: var(--faint);
	}
	.search.open {
		width: min(250px, 46vw);
		border-color: var(--mute);
	}
	.search-btn {
		flex: none;
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		color: var(--mute);
		transition: color 0.2s;
	}
	.search:hover .search-btn,
	.search.open .search-btn {
		color: var(--ink);
	}
	.search input {
		flex: 1;
		min-width: 0;
		height: 100%;
		background: none;
		border: 0;
		outline: none;
		color: var(--ink);
		font: inherit;
		opacity: 0;
		transition: opacity 0.3s 0.1s;
	}
	.search input::placeholder {
		color: var(--faint);
	}
	.search.open input {
		opacity: 1;
	}
	.search kbd,
	.search .x {
		flex: none;
		display: grid;
		place-items: center;
		margin-right: 5px;
		width: 20px;
		height: 20px;
		border-radius: 6px;
		font-family: var(--mono);
		font-size: 10.5px;
		color: var(--mute);
		border: 1px solid var(--line-2);
		opacity: 0;
		transition: opacity 0.3s;
	}
	.search .x {
		font-size: 14px;
		border-radius: 999px;
	}
	.search .x:hover {
		color: var(--ink);
	}
	.search.open kbd,
	.search.open .x {
		opacity: 1;
	}

	.icon {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 999px;
		border: 1px solid var(--line-2);
		color: var(--mute);
		transition:
			color 0.2s,
			border-color 0.2s,
			transform 0.5s var(--out);
	}
	.icon:hover {
		color: var(--ink);
		border-color: var(--faint);
	}
	.dice:hover svg {
		transform: rotate(90deg);
	}
	.dice svg {
		transition: transform 0.5s var(--out);
	}
	.icon:active,
	.drift:active,
	.chip:active {
		transform: scale(0.93);
	}

	.drift {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 32px;
		padding: 0 13px 0 12px;
		border-radius: 999px;
		border: 1px solid var(--line-2);
		color: var(--mute);
		transition:
			color 0.3s,
			border-color 0.3s,
			background 0.3s,
			transform 0.3s var(--out);
	}
	.drift:hover {
		color: var(--ink);
		border-color: var(--faint);
	}
	.drift .dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
		transition: transform 0.3s var(--out);
	}
	.drift.on {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--bg);
	}
	.drift.on .dot {
		animation: breathe 1.6s ease-in-out infinite;
	}
	@keyframes breathe {
		50% {
			transform: scale(0.4);
			opacity: 0.4;
		}
	}
	@media (max-width: 640px) {
		.crumb,
		.home span {
			display: none;
		}
		.drift-label {
			display: none;
		}
		.drift {
			width: 32px;
			padding: 0;
			justify-content: center;
		}
		.seg button {
			padding: 0 9px;
		}
		.bar:has(.search.open) .home span,
		.bar:has(.search.open) .years,
		.bar:has(.search.open) .dice,
		.bar:has(.search.open) .drift {
			display: none;
		}
	}

	/* ---------- hero ---------- */
	.hero {
		position: relative;
		z-index: 1;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		padding: 110px 0 28px;
	}
	.hero-grid {
		flex: 1;
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
		align-items: center;
		gap: clamp(40px, 6vw, 110px);
		width: 100%;
		max-width: 1520px;
		margin: 0 auto;
		padding: 0 clamp(20px, 6vw, 110px);
	}
	@media (max-width: 1100px) {
		.hero-grid {
			grid-template-columns: 1fr;
			gap: 64px;
			padding-top: 40px;
		}
	}
	.ago {
		color: var(--ink-2);
	}
	.eyebrow {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mute);
		margin-bottom: 36px;
		animation: rise 0.9s var(--out) both;
	}
	.sep {
		color: var(--faint);
	}
	.live {
		position: relative;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ink);
	}
	.live::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: var(--ink);
		animation: ping 2.4s var(--out) infinite;
	}
	@keyframes ping {
		0% {
			transform: scale(1);
			opacity: 0.6;
		}
		70%,
		100% {
			transform: scale(3.2);
			opacity: 0;
		}
	}
	.tonight {
		font-size: clamp(32px, 4.6vw, 72px);
		line-height: 1.08;
		font-weight: 300;
		letter-spacing: -0.02em;
		text-wrap: balance;
		max-width: 20ch;
	}
	.tonight.eth {
		font-size: clamp(26px, 3.6vw, 54px);
		line-height: 1.38;
		letter-spacing: 0;
		max-width: 22ch;
	}
	.w {
		display: inline-block;
		animation: word 1.1s var(--out) both;
		animation-delay: calc(200ms + var(--i) * 55ms);
	}
	@keyframes word {
		from {
			opacity: 0;
			transform: translateY(0.35em);
			filter: blur(8px);
		}
	}
	.hero-foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 18px 28px;
		margin-top: 32px;
		animation: rise 1s var(--out) both;
		animation-delay: calc(400ms + var(--i) * 55ms);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
	}
	.tonight-ref {
		font-style: italic;
		font-size: clamp(18px, 1.8vw, 24px);
		color: var(--ink-2);
	}
	.tonight-ref::before {
		content: '';
		display: inline-block;
		vertical-align: middle;
		width: 28px;
		height: 1px;
		margin-right: 14px;
		background: var(--faint);
	}
	.hero-acts {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.chip.solid {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--bg);
	}
	.chip.solid:hover {
		background: #fff;
		color: var(--bg);
	}
	.chip.solid svg {
		transition: transform 0.35s var(--out);
	}
	.chip.solid:hover svg {
		transform: translateY(-2px);
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 30px;
		padding: 0 13px;
		border: 1px solid var(--line-2);
		border-radius: 999px;
		font-family: var(--sans);
		font-size: 12px;
		color: var(--mute);
		transition:
			color 0.2s,
			border-color 0.2s,
			transform 0.3s var(--out);
	}
	.chip:hover {
		color: var(--ink);
		border-color: var(--faint);
	}
	.ne {
		display: inline-block;
		transition: transform 0.3s var(--out);
	}
	.chip:hover .ne {
		transform: translate(2px, -2px);
	}

	/* ---------- nights calendar ---------- */
	.nights {
		position: relative;
		padding: 26px 26px 0;
		border: 1px solid var(--line);
		border-radius: 20px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0.005));
		animation: rise 1.1s var(--out) 0.5s both;
	}
	.nights-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 18px;
	}
	.nights-head p {
		font-family: var(--serif);
		font-style: italic;
		font-size: 19px;
		color: var(--ink-2);
	}
	.legend {
		display: flex;
		align-items: center;
		gap: 3px;
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.08em;
		color: var(--mute);
	}
	.legend .cell {
		width: 9px;
		height: 9px;
		animation: none;
	}
	.legend .cell:first-of-type {
		margin-left: 5px;
	}
	.legend .cell:last-of-type {
		margin-right: 5px;
	}
	.cal {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.cal-row {
		display: grid;
		grid-template-columns: 38px 1fr;
		align-items: center;
		gap: 10px;
	}
	.cal-year {
		font-family: var(--mono);
		font-size: 10.5px;
		color: var(--mute);
		text-align: left;
		font-variant-numeric: tabular-nums;
		transition: color 0.2s;
	}
	.cal-year:hover {
		color: var(--ink);
	}
	.cells {
		display: grid;
		grid-template-columns: repeat(53, minmax(0, 1fr));
		gap: 2px;
		min-width: 0;
	}
	.cell {
		display: block;
		min-width: 0;
		padding: 0;
		border: 0;
		aspect-ratio: 1;
		border-radius: 2px;
		background: var(--ink);
		opacity: var(--o);
		animation: cell-in 0.7s var(--out) both;
		animation-delay: calc(600ms + var(--c) * 9ms + var(--r) * 50ms);
		transition:
			transform 0.25s var(--out),
			opacity 0.25s;
	}
	.cell.l0 {
		--o: 0.06;
	}
	.cell.l1 {
		--o: 0.28;
	}
	.cell.l2 {
		--o: 0.48;
	}
	.cell.l3 {
		--o: 0.72;
	}
	.cell.l4 {
		--o: 1;
	}
	.cell.future {
		--o: 0;
	}
	@keyframes cell-in {
		from {
			opacity: 0;
			transform: scale(0.3);
		}
	}
	button.cell {
		cursor: pointer;
	}
	button.cell:hover,
	button.cell:focus-visible {
		opacity: 1;
		transform: scale(1.7);
		outline: none;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
		position: relative;
		z-index: 2;
	}
	.tip {
		position: absolute;
		z-index: 5;
		translate: -50% calc(-100% - 10px);
		padding: 6px 10px;
		border-radius: 8px;
		background: var(--ink);
		color: var(--bg);
		font-family: var(--sans);
		font-size: 11.5px;
		white-space: nowrap;
		pointer-events: none;
		animation: tip-in 0.2s var(--out);
	}
	.tip::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: -4px;
		width: 8px;
		height: 8px;
		background: var(--ink);
		translate: -50% 0;
		rotate: 45deg;
	}
	@keyframes tip-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		margin: 24px -26px 0;
		border-top: 1px solid var(--line);
	}
	.stats div {
		display: flex;
		flex-direction: column-reverse;
		gap: 8px;
		padding: 18px 0 20px 26px;
	}
	.stats div + div {
		border-left: 1px solid var(--line);
	}
	.stats dd {
		font-family: var(--sans);
		font-size: clamp(22px, 2vw, 30px);
		font-weight: 300;
		letter-spacing: -0.03em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.stats dt {
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mute);
	}
	@media (max-width: 640px) {
		.nights {
			padding: 18px 16px 0;
		}
		.nights-head p {
			font-size: 16px;
		}
		.legend {
			display: none;
		}
		.cal-row {
			grid-template-columns: 30px 1fr;
			gap: 6px;
		}
		.cal-year {
			font-size: 9.5px;
		}
		.cells {
			gap: 1.5px;
		}
		.stats {
			grid-template-columns: repeat(2, 1fr);
			margin: 18px -16px 0;
		}
		.stats div {
			padding: 16px 0 16px 16px;
		}
		.stats div:nth-child(3) {
			border-left: 0;
		}
		.stats div:nth-child(n + 3) {
			border-top: 1px solid var(--line);
		}
	}

	/* ---------- ticker ---------- */
	.ticker {
		margin-top: 56px;
		padding: 16px 0;
		border-block: 1px solid var(--line);
		overflow: hidden;
		mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
		animation: rise 1s var(--out) 1s both;
	}
	.ticker-track {
		display: flex;
		align-items: center;
		width: max-content;
		animation: marquee 120s linear infinite;
	}
	.ticker:hover .ticker-track {
		animation-play-state: paused;
	}
	.ticker button {
		padding: 0 4px;
		font-family: var(--serif);
		font-style: italic;
		font-size: 17px;
		color: var(--mute);
		white-space: nowrap;
		transition: color 0.25s;
	}
	.ticker button.eth {
		font-family: 'Noto Serif Ethiopic', var(--serif);
		font-style: normal;
		font-size: 14.5px;
	}
	.ticker button:hover {
		color: var(--ink);
	}
	.tdot {
		padding: 0 22px;
		font-size: 8px;
		color: var(--faint);
	}
	@keyframes marquee {
		to {
			transform: translateX(-50%);
		}
	}
	.cue {
		align-self: center;
		margin-top: 26px;
		display: flex;
		align-items: center;
		gap: 14px;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--mute);
		animation: rise 1s var(--out) 1.2s both;
		transition: color 0.3s;
	}
	.cue:hover {
		color: var(--ink);
	}
	.cue-line {
		position: relative;
		width: 56px;
		height: 1px;
		background: var(--line-2);
		overflow: hidden;
	}
	.cue-line::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--ink);
		animation: sweep 2.6s var(--out) infinite;
	}
	@keyframes sweep {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(100%);
		}
	}

	/* ---------- reveal ---------- */
	:global(.gn .rv) {
		opacity: 0;
		transform: translateY(18px);
		transition:
			opacity 0.9s var(--out),
			transform 0.9s var(--out);
		transition-delay: var(--d, 0ms);
	}
	:global(.gn .rv.in) {
		opacity: 1;
		transform: none;
	}

	/* ---------- wall ---------- */
	.wall {
		position: relative;
		z-index: 1;
		padding: 0 clamp(16px, 3vw, 48px) 80px;
		scroll-margin-top: 20px;
	}
	.result {
		font-family: var(--sans);
		font-size: 13px;
		color: var(--mute);
		padding: 90px 0 0;
	}
	.result .n {
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.result button {
		margin-left: 12px;
		color: var(--ink);
		border-bottom: 1px solid var(--faint);
		transition: border-color 0.2s;
	}
	.result button:hover {
		border-color: var(--ink);
	}
	.year {
		scroll-margin-top: -40px;
	}
	.year-head {
		display: flex;
		align-items: baseline;
		gap: 20px;
		padding: 110px 0 36px;
		font-family: var(--sans);
	}
	.yr {
		font-size: clamp(52px, 8vw, 120px);
		font-weight: 300;
		line-height: 0.8;
		letter-spacing: -0.055em;
		color: var(--ink);
	}
	.rule {
		flex: 1;
		height: 1px;
		align-self: center;
		background: var(--line-2);
		transform-origin: left;
		transform: scaleX(0);
		transition: transform 1.4s var(--out) 0.15s;
	}
	:global(.gn .year-head:not(.rv)) .rule,
	:global(.gn .year-head.in) .rule {
		transform: scaleX(1);
	}
	.year-head small {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mute);
		white-space: nowrap;
	}
	.cols {
		display: flex;
		align-items: flex-start;
		gap: clamp(20px, 2.6vw, 44px);
	}
	.col {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: clamp(8px, 1vw, 14px);
	}

	/* ---------- verse ---------- */
	.verse {
		position: relative;
		padding: 18px 0 22px;
		border-top: 1px solid var(--line);
	}
	.verse::before {
		content: '';
		position: absolute;
		top: -1px;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--ink);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.7s var(--out);
	}
	.verse:hover::before,
	.verse:focus-within::before,
	.verse.hl::before {
		transform: scaleX(1);
	}
	.v-top {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 14px;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		color: #4d4d4d;
		transition: color 0.4s;
		font-variant-numeric: tabular-nums;
	}
	.verse:hover .v-top {
		color: var(--mute);
	}
	.text {
		font-weight: 300;
		white-space: pre-line;
		text-wrap: pretty;
		color: var(--ink-2);
		transition: color 0.4s;
	}
	.verse:hover .text,
	.verse.hl .text {
		color: var(--ink);
	}
	.xl .text {
		font-size: 30px;
		line-height: 1.16;
		letter-spacing: -0.015em;
	}
	.lg .text {
		font-size: 24px;
		line-height: 1.24;
		letter-spacing: -0.01em;
	}
	.md .text {
		font-size: 19px;
		line-height: 1.4;
	}
	.sm .text {
		font-size: 16.5px;
		line-height: 1.52;
	}
	.eth .text {
		line-height: 1.65;
		letter-spacing: 0;
	}
	.eth.xl .text {
		font-size: 24px;
	}
	.eth.lg .text {
		font-size: 20px;
	}
	.eth.md .text {
		font-size: 17px;
	}
	.eth.sm .text {
		font-size: 15px;
	}
	.v-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-top: 16px;
		min-height: 26px;
	}
	.eth .ref,
	.tonight-ref.eth {
		font-style: normal;
		font-size: 14px;
	}
	.tonight-ref.eth {
		font-size: clamp(16px, 1.5vw, 20px);
	}
	.ref {
		font-style: italic;
		font-size: 15.5px;
		color: var(--mute);
		transition: color 0.4s;
	}
	.verse:hover .ref {
		color: var(--ink-2);
	}
	.acts {
		display: flex;
		gap: 2px;
	}
	.acts button,
	.acts a {
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border-radius: 8px;
		color: var(--mute);
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.3s var(--out),
			transform 0.4s var(--out),
			color 0.2s,
			background 0.2s;
	}
	.acts a {
		transition-delay: 40ms;
	}
	.verse:hover .acts > *,
	.verse:focus-within .acts > *,
	.acts .done {
		opacity: 1;
		transform: none;
	}
	.acts button:hover,
	.acts a:hover {
		color: var(--ink);
		background: rgba(255, 255, 255, 0.06);
	}
	.acts .done {
		color: var(--ink);
		animation: pop 0.4s var(--out);
	}
	@keyframes pop {
		40% {
			transform: scale(1.25);
		}
	}
	@media (hover: none) {
		.acts button,
		.acts a {
			opacity: 1;
			transform: none;
		}
	}
	.verse.hl::after {
		content: '';
		position: absolute;
		inset: -10px -14px;
		border-radius: 14px;
		border: 1px solid var(--ink);
		pointer-events: none;
		animation: halo 3.2s var(--out) forwards;
	}
	@keyframes halo {
		0% {
			opacity: 0;
			transform: scale(1.04);
		}
		12% {
			opacity: 0.9;
			transform: scale(1);
		}
		70% {
			opacity: 0.5;
		}
		100% {
			opacity: 0;
		}
	}

	.empty {
		padding: 160px 0;
		text-align: center;
		font-style: italic;
		color: var(--mute);
		font-size: 20px;
	}

	/* ---------- end ---------- */
	.end {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 160px 0 48px;
		text-align: center;
	}
	.moon {
		position: relative;
		width: 22px;
		height: 22px;
		margin-bottom: 28px;
		border-radius: 50%;
		box-shadow: inset -6px 3px 0 0 var(--ink);
		transform: rotate(-20deg);
		animation: float 6s ease-in-out infinite;
		filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.25));
	}
	@keyframes float {
		50% {
			transform: rotate(-8deg) translateY(-5px);
		}
	}
	.bye {
		font-size: clamp(34px, 5vw, 60px);
		font-weight: 300;
		line-height: 1.2;
		color: var(--ink);
	}
	.credit {
		margin-top: 14px;
		font-family: var(--sans);
		font-size: 13px;
		color: var(--mute);
	}
	.credit a {
		color: var(--ink);
		border-bottom: 1px solid var(--faint);
		transition: border-color 0.2s;
	}
	.credit a:hover {
		border-color: var(--ink);
	}

	/* ---------- toast ---------- */
	.toast {
		position: fixed;
		left: 50%;
		bottom: 28px;
		z-index: 30;
		translate: -50% 0;
		display: flex;
		align-items: center;
		gap: 8px;
		height: 36px;
		padding: 0 16px;
		border-radius: 999px;
		background: var(--ink);
		color: var(--bg);
		font-family: var(--sans);
		font-size: 12.5px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
	}

	@media (prefers-reduced-motion: reduce) {
		.star,
		.live::after,
		.cue-line::after,
		.moon,
		.drift.on .dot {
			animation: none;
		}
		.w,
		.eyebrow,
		.hero-foot,
		.nights,
		.cell,
		.ticker,
		.ticker-track,
		.years-menu button,
		.ybar span,
		.cue {
			animation: none;
		}
	}
</style>
