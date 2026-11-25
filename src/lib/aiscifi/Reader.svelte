<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { inline } from './text';
	import {
		prefs,
		toggleTheme,
		stepSize,
		markRead,
		saveLast,
		progressFor
	} from './prefs.svelte';
	import { reveal, scramble } from './actions';
	import type { Snippet } from 'svelte';

	type Ref = { slug: string; roman: string; title: string; days: string; teaser: string };
	type ReaderData = {
		meta: { n: number; roman: string; title: string; days: string; place: string; epigraph: string; source: string; teaser: string };
		blocks: import('./text').Block[];
		words: number;
		minutes: number;
		prev: Ref | null;
		next: Ref | null;
	};

	let {
		data,
		base,
		slug,
		title,
		totalRoman,
		unit = 'Transmission',
		logTag = 'RX ▸',
		finLine,
		finNote,
		plate
	}: {
		data: ReaderData;
		base: string;
		slug: string;
		title: string;
		totalRoman: string;
		unit?: string;
		logTag?: string;
		finLine: string;
		finNote: string;
		/** Optional header image, rendered above the part number. */
		plate?: Snippet<[number]>;
	} = $props();
	const BASE = $derived(base);
	const series = $derived({ slug });
	const UNIT = $derived(unit.toUpperCase());

	let progress = $state(0);
	let barHidden = $state(false);
	let mounted = $state(false);
	let article: HTMLElement | undefined = $state();

	const sizes = [1.06, 1.17, 1.3, 1.44];

	function measure() {
		if (!article) return 0;
		const r = article.getBoundingClientRect();
		const total = r.height - window.innerHeight * 0.6;
		return Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
	}

	let lastY = 0;
	let saveTimer: ReturnType<typeof setTimeout> | undefined;
	function onScroll() {
		const y = window.scrollY;
		barHidden = y > 140 && y > lastY + 2 ? true : y < lastY - 2 ? false : barHidden;
		lastY = y;
		progress = measure();
		clearTimeout(saveTimer);
		const n = data.meta.n;
		const pct = progress;
		saveTimer = setTimeout(() => {
			saveLast(series.slug, n, pct);
			if (pct > 0.97) markRead(series.slug, n);
		}, 250);
	}

	function onKey(e: KeyboardEvent) {
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		const t = e.target as HTMLElement;
		if (t && (t.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(t.tagName))) return;
		if (e.key === 'ArrowRight' && data.next) goto(`${BASE}/${data.next.slug}`);
		if (e.key === 'ArrowLeft' && data.prev) goto(`${BASE}/${data.prev.slug}`);
	}

	onMount(() => {
		mounted = true;
		progress = measure();
		return () => clearTimeout(saveTimer);
	});

	// On every part change: restore position if asked, otherwise start at the top.
	$effect(() => {
		const n = data.meta.n;
		mounted = false;
		tick().then(() => {
			requestAnimationFrame(() => {
				mounted = true;
				const last = progressFor(series.slug).last;
				const wantResume =
					new URLSearchParams(window.location.search).get('resume') === '1' && last?.n === n;
				if (wantResume && article && last) {
					const r = article.getBoundingClientRect();
					const total = r.height - window.innerHeight * 0.6;
					window.scrollTo({ top: window.scrollY + r.top + last.pct * total, behavior: 'auto' });
				}
				progress = measure();
			});
		});
	});
</script>

<svelte:window onscroll={onScroll} onkeydown={onKey} onresize={() => (progress = measure())} />

<svelte:head>
	<title>{data.meta.roman}. {data.meta.title} — {title}</title>
	<meta name="description" content={data.meta.teaser} />
	<meta property="og:title" content="{data.meta.roman}. {data.meta.title} — {title}" />
	<meta property="og:description" content={data.meta.teaser} />
</svelte:head>

<nav class="bar mono" class:hidden={barHidden} aria-label="Reader">
	<div class="bar-l">
		<a href="/aiscifi" class="brand top" aria-label="AI Sci-Fi — all stories">
			<span class="dot" aria-hidden="true"></span><span class="hide-xs">AI SCI-FI</span>
		</a>
		<span class="sep hide-xs">/</span>
		<a href={BASE} class="brand" aria-label="{title} — all parts">{title.toUpperCase()}</a>
		<span class="sep">/</span>
		<span class="where">PART {data.meta.roman}<span class="of">&nbsp;OF {totalRoman}</span></span>
	</div>
	<div class="bar-r">
		<div class="ctl" role="group" aria-label="Text size">
			<button onclick={() => stepSize(-1)} disabled={prefs.size === 0} aria-label="Smaller text">A−</button>
			<button onclick={() => stepSize(1)} disabled={prefs.size === 3} aria-label="Larger text">A+</button>
		</div>
		<button class="ctl-btn" onclick={toggleTheme} aria-label="Toggle light and dark">
			<span class="sw" class:on={prefs.theme === 'light'} aria-hidden="true"></span>
		</button>
		<span class="pct" aria-label="Progress">{String(Math.round(progress * 100)).padStart(2, '0')}%</span>
	</div>
	<span class="meter" style="transform:scaleX({progress})" aria-hidden="true"></span>
