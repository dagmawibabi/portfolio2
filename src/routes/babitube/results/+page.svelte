<script lang="ts">
	import { page } from '$app/state';
	import ChipBar from '../../../components/babitube_components/chip_bar.svelte';
	import VideoFilters from '../../../components/babitube_components/video_filters.svelte';
	import VideoGrid from '../../../components/babitube_components/video_grid.svelte';
	import { CATEGORIES, applyFilters, filterParams, matchVideos } from '$lib/babitube/utils';

	let { data } = $props();

	const query = $derived(page.url.searchParams.get('search_query') ?? '');
	const active = $derived(page.url.searchParams.get('c'));
	const matches = $derived(matchVideos(data.babitube.videos, query));
	const videos = $derived(
		applyFilters(
			active ? matches.filter((v) => v.cats.includes(active)) : matches,
			page.url.searchParams
		)
	);

	const kept = $derived(filterParams(page.url.searchParams));
	const base = $derived(
		`/babitube/results?search_query=${encodeURIComponent(query)}${kept ? `&${kept}` : ''}`
	);
	const chips = $derived([
		{ label: 'All', href: base, active: !active },
		...CATEGORIES.map((c) => ({
			...c,
			count: matches.filter((v) => v.cats.includes(c.key)).length
		}))
			.filter((c) => c.count)
			.sort((a, b) => b.count - a.count)
			.map((c) => ({ label: c.label, href: `${base}&c=${c.key}`, active: active === c.key }))
	]);
</script>

<svelte:head>
	<title>{query} • BabiTube</title>
</svelte:head>

<div class="wrap">
	<ChipBar {chips} />
	<div class="content">
		<VideoFilters count={videos.length} defaultSort="Relevance" />
		{#if videos.length}
			<VideoGrid {videos} layout="row" />
		{:else}
			<p class="empty">No results for “{query}”. Try different keywords.</p>
		{/if}
	</div>
</div>

<style>
	.wrap {
		max-width: 1096px;
		margin: 0 auto;
	}
	.content {
		padding: 12px 24px 48px;
	}
	.empty {
		padding: 64px 0;
		text-align: center;
		color: var(--text-2);
	}
	@media (max-width: 640px) {
		.content {
			padding: 4px 0 32px;
		}
	}
</style>
