<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, X, ArrowUpRight, ArrowRight, ArrowDown, Send } from 'lucide-svelte';
	import SiteNav from '../../components/channel_components/site_nav.svelte';
	import ShowcaseCard from '../../components/channel_components/showcase_card.svelte';
	import { reveal, countUp } from '../../components/channel_components/motion';
	import { compact, fmtMonth, postUrl } from '$lib/channel';
	import { tgProfile } from '$lib/channel/showcase_text';
	import type { ShowcasePost } from '$lib/channel/showcase';

	let { data } = $props();
	const posts = $derived(data.posts as ShowcasePost[]);

	// ---------- derived stats ----------
	const handleKey = (h: string) => h.toLowerCase();
	const isPerson = (h: string) => !/bot$/i.test(h);
	const creators = $derived.by(() => {
		const m = new Map<string, { handle: string; count: number; loves: number }>();
		for (const p of posts)
			for (const c of p.creators.filter(isPerson)) {
				const k = handleKey(c);
				const e = m.get(k) ?? { handle: c, count: 0, loves: 0 };
				e.count++;
				e.loves += p.reactions;
				m.set(k, e);
			}
		return [...m.values()].sort((a, b) => b.count - a.count || b.loves - a.loves);
	});
	const totalLoves = $derived(posts.reduce((a, p) => a + p.reactions, 0));
	const firstDate = $derived(posts.at(-1)?.date ?? '');
	const years = $derived([...new Set(posts.map((p) => p.date.slice(0, 4)))].sort().reverse());
	const perYear = $derived(years.map((y) => ({ y, n: posts.filter((p) => p.date.startsWith(y)).length })).reverse());
	const maxYear = $derived(Math.max(...perYear.map((x) => x.n)));
	const CATEGORY_ORDER = ['Apps & Sites', 'Art & Design', 'Bots', 'Writing', 'Video & Podcasts', 'Music', 'Clubs & Events', 'Games', 'AI', 'Other'];
	const categories = $derived(
		CATEGORY_ORDER.map((c) => ({ name: c, count: posts.filter((p) => p.categories.includes(c)).length })).filter((c) => c.count)
	);
	const maxCat = $derived(Math.max(...categories.map((c) => c.count)));
	const spotlightPosts = $derived([...posts].sort((a, b) => b.reactions - a.reactions).slice(0, 3));
	const topMakers = $derived(creators.slice(0, 10));

	// two rows of creator handles drifting under the hero
	const marqueeRows = $derived.by(() => {
		const hs = creators.slice(0, 80).map((c) => c.handle);
		return [0, 1].map((r) => hs.filter((_, i) => i % 2 === r));
	});

	const headline = 'Made by the community, cheered on by all of us.'.split(' ');

	// ---------- filters ----------
	let query = $state('');
	let category = $state('All');
	let year = $state('All');
	let creator = $state<string | null>(null);
	let sort = $state<'new' | 'old' | 'loved'>('new');
	let limit = $state(24);
	const SORTS = [
		{ v: 'new', label: 'Newest' },
		{ v: 'old', label: 'Oldest' },
		{ v: 'loved', label: 'Loved' }
	] as const;
	const sortIndex = $derived(SORTS.findIndex((s) => s.v === sort));

	const searchable = $derived(
		posts.map((p) =>
			[p.title ?? '', p.segments.map((s) => s[1]).join(''), p.creators.join(' '), p.tags.join(' '), p.links.map((l) => l.host).join(' ')]
				.join(' ')
				.toLowerCase()
		)
	);
	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const out = posts.filter(
			(p, i) =>
				(category === 'All' || p.categories.includes(category)) &&
				(year === 'All' || p.date.startsWith(year)) &&
				(!creator || p.creators.some((c) => handleKey(c) === handleKey(creator!))) &&
				(!q || q.split(/\s+/).every((w) => searchable[i].includes(w)))
		);
		if (sort === 'old') out.reverse();
		if (sort === 'loved') out.sort((a, b) => b.reactions - a.reactions);
		return out;
	});
	const shown = $derived(filtered.slice(0, limit));
	const active = $derived(query || category !== 'All' || year !== 'All' || creator);

	$effect(() => {
		// any filter change starts from the top of the list again
		void [query, category, year, creator, sort];
		limit = 24;
	});

	function reset() {
		query = '';
		category = 'All';
		year = 'All';
		creator = null;
		sort = 'new';
	}
	const toBrowse = () => document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' });
	function pickCreator(h: string) {
		creator = h;
		toBrowse();
	}
	function pickCategory(c: string) {
		category = c;
		toBrowse();
	}
	function pickYear(y: string) {
		year = y;
		toBrowse();
	}

	let searchEl: HTMLInputElement | undefined = $state();
	function onKey(e: KeyboardEvent) {
		const t = e.target as HTMLElement;
		if (e.key === '/' && !/input|textarea|select/i.test(t.tagName)) {
			e.preventDefault();
			searchEl?.focus();
			searchEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		} else if (e.key === 'Escape' && t === searchEl) {
			query = '';
			searchEl?.blur();
		}
	}

	let sentinel: HTMLDivElement | undefined = $state();
	let stickMark: HTMLDivElement | undefined = $state();
	let stuck = $state(false);
	onMount(() => {
		// deep links from a project page: /communityshowcase?maker=@x or ?category=Bots
		const params = new URLSearchParams(location.search);
		const m = params.get('maker');
		const c = params.get('category');
		if (m) creator = creators.find((x) => handleKey(x.handle) === handleKey(m))?.handle ?? m;
		const q = params.get('q');
		if (c && categories.some((x) => x.name === c)) category = c;
		if (q) query = q;
		if (m || c || q) requestAnimationFrame(toBrowse);

		const io = new IntersectionObserver((es) => {
			if (es[0].isIntersecting && limit < filtered.length) limit += 24;
		}, { rootMargin: '800px' });
		if (sentinel) io.observe(sentinel);
		const so = new IntersectionObserver(([e]) => (stuck = !e.isIntersecting && e.boundingClientRect.top < 0));
		if (stickMark) so.observe(stickMark);
		return () => {
			io.disconnect();
			so.disconnect();
		};
	});
