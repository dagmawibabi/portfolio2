<script lang="ts">
	import { page } from '$app/state';
	import ChipBar from '../../components/babitube_components/chip_bar.svelte';
	import VideoFilters from '../../components/babitube_components/video_filters.svelte';
	import VideoGrid from '../../components/babitube_components/video_grid.svelte';
	import { prefs, ui } from '$lib/babitube/prefs.svelte';
	import {
		CATEGORIES,
		applyFilters,
		categoryLabel,
		filterParams,
		homeFeed,
		readHistory
	} from '$lib/babitube/utils';

	let { data } = $props();

	const active = $derived(page.url.searchParams.get('c'));
	const counts = $derived(data.babitube.meta.categoryCounts);

	const kept = $derived(filterParams(page.url.searchParams));
	const chips = $derived([
		{ label: 'All', href: kept ? `/babitube?${kept}` : '/babitube', active: !active },
		...CATEGORIES.filter((c) => counts[c.key])
			.toSorted((a, b) => {
				if (a.key === 'general') return 1;
				if (b.key === 'general') return -1;
				return counts[b.key] - counts[a.key];
			})
			.map((c) => ({ label: c.label, href: `/babitube?c=${c.key}${kept ? `&${kept}` : ''}`, active: active === c.key }))
	]);

	const watched = new Set(readHistory());

	const videos = $derived(
		applyFilters(
			homeFeed(data.babitube.videos, ui.feedRound).filter(
				(v) =>
					(!active || v.cats.includes(active)) &&
					!(prefs.hideShorts && v.cats.includes('shorts')) &&
					!(prefs.hideWatched && watched.has(v.id))
			),
			page.url.searchParams
		)
	);
</script>

<svelte:head>
	{#if active}<title>{categoryLabel(active)} • BabiTube</title>{/if}
</svelte:head>

<ChipBar {chips} />

<div class="content">
	<VideoFilters count={videos.length} defaultSort="Recommended" />
	{#if videos.length}
		<VideoGrid {videos} />
	{:else}
		<p class="empty">No videos match these filters.</p>
	{/if}
</div>

<style>
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
