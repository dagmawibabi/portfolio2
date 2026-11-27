<script lang="ts">
	import { goto } from '$app/navigation';
	import { mode } from 'mode-watcher';
	import {
		ArrowLeft,
		ArrowRight,
		ArrowUpRight,
		Heart,
		Play,
		Send,
		Link2,
		Check,
		CalendarDays,
		Image,
		Video,
		Music,
		FileText,
		Mic
	} from 'lucide-svelte';
	import SiteNav from '../../../components/channel_components/site_nav.svelte';
	import ShowcaseCard from '../../../components/channel_components/showcase_card.svelte';
	import RichText from '../../../components/channel_components/rich_text.svelte';
	import { reveal, spotlight } from '../../../components/channel_components/motion';
	import '../../../components/channel_components/showcase.css';
	import { fmtDate, relative, postUrl, CHANNEL, hash } from '$lib/channel';
	import { headlineOf, bodyOf, favicon, tgProfile, showcaseHref } from '$lib/channel/showcase_text';
	import type { ShowcaseLink } from '$lib/channel/showcase';

	let { data } = $props();
	const post = $derived(data.post);
	const headline = $derived(headlineOf(post));
	const body = $derived(bodyOf(post, headline));
	const plain = $derived(body.map((s) => s[1]).join('').replace(/\s+/g, ' ').trim());
	const people = $derived(post.creators.filter((c) => !/bot$/i.test(c)));
	const bots = $derived(post.creators.filter((c) => /bot$/i.test(c)));

	const video = $derived(post.links.find((l) => l.embed?.kind === 'youtube'));
	const otherEmbeds = $derived(post.links.filter((l) => l.embed && l.embed.kind !== 'youtube'));
	const previewLinks = $derived(
		post.links.filter((l) => l.host !== 't.me' && l.host !== 'telegram.me' && l.url !== video?.url && !l.embed)
	);
	const heroImage = $derived(!video && post.cover && !post.cover.icon ? post.cover.image : null);
	const mediaLabel = $derived(
		(
			({
				photo: { icon: Image, label: 'Photo' },
				video_file: { icon: Video, label: 'Video' },
				video_message: { icon: Video, label: 'Video note' },
				animation: { icon: Video, label: 'GIF' },
				audio_file: { icon: Music, label: 'Audio' },
				voice_message: { icon: Mic, label: 'Voice note' },
				file: { icon: FileText, label: 'File' }
			}) as Record<string, { icon: typeof Image; label: string }>
		)[post.media ?? ''] ?? null
	);

	let playing = $state(false);
	let heroFailed = $state(false);
	let copied = $state(false);
	// reset per-post UI state when navigating between projects
	$effect(() => {
		void post.id;
		playing = false;
		heroFailed = false;
	});

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(location.href);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			/* clipboard blocked */
		}
	}
	async function share() {
		if (navigator.share) {
			try {
				await navigator.share({ title: headline, url: location.href });
			} catch {
				/* dismissed */
			}
		} else copyLink();
	}

	const label = (l: ShowcaseLink) => (l.label.startsWith('http') || l.label.length > 40 ? l.host : l.label);
	const failed = $state<Record<string, boolean>>({});

	// The channel post itself, embedded with Telegram's widget so its photos/videos show here.
	let tgBox: HTMLDivElement | undefined = $state();
	let tgLoaded = $state(false);
	function mountTelegram() {
		if (!tgBox) return;
		tgBox.innerHTML = '';
		tgLoaded = false;
		const s = document.createElement('script');
		s.async = true;
		s.src = 'https://telegram.org/js/telegram-widget.js?22';
		s.dataset.telegramPost = `${CHANNEL}/${post.id}`;
		s.dataset.width = '100%';
		s.dataset.userpic = 'false';
		if (mode.current === 'dark') s.dataset.dark = '1';
		tgBox.appendChild(s);
		const check = setInterval(() => {
			const f = tgBox?.querySelector('iframe');
			if (f && f.offsetHeight > 60) {
				tgLoaded = true;
				clearInterval(check);
			}
		}, 300);
		setTimeout(() => clearInterval(check), 15000);
	}
	$effect(() => {
		void post.id;
		void mode.current;
		if (tgBox) mountTelegram();
	});

	function onKey(e: KeyboardEvent) {
		if (/input|textarea|select/i.test((e.target as HTMLElement).tagName)) return;
		if (e.key === 'ArrowLeft' && data.newer) goto(showcaseHref(data.newer.id));
		if (e.key === 'ArrowRight' && data.older) goto(showcaseHref(data.older.id));
	}
