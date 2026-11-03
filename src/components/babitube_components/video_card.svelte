<script lang="ts">
	import { page } from '$app/state';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Link from '@lucide/svelte/icons/link';
	import Send from '@lucide/svelte/icons/send';
	import { isSaved, prefs, toggleSaved } from '$lib/babitube/prefs.svelte';
	import {
		avatarColor,
		channelHref,
		compactNumber,
		formatDuration,
		initial,
		latestAt,
		postUrl,
		richToText,
		thumb,
		timeAgo,
		watchHref,
		youtubeUrl,
		type TubeVideo
	} from '$lib/babitube/utils';

	let {
		video,
		layout = 'grid'
	}: {
		video: TubeVideo;
		layout?: 'grid' | 'row' | 'compact';
	} = $props();

	let menuOpen = $state(false);
	let imageFailed = $state(false);

	const href = $derived(watchHref(video));
	const channelName = $derived(video.channel ?? 'Unavailable on YouTube');
	// Videos found inside a playlist were never posted themselves.
	const latestPost = $derived(
		video.posts.length ? video.posts.reduce((a, b) => (b.at > a.at ? b : a)) : undefined
	);
	const when = $derived(
		video.published
			? timeAgo(new Date(video.published).getTime() / 1000)
			: latestPost
				? `Shared ${timeAgo(latestAt(video))}`
				: ''
	);
	const views = $derived(
		video.views != null && !prefs.hideViews ? `${compactNumber(video.views)} views` : ''
	);
	// Only worth the space when it explains the order you're looking at.
	const discussion = $derived(
		page.url.searchParams.get('sort') === 'comments' && video.discussion
			? `${compactNumber(video.discussion)} comments`
			: ''
	);
	const metaLine = $derived([discussion || views, when].filter(Boolean).join(' • '));
	const snippet = $derived(richToText(latestPost?.rich).replace(/\s+/g, ' ').trim());

	async function copyLink() {
		menuOpen = false;
		await navigator.clipboard?.writeText(youtubeUrl(video.id));
	}
</script>

<svelte:window onclick={() => (menuOpen = false)} />

