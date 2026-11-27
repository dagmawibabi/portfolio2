<script lang="ts">
	import { goto } from '$app/navigation';
	import { Heart, ArrowUpRight, Image, Video, Music, FileText, Mic, Plus, Minus, Play } from 'lucide-svelte';
	import RichText from './rich_text.svelte';
	import { spotlight } from './motion';
	import { fmtDate, relative, hash } from '$lib/channel';
	import { headlineOf, bodyOf, favicon, showcaseHref } from '$lib/channel/showcase_text';
	import type { ShowcasePost } from '$lib/channel/showcase';

	let {
		post,
		featured = false,
		rank,
		onCreator
	}: { post: ShowcasePost; featured?: boolean; rank?: number; onCreator?: (h: string) => void } = $props();

	let open = $state(false);
	let playing = $state(false);
	let imgFailed = $state(false);
	const href = $derived(showcaseHref(post.id));
	const h = $derived(hash(post.id));
	const site = $derived(post.links.find((l) => !['t.me', 'telegram.me', 'github.com'].includes(l.host)) ?? post.links[0]);
	const headline = $derived(headlineOf(post));
	const body = $derived(bodyOf(post, headline));
	const initial = $derived(
		(post.title ?? site?.host ?? post.creators[0] ?? '✦').replace(/^[@•\s"“]+/, '').charAt(0).toUpperCase()
	);
	const long = $derived(body.reduce((a, s) => a + s[1].length, 0) > 220);
	const mediaInfo = $derived(
		({
			photo: { icon: Image, label: 'Photo' },
			video_file: { icon: Video, label: 'Video' },
			video_message: { icon: Video, label: 'Video note' },
			animation: { icon: Video, label: 'GIF' },
			audio_file: { icon: Music, label: 'Audio' },
			voice_message: { icon: Mic, label: 'Voice' },
			file: { icon: FileText, label: 'File' }
		} as Record<string, { icon: typeof Image; label: string }>)[post.media ?? ''] ?? null
	);
	const pattern = $derived(h % 4);
	const cover = $derived(imgFailed ? null : post.cover);

	/** The whole card opens the project page, except clicks on its own links and buttons. */
	function openCard(e: MouseEvent) {
		const t = e.target as HTMLElement;
		if (t.closest('a, button, iframe, input, select') || getSelection()?.toString()) return;
		if (e.metaKey || e.ctrlKey) window.open(href, '_blank');
		else goto(href);
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<article class="card" class:featured class:has-img={!!cover} use:spotlight onclick={openCard}>
	<div class="cover p{pattern}" class:icon={cover?.icon}>
		{#if playing && cover?.youtube}
			<iframe
				src="https://www.youtube-nocookie.com/embed/{cover.youtube}?autoplay=1&rel=0"
				title={headline}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		{:else}
			{#if cover}
				<img class="shot" src={cover.image} alt="" loading="lazy" referrerpolicy="no-referrer" onerror={() => (imgFailed = true)} />
				<span class="shade"></span>
			{:else}
				<span class="grain"></span>
				<span class="initial">{initial}</span>
			{/if}
			{#if cover?.youtube}
				<button class="play" onclick={() => (playing = true)} aria-label="Play video here">
					<Play size={18} fill="currentColor" />
				</button>
			{:else}
				<a class="go" {href} aria-label="Open {headline}"><ArrowUpRight size={14} /></a>
			{/if}
			{#if rank}<span class="rank">№{rank}</span>{/if}
			{#if site}
				<span class="tag site">
					<img src={favicon(site.host, 64)} alt="" loading="lazy" width="14" height="14" />
					{site.host}
				</span>
			{/if}
			{#if mediaInfo && !cover}
				<span class="tag media">
					<mediaInfo.icon size={11} />
					{mediaInfo.label}
				</span>
			{/if}
		{/if}
	</div>

	<div class="body">
		<div class="meta">
			<time datetime={post.date} title={relative(post.date)}>{fmtDate(post.date)}</time>
			{#if post.reactions}
				<span class="loves" title="{post.reactions} reactions"><Heart size={12} />{post.reactions}</span>
			{/if}
		</div>
		<h3 class="title"><a {href}>{headline}</a></h3>

		{#if body.length}
			<div class="excerpt" class:clamped={long && !open}>
				<RichText segments={body} class="text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400" />
			</div>
			{#if long}
				<button class="more" onclick={() => (open = !open)} aria-expanded={open}>
					{#if open}<Minus size={11} />{:else}<Plus size={11} />{/if}
					{open ? 'Less' : 'More'}
				</button>
			{/if}
		{/if}

		{#if post.links.length}
			<div class="links">
				{#each post.links.slice(0, 3) as l (l.url)}
					<a href={l.url} target="_blank" rel="noopener noreferrer" class="link">
						<img src={favicon(l.host)} alt="" loading="lazy" width="12" height="12" />
						<span>{l.label.startsWith('http') || l.label.length > 34 ? l.host : l.label}</span>
						<ArrowUpRight size={11} class="arr" />
					</a>
				{/each}
			</div>
		{/if}

		<footer>
			<span class="people">
				{#each post.creators.slice(0, 3) as c (c)}
					<button class="person" onclick={() => onCreator?.(c)} title="See everything by {c}">{c}</button>
				{/each}
			</span>
			<a class="details" {href}>Details <ArrowUpRight size={11} /></a>
		</footer>
	</div>
</article>

<style>
	.card {
		--line: rgb(0 0 0 / 0.08);
		--line-strong: rgb(0 0 0 / 0.22);
		--ink: #0a0a0a;
		--muted: #737373;
		--surface: #fff;
		--wash: #f5f5f5;
		position: relative;
		display: flex;
		flex: 1;
		min-width: 0;
		flex-direction: column;
		overflow: hidden;
		border-radius: 18px;
		background: var(--surface);
		border: 1px solid var(--line);
		cursor: pointer;
		transition:
			border-color 0.35s ease,
			transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.5s ease;
	}
	:global(.dark) .card {
		--line: rgb(255 255 255 / 0.08);
		--line-strong: rgb(255 255 255 / 0.24);
		--ink: #fafafa;
		--muted: #8a8a8a;
		--surface: #0f0f0f;
		--wash: #161616;
	}
	/* cursor spotlight */
	.card::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		border-radius: inherit;
		opacity: 0;
		transition: opacity 0.4s ease;
		background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgb(0 0 0 / 0.04), transparent 60%);
	}
	:global(.dark) .card::after {
		background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.05), transparent 60%);
	}
	.card:hover {
		border-color: var(--line-strong);
		transform: translateY(-2px);
		box-shadow: 0 24px 48px -32px rgb(0 0 0 / 0.35);
	}
	.card:hover::after {
		opacity: 1;
	}

	/* ---------- cover ---------- */
	.cover {
		position: relative;
		display: block;
		aspect-ratio: 1.91;
		overflow: hidden;
		background: var(--wash);
		border-bottom: 1px solid var(--line);
		color: var(--ink);
	}
	.cover::before {
		content: '';
		position: absolute;
		inset: -24px;
		opacity: 0.55;
		transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.has-img .cover:not(.icon)::before {
		display: none;
	}
	.card:hover .cover::before {
		transform: translate(-10px, -6px);
	}
	.p0::before {
		background-image: radial-gradient(currentColor 0.8px, transparent 0.8px);
		background-size: 12px 12px;
		opacity: 0.18;
	}
	.p1::before {
		background-image: repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 9px);
		opacity: 0.09;
	}
	.p2::before {
		background-image:
			linear-gradient(currentColor 1px, transparent 1px),
			linear-gradient(90deg, currentColor 1px, transparent 1px);
		background-size: 20px 20px;
		opacity: 0.07;
	}
	.p3::before {
		background-image: repeating-radial-gradient(circle at 100% 100%, currentColor 0 1px, transparent 1px 14px);
		opacity: 0.1;
	}
	.shot {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.card:hover .shot {
		transform: scale(1.04);
	}
	/* avatars and app icons: shown whole, centred on the pattern */
	.icon .shot {
		inset: 50% auto auto 50%;
		width: 34%;
		height: auto;
		aspect-ratio: 1;
		translate: -50% -50%;
		border-radius: 22%;
		box-shadow: 0 12px 32px -12px rgb(0 0 0 / 0.35);
	}
	.icon .shade {
		display: none;
	}
	.shade {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgb(0 0 0 / 0.25), transparent 35%, transparent 70%, rgb(0 0 0 / 0.25));
		pointer-events: none;
	}
	iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.grain {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 40%, var(--wash));
	}
	.initial {
		position: absolute;
		right: 16px;
		bottom: -30px;
		font-size: 128px;
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.06em;
		color: transparent;
		-webkit-text-stroke: 1px color-mix(in oklab, var(--ink) 22%, transparent);
		transition:
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			color 0.5s ease,
			-webkit-text-stroke-color 0.5s ease;
	}
	.featured .initial {
		font-size: 170px;
		bottom: -42px;
	}
	.card:hover .initial {
		transform: translateY(-8px);
		color: color-mix(in oklab, var(--ink) 6%, transparent);
		-webkit-text-stroke-color: color-mix(in oklab, var(--ink) 40%, transparent);
	}
	.rank {
		position: absolute;
		left: 12px;
		bottom: 12px;
		padding: 2px 8px;
		border-radius: 999px;
		background: color-mix(in oklab, var(--surface) 85%, transparent);
		backdrop-filter: blur(8px);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 11px;
		color: var(--ink);
	}
	.go {
		position: absolute;
		right: 12px;
		top: 12px;
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 999px;
		background: var(--ink);
		color: var(--surface);
		opacity: 0;
		transform: scale(0.6) rotate(-45deg);
		transition:
			opacity 0.3s ease,
			transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.card:hover .go,
	.go:focus-visible {
		opacity: 1;
		transform: scale(1) rotate(0);
	}
	.play {
		position: absolute;
		left: 50%;
		top: 50%;
		display: grid;
		place-items: center;
		width: 54px;
		height: 54px;
		translate: -50% -50%;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.92);
		color: #0a0a0a;
		padding-left: 3px;
		box-shadow: 0 10px 30px -8px rgb(0 0 0 / 0.5);
		transition:
			transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
			background 0.2s,
			color 0.2s;
	}
	.play::before {
		content: '';
		position: absolute;
		inset: -6px;
		border-radius: inherit;
		border: 1.5px solid rgb(255 255 255 / 0.7);
		animation: ring 2.2s ease-out infinite;
	}
	@keyframes ring {
		from {
			transform: scale(0.9);
			opacity: 1;
		}
		to {
			transform: scale(1.35);
			opacity: 0;
		}
	}
	.card:hover .play,
	.play:focus-visible {
		transform: scale(1.1);
		background: #ff0033;
		color: white;
	}
	.tag {
		position: absolute;
		left: 12px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 9px 4px 7px;
		border-radius: 999px;
		font-size: 11px;
		background: color-mix(in oklab, var(--surface) 85%, transparent);
		border: 1px solid var(--line);
		backdrop-filter: blur(8px);
		color: var(--ink);
	}
	.site {
		top: 12px;
		max-width: calc(100% - 64px);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.media {
		bottom: 12px;
		color: var(--muted);
	}
	.featured .media {
		left: auto;
		right: 12px;
	}
	.tag img,
	.link img {
		border-radius: 3px;
	}

	/* ---------- body ---------- */
	.body {
		position: relative;
		z-index: 1;
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 10px;
		padding: 16px 18px 14px;
	}
	.meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 10.5px;
		letter-spacing: 0.02em;
		color: var(--muted);
		text-transform: uppercase;
	}
	.loves {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: #e11d48;
		font-weight: 500;
	}
	:global(.dark) .loves {
		color: #fb7185;
	}
	.loves :global(svg) {
		fill: currentColor;
	}
	.card:hover .loves :global(svg) {
		animation: beat 0.9s ease;
	}
	@keyframes beat {
		0%,
		100% {
			transform: scale(1);
		}
		25% {
			transform: scale(1.3);
		}
		45% {
			transform: scale(0.95);
		}
		65% {
			transform: scale(1.15);
		}
	}
	.title {
		font-size: 16.5px;
		font-weight: 500;
		line-height: 1.3;
		letter-spacing: -0.015em;
		color: var(--ink);
	}
	.title a {
		background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
		transition: background-size 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.card:hover .title a {
		background-size: 100% 1px;
	}
	.featured .title {
		font-size: 20px;
	}
	.excerpt.clamped {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
		mask-image: linear-gradient(180deg, black 60%, transparent);
	}
	.more {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		width: fit-content;
		margin-top: -4px;
		font-size: 11.5px;
		font-weight: 500;
		color: var(--ink);
		opacity: 0.6;
		transition: opacity 0.2s;
	}
	.more:hover {
		opacity: 1;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		max-width: 100%;
		padding: 4px 9px;
		border-radius: 8px;
		font-size: 12px;
		border: 1px solid var(--line);
		color: var(--ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.link span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.link :global(.arr) {
		opacity: 0.5;
		transition: transform 0.25s ease;
	}
	.link:hover {
		border-color: var(--line-strong);
		background: var(--wash);
	}
	.link:hover :global(.arr) {
		transform: translate(2px, -2px);
		opacity: 1;
	}
	footer {
		margin-top: auto;
		padding-top: 12px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		border-top: 1px solid var(--line);
		font-size: 12px;
		color: var(--muted);
	}
	.people {
		display: flex;
		min-width: 0;
		gap: 10px;
		overflow: hidden;
	}
	.person {
		position: relative;
		white-space: nowrap;
		color: var(--ink);
		opacity: 0.75;
		transition: opacity 0.2s;
	}
	.person::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -2px;
		height: 1px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.3s ease;
	}
	.person:hover {
		opacity: 1;
	}
	.person:hover::after {
		transform: scaleX(1);
		transform-origin: left;
	}
	.details {
		display: inline-flex;
		flex-shrink: 0;
		align-items: center;
		gap: 3px;
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		transition: color 0.2s;
	}
	.details :global(svg) {
		transition: transform 0.3s ease;
	}
	.card:hover .details {
		color: var(--ink);
	}
	.card:hover .details :global(svg) {
		transform: translate(2px, -2px);
	}
	@media (prefers-reduced-motion: reduce) {
		.card,
		.card *,
		.card::before,
		.cover::before,
		.play::before {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