</script>

<svelte:window onkeydown={onKey} />

<svelte:head>
	<title>{headline} — Community Showcase</title>
	<meta name="description" content={plain.slice(0, 180) || `A community showcase by ${post.creators.join(', ')}`} />
	<meta property="og:title" content={headline} />
	<meta property="og:description" content={plain.slice(0, 180)} />
	{#if post.cover}<meta property="og:image" content={post.cover.image} />{/if}
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" />
</svelte:head>

<div class="sc-page min-h-screen">
	<div class="mx-auto w-[92%] max-w-6xl">
		<SiteNav />
	</div>

	{#key post.id}
		<main class="mx-auto w-[92%] max-w-6xl pb-32">
			<!-- breadcrumb / pager -->
			<div class="crumbs enter" style="--i:0">
				<a href="/communityshowcase" class="back"><ArrowLeft size={14} /> All showcases</a>
				<div class="flex items-center gap-1">
					<span class="sc-mono mr-2 text-[11px] text-[var(--muted)]">№{data.index} / {data.total}</span>
					{#if data.newer}
						<a class="nav-btn" href={showcaseHref(data.newer.id)} aria-label="Newer showcase" title="Newer (←)"><ArrowLeft size={14} /></a>
					{:else}<span class="nav-btn off"><ArrowLeft size={14} /></span>{/if}
					{#if data.older}
						<a class="nav-btn" href={showcaseHref(data.older.id)} aria-label="Older showcase" title="Older (→)"><ArrowRight size={14} /></a>
					{:else}<span class="nav-btn off"><ArrowRight size={14} /></span>{/if}
				</div>
			</div>

			<!-- header -->
			<header class="pt-10 md:pt-16">
				<div class="meta enter sc-mono" style="--i:1">
					<span class="flex items-center gap-1.5"><CalendarDays size={12} />{fmtDate(post.date)}</span>
					<span class="dot-sep"></span>
					<span>{relative(post.date)}</span>
					{#each post.categories as c (c)}
						<span class="dot-sep"></span>
						<a href="/communityshowcase?category={encodeURIComponent(c)}" class="cat">{c}</a>
					{/each}
				</div>
				<h1 class="title enter" style="--i:2">{headline}</h1>

				<div class="byline enter" style="--i:3">
					{#each people as c (c)}
						<a class="maker" href={tgProfile(c)} target="_blank" rel="noopener noreferrer">
							<span class="avatar" style="--g:{hash(c) % 5}">{c.charAt(1).toUpperCase()}</span>
							<span>{c}</span>
							<ArrowUpRight size={12} class="arr" />
						</a>
					{/each}
					{#each bots as c (c)}
						<a class="maker bot" href={tgProfile(c)} target="_blank" rel="noopener noreferrer">{c}<ArrowUpRight size={12} class="arr" /></a>
					{/each}
					{#if post.reactions}
						<span class="loves"><Heart size={14} />{post.reactions} reactions</span>
					{/if}
				</div>
			</header>

			<!-- hero media -->
			{#if video?.embed?.kind === 'youtube'}
				<div class="hero enter" style="--i:4">
					{#if playing}
						<iframe
							src={video.embed.src}
							title={headline}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						></iframe>
					{:else}
						<button class="poster" onclick={() => (playing = true)} aria-label="Play video">
							<img src="https://i.ytimg.com/vi/{video.embed.id}/maxresdefault.jpg" alt="" onerror={(e) => ((e.currentTarget as HTMLImageElement).src = video.embed?.kind === 'youtube' ? video.embed.thumb : '')} />
							<span class="big-play"><Play size={26} fill="currentColor" /></span>
							<span class="yt-label sc-mono">Watch here · YouTube</span>
						</button>
					{/if}
				</div>
			{:else if heroImage && !heroFailed}
				<a class="hero img enter" style="--i:4" href={post.links.find((l) => l.preview?.image === heroImage)?.url ?? postUrl(post.id)} target="_blank" rel="noopener noreferrer">
					<img src={heroImage} alt="Preview of {headline}" referrerpolicy="no-referrer" onerror={() => (heroFailed = true)} />
					<span class="hero-host"><img src={favicon(post.cover?.host ?? '', 64)} alt="" width="14" height="14" />{post.cover?.host}<ArrowUpRight size={12} /></span>
				</a>
			{/if}

			<!-- body + aside -->
			<div class="mt-14 grid gap-12 lg:grid-cols-[1fr_320px]">
				<article use:reveal>
					<h2 class="eyebrow sc-mono">About</h2>
					{#if body.length}
						<RichText segments={body} class="text-[17px] leading-[1.75] text-[var(--ink)] opacity-85" />
					{:else}
						<p class="text-[var(--muted)]">No description — the post speaks through its media.</p>
					{/if}
					{#if post.tags.length}
						<div class="mt-8 flex flex-wrap gap-1.5">
							{#each post.tags as t (t)}
								<a class="tagchip sc-mono" href="/communityshowcase?q={encodeURIComponent(t)}">#{t}</a>
							{/each}
						</div>
					{/if}
				</article>

				<aside class="side" use:reveal={100}>
					<div class="panel">
						<a class="btn primary w-full" href={postUrl(post.id)} target="_blank" rel="noopener noreferrer">
							<Send size={14} /> Open on Telegram
						</a>
						<div class="mt-2 grid grid-cols-2 gap-2">
							<button class="btn ghost" onclick={copyLink}>
								{#if copied}<span class="ok"><Check size={14} /></span> Copied{:else}<Link2 size={14} /> Copy link{/if}
							</button>
							<button class="btn ghost" onclick={share}><ArrowUpRight size={14} /> Share</button>
						</div>
						<dl class="facts">
							<div><dt>Posted</dt><dd>{fmtDate(post.date)}</dd></div>
							{#if post.reactions}<div><dt>Reactions</dt><dd class="love-dd"><Heart size={12} />{post.reactions}</dd></div>{/if}
							{#if mediaLabel}<div><dt>Media</dt><dd class="flex items-center gap-1.5"><mediaLabel.icon size={12} />{mediaLabel.label}</dd></div>{/if}
							{#if post.forwarded}<div><dt>Via</dt><dd class="truncate">{post.forwarded}</dd></div>{/if}
							<div><dt>Post</dt><dd><a class="sc-mono text-[12px] hover:underline" href={postUrl(post.id)} target="_blank" rel="noopener noreferrer">#{post.id}</a></dd></div>
						</dl>
					</div>

					{#if post.links.length}
						<h3 class="eyebrow sc-mono mt-8">Links</h3>
						<ul class="linklist">
							{#each post.links as l (l.url)}
								<li>
									<a href={l.url} target="_blank" rel="noopener noreferrer">
										<img src={favicon(l.host, 64)} alt="" width="16" height="16" loading="lazy" />
										<span class="min-w-0 flex-1">
											<span class="block truncate text-[13.5px]">{l.preview?.title ?? label(l)}</span>
											<span class="sc-mono block truncate text-[10.5px] text-[var(--muted)]">{l.host}</span>
										</span>
										<ArrowUpRight size={14} class="arr" />
									</a>
								</li>
							{/each}
						</ul>
					{/if}

					{#if people.length}
						<h3 class="eyebrow sc-mono mt-8">More from</h3>
						<div class="flex flex-col gap-1">
							{#each people as c (c)}
								<a class="see-all" href="/communityshowcase?maker={encodeURIComponent(c)}">Everything by {c} <ArrowRight size={13} /></a>
							{/each}
						</div>
					{/if}
				</aside>
			</div>

			<!-- link previews & embeds -->
			{#if previewLinks.length || otherEmbeds.length}
				<section class="mt-20">
					<h2 class="eyebrow sc-mono" use:reveal>Previews</h2>
					{#each otherEmbeds as l (l.url)}
						{#if l.embed && l.embed.kind !== 'youtube'}
							<div class="embed" use:reveal style={l.embed.height ? `height:${l.embed.height}px` : 'aspect-ratio:16/9'}>
								<iframe src={l.embed.src} title={label(l)} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>
							</div>
						{/if}
					{/each}
					<div class="grid gap-4 sm:grid-cols-2">
						{#each previewLinks as l, i (l.url)}
							<a class="pv" href={l.url} target="_blank" rel="noopener noreferrer" use:reveal={(i % 2) * 80} use:spotlight>
								{#if l.preview?.image && !failed[l.url]}
									<span class="pv-img" class:icon={['play.google.com', 'youtube.com', 'instagram.com', 'pub.dev', 'npmjs.com'].includes(l.host)}>
										<img src={l.preview.image} alt="" loading="lazy" referrerpolicy="no-referrer" onerror={() => (failed[l.url] = true)} />
									</span>
								{/if}
								<span class="pv-body">
									<span class="pv-host sc-mono"><img src={favicon(l.host)} alt="" width="12" height="12" />{l.preview?.site ?? l.host}</span>
									<span class="pv-title">{l.preview?.title ?? label(l)}</span>
									{#if l.preview?.description}<span class="pv-desc">{l.preview.description}</span>{/if}
									<span class="pv-url sc-mono">{l.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}<ArrowUpRight size={11} /></span>
								</span>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			<!-- the original post -->
			<section class="mt-20">
				<h2 class="eyebrow sc-mono" use:reveal>Original post</h2>
				<div class="tg-wrap" use:reveal>
					{#if !tgLoaded}
						<div class="tg-skeleton">
							<span></span><span></span><span></span>
							<a href={postUrl(post.id)} target="_blank" rel="noopener noreferrer" class="sc-mono">t.me/{CHANNEL}/{post.id} <ArrowUpRight size={11} /></a>
						</div>
					{/if}
					<div bind:this={tgBox} class="tg" class:ready={tgLoaded}></div>
				</div>
			</section>

			{#if data.byMakers.length}
				<section class="mt-24">
					<h2 class="eyebrow sc-mono" use:reveal>More by {people.join(', ') || 'these makers'}</h2>
					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each data.byMakers as p, i (p.id)}
							<div class="flex" use:reveal={(i % 3) * 70}>
								<ShowcaseCard post={p} onCreator={(h) => goto(`/communityshowcase?maker=${encodeURIComponent(h)}`)} />
							</div>
						{/each}
					</div>
				</section>
			{/if}

			{#if data.related.length}
				<section class="mt-24">
					<h2 class="eyebrow sc-mono" use:reveal>Around the same time</h2>
					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each data.related as p, i (p.id)}
							<div class="flex" use:reveal={(i % 3) * 70}>
								<ShowcaseCard post={p} onCreator={(h) => goto(`/communityshowcase?maker=${encodeURIComponent(h)}`)} />
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<!-- pager -->
			<nav class="pager" use:reveal>
				{#if data.newer}
					<a href={showcaseHref(data.newer.id)} class="pg">
						<span class="sc-mono pg-k"><ArrowLeft size={12} /> Newer</span>
						<span class="pg-t">{data.newer.title ?? `Showcase #${data.newer.id}`}</span>
					</a>
				{:else}<span></span>{/if}
				{#if data.older}
					<a href={showcaseHref(data.older.id)} class="pg right">
						<span class="sc-mono pg-k">Older <ArrowRight size={12} /></span>
						<span class="pg-t">{data.older.title ?? `Showcase #${data.older.id}`}</span>
					</a>
				{/if}
			</nav>
		</main>
	{/key}
</div>

<style>
	.enter {
		animation: rise 0.9s var(--ease) both;
		animation-delay: calc(var(--i) * 70ms + 60ms);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(14px);
			filter: blur(4px);
		}
	}
	.crumbs {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 24px;
	}
	.back {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		color: var(--muted);
		transition: color 0.2s;
	}
	.back :global(svg) {
		transition: transform 0.3s var(--ease);
	}
	.back:hover {
		color: var(--ink);
	}
	.back:hover :global(svg) {
		transform: translateX(-3px);
	}
	.nav-btn {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 999px;
		border: 1px solid var(--line);
		transition:
			border-color 0.2s,
			background 0.2s,
			transform 0.15s;
	}
	.nav-btn:hover {
		border-color: var(--ink);
		background: var(--surface);
	}
	.nav-btn:active {
		transform: scale(0.92);
	}
	.nav-btn.off {
		opacity: 0.3;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.dot-sep {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--line-strong);
	}
	.cat {
		color: var(--ink);
		background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
		transition: background-size 0.35s var(--ease);
	}
	.cat:hover {
		background-size: 100% 1px;
	}
	.title {
		margin-top: 20px;
		max-width: 22ch;
		font-size: clamp(36px, 6.5vw, 84px);
		font-weight: 500;
		line-height: 0.98;
		letter-spacing: -0.05em;
		text-wrap: balance;
	}
	.byline {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		margin-top: 28px;
	}
	.maker {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 36px;
		padding: 0 12px 0 4px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--surface);
		font-size: 13.5px;
		transition: border-color 0.2s;
	}
	.maker.bot {
		padding-left: 12px;
		color: var(--muted);
	}
	.maker:hover {
		border-color: var(--line-strong);
	}
	.maker :global(.arr) {
		opacity: 0.4;
		transition:
			transform 0.3s var(--ease),
			opacity 0.2s;
	}
	.maker:hover :global(.arr) {
		opacity: 1;
		transform: translate(2px, -2px);
	}
	.avatar {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		font-size: 12px;
		font-weight: 600;
		background: color-mix(in oklab, var(--ink) calc(8% + var(--g) * 4%), var(--surface));
	}
	.loves {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-left: 6px;
		font-size: 13px;
		color: var(--love);
	}
	.loves :global(svg),
	.love-dd :global(svg) {
		fill: currentColor;
		animation: beat 1.6s ease 1s 2;
	}
	@keyframes beat {
		0%,
		60%,
		100% {
			transform: scale(1);
		}
		15% {
			transform: scale(1.3);
		}
		30% {
			transform: scale(0.95);
		}
		45% {
			transform: scale(1.15);
		}
	}

	.hero {
		position: relative;
		display: block;
		margin-top: 48px;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-radius: 22px;
		border: 1px solid var(--line);
		background: var(--wash);
	}
	.hero.img {
		aspect-ratio: auto;
		max-height: 620px;
	}
	.hero.img > img {
		width: 100%;
		max-height: 620px;
		object-fit: cover;
		transition: transform 1.2s var(--ease);
	}
	.hero.img:hover > img {
		transform: scale(1.02);
	}
	.hero-host {
		position: absolute;
		left: 16px;
		bottom: 16px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px 6px 9px;
		border-radius: 999px;
		font-size: 12px;
		background: color-mix(in oklab, var(--surface) 85%, transparent);
		backdrop-filter: blur(10px);
		border: 1px solid var(--line);
	}
	.hero iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.poster {
		position: absolute;
		inset: 0;
		width: 100%;
		cursor: pointer;
	}
	.poster img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition:
			transform 1.2s var(--ease),
			filter 0.5s;
	}
	.poster:hover img {
		transform: scale(1.03);
		filter: brightness(0.85);
	}
	.big-play {
		position: absolute;
		left: 50%;
		top: 50%;
		display: grid;
		place-items: center;
		width: 84px;
		height: 84px;
		padding-left: 4px;
		translate: -50% -50%;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.94);
		color: #0a0a0a;
		box-shadow: 0 20px 50px -12px rgb(0 0 0 / 0.6);
		transition:
			transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
			background 0.2s,
			color 0.2s;
	}
	.big-play::before {
		content: '';
		position: absolute;
		inset: -8px;
		border-radius: inherit;
		border: 2px solid rgb(255 255 255 / 0.7);
		animation: ring 2.2s ease-out infinite;
	}
	@keyframes ring {
		from {
			transform: scale(0.9);
			opacity: 1;
		}
		to {
			transform: scale(1.4);
			opacity: 0;
		}
	}
	.poster:hover .big-play {
		transform: scale(1.08);
		background: #ff0033;
		color: white;
	}
	.yt-label {
		position: absolute;
		left: 16px;
		bottom: 16px;
		padding: 5px 10px;
		border-radius: 999px;
		font-size: 11px;
		color: white;
		background: rgb(0 0 0 / 0.55);
		backdrop-filter: blur(8px);
	}

	.eyebrow {
		margin-bottom: 18px;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.tagchip {
		padding: 4px 10px;
		border-radius: 999px;
		border: 1px solid var(--line);
		font-size: 11px;
		color: var(--muted);
		transition:
			color 0.2s,
			border-color 0.2s;
	}
	.tagchip:hover {
		color: var(--ink);
		border-color: var(--line-strong);
	}

	.side {
		align-self: start;
	}
	@media (min-width: 1024px) {
		.side {
			position: sticky;
			top: 24px;
		}
	}
	.panel {
		padding: 16px;
		border-radius: 18px;
		border: 1px solid var(--line);
		background: var(--surface);
	}
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		height: 40px;
		padding: 0 14px;
		border-radius: 12px;
		font-size: 13.5px;
		font-weight: 500;
		transition:
			background 0.25s,
			border-color 0.25s,
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
		border: 1px solid var(--line);
	}
	.btn.ghost:hover {
		border-color: var(--line-strong);
		background: var(--wash);
	}
	.ok {
		display: inline-grid;
		animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes pop {
		from {
			transform: scale(0);
		}
	}
	.facts {
		margin-top: 14px;
	}
	.facts > div {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 9px 2px;
		border-top: 1px solid var(--line);
		font-size: 13px;
	}
	.facts dt {
		color: var(--muted);
	}
	.facts dd {
		min-width: 0;
	}
	.love-dd {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		color: var(--love);
	}
	.linklist {
		border-top: 1px solid var(--line);
	}
	.linklist a {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 11px 4px;
		border-bottom: 1px solid var(--line);
		transition: padding 0.3s var(--ease);
	}
	.linklist img {
		border-radius: 4px;
		flex-shrink: 0;
	}
	.linklist a:hover {
		padding-left: 10px;
	}
	.linklist :global(.arr) {
		flex-shrink: 0;
		color: var(--muted);
		transition: transform 0.3s var(--ease);
	}
	.linklist a:hover :global(.arr) {
		transform: translate(2px, -2px);
		color: var(--ink);
	}
	.see-all {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13.5px;
	}
	.see-all :global(svg) {
		transition: transform 0.3s var(--ease);
	}
	.see-all:hover :global(svg) {
		transform: translateX(4px);
	}

	.embed {
		position: relative;
		margin-bottom: 16px;
		overflow: hidden;
		border-radius: 16px;
		border: 1px solid var(--line);
		background: var(--wash);
	}
	.embed iframe {
		width: 100%;
		height: 100%;
		border: 0;
	}
	.pv {
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 18px;
		border: 1px solid var(--line);
		background: var(--surface);
		transition:
			border-color 0.3s,
			transform 0.5s var(--ease),
			box-shadow 0.5s;
	}
	.pv::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.4s;
		background: radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--ink) 5%, transparent), transparent 60%);
	}
	.pv:hover {
		border-color: var(--line-strong);
		transform: translateY(-2px);
		box-shadow: 0 24px 48px -32px rgb(0 0 0 / 0.35);
	}
	.pv:hover::after {
		opacity: 1;
	}
	.pv-img {
		position: relative;
		display: block;
		aspect-ratio: 1.91;
		overflow: hidden;
		border-bottom: 1px solid var(--line);
		background: var(--wash);
	}
	.pv-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.9s var(--ease);
	}
	.pv:hover .pv-img img {
		transform: scale(1.04);
	}
	.pv-img.icon {
		background-image: radial-gradient(color-mix(in oklab, var(--ink) 15%, transparent) 0.8px, transparent 0.8px);
		background-size: 12px 12px;
	}
	.pv-img.icon img {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 30%;
		height: auto;
		aspect-ratio: 1;
		translate: -50% -50%;
		border-radius: 22%;
		box-shadow: 0 12px 32px -12px rgb(0 0 0 / 0.35);
	}
	.pv-body {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 6px;
		padding: 14px 16px 14px;
	}
	.pv-host {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--muted);
	}
	.pv-host img {
		border-radius: 3px;
	}
	.pv-title {
		font-size: 15.5px;
		font-weight: 500;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}
	.pv-desc {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-size: 13px;
		line-height: 1.55;
		color: var(--muted);
	}
	.pv-url {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-top: auto;
		padding-top: 6px;
		overflow: hidden;
		font-size: 11px;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--muted);
	}

	.tg-wrap {
		position: relative;
		max-width: 560px;
	}
	.tg {
		opacity: 0;
		transition: opacity 0.6s;
	}
	.tg.ready {
		opacity: 1;
	}
	.tg-skeleton {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 20px;
		border-radius: 16px;
		border: 1px solid var(--line);
		background: var(--surface);
	}
	.tg-skeleton span {
		height: 12px;
		border-radius: 6px;
		background: linear-gradient(90deg, var(--wash), color-mix(in oklab, var(--ink) 8%, var(--wash)), var(--wash));
		background-size: 200% 100%;
		animation: shimmer 1.4s linear infinite;
	}
	.tg-skeleton span:nth-child(2) {
		width: 80%;
	}
	.tg-skeleton span:nth-child(3) {
		width: 55%;
	}
	.tg-skeleton a {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-top: 6px;
		font-size: 11px;
		color: var(--muted);
	}
	@keyframes shimmer {
		to {
			background-position: -200% 0;
		}
	}

	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-top: 96px;
		border-top: 1px solid var(--line);
	}
	.pg {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 28px 0;
	}
	.pg.right {
		grid-column: 2;
		text-align: right;
		align-items: flex-end;
	}
	.pg-k {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.pg-t {
		font-size: clamp(18px, 2.4vw, 26px);
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.15;
		transition: transform 0.4s var(--ease);
	}
	.pg:hover .pg-t {
		transform: translateX(6px);
	}
	.pg:not(.right):hover .pg-t {
		transform: translateX(-6px);
	}
	@media (prefers-reduced-motion: reduce) {
		.enter,
		.big-play::before,
		.tg-skeleton span,
		.loves :global(svg) {
			animation: none;
		}
	}
</style>