<article class="card {layout}">
	<a class="thumb" {href} aria-label={video.title}>
		{#if !imageFailed}
			<img
				src={thumb(video.id)}
				alt=""
				loading="lazy"
				decoding="async"
				onerror={() => (imageFailed = true)}
			/>
		{/if}
		{#if video.live && !video.duration}
			<span class="badge live">LIVE</span>
		{:else if video.duration}
			<span class="badge">{formatDuration(video.duration)}</span>
		{/if}
	</a>

	<div class="body">
		{#if layout === 'grid'}
			{#if video.channel}
				<a class="avatar" href={channelHref(video.channel)} aria-label={video.channel}>
					{#if video.channelImg}
						<img src={video.channelImg} alt="" loading="lazy" referrerpolicy="no-referrer" />
					{:else}
						<span style:background={avatarColor(video.channel)}>{initial(video.channel)}</span>
					{/if}
				</a>
			{:else}
				<span class="avatar"><span style:background="#717171">?</span></span>
			{/if}
		{/if}

		<div class="details">
			<h3><a {href} title={video.title}>{video.title}</a></h3>

			{#if layout === 'row'}
				<p class="meta">
					{metaLine}
				</p>
				<div class="row-channel">
					{#if video.channel}
						<a class="avatar small" href={channelHref(video.channel)} tabindex="-1" aria-hidden="true">
							{#if video.channelImg}
								<img src={video.channelImg} alt="" loading="lazy" referrerpolicy="no-referrer" />
							{:else}
								<span style:background={avatarColor(video.channel)}>{initial(video.channel)}</span>
							{/if}
						</a>
						<a class="meta name" href={channelHref(video.channel)}>{video.channel}</a>
					{:else}
						<span class="meta">{channelName}</span>
					{/if}
				</div>
				{#if snippet}<p class="meta snippet">{snippet}</p>{/if}
			{:else}
				<p class="meta">
					{#if video.channel}
						<a class="name" href={channelHref(video.channel)}>{video.channel}</a>
					{:else}
						{channelName}
					{/if}
				</p>
				<p class="meta">{metaLine}</p>
			{/if}
		</div>

		<div class="menu-wrap">
			<button
				class="kebab"
				class:open={menuOpen}
				aria-label="Action menu"
				aria-expanded={menuOpen}
				onclick={(e) => {
					e.stopPropagation();
					menuOpen = !menuOpen;
				}}
			>
				<EllipsisVertical size={20} strokeWidth={1.5} />
			</button>
			{#if menuOpen}
				<div class="menu" role="menu">
					<button role="menuitem" onclick={() => toggleSaved(video.id)}>
						{#if isSaved(video.id)}
							<BookmarkCheck size={20} strokeWidth={1.5} /> Remove from Watch later
						{:else}
							<Bookmark size={20} strokeWidth={1.5} /> Save to Watch later
						{/if}
					</button>
					<a role="menuitem" href={youtubeUrl(video.id)} target="_blank" rel="noopener">
						<ExternalLink size={20} strokeWidth={1.5} /> Watch on YouTube
					</a>
					{#if latestPost}
						<a role="menuitem" href={postUrl(latestPost.id)} target="_blank" rel="noopener">
							<Send size={20} strokeWidth={1.5} /> View Telegram post
						</a>
					{/if}
					<button role="menuitem" onclick={copyLink}>
						<Link size={20} strokeWidth={1.5} /> Copy link
					</button>
				</div>
			{/if}
		</div>
	</div>
</article>

<style>
	.card {
		min-width: 0;
		position: relative;
	}
	.thumb {
		position: relative;
		display: block;
		aspect-ratio: 16 / 9;
		border-radius: 12px;
		overflow: hidden;
		background: var(--placeholder);
	}
	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.card:hover .thumb {
		border-radius: 12px;
	}
	.badge {
		position: absolute;
		right: 8px;
		bottom: 8px;
		padding: 1px 4px;
		border-radius: 4px;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 12px;
		line-height: 18px;
		font-weight: 500;
	}
	.badge.live {
		background: #cc0000;
	}
	.body {
		display: flex;
		position: relative;
		padding-top: 12px;
		min-width: 0;
	}
	.avatar {
		flex-shrink: 0;
		display: block;
		width: 36px;
		height: 36px;
		margin-right: 12px;
		border-radius: 50%;
		overflow: hidden;
	}
	.avatar img,
	.avatar span {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		object-fit: cover;
		color: #fff;
		font-size: 16px;
		font-weight: 500;
	}
	.avatar.small {
		width: 24px;
		height: 24px;
		margin-right: 8px;
	}
	.avatar.small span {
		font-size: 12px;
	}
	.details {
		flex: 1;
		min-width: 0;
		padding-right: 24px;
	}
	h3 {
		font-size: 16px;
		line-height: 22px;
		font-weight: 500;
		margin-bottom: 4px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		overflow-wrap: anywhere;
	}
	.meta {
		color: var(--text-2);
		font-size: 14px;
		line-height: 20px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.name:hover {
		color: var(--text);
	}
	.menu-wrap {
		position: absolute;
		top: 8px;
		right: -8px;
	}
	.kebab {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		color: var(--text);
		cursor: pointer;
		opacity: 0;
	}
	.card:hover .kebab,
	.kebab:focus-visible,
	.kebab.open {
		opacity: 1;
	}
	.kebab:hover {
		background: var(--hover);
	}
	.menu {
		position: absolute;
		top: 36px;
		right: 0;
		width: 232px;
		padding: 8px 0;
		background: var(--bg-raised);
		border-radius: 12px;
		box-shadow: var(--menu-shadow);
		z-index: 15;
	}
	.menu a,
	.menu button {
		display: flex;
		align-items: center;
		gap: 16px;
		width: 100%;
		height: 36px;
		padding: 0 16px;
		color: var(--text);
		cursor: pointer;
	}
	.menu a:hover,
	.menu button:hover {
		background: var(--hover);
	}

	/* Search results */
	.row {
		display: flex;
		gap: 16px;
	}
	.row .thumb {
		flex: 0 0 min(500px, 46%);
		min-width: 240px;
	}
	.row .body {
		flex: 1;
		padding-top: 0;
	}
	.row h3 {
		font-size: 18px;
		line-height: 26px;
		font-weight: 400;
	}
	.row .meta {
		font-size: 12px;
		line-height: 18px;
	}
	.row-channel {
		display: flex;
		align-items: center;
		padding: 12px 0;
	}
	.row .snippet {
		white-space: normal;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.row .menu-wrap {
		top: -6px;
	}

	/* Watch page sidebar */
	.compact {
		display: flex;
		gap: 8px;
	}
	.compact .thumb {
		flex: 0 0 168px;
		height: 94px;
		border-radius: 8px;
	}
	.compact .body {
		flex: 1;
		padding-top: 0;
	}
	.compact h3 {
		font-size: 14px;
		line-height: 20px;
	}
	.compact .meta {
		font-size: 12px;
		line-height: 18px;
	}
	.compact .badge {
		right: 4px;
		bottom: 4px;
	}
	.compact .menu-wrap {
		top: -6px;
	}

	@media (hover: none) {
		.kebab {
			opacity: 1;
		}
	}
	@media (max-width: 640px) {
		.grid .thumb {
			border-radius: 0;
		}
		.grid .body {
			padding: 12px 12px 0;
		}
		.grid .menu-wrap {
			right: 4px;
		}
		.row {
			flex-direction: column;
			gap: 0;
		}
		.row .thumb {
			flex: none;
			width: 100%;
			border-radius: 0;
		}
		.row .body {
			padding: 12px;
		}
		.row .menu-wrap {
			top: 6px;
			right: 4px;
		}
	}
</style>
