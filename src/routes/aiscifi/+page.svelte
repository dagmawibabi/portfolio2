<script lang="ts">
	import { onMount } from 'svelte';
	import Signal from '$lib/aiscifi/Signal.svelte';
	import { catalog, archiveWords } from '$lib/aiscifi/catalog';
	import { prefs, toggleTheme, progressFor } from '$lib/aiscifi/prefs.svelte';
	import { scramble, reveal } from '$lib/aiscifi/actions';

	const description =
		'Stories about the minds we are building, and what happens when they stop doing exactly what we meant. Far futures, next Tuesdays, and everything in between.';

	let mounted = $state(false);
	let utc = $state('--:--:--');

	onMount(() => {
		mounted = true;
		const tick = () => (utc = new Date().toISOString().slice(11, 19));
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	});

	const pad = (n: number, l = 3) => String(n).padStart(l, '0');
	const fmt = (n: number) => (Math.round(n / 1000) * 1000).toLocaleString('en-US');
	const words = ['AI', 'Sci-Fi'];
</script>

<svelte:head>
	<title>AI Sci-Fi — an anthology of machine fiction</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="AI Sci-Fi — an anthology of machine fiction" />
	<meta property="og:description" content={description} />
</svelte:head>

<header class="hero">
	<Signal theme={prefs.theme} />
	<div class="fade" aria-hidden="true"></div>

	<nav class="bar mono">
		<a href="/" class="brand">
			<span class="dot" aria-hidden="true"></span>
			<span use:scramble={{ delay: 100 }}>AI SCI-FI</span>
		</a>
		<div class="bar-r">
			<span class="hide-sm">ARCHIVE — {pad(catalog.length, 2)} SERIES — {fmt(archiveWords)} WORDS</span>
			<button class="chip" onclick={toggleTheme} aria-label="Toggle light and dark">
				<span class="sw" class:on={prefs.theme === 'light'} aria-hidden="true"></span>
				{prefs.theme === 'dark' ? 'DARK' : 'LIGHT'}
			</button>
		</div>
	</nav>

	<div class="hero-main">
		<p class="kicker mono" class:on={mounted}><span class="tick"></span>An anthology of machine fiction</p>
		<h1 class="title" aria-label="AI Sci-Fi">
			{#each words as word, wi}
				<span class="word">
					{#each word.split('') as ch, i}
						<span class="ch" class:on={mounted} style="transition-delay:{160 + (wi * 3 + i) * 60}ms"
							>{ch}</span
						>
					{/each}
				</span>
			{/each}
		</h1>
		<p class="lede" class:on={mounted}>{description}</p>
	</div>

	<p class="stamp mono" aria-hidden="true">UTC {utc} · SIGNAL NOMINAL</p>

	<a class="scroll mono" href="#archive">
		<span>Archive</span>
		<span class="line" aria-hidden="true"></span>
	</a>
</header>

<main>
	<section id="archive" class="wrap">
		<div class="sec-head mono" use:reveal>
			<span>01</span><span>The archive</span><span class="rule"></span><span>{catalog.length} series</span>
		</div>

		<div class="series">
			{#each catalog as s, i}
				{@const p = progressFor(s.slug)}
				<a href={s.href} class="entry" use:reveal style="--d:{i * 80}ms">
					<span class="e-top mono">
						<span>SERIES {pad(i + 1)}</span>
						<span class="status"><span class="led" aria-hidden="true"></span>{s.status}</span>
					</span>
					<span class="e-title">{s.title}</span>
					<span class="e-tag">{s.tagline}</span>
					<span class="e-blurb">{s.blurb}</span>
					<span class="e-meta mono">
						<span>{s.parts} parts</span>
						<span>{fmt(s.words)} words</span>
						<span>{Math.round(s.minutes / 5) * 5} min</span>
						<span>{s.setting}</span>
						{#if p.read.length}<span>{p.read.length}/{s.parts} read</span>{/if}
					</span>
					<span class="e-foot">
						<span class="tags mono">
							{#each s.tags as t}<span>{t}</span>{/each}
						</span>
						<span class="enter mono">
							<span use:scramble={{ hover: true, onMount: false, duration: 380 }}>ENTER</span>
							<span class="arr" aria-hidden="true">→</span>
						</span>
					</span>
				</a>
			{/each}

			<div class="entry slot" use:reveal style="--d:{catalog.length * 80}ms" aria-label="Next series in preparation">
				<span class="e-top mono">
					<span>SERIES {pad(catalog.length + 1)}</span>
					<span class="status muted">in preparation</span>
				</span>
				<span class="slot-text">The next signal is being written<span class="caret" aria-hidden="true"></span></span>
			</div>
		</div>
	</section>

	<section class="wrap about">
		<div class="sec-head mono" use:reveal>
			<span>02</span><span>About the archive</span><span class="rule"></span>
		</div>
		<div class="cols" use:reveal>
			<p>
				Some of these stories are set centuries out, among the asteroids. Some are set next month,
				in a kitchen, with products you already use. Some are single pieces, some are serials still
				being written. Each gets its own look.
			</p>
			<p>
				The subject is always the same: minds that we build, and the moment they become
				something we have to argue with. None of them are villains. Most of them are right about
				something.
			</p>
		</div>
	</section>

	<footer class="wrap foot" use:reveal>
		<div class="foot-row mono">
			<a href="/" class="link">← Home</a>
			<span>All fiction. Every name, station and machine is invented.</span>
		</div>
	</footer>
</main>

<style>
	.mono {
		font-family: var(--mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.wrap {
		width: min(1120px, 100% - 32px);
		margin-inline: auto;
	}

	/* ───────── hero ───────── */
	.hero {
		position: relative;
		height: 100vh;
		height: 100svh;
		min-height: 560px;
		overflow: hidden;
		isolation: isolate;
	}
	.fade {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			linear-gradient(to right, var(--bg) 0%, transparent 45%),
			linear-gradient(to bottom, var(--bg) 0%, transparent 18%, transparent 80%, var(--bg) 100%);
	}
	.bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 18px max(16px, 3vw);
		color: var(--fg-2);
		z-index: 2;
	}
	.brand {
		display: inline-flex;
		gap: 10px;
		align-items: center;
		color: var(--fg);
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--fg);
		animation: ping 2.4s var(--ease) infinite;
	}
	@keyframes ping {
		0% {
			box-shadow: 0 0 0 0 color-mix(in srgb, var(--fg) 60%, transparent);
		}
		70%,
		100% {
			box-shadow: 0 0 0 10px transparent;
		}
	}
	.bar-r {
		display: flex;
		gap: 20px;
		align-items: center;
	}
	.chip {
		font: inherit;
		letter-spacing: inherit;
		color: var(--fg);
		background: transparent;
		border: 1px solid var(--line-2);
		padding: 6px 10px;
		display: inline-flex;
		gap: 8px;
		align-items: center;
		cursor: pointer;
		transition: border-color 0.3s;
	}
	.chip:hover {
		border-color: var(--fg);
	}
	.sw {
		width: 18px;
		height: 8px;
		border: 1px solid currentColor;
		position: relative;
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

	.hero-main {
		position: absolute;
		left: max(16px, 3vw);
		right: max(16px, 3vw);
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		pointer-events: none;
	}
	.kicker {
		display: flex;
		gap: 10px;
		align-items: center;
		color: var(--fg-2);
		margin: 0 0 14px;
		opacity: 0;
		transition: opacity 0.8s 0.1s;
	}
	.kicker.on {
		opacity: 1;
	}
	.tick {
		width: 28px;
		height: 1px;
		background: currentColor;
	}
	.title {
		font-family: var(--serif);
		font-weight: 300;
		font-size: clamp(4rem, 17vw, 15rem);
		line-height: 0.84;
		letter-spacing: -0.05em;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0 0.22em;
	}
	.word {
		white-space: nowrap;
	}
	.word:last-child {
		font-style: italic;
	}
	.ch {
		display: inline-block;
		opacity: 0;
		filter: blur(14px);
		transform: translateY(0.12em);
		transition:
			opacity 0.9s var(--ease),
			filter 1.1s var(--ease),
			transform 1.1s var(--ease);
	}
	.ch.on {
		opacity: 1;
		filter: blur(0);
		transform: none;
	}
	.lede {
		font-size: clamp(1.05rem, 2vw, 1.4rem);
		line-height: 1.45;
		color: var(--fg-2);
		max-width: 34ch;
		margin: 26px 0 0;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 1s 0.9s,
			transform 1s 0.9s var(--ease);
	}
	.lede.on {
		opacity: 1;
		transform: none;
	}
	.stamp {
		position: absolute;
		right: max(16px, 3vw);
		bottom: 26px;
		margin: 0;
		color: var(--mute);
		font-size: 0.6rem;
		z-index: 2;
		font-variant-numeric: tabular-nums;
	}
	.scroll {
		position: absolute;
		bottom: 22px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		color: var(--mute);
		font-size: 0.6rem;
		z-index: 2;
	}
	.scroll .line {
		width: 1px;
		height: 34px;
		background: linear-gradient(var(--fg), transparent);
		animation: drip 2.2s var(--ease) infinite;
	}
	@keyframes drip {
		0% {
			transform: scaleY(0);
			transform-origin: top;
		}
		50% {
			transform: scaleY(1);
			transform-origin: top;
		}
		51% {
			transform-origin: bottom;
		}
		100% {
			transform: scaleY(0);
			transform-origin: bottom;
		}
	}

	/* ───────── sections ───────── */
	main {
		position: relative;
		z-index: 1;
	}
	section {
		padding-top: clamp(70px, 12vh, 130px);
	}
	.sec-head,
	.entry,
	.cols,
	.foot {
		opacity: 0;
		transform: translateY(14px);
		transition:
			opacity 0.9s var(--ease) var(--d, 0ms),
			transform 0.9s var(--ease) var(--d, 0ms),
			color 0.45s var(--ease),
			border-color 0.3s;
	}
	.sec-head:global(.in),
	.entry:global(.in),
	.cols:global(.in),
	.foot:global(.in) {
		opacity: 1;
		transform: none;
	}
	.sec-head {
		display: flex;
		gap: 16px;
		align-items: center;
		color: var(--mute);
		margin-bottom: 22px;
	}
	.sec-head span:nth-child(2) {
		color: var(--fg);
	}
	.rule {
		flex: 1;
		height: 1px;
		background: var(--line-2);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 1.4s var(--ease) 0.2s;
	}
	.sec-head:global(.in) .rule {
		transform: scaleX(1);
	}

	.series {
		display: grid;
		gap: 16px;
	}
	.entry {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: clamp(22px, 4vw, 40px);
		border: 1px solid var(--line-2);
		overflow: hidden;
		isolation: isolate;
	}
	a.entry::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--fg);
		transform: translateY(101%);
		transition: transform 0.6s var(--ease);
		z-index: -1;
	}
	a.entry:hover {
		color: var(--bg);
		border-color: var(--fg);
	}
	a.entry:hover::before {
		transform: none;
	}
	.e-top {
		display: flex;
		justify-content: space-between;
		color: var(--mute);
		font-size: 0.64rem;
	}
	.status {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		color: var(--fg-2);
	}
	.status.muted {
		color: var(--mute);
	}
	.led {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
	}
	a.entry:hover .e-top,
	a.entry:hover .status,
	a.entry:hover .e-blurb,
	a.entry:hover .e-meta,
	a.entry:hover .tags {
		color: color-mix(in srgb, var(--bg) 68%, var(--fg));
	}
	.e-title {
		font-size: clamp(3rem, 10vw, 7.5rem);
		font-weight: 300;
		letter-spacing: -0.045em;
		line-height: 0.9;
		margin-top: clamp(10px, 3vw, 36px);
		transition: transform 0.6s var(--ease);
	}
	a.entry:hover .e-title {
		transform: translateX(12px);
	}
	.e-tag {
		font-style: italic;
		font-size: clamp(1.1rem, 2.2vw, 1.5rem);
	}
	.e-blurb {
		color: var(--fg-2);
		font-size: 1.05rem;
		line-height: 1.55;
		max-width: 56ch;
		transition: color 0.45s;
	}
	.e-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 22px;
		color: var(--mute);
		font-size: 0.64rem;
		padding-top: 14px;
		border-top: 1px solid var(--line);
		margin-top: 8px;
	}
	.e-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		color: var(--mute);
		font-size: 0.6rem;
	}
	.tags span {
		border: 1px solid currentColor;
		padding: 3px 7px;
	}
	.enter {
		display: inline-flex;
		gap: 10px;
		align-items: center;
	}
	.arr {
		transition: transform 0.4s var(--ease);
	}
	a.entry:hover .arr {
		transform: translateX(6px);
	}

	.slot {
		border-style: dashed;
		min-height: 180px;
	}
	.slot-text {
		font-family: var(--mono);
		font-size: 0.78rem;
		color: var(--mute);
		margin-top: auto;
		letter-spacing: 0.04em;
	}
	.caret {
		display: inline-block;
		width: 0.6em;
		height: 1.1em;
		margin-left: 6px;
		vertical-align: -0.2em;
		background: var(--mute);
		animation: caret 1.1s steps(2) infinite;
	}
	@keyframes caret {
		50% {
			opacity: 0;
		}
	}

	.cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32px;
	}
	.cols p {
		margin: 0;
		font-size: 1.15rem;
		line-height: 1.6;
		color: var(--fg-2);
	}

	.foot {
		padding: clamp(90px, 16vh, 180px) 0 40px;
	}
	.foot-row {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
		color: var(--mute);
		font-size: 0.62rem;
		border-top: 1px solid var(--line);
		padding-top: 18px;
	}
	.link {
		color: var(--fg);
		background: linear-gradient(currentColor, currentColor) no-repeat 0 100% / 0 1px;
		transition: background-size 0.4s var(--ease);
	}
	.link:hover {
		background-size: 100% 1px;
	}

	@media (max-width: 760px) {
		.hide-sm,
		.stamp {
			display: none;
		}
		.cols {
			grid-template-columns: 1fr;
			gap: 18px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ch,
		.lede,
		.kicker,
		.sec-head,
		.entry,
		.cols,
		.foot {
			transition: none !important;
			opacity: 1 !important;
			transform: none !important;
			filter: none !important;
		}
		.dot,
		.scroll .line,
		.caret {
			animation: none;
		}
	}
</style>
