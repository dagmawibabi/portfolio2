<script lang="ts">
	import { onMount } from 'svelte';
	import Field from '$lib/aiscifi/Field.svelte';
	import { parts, series, dossier, cast, readingMinutes } from '$lib/aiscifi/story';
	import { prefs, toggleTheme } from '$lib/aiscifi/prefs.svelte';
	import { scramble, reveal } from '$lib/aiscifi/actions';

	const totalWords = '27,000';
	const minutes = parts.map((p) => readingMinutes(p.n));

	let utc = $state('--:--:--');
	let probe = $state({ x: 0.5, y: 0.5, dist: 0, pull: 0, count: 0 });
	let booted = $state(0);
	let mounted = $state(false);

	const boot = [
		'LINK ........ PSYCHE RELAY 07',
		'LIGHT DELAY . 05m 54s',
		'RESIDUALS ... 406 / THERMAL 391',
		'ALLOCATION .. SUSPENDED'
	];

	const resume = $derived(
		prefs.last && prefs.last.pct > 0.02 && prefs.last.pct < 0.97
			? parts.find((p) => p.n === prefs.last!.n)
			: null
	);

	onMount(() => {
		mounted = true;
		const tick = () => {
			const d = new Date();
			utc = d.toISOString().slice(11, 19);
		};
		tick();
		const clock = setInterval(tick, 1000);
		const timers = boot.map((_, i) => setTimeout(() => (booted = i + 1), 500 + i * 380));
		return () => {
			clearInterval(clock);
			timers.forEach(clearTimeout);
		};
	});

	const pad = (n: number, l = 2) => String(n).padStart(l, '0');
	const title = 'Perihelion'.split('');
</script>

<svelte:head>
	<title>Perihelion — a serial in eight parts</title>
	<meta name="description" content={series.blurb} />
	<meta property="og:title" content="Perihelion — a serial in eight parts" />
	<meta property="og:description" content={series.blurb} />
</svelte:head>