</script>

<svelte:window onkeydown={onKey} />

<svelte:head>
	<title>Community Showcase — Dagmawi Babi</title>
	<meta
		name="description"
		content="{posts.length} projects, art, apps, bots, music and writing made by the community around Dagmawi Babi's Telegram channel."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Caveat:wght@500;700&display=swap" />
</svelte:head>

<div class="page min-h-screen">
	<div class="mx-auto w-[92%] max-w-6xl">
		<SiteNav />
	</div>

	<!-- HERO -->
	<header class="relative overflow-hidden">
		<div class="hero-grid" aria-hidden="true"></div>
		<div class="relative mx-auto w-[92%] max-w-6xl pt-14 pb-10 md:pt-24">
			<a href="https://t.me/Dagmawi_Babi" target="_blank" rel="noopener noreferrer" class="live enter" style="--i:0">
				<span class="dot"></span>
				<span>#CommunityShowcase</span>
				<span class="sep"></span>
				<span class="muted">since {fmtMonth(firstDate)}</span>
				<ArrowUpRight size={12} class="arr" />
			</a>

			<h1 class="mt-8 max-w-5xl text-[clamp(44px,8vw,112px)] leading-[0.95] font-medium tracking-[-0.055em]">
				{#each headline as w, i (i)}<span class="word" class:hand-word={w.startsWith('community')}><span style="--i:{i}" class:soft={i > 3}
							>{#if w.startsWith('community')}<span class="hand"
									>community<svg class="scribble" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"
										><path pathLength="1" d="M4 14 C 60 4, 120 6, 170 10 S 260 16, 296 6" /></svg
									></span
								>{w.slice(9)}{:else}{w}{/if}</span
						></span
					>{' '}{/each}
			</h1>

			<div class="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
				<p class="enter max-w-xl text-[15px] leading-relaxed md:text-base muted" style="--i:6">
					Every project our community has built and shipped — apps, bots, art, music, blogs and wild side-projects —
					all in one place, each linked back to its post. And to every maker here: thank you for trusting me with
					your work, for the early access, the upgraded plans and so much more. It means a lot.
				</p>
				<div class="enter flex flex-wrap gap-2" style="--i:7">
					<a href="#browse" class="btn primary">
						Explore <ArrowDown size={15} class="bounce" />
					</a>
					<a href="https://t.me/Dagmawi_Babi" target="_blank" rel="noopener noreferrer" class="btn ghost">
						<Send size={14} /> Share yours
					</a>
				</div>
			</div>

			<!-- stats -->
			<dl class="stats enter mt-16" style="--i:8">
				<div>
					<dd use:countUp={{ to: posts.length }}>{posts.length.toLocaleString()}</dd>
					<dt>Showcases</dt>
				</div>
				<div>
					<dd use:countUp={{ to: creators.length }}>{creators.length.toLocaleString()}</dd>
					<dt>Makers</dt>
				</div>
				<div>
					<dd use:countUp={{ to: totalLoves, format: (n) => compact.format(Math.round(n)) }}>{compact.format(totalLoves)}</dd>
					<dt>Reactions</dt>
				</div>
				<div class="years">
					<div class="bars" role="group" aria-label="Showcases per year">
						{#each perYear as p, i (p.y)}
							<button class="bar" style="--h:{Math.max(8, (p.n / maxYear) * 100)}%; --i:{i}" onclick={() => pickYear(p.y)} title="{p.n} in {p.y}">
								<span class="fill"></span>
								<span class="tip">{p.n}</span>
								<span class="yr">’{p.y.slice(2)}</span>
							</button>
						{/each}
					</div>
					<dt>Per year</dt>
				</div>
			</dl>
		</div>

		<!-- makers marquee -->
		<div class="marquee enter" style="--i:9" aria-label="Makers featured">
			{#each marqueeRows as row, r (r)}
				<div class="track" style="--d:{90 + r * 25}s; --dir:{r % 2 ? 'reverse' : 'normal'}">
					{#each [...row, ...row] as h, i (i)}
						<a
							class="handle"
							href={tgProfile(h)}
							target="_blank"
							rel="noopener noreferrer"
							title="Open {h} on Telegram"
							tabindex={i >= row.length ? -1 : 0}
							aria-hidden={i >= row.length ? 'true' : undefined}
						>{h}<ArrowUpRight size={11} class="harr" /></a>
					{/each}
				</div>
			{/each}
		</div>
	</header>

	<main class="mx-auto w-[92%] max-w-6xl pb-32">
		<!-- categories + makers -->
		<section class="grid gap-14 py-20 lg:grid-cols-[1.4fr_1fr]">
			<div use:reveal>
				<h2 class="eyebrow"><span>01</span> What people make</h2>
				<ul class="rows">
					{#each categories as c, i (c.name)}
						<li>
							<button class="row" onclick={() => pickCategory(c.name)} style="--w:{(c.count / maxCat) * 100}%">
								<span class="idx">{String(i + 1).padStart(2, '0')}</span>
								<span class="name">{c.name}</span>
								<span class="meter"><span></span></span>
								<span class="num">{c.count}</span>
								<ArrowRight size={14} class="arr" />
							</button>
						</li>
					{/each}
				</ul>
			</div>
			<aside use:reveal={120}>
				<h2 class="eyebrow"><span>02</span> Frequent makers</h2>
				<ol class="rows">
					{#each topMakers as c, i (c.handle)}
						<li>
							<button class="row" onclick={() => pickCreator(c.handle)} style="--w:{(c.count / topMakers[0].count) * 100}%">
								<span class="idx">{String(i + 1).padStart(2, '0')}</span>
								<span class="name truncate">{c.handle}</span>
								<span class="meter"><span></span></span>
								<span class="num">{c.count}</span>
								<ArrowRight size={14} class="arr" />
							</button>
						</li>
					{/each}
				</ol>
			</aside>
		</section>

		<!-- spotlight -->
		<section class="pb-20">
			<h2 class="eyebrow" use:reveal><span>03</span> Most loved</h2>
			<div class="grid gap-4 md:grid-cols-3">
				{#each spotlightPosts as p, i (p.id)}
					<div use:reveal={i * 90} class="flex">
						<ShowcaseCard post={p} featured rank={i + 1} onCreator={pickCreator} />
					</div>
				{/each}
			</div>
		</section>

		<!-- browse -->
		<section id="browse" class="scroll-mt-2">
			<h2 class="eyebrow" use:reveal><span>04</span> Everything</h2>
			<div bind:this={stickMark} class="h-px"></div>
			<div class="toolbar" class:stuck>
				<div class="flex flex-col gap-3 md:flex-row md:items-center">
					<label class="search">
						<Search size={15} class="icon" />
						<input bind:this={searchEl} bind:value={query} placeholder="Search projects, makers, sites, tags" aria-label="Search showcases" />
						{#if query}
							<button class="clear" onclick={() => (query = '')} aria-label="Clear search"><X size={14} /></button>
						{:else}
							<kbd>/</kbd>
						{/if}
					</label>
					<div class="flex gap-2">
						<div class="seg" style="--n:{SORTS.length}; --at:{sortIndex}" role="radiogroup" aria-label="Sort">
							<span class="thumb" aria-hidden="true"></span>
							{#each SORTS as s (s.v)}
								<button role="radio" aria-checked={sort === s.v} class:on={sort === s.v} onclick={() => (sort = s.v)}>{s.label}</button>
							{/each}
						</div>
						<select bind:value={year} class="sel" aria-label="Year">
							<option value="All">All years</option>
							{#each years as y (y)}<option value={y}>{y}</option>{/each}
						</select>
					</div>
				</div>
				<div class="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
					{#each [{ name: 'All', count: posts.length }, ...categories] as c (c.name)}
						<button class="pill" class:on={category === c.name} onclick={() => (category = c.name)}>
							{c.name}<span class="n">{c.count}</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="status">
				<span class="count">
					{#key filtered.length}<strong class="tick">{filtered.length}</strong>{/key}
					result{filtered.length === 1 ? '' : 's'}
				</span>
				{#if creator}
					<span class="filter-chip">
						{creator}
						<a href="https://t.me/{creator.slice(1)}" target="_blank" rel="noopener noreferrer" aria-label="Open {creator} on Telegram"><ArrowUpRight size={12} /></a>
						<button onclick={() => (creator = null)} aria-label="Remove maker filter"><X size={12} /></button>
					</span>
				{/if}
				{#if active}<button class="reset" onclick={reset}>Reset</button>{/if}
			</div>

			{#if shown.length}
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each shown as p, i (p.id)}
						<div use:reveal={(i % 3) * 70} class="flex">
							<ShowcaseCard post={p} onCreator={pickCreator} />
						</div>
					{/each}
				</div>
			{:else}
				<div class="empty">
					<p class="big">Nothing here — yet.</p>
					<p class="muted mt-2 text-sm">Maybe you're the one to build it.</p>
					<button class="btn ghost mt-6" onclick={reset}>Reset filters</button>
				</div>
			{/if}
			<div bind:this={sentinel} class="h-px"></div>
			{#if limit < filtered.length}
				<div class="mt-10 text-center">
					<button class="btn ghost" onclick={() => (limit += 48)}>
						Show more <span class="muted">· {filtered.length - limit}</span>
					</button>
				</div>
			{/if}
		</section>

		<!-- CTA -->
		<section class="cta" use:reveal>
			<div class="cta-grid" aria-hidden="true"></div>
			<p class="relative font-mono text-[11px] tracking-[0.18em] uppercase opacity-60">Your turn</p>
			<h2 class="relative mt-4 max-w-3xl text-[clamp(30px,5vw,60px)] leading-[1.02] font-medium tracking-[-0.04em]">
				Made something you're proud of? I'd love to show it off.
			</h2>
			<div class="relative mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
				<a href="https://t.me/Dagmawi_Babi" target="_blank" rel="noopener noreferrer" class="btn invert">
					<Send size={14} /> Send it on Telegram <ArrowRight size={14} class="slide" />
				</a>
				<a class="latest" href={postUrl(posts[0]?.id)} target="_blank" rel="noopener noreferrer">
					Latest: t.me/Dagmawi_Babi/{posts[0]?.id}
				</a>
			</div>
		</section>
	</main>
</div>

<style>
	.page {
		--bg: #fafafa;
		--ink: #0a0a0a;
		--muted: #737373;
		--line: rgb(0 0 0 / 0.08);
		--line-strong: rgb(0 0 0 / 0.22);
		--surface: #fff;
		--wash: #f2f2f2;
		--ease: cubic-bezier(0.2, 0.8, 0.2, 1);
		background: var(--bg);
		color: var(--ink);
	}
	:global(.dark) .page {
		--bg: #080808;
		--ink: #fafafa;
		--muted: #8a8a8a;
		--line: rgb(255 255 255 / 0.08);
		--line-strong: rgb(255 255 255 / 0.24);
		--surface: #0f0f0f;
		--wash: #161616;
	}
	.muted {
		color: var(--muted);
	}
	.font-mono,
	.eyebrow,
	.stats dt,
	.idx,
	.num,
	kbd,
	.status,
	.pill .n {
		font-family: 'JetBrains Mono', ui-monospace, monospace;
	}

	/* reveal-on-scroll (set up by the `reveal` action) */
	:global([data-reveal]) {
		opacity: 0;
		transform: translateY(16px);
		transition:
			opacity 0.8s var(--ease, ease),
			transform 0.9s var(--ease, ease);
		transition-delay: var(--reveal-delay, 0ms);
	}
	:global([data-reveal][data-shown]) {
		opacity: 1;
		transform: none;
	}

	/* ---------- hero ---------- */
	.hero-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(var(--line) 1px, transparent 1px),
			linear-gradient(90deg, var(--line) 1px, transparent 1px);
		background-size: 64px 64px;
		mask-image: radial-gradient(ellipse 70% 60% at 70% 0%, black, transparent 75%);
		animation: drift 40s linear infinite;
	}
	@keyframes drift {
		to {
			background-position: 64px 64px;
		}
	}
	.enter {
		animation: rise 0.9s var(--ease) both;
		animation-delay: calc(var(--i) * 70ms + 80ms);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(14px);
			filter: blur(4px);
		}
	}
	.word {
		display: inline-block;
		overflow: hidden;
		vertical-align: top;
		padding-bottom: 0.08em;
		margin-bottom: -0.08em;
	}
	.word > span {
		display: inline-block;
		animation: up 1s var(--ease) both;
		animation-delay: calc(var(--i) * 55ms + 120ms);
	}
	/* "community" in handwriting, with a scribbled underline that draws itself in */
	.word.hand-word {
		padding: 0.1em 0.06em 0.2em;
		margin: -0.1em -0.06em -0.2em;
	}
	.hand {
		position: relative;
		display: inline-block;
		font-family: 'Caveat', 'Segoe Print', cursive;
		font-weight: 700;
		font-size: 1.18em;
		line-height: 0.8;
		letter-spacing: -0.01em;
		padding: 0 0.04em;
		transform-origin: 50% 80%;
		transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.hand:hover {
		transform: rotate(-3deg) scale(1.04);
	}
	.scribble {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -0.02em;
		width: 100%;
		height: 0.16em;
		overflow: visible;
	}
	.scribble path {
		fill: none;
		stroke: currentColor;
		stroke-width: 3.5;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		opacity: 0.55;
		animation: draw 0.9s cubic-bezier(0.65, 0, 0.35, 1) 1.1s forwards;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	.word > .soft {
		color: var(--muted);
	}
	@keyframes up {
		from {
			transform: translateY(105%);
		}
	}
	.live {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 6px 12px 6px 10px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--surface);
		font-size: 12px;
		transition: border-color 0.25s;
	}
	.live:hover {
		border-color: var(--line-strong);
	}
	.live :global(.arr) {
		color: var(--muted);
		transition: transform 0.25s var(--ease);
	}
	.live:hover :global(.arr) {
		transform: translate(2px, -2px);
		color: var(--ink);
	}
	.sep {
		width: 1px;
		height: 12px;
		background: var(--line-strong);
	}
	.dot {
		position: relative;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ink);
	}
	.dot::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: var(--ink);
		animation: ping 2s ease-out infinite;
	}
	@keyframes ping {
		to {
			transform: scale(3.2);
			opacity: 0;
		}
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 42px;
		padding: 0 18px;
		border-radius: 999px;
		font-size: 14px;
		font-weight: 500;
		transition:
			background 0.25s,
			border-color 0.25s,
			color 0.25s,
			transform 0.15s;
	}
	.btn:active {
		transform: scale(0.97);
	}
	.btn.primary {
		background: var(--ink);
		color: var(--bg);
	}
	.btn.primary:hover {
		background: color-mix(in oklab, var(--ink) 82%, var(--bg));
	}
	.btn.ghost {
		border: 1px solid var(--line-strong);
	}
	.btn.ghost:hover {
		border-color: var(--ink);
		background: var(--surface);
	}
	.btn :global(.bounce) {
		transition: transform 0.3s var(--ease);
	}
	.btn:hover :global(.bounce) {
		animation: nudge 0.9s var(--ease) infinite;
	}
	@keyframes nudge {
		50% {
			transform: translateY(3px);
		}
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		border-top: 1px solid var(--line);
	}
	.stats > div {
		padding: 22px 0 4px;
		border-bottom: 1px solid var(--line);
	}
	.stats > div:nth-child(odd) {
		padding-right: 20px;
	}
	.stats > div:nth-child(even) {
		padding-left: 20px;
		border-left: 1px solid var(--line);
	}
	@media (min-width: 768px) {
		.stats {
			grid-template-columns: repeat(4, 1fr);
		}
		.stats > div {
			padding: 26px 24px 4px !important;
			border-bottom: 0;
			border-left: 1px solid var(--line);
		}
		.stats > div:first-child {
			padding-left: 0 !important;
			border-left: 0;
		}
	}
	.stats dd {
		font-size: clamp(32px, 4vw, 48px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.stats dt {
		margin: 10px 0 16px;
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.bars {
		display: flex;
		align-items: flex-end;
		gap: 5px;
		height: 48px;
	}
	.bar {
		position: relative;
		flex: 1;
		height: 100%;
		display: flex;
		align-items: flex-end;
	}
	.fill {
		display: block;
		width: 100%;
		height: var(--h);
		border-radius: 3px 3px 1px 1px;
		background: color-mix(in oklab, var(--ink) 18%, transparent);
		transform-origin: bottom;
		animation: grow 1s var(--ease) both;
		animation-delay: calc(var(--i) * 70ms + 700ms);
		transition: background 0.2s;
	}
	.bar:last-child .fill {
		background: var(--ink);
	}
	.bar:hover .fill {
		background: var(--ink);
	}
	@keyframes grow {
		from {
			transform: scaleY(0);
		}
	}
	.tip,
	.yr {
		position: absolute;
		left: 50%;
		translate: -50% 0;
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 9.5px;
		color: var(--muted);
		white-space: nowrap;
	}
	.tip {
		bottom: calc(var(--h) + 4px);
		opacity: 0;
		transform: translateY(3px);
		transition:
			opacity 0.2s,
			transform 0.2s;
		color: var(--ink);
	}
	.bar:hover .tip {
		opacity: 1;
		transform: none;
	}
	.yr {
		bottom: -16px;
	}
	.years dt {
		margin-top: 26px;
	}

	.marquee {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 18px 0;
		border-block: 1px solid var(--line);
		mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
	}
	.track {
		display: flex;
		width: max-content;
		animation: slide var(--d) linear infinite;
		animation-direction: var(--dir);
	}
	.marquee:hover .track {
		animation-play-state: paused;
	}
	@keyframes slide {
		to {
			transform: translateX(-50%);
		}
	}
	.handle {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 2px;
		padding: 4px 18px;
		font-size: 14px;
		letter-spacing: -0.01em;
		white-space: nowrap;
		color: var(--muted);
		transition: color 0.2s;
	}
	.handle::before {
		content: '';
		position: absolute;
		left: -2px;
		top: 50%;
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--line-strong);
	}
	.handle:hover {
		color: var(--ink);
	}
	.handle :global(.harr) {
		width: 0;
		opacity: 0;
		transform: translate(-4px, 4px);
		transition:
			width 0.25s var(--ease),
			opacity 0.2s,
			transform 0.3s var(--ease);
	}
	.handle:hover :global(.harr),
	.handle:focus-visible :global(.harr) {
		width: 11px;
		opacity: 1;
		transform: none;
	}

	/* ---------- index rows ---------- */
	.eyebrow {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 20px;
		font-size: 11px;
		font-weight: 400;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.eyebrow span {
		color: var(--ink);
	}
	.rows {
		border-top: 1px solid var(--line);
	}
	.row {
		position: relative;
		display: grid;
		grid-template-columns: 28px 1fr minmax(40px, 30%) 40px 16px;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 13px 4px;
		border-bottom: 1px solid var(--line);
		text-align: left;
		font-size: 15px;
		isolation: isolate;
	}
	.row::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: var(--wash);
		transform: scaleY(0);
		transform-origin: bottom;
		transition: transform 0.35s var(--ease);
	}
	.row:hover::before {
		transform: scaleY(1);
	}
	.idx {
		font-size: 11px;
		color: var(--muted);
	}
	.name {
		transition: transform 0.35s var(--ease);
	}
	.row:hover .name {
		transform: translateX(6px);
	}
	.meter {
		height: 2px;
		border-radius: 2px;
		background: var(--line);
		overflow: hidden;
	}
	.meter span {
		display: block;
		height: 100%;
		width: var(--w);
		background: color-mix(in oklab, var(--ink) 35%, transparent);
		transform: scaleX(0);
		transform-origin: left;
		transition:
			transform 1.2s var(--ease) 0.2s,
			background 0.2s;
	}
	:global([data-shown]) .meter span {
		transform: scaleX(1);
	}
	.row:hover .meter span {
		background: var(--ink);
	}
	.num {
		text-align: right;
		font-size: 12px;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.row :global(.arr) {
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.25s,
			transform 0.35s var(--ease);
	}
	.row:hover :global(.arr) {
		opacity: 1;
		transform: none;
	}

	/* ---------- toolbar ---------- */
	.toolbar {
		position: sticky;
		top: 0;
		z-index: 20;
		margin: 0 -4%;
		padding: 12px 4%;
		background: color-mix(in oklab, var(--bg) 82%, transparent);
		backdrop-filter: blur(16px) saturate(1.2);
		border-bottom: 1px solid transparent;
		transition:
			border-color 0.3s,
			padding 0.3s var(--ease);
	}
	.toolbar.stuck {
		border-color: var(--line);
	}
	.search {
		position: relative;
		display: flex;
		flex: 1;
		align-items: center;
	}
	.search :global(.icon) {
		position: absolute;
		left: 14px;
		color: var(--muted);
		pointer-events: none;
		transition: color 0.2s;
	}
	.search:focus-within :global(.icon) {
		color: var(--ink);
	}
	.search input {
		width: 100%;
		height: 42px;
		padding: 0 40px 0 38px;
		border-radius: 12px;
		border: 1px solid var(--line);
		background: var(--surface);
		font-size: 14px;
		outline: none;
		transition:
			border-color 0.2s,
			box-shadow 0.25s;
	}
	.search input::placeholder {
		color: var(--muted);
	}
	.search input:focus {
		border-color: var(--line-strong);
		box-shadow: 0 0 0 4px color-mix(in oklab, var(--ink) 6%, transparent);
	}
	kbd,
	.clear {
		position: absolute;
		right: 10px;
	}
	kbd {
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: 6px;
		border: 1px solid var(--line);
		font-size: 11px;
		color: var(--muted);
		transition: opacity 0.2s;
	}
	.search:focus-within kbd {
		opacity: 0;
	}
	.clear {
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: 6px;
		color: var(--muted);
		animation: pop 0.25s var(--ease);
	}
	.clear:hover {
		color: var(--ink);
		background: var(--wash);
	}
	@keyframes pop {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
	}
	.seg {
		position: relative;
		display: grid;
		grid-template-columns: repeat(var(--n), 1fr);
		height: 42px;
		padding: 3px;
		border-radius: 12px;
		border: 1px solid var(--line);
		background: var(--surface);
	}
	.seg .thumb {
		position: absolute;
		top: 3px;
		bottom: 3px;
		left: 3px;
		width: calc((100% - 6px) / var(--n));
		border-radius: 9px;
		background: var(--ink);
		transform: translateX(calc(var(--at) * 100%));
		transition: transform 0.4s cubic-bezier(0.34, 1.3, 0.64, 1);
	}
	.seg button {
		position: relative;
		padding: 0 14px;
		font-size: 13px;
		color: var(--muted);
		transition: color 0.3s;
	}
	.seg button:hover {
		color: var(--ink);
	}
	.seg button.on {
		color: var(--bg);
	}
	.sel {
		height: 42px;
		padding: 0 12px;
		border-radius: 12px;
		font-size: 13px;
		border: 1px solid var(--line);
		background: var(--surface);
		color: var(--ink);
		outline: none;
		transition: border-color 0.2s;
	}
	.sel:hover,
	.sel:focus {
		border-color: var(--line-strong);
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		flex-shrink: 0;
		padding: 6px 12px;
		border-radius: 999px;
		font-size: 13px;
		white-space: nowrap;
		color: var(--muted);
		border: 1px solid transparent;
		transition:
			color 0.2s,
			background 0.25s,
			border-color 0.2s,
			transform 0.15s;
	}
	.pill:hover {
		color: var(--ink);
		border-color: var(--line);
	}
	.pill:active {
		transform: scale(0.95);
	}
	.pill.on {
		color: var(--bg);
		background: var(--ink);
	}
	.pill .n {
		font-size: 10.5px;
		opacity: 0.55;
	}

	.status {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		margin: 18px 0 20px;
		font-size: 12px;
		color: var(--muted);
	}
	.count strong {
		display: inline-block;
		color: var(--ink);
		font-weight: 500;
	}
	.tick {
		animation: tick 0.35s var(--ease);
	}
	@keyframes tick {
		from {
			transform: translateY(-6px);
			opacity: 0;
		}
	}
	.filter-chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 3px 6px 3px 10px;
		border-radius: 999px;
		background: var(--ink);
		color: var(--bg);
		animation: pop 0.3s var(--ease);
	}
	.filter-chip a,
	.filter-chip button {
		opacity: 0.6;
		transition: opacity 0.2s;
	}
	.filter-chip a:hover,
	.filter-chip button:hover {
		opacity: 1;
	}
	.reset {
		position: relative;
		color: var(--ink);
	}
	.reset::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -1px;
		height: 1px;
		background: currentColor;
		transform-origin: left;
		transition: transform 0.3s var(--ease);
	}
	.reset:hover::after {
		transform: scaleX(0);
		transform-origin: right;
	}

	.empty {
		padding: 96px 0;
		text-align: center;
		border: 1px dashed var(--line-strong);
		border-radius: 18px;
	}
	.empty .big {
		font-size: clamp(22px, 3vw, 32px);
		font-weight: 500;
		letter-spacing: -0.03em;
	}

	/* ---------- CTA ---------- */
	.cta {
		position: relative;
		margin-top: 112px;
		overflow: hidden;
		padding: clamp(36px, 7vw, 80px);
		border-radius: 24px;
		background: var(--ink);
		color: var(--bg);
	}
	.cta-grid {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(color-mix(in oklab, var(--bg) 22%, transparent) 1px, transparent 1px);
		background-size: 18px 18px;
		mask-image: radial-gradient(ellipse 60% 80% at 100% 100%, black, transparent 70%);
		animation: drift-dots 30s linear infinite;
	}
	@keyframes drift-dots {
		to {
			background-position: 18px -18px;
		}
	}
	.btn.invert {
		background: var(--bg);
		color: var(--ink);
	}
	.btn.invert :global(.slide) {
		transition: transform 0.3s var(--ease);
	}
	.btn.invert:hover :global(.slide) {
		transform: translateX(4px);
	}
	.latest {
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 12px;
		opacity: 0.55;
		transition: opacity 0.2s;
	}
	.latest:hover {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.track,
		.hero-grid,
		.cta-grid,
		.dot::after {
			animation: none;
		}
		.enter,
		.word > span,
		.fill {
			animation: none;
		}
		:global([data-reveal]) {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
