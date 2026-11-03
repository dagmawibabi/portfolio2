<script lang="ts">
	import { page } from '$app/state';
	import VideoFilters from '../../../components/babitube_components/video_filters.svelte';
	import VideoGrid from '../../../components/babitube_components/video_grid.svelte';
	import { applyFilters, avatarColor, compactNumber, initial, latestAt } from '$lib/babitube/utils';

	let { data } = $props();

	const name = $derived(page.url.searchParams.get('name') ?? '');
	const all = $derived(data.babitube.videos.filter((v) => v.channel === name));
	const first = $derived(all[0]);

	const videos = $derived(
		applyFilters(
			all.toSorted((a, b) => latestAt(b) - latestAt(a)),
			page.url.searchParams
		)
	);
</script>

<svelte:head>
	<title>{name} • BabiTube</title>
</svelte:head>

<div class="channel">
	<header>
		<span class="avatar">
			{#if first?.channelImg}
				<img src={first.channelImg} alt="" referrerpolicy="no-referrer" />
			{:else}
				<span style:background={avatarColor(name)}>{initial(name)}</span>
			{/if}
		</span>
		<div class="text">
			<h1>{name}</h1>
			<p>
				{#if first?.subs != null}{compactNumber(first.subs)} subscribers{' • '}{/if}{all.length}
				{all.length === 1 ? 'video' : 'videos'} shared
			</p>
			{#if first?.channelUrl}
				<a class="subscribe" href={first.channelUrl} target="_blank" rel="noopener">Subscribe</a>
			{/if}
		</div>
	</header>

	<nav class="tabs" aria-label="Channel"><span class="tab active">Videos</span></nav>

	<div class="content">
		<VideoFilters count={videos.length} defaultSort="Latest shared" />
		{#if videos.length}
			<VideoGrid {videos} />
		{:else}
			<p class="empty">No videos match these filters.</p>
		{/if}
	</div>
</div>

<style>
	.channel {
		max-width: 1284px;
		margin: 0 auto;
	}
	header {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 24px 24px 16px;
	}
	.avatar {
		flex-shrink: 0;
		width: 160px;
		height: 160px;
		border-radius: 50%;
		overflow: hidden;
	}
	.avatar img,
	.avatar > span {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		object-fit: cover;
		color: #fff;
		font-size: 64px;
		font-weight: 500;
	}
	.text {
		min-width: 0;
	}
	h1 {
		font-size: 36px;
		line-height: 50px;
		font-weight: 700;
		overflow-wrap: anywhere;
	}
	.text p {
		color: var(--text-2);
		margin-top: 4px;
	}
	.subscribe {
		display: inline-flex;
		align-items: center;
		height: 36px;
		margin-top: 12px;
		padding: 0 16px;
		border-radius: 18px;
		background: var(--chip-active-bg);
		color: var(--chip-active-text);
		font-weight: 500;
	}
	.subscribe:hover {
		opacity: 0.85;
	}
	.tabs {
		display: flex;
		margin: 0 24px;
		border-bottom: 1px solid var(--line);
	}
	.tab {
		padding: 0 0 12px;
		font-size: 16px;
		line-height: 22px;
		font-weight: 500;
	}
	.tab.active {
		border-bottom: 2px solid var(--text);
	}
	.content {
		padding: 16px 24px 48px;
	}
	.empty {
		padding: 64px 0;
		text-align: center;
		color: var(--text-2);
	}
	@media (max-width: 640px) {
		header {
			gap: 16px;
			padding: 16px 12px;
		}
		.avatar {
			width: 72px;
			height: 72px;
		}
		.avatar > span {
			font-size: 30px;
		}
		h1 {
			font-size: 24px;
			line-height: 32px;
		}
		.tabs {
			margin: 0 12px;
		}
		.content {
			padding: 4px 0 32px;
		}
	}
</style>