</nav>

{#key data.meta.n}
	<div class="page" class:on={mounted}>
		<header class="head">
			{#if plate}<div class="s1">{@render plate(data.meta.n)}</div>{/if}
			<p class="partno mono s1">
				<span use:scramble={{ delay: 150 }}>{UNIT} {String(data.meta.n).padStart(2, '0')}</span>
			</p>
			<h1 class="s2">
				<span class="roman">{data.meta.roman}.</span>
				{data.meta.title}
			</h1>
			<dl class="facts mono s3">
				<div><dt>WHEN</dt><dd>{data.meta.days}</dd></div>
				<div><dt>WHERE</dt><dd>{data.meta.place}</dd></div>
				<div><dt>LENGTH</dt><dd>{data.minutes} min · {data.words.toLocaleString()} words</dd></div>
			</dl>
			<span class="hr s3" aria-hidden="true"></span>
			<blockquote class="epi s4">
				<p>{data.meta.epigraph}</p>
				<cite class="mono">— {data.meta.source}</cite>
			</blockquote>
		</header>

		<article
			bind:this={article}
			class="prose s5"
			style="--fs:{sizes[prefs.size]}rem"
		>
			{#each data.blocks as b, i}
				{#if b.type === 'p'}
					<p class:first={i === 0}>{@html inline(b.text)}</p>
				{:else if b.type === 'break'}
					<div class="brk" use:reveal aria-hidden="true">
						<span class="orbit"><span class="sat"></span></span>
					</div>
				{:else}
					<div class="log" use:reveal role="note">
						<span class="log-tag mono" aria-hidden="true">{logTag}</span>
						{#each b.lines as line, j}
							<p style="--i:{j}">{@html inline(line)}</p>
						{/each}
					</div>
				{/if}
			{/each}
		</article>

		<footer class="end" use:reveal>
			<p class="endmark mono">
				<span class="ln"></span>END OF {UNIT} {data.meta.roman}<span class="ln"></span>
			</p>

			{#if data.next}
				<a class="next" href="{BASE}/{data.next.slug}">
					<span class="mono lbl">
						<span>Next — Part {data.next.roman}</span>
						<span class="mono">{data.next.days}</span>
					</span>
					<span class="ntitle">{data.next.title}</span>
					<span class="nteaser">{data.next.teaser}</span>
					<span class="go mono" aria-hidden="true">
						<span use:scramble={{ hover: true, onMount: false, duration: 380 }}>CONTINUE</span> →
					</span>
				</a>
			{:else}
				<div class="fin">
					<p class="fin-sum">{finLine}</p>
					<p class="mono fin-note">{finNote}</p>
				</div>
			{/if}

			<div class="nav mono">
				{#if data.prev}
					<a href="{BASE}/{data.prev.slug}" class="link">← {data.prev.roman}. {data.prev.title}</a>
				{:else}
					<span></span>
				{/if}
				<a href={BASE} class="link">All {unit.toLowerCase()}s</a>
			</div>
			<p class="keys mono" aria-hidden="true">← → to move between parts</p>
		</footer>
	</div>
{/key}

<style>
	.mono {
		font-family: var(--mono);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	/* ───────── bar ───────── */
	.bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 40;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 12px max(16px, 3vw);
		background: color-mix(in srgb, var(--bg) 82%, transparent);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--line);
		color: var(--mute);
		transition: transform 0.5s var(--ease);
	}
	.bar.hidden {
		transform: translateY(calc(-100% - 2px));
	}
	.bar-l,
	.bar-r {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}
	.brand {
		display: inline-flex;
		gap: 9px;
		align-items: center;
		color: var(--fg);
	}
	.brand.top {
		color: var(--mute);
		transition: color 0.3s;
	}
	.brand.top:hover {
		color: var(--fg);
	}
	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--fg);
	}
	.where {
		white-space: nowrap;
	}
	.sep {
		color: var(--faint);
	}
	.ctl {
		display: flex;
		border: 1px solid var(--line-2);
	}
	.ctl button,
	.ctl-btn {
		font: inherit;
		letter-spacing: inherit;
		background: transparent;
		color: var(--fg);
		border: 0;
		padding: 5px 9px;
		cursor: pointer;
		transition:
			background 0.25s,
			color 0.25s;
	}
	.ctl button + button {
		border-left: 1px solid var(--line-2);
	}
	.ctl button:hover:not(:disabled),
	.ctl-btn:hover {
		background: var(--fg);
		color: var(--bg);
	}
	.ctl button:disabled {
		color: var(--faint);
		cursor: default;
	}
	.ctl-btn {
		border: 1px solid var(--line-2);
		padding: 8px 9px;
		display: inline-flex;
	}
	.sw {
		width: 18px;
		height: 8px;
		border: 1px solid currentColor;
		position: relative;
		display: block;
	}
	.sw::after {
		content: '';
		position: absolute;
		top: 1px;
		left: 1px;
		width: 6px;
		height: 4px;
		background: currentColor;
		transition: transform 0.35s var(--ease);
	}
	.sw.on::after {
		transform: translateX(8px);
	}
	.pct {
		color: var(--fg);
		font-variant-numeric: tabular-nums;
		min-width: 4ch;
		text-align: right;
	}
	.meter {
		position: absolute;
		left: 0;
		bottom: -1px;
		height: 1px;
		width: 100%;
		background: var(--fg);
		transform-origin: left;
		transition: transform 0.15s linear;
	}

	/* ───────── page ───────── */
	.page {
		width: min(40rem, 100% - 32px);
		margin-inline: auto;
		padding: clamp(84px, 12vh, 128px) 0 80px;
	}
	.s1,
	.s2,
	.s3,
	.s4,
	.s5 {
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 1s var(--ease),
			transform 1.1s var(--ease);
	}
	.page.on .s1,
	.page.on .s2,
	.page.on .s3,
	.page.on .s4,
	.page.on .s5 {
		opacity: 1;
		transform: none;
	}
	.page.on .s2 {
		transition-delay: 0.12s;
	}
	.page.on .s3 {
		transition-delay: 0.3s;
	}
	.page.on .s4 {
		transition-delay: 0.45s;
	}
	.page.on .s5 {
		transition-delay: 0.6s;
	}

	.partno {
		color: var(--mute);
		margin: 0 0 18px;
	}
	h1 {
		font-family: var(--serif);
		font-weight: 300;
		font-size: clamp(2.3rem, 6.5vw, 3.9rem);
		line-height: 1.02;
		letter-spacing: -0.03em;
		margin: 0 0 28px;
		text-wrap: balance;
	}
	.roman {
		font-style: italic;
		color: var(--mute);
		margin-right: 0.15em;
	}
	.facts {
		display: grid;
		grid-template-columns: repeat(3, auto);
		justify-content: start;
		gap: 8px 32px;
		margin: 0;
		font-size: 0.62rem;
	}
	.facts div {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.facts dt {
		color: var(--faint);
	}
	.facts dd {
		margin: 0;
		color: var(--fg-2);
	}
	.hr {
		display: block;
		height: 1px;
		background: var(--line-2);
		margin: 34px 0;
		transform-origin: left;
	}
	.page.on .hr {
		animation: draw 1.6s var(--ease) 0.4s both;
	}
	@keyframes draw {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}
	.epi {
		margin: 0 0 clamp(48px, 9vh, 80px);
		padding: 0;
	}
	.epi p {
		font-style: italic;
		font-size: 1.05rem;
		line-height: 1.55;
		color: var(--fg-2);
		margin: 0 0 10px;
		max-width: 34em;
	}
	.epi cite {
		font-style: normal;
		color: var(--mute);
		font-size: 0.6rem;
	}

	/* ───────── prose ───────── */
	.prose {
		font-family: var(--serif);
		font-size: var(--fs);
		line-height: 1.72;
		font-weight: 400;
		font-variation-settings: 'opsz' 16;
		color: var(--fg);
		hanging-punctuation: first;
		transition: font-size 0.25s var(--ease);
	}
	.prose p {
		margin: 0 0 1.15em;
		text-wrap: pretty;
	}
	.prose p.first::first-letter {
		float: left;
		font-size: 3.6em;
		line-height: 0.82;
		padding: 0.06em 0.1em 0 0;
		font-weight: 300;
	}
	.prose p.first::first-line {
		font-variant: small-caps;
		letter-spacing: 0.03em;
	}
	.prose :global(em) {
		font-style: italic;
	}

	.brk {
		display: flex;
		justify-content: center;
		margin: 2.6em 0;
	}
	.orbit {
		position: relative;
		width: 26px;
		height: 26px;
		border: 1px solid var(--line-2);
		border-radius: 50%;
		opacity: 0;
		transform: scale(0.6);
		transition:
			opacity 0.8s,
			transform 1s var(--ease);
	}
	.brk:global(.in) .orbit {
		opacity: 1;
		transform: none;
	}
	.orbit::before {
		content: '';
		position: absolute;
		inset: 10px;
		border-radius: 50%;
		background: var(--fg);
	}
	.sat {
		position: absolute;
		inset: 0;
		animation: spin 9s linear infinite;
	}
	.sat::after {
		content: '';
		position: absolute;
		top: -2px;
		left: 50%;
		width: 3px;
		height: 3px;
		margin-left: -1.5px;
		border-radius: 50%;
		background: var(--fg);
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.log {
		position: relative;
		margin: 1.8em 0 2em;
		padding: 1.1em 1.2em 0.4em 1.2em;
		border-left: 1px solid var(--fg);
		background: linear-gradient(to right, var(--bg-2), transparent 85%);
		font-family: var(--mono);
		font-size: calc(var(--fs) * 0.72);
		line-height: 1.7;
		letter-spacing: 0.01em;
		color: var(--fg);
	}
	.log-tag {
		position: absolute;
		top: -0.75em;
		left: 1.2em;
		font-size: 0.6rem;
		color: var(--mute);
		background: var(--bg);
		padding: 0 6px;
	}
	.log p {
		margin: 0 0 0.75em;
		clip-path: inset(0 100% 0 0);
		opacity: 0.2;
		transition:
			clip-path 0.9s steps(32) calc(var(--i) * 140ms + 100ms),
			opacity 0.3s calc(var(--i) * 140ms + 100ms);
	}
	.log:global(.in) p {
		clip-path: inset(0 0 0 0);
		opacity: 1;
	}

	/* ───────── end ───────── */
	.end {
		margin-top: clamp(60px, 12vh, 120px);
		opacity: 0;
		transform: translateY(14px);
		transition:
			opacity 1s var(--ease),
			transform 1s var(--ease);
	}
	.end:global(.in) {
		opacity: 1;
		transform: none;
	}
	.endmark {
		display: flex;
		align-items: center;
		gap: 14px;
		color: var(--mute);
		font-size: 0.62rem;
		margin: 0 0 48px;
		white-space: nowrap;
	}
	.ln {
		flex: 1;
		height: 1px;
		background: var(--line-2);
	}
	.next {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 26px 24px 24px;
		border: 1px solid var(--line-2);
		overflow: hidden;
		isolation: isolate;
		transition:
			border-color 0.3s,
			color 0.4s var(--ease);
	}
	.next::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--fg);
		transform: translateY(101%);
		transition: transform 0.55s var(--ease);
		z-index: -1;
	}
	.next:hover {
		color: var(--bg);
		border-color: var(--fg);
	}
	.next:hover::before {
		transform: none;
	}
	.lbl {
		display: flex;
		justify-content: space-between;
		color: var(--mute);
		font-size: 0.62rem;
		transition: color 0.4s;
	}
	.next:hover .lbl,
	.next:hover .nteaser {
		color: color-mix(in srgb, var(--bg) 70%, var(--fg));
	}
	.ntitle {
		font-size: clamp(1.7rem, 4.6vw, 2.5rem);
		font-weight: 300;
		letter-spacing: -0.02em;
		line-height: 1.08;
	}
	.nteaser {
		font-style: italic;
		color: var(--fg-2);
		transition: color 0.4s;
	}
	.go {
		align-self: flex-end;
		font-size: 0.66rem;
	}

	.fin {
		text-align: center;
		padding: 20px 0 10px;
	}
	.fin-sum {
		font-size: clamp(2rem, 7vw, 3.4rem);
		font-style: italic;
		font-weight: 300;
		margin: 0 0 14px;
	}
	.fin-note {
		color: var(--mute);
		margin: 0;
		font-size: 0.62rem;
	}

	.nav {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
		margin-top: 32px;
		font-size: 0.62rem;
		color: var(--fg-2);
	}
	.link {
		background: linear-gradient(currentColor, currentColor) no-repeat 0 100% / 0 1px;
		transition: background-size 0.4s var(--ease);
		padding-bottom: 2px;
	}
	.link:hover {
		background-size: 100% 1px;
	}
	.keys {
		margin-top: 40px;
		text-align: center;
		color: var(--faint);
		font-size: 0.58rem;
	}

	@media (max-width: 640px) {
		.of,
		.sep,
		.hide-xs,
		.ctl,
		.keys {
			display: none;
		}
		.facts {
			grid-template-columns: 1fr 1fr;
		}
		.prose {
			line-height: 1.66;
		}
		.next {
			padding: 22px 18px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.s1,
		.s2,
		.s3,
		.s4,
		.s5,
		.end,
		.log p,
		.orbit {
			transition: none !important;
			opacity: 1 !important;
			transform: none !important;
			clip-path: none !important;
		}
		.sat,
		.page.on .hr {
			animation: none;
		}
	}
</style>