<header class="hero">
	<Field theme={prefs.theme} onprobe={(p) => (probe = p)} />
	<div class="vignette" aria-hidden="true"></div>
	<div class="gridlines" aria-hidden="true"></div>

	<nav class="bar mono">
		<a href="/" class="brand">
			<span class="dot" aria-hidden="true"></span>
			<span use:scramble={{ delay: 120 }}>PERIHELION</span>
		</a>
		<div class="bar-r">
			<span class="hide-sm">SERIAL — 08 TRANSMISSIONS — {totalWords} WORDS</span>
			<button class="chip" onclick={toggleTheme} aria-label="Toggle light and dark">
				<span class="sw" class:on={prefs.theme === 'light'} aria-hidden="true"></span>
				{prefs.theme === 'dark' ? 'DARK' : 'LIGHT'}
			</button>
		</div>
	</nav>

	<ol class="boot mono" aria-hidden="true">
		{#each boot as line, i}
			<li class:on={booted > i}>{line}</li>
		{/each}
	</ol>

	<div class="hero-main">
		<p class="kicker mono" class:on={mounted}>
			<span class="tick"></span> A hard science-fiction serial · 2193
		</p>
		<h1 class="title" aria-label="Perihelion">
			{#each title as ch, i}
				<span class="ch" class:on={mounted} style="transition-delay:{180 + i * 55}ms">{ch}</span>
			{/each}
		</h1>
		<p class="tagline" class:on={mounted}>{series.tagline}</p>
		<div class="cta" class:on={mounted}>
			<a class="btn primary mono" href="/aiscifi/1">
				<span use:scramble={{ hover: true, onMount: false, duration: 420 }}>BEGIN TRANSMISSION</span>
				<span class="arr" aria-hidden="true">→</span>
			</a>
			{#if resume}
				<a class="btn mono" href="/aiscifi/{resume.slug}?resume=1">
					<span>RESUME {resume.roman} · {Math.round((prefs.last?.pct ?? 0) * 100)}%</span>
				</a>
			{/if}
		</div>
	</div>

	<dl class="hud mono" aria-hidden="true">
		<div><dt>UTC</dt><dd>{utc}</dd></div>
		<div><dt>PROBE</dt><dd>{probe.x.toFixed(3)} / {probe.y.toFixed(3)}</dd></div>
		<div><dt>Δ TO MASS</dt><dd>{Math.round(probe.dist)} px</dd></div>
		<div><dt>PULL</dt><dd>{(probe.pull * 1000).toFixed(2)} mg</dd></div>
		<div><dt>PACKETS BENT</dt><dd>{pad(probe.count, 3)}</dd></div>
	</dl>

	<a class="scroll mono" href="#transmissions">
		<span>Transmissions</span>
		<span class="line" aria-hidden="true"></span>
	</a>
</header>

<main>
	<section class="intro wrap" use:reveal>
		<p class="lede">{series.blurb}</p>
		<p class="note mono">Move the cursor through the field above. You have mass, too.</p>
	</section>

	<section id="transmissions" class="wrap">
		<div class="sec-head mono" use:reveal>
			<span>01</span><span>Transmissions</span><span class="rule"></span><span>{parts.length} parts</span>
		</div>

		<ol class="parts">
			{#each parts as p, i}
				<li use:reveal style="--d:{i * 60}ms">
					<a href="/aiscifi/{p.slug}" class="row">
						<span class="num mono">{pad(p.n)}</span>
						<span class="body">
							<span class="ptitle">{p.title}</span>
							<span class="teaser">{p.teaser}</span>
						</span>
						<span class="meta mono">
							<span>{p.days}</span>
							<span class="hide-sm">{p.place}</span>
						</span>
						<span class="mins mono">
							{minutes[i]} min
							<span class="read" class:done={prefs.read.includes(p.n)} title={prefs.read.includes(p.n) ? 'Read' : 'Unread'}></span>
						</span>
						<span class="go" aria-hidden="true">→</span>
					</a>
				</li>
			{/each}
		</ol>
	</section>

	<section class="wrap">
		<div class="sec-head mono" use:reveal>
			<span>02</span><span>Dossier</span><span class="rule"></span><span>The world, 2193</span>
		</div>
		<div class="dossier">
			{#each dossier as d, i}
				<article class="card" use:reveal style="--d:{i * 80}ms">
					<span class="corner tl" aria-hidden="true"></span>
					<span class="corner br" aria-hidden="true"></span>
					<p class="mono k">FILE {pad(i + 1)} — {d.k}</p>
					<p class="v">{d.v}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="wrap">
		<div class="sec-head mono" use:reveal>
			<span>03</span><span>Persons of record</span><span class="rule"></span><span>{cast.length}</span>
		</div>
		<ul class="cast">
			{#each cast as c, i}
				<li use:reveal style="--d:{i * 50}ms">
					<span class="cname">{c.name}</span>
					<span class="crole mono">{c.role}</span>
				</li>
			{/each}
		</ul>
	</section>

	<footer class="wrap foot" use:reveal>
		<p class="sum">The sum is kept.</p>
		<div class="foot-row mono">
			<a href="/aiscifi/1" class="link">Begin → Part I</a>
			<span>A work of fiction. Every name, station and machine is invented.</span>
			<a href="/" class="link">← Home</a>
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
	.vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(120% 80% at 20% 100%, var(--bg) 0%, transparent 55%),
			linear-gradient(to bottom, var(--bg) 0%, transparent 14%, transparent 70%, var(--bg) 100%);
		opacity: 0.92;
	}
	.gridlines {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image:
			linear-gradient(to right, var(--line) 1px, transparent 1px),
			linear-gradient(to bottom, var(--line) 1px, transparent 1px);
		background-size: 120px 120px;
		mask-image: radial-gradient(70% 60% at 60% 40%, #000 0%, transparent 75%);
		opacity: 0.35;
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
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--fg);
		box-shadow: 0 0 0 0 var(--fg);
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
		transition:
			border-color 0.3s,
			background 0.3s;
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

	.boot {
		position: absolute;
		top: 64px;
		left: max(16px, 3vw);
		list-style: none;
		margin: 0;
		padding: 0;
		color: var(--mute);
		font-size: 0.64rem;
		line-height: 1.9;
		z-index: 2;
	}
	.boot li {
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.4s,
			transform 0.5s var(--ease);
		clip-path: inset(0 100% 0 0);
	}
	.boot li.on {
		opacity: 1;
		transform: none;
		clip-path: inset(0 0 0 0);
		transition:
			opacity 0.2s,
			transform 0.5s var(--ease),
			clip-path 0.7s steps(28);
	}
	.boot li:last-child.on {
		color: var(--fg);
		animation: blink 1.1s steps(2) 3;
	}
	@keyframes blink {
		50% {
			opacity: 0.2;
		}
	}

	.hero-main {
		position: absolute;
		left: max(16px, 3vw);
		right: max(16px, 3vw);
		bottom: clamp(72px, 12vh, 140px);
		z-index: 2;
		pointer-events: none;
	}
	.hero-main a {
		pointer-events: auto;
	}
	.kicker {
		display: flex;
		gap: 10px;
		align-items: center;
		color: var(--fg-2);
		margin: 0 0 8px;
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
		font-size: clamp(3.6rem, 15vw, 13.5rem);
		line-height: 0.86;
		letter-spacing: -0.045em;
		margin: 0;
		font-variation-settings: 'opsz' 72;
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
	.tagline {
		font-style: italic;
		font-size: clamp(1.05rem, 2.2vw, 1.5rem);
		color: var(--fg-2);
		margin: 18px 0 26px;
		max-width: 34ch;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 1s 0.8s,
			transform 1s 0.8s var(--ease);
	}
	.tagline.on,
	.cta.on {
		opacity: 1;
		transform: none;
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 1s 1.05s,
			transform 1s 1.05s var(--ease);
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 14px;
		padding: 14px 18px;
		border: 1px solid var(--line-2);
		color: var(--fg);
		background: color-mix(in srgb, var(--bg) 60%, transparent);
		backdrop-filter: blur(6px);
		position: relative;
		overflow: hidden;
		transition:
			border-color 0.3s,
			color 0.35s var(--ease);
	}
	.btn::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--fg);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.45s var(--ease);
		z-index: -1;
	}
	.btn:hover {
		color: var(--bg);
		border-color: var(--fg);
	}
	.btn:hover::before {
		transform: scaleX(1);
	}
	.btn.primary {
		border-color: var(--fg);
	}
	.arr {
		transition: transform 0.35s var(--ease);
	}
	.btn:hover .arr {
		transform: translateX(4px);
	}

	.hud {
		position: absolute;
		right: max(16px, 3vw);
		bottom: clamp(72px, 12vh, 140px);
		margin: 0;
		z-index: 2;
		display: grid;
		gap: 6px;
		font-size: 0.62rem;
		color: var(--mute);
		min-width: 230px;
		border-left: 1px solid var(--line-2);
		padding-left: 14px;
	}
	.hud div {
		display: flex;
		justify-content: space-between;
		gap: 24px;
	}
	.hud dt {
		margin: 0;
	}
	.hud dd {
		margin: 0;
		color: var(--fg);
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
		transform-origin: top;
		animation: drip 2.2s var(--ease) infinite;
	}
	@keyframes drip {
		0% {
			transform: scaleY(0);
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
		padding-bottom: 40px;
	}
	.intro,
	.sec-head,
	.parts li,
	.card,
	.cast li,
	.foot {
		opacity: 0;
		transform: translateY(14px);
		transition:
			opacity 0.9s var(--ease) var(--d, 0ms),
			transform 0.9s var(--ease) var(--d, 0ms);
	}
	.intro:global(.in),
	.sec-head:global(.in),
	.parts li:global(.in),
	.card:global(.in),
	.cast li:global(.in),
	.foot:global(.in) {
		opacity: 1;
		transform: none;
	}

	.intro {
		padding: clamp(80px, 14vh, 160px) 0 clamp(40px, 8vh, 90px);
	}
	.lede {
		font-size: clamp(1.35rem, 2.8vw, 2.15rem);
		line-height: 1.35;
		font-weight: 300;
		max-width: 30ch;
		margin: 0;
		letter-spacing: -0.01em;
	}
	.note {
		color: var(--mute);
		margin-top: 26px;
		font-size: 0.64rem;
	}

	section {
		padding-top: clamp(40px, 8vh, 90px);
	}
	.sec-head {
		display: flex;
		gap: 16px;
		align-items: center;
		color: var(--mute);
		margin-bottom: 18px;
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

	.parts {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	.row {
		position: relative;
		display: grid;
		grid-template-columns: 56px 1fr auto auto 24px;
		gap: 24px;
		align-items: baseline;
		padding: 24px 4px;
		border-bottom: 1px solid var(--line);
		isolation: isolate;
	}
	.row::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--bg-2);
		transform: scaleY(0);
		transform-origin: bottom;
		transition: transform 0.45s var(--ease);
		z-index: -1;
	}
	.row::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -1px;
		height: 1px;
		width: 100%;
		background: var(--fg);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.6s var(--ease);
	}
	.row:hover::before {
		transform: scaleY(1);
	}
	.row:hover::after {
		transform: scaleX(1);
	}
	.num {
		color: var(--mute);
		transition: color 0.3s;
	}
	.row:hover .num {
		color: var(--fg);
	}
	.body {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.ptitle {
		font-size: clamp(1.5rem, 3.2vw, 2.4rem);
		font-weight: 300;
		letter-spacing: -0.02em;
		line-height: 1.1;
		transition: transform 0.5s var(--ease);
	}
	.row:hover .ptitle {
		transform: translateX(10px);
	}
	.teaser {
		font-style: italic;
		color: var(--fg-2);
		font-size: 1.02rem;
		display: grid;
		grid-template-rows: 0fr;
		opacity: 0;
		overflow: hidden;
		transition:
			grid-template-rows 0.5s var(--ease),
			opacity 0.4s,
			margin 0.5s var(--ease),
			transform 0.5s var(--ease);
	}
	.row:hover .teaser,
	.row:focus-visible .teaser {
		grid-template-rows: 1fr;
		opacity: 1;
		margin-top: 8px;
		transform: translateX(10px);
	}
	.meta {
		display: flex;
		flex-direction: column;
		gap: 4px;
		text-align: right;
		color: var(--mute);
		font-size: 0.64rem;
	}
	.mins {
		display: flex;
		gap: 10px;
		align-items: center;
		color: var(--mute);
		font-size: 0.64rem;
		white-space: nowrap;
	}
	.read {
		width: 7px;
		height: 7px;
		border: 1px solid var(--mute);
		border-radius: 50%;
	}
	.read.done {
		background: var(--fg);
		border-color: var(--fg);
	}
	.go {
		font-family: var(--mono);
		opacity: 0;
		transform: translateX(-8px);
		transition:
			opacity 0.3s,
			transform 0.4s var(--ease);
	}
	.row:hover .go {
		opacity: 1;
		transform: none;
	}

	.dossier {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1px;
		background: var(--line);
		border: 1px solid var(--line);
	}
	.card {
		position: relative;
		background: var(--bg);
		padding: 28px 28px 34px;
		transition: background 0.4s;
	}
	.card:hover {
		background: var(--bg-2);
	}
	.k {
		color: var(--mute);
		margin: 0 0 14px;
	}
	.v {
		margin: 0;
		font-size: 1.08rem;
		line-height: 1.55;
		color: var(--fg-2);
		max-width: 46ch;
	}
	.corner {
		position: absolute;
		width: 10px;
		height: 10px;
		border-color: var(--fg);
		border-style: solid;
		opacity: 0;
		transition:
			opacity 0.3s,
			transform 0.45s var(--ease);
	}
	.corner.tl {
		top: 8px;
		left: 8px;
		border-width: 1px 0 0 1px;
		transform: translate(6px, 6px);
	}
	.corner.br {
		bottom: 8px;
		right: 8px;
		border-width: 0 1px 1px 0;
		transform: translate(-6px, -6px);
	}
	.card:hover .corner {
		opacity: 1;
		transform: none;
	}

	.cast {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	.cast li {
		display: grid;
		grid-template-columns: minmax(180px, 280px) 1fr;
		gap: 24px;
		align-items: baseline;
		padding: 16px 4px;
		border-bottom: 1px solid var(--line);
	}
	.cname {
		font-size: 1.3rem;
		font-weight: 300;
	}
	.crole {
		color: var(--mute);
		text-transform: none;
		letter-spacing: 0.02em;
		font-size: 0.74rem;
	}

	.foot {
		padding: clamp(90px, 18vh, 200px) 0 40px;
	}
	.sum {
		font-size: clamp(2.4rem, 9vw, 7.5rem);
		font-weight: 300;
		font-style: italic;
		letter-spacing: -0.03em;
		margin: 0 0 48px;
		line-height: 1;
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
		.hud {
			display: none;
		}
		.row {
			grid-template-columns: 34px 1fr auto;
			gap: 14px;
			padding: 20px 0;
		}
		.meta,
		.go {
			display: none;
		}
		.teaser {
			grid-template-rows: 1fr;
			opacity: 1;
			margin-top: 6px;
			font-size: 0.95rem;
		}
		.dossier {
			grid-template-columns: 1fr;
		}
		.card {
			padding: 22px 18px 26px;
		}
		.cast li {
			grid-template-columns: 1fr;
			gap: 4px;
		}
		.boot {
			top: 58px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ch,
		.tagline,
		.cta,
		.kicker,
		.intro,
		.sec-head,
		.parts li,
		.card,
		.cast li,
		.foot {
			transition: none !important;
			opacity: 1 !important;
			transform: none !important;
			filter: none !important;
		}
		.dot,
		.scroll .line {
			animation: none;
		}
	}
</style>
