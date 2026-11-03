<script lang="ts">
	import VideoCard from './video_card.svelte';
	import { prefs } from '$lib/babitube/prefs.svelte';
	import { nearViewport, type TubeVideo } from '$lib/babitube/utils';

	const PAGE = 48;

	let {
		videos,
		layout = 'grid'
	}: {
		videos: TubeVideo[];
		layout?: 'grid' | 'row';
	} = $props();

	let limit = $state(PAGE);

	$effect(() => {
		videos;
		limit = PAGE;
	});
</script>

<div class={layout} class:set-columns={prefs.columns > 0} style:--columns={prefs.columns}>
	{#each videos.slice(0, limit) as video (video.id)}
		<VideoCard {video} {layout} />
	{/each}
</div>

{#if limit < videos.length}
	<div class="sentinel" use:nearViewport={() => (limit += PAGE)}></div>
{/if}

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
		gap: 40px 16px;
	}
	.grid.set-columns {
		grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
	}
	.row {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.sentinel {
		height: 1px;
	}
	@media (min-width: 2200px) {
		.grid:not(.set-columns) {
			grid-template-columns: repeat(6, 1fr);
		}
	}
	/* A chosen column count stops making sense once the cards would get too small to read. */
	@media (max-width: 900px) {
		.grid.set-columns {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.grid,
		.grid.set-columns {
			grid-template-columns: minmax(0, 1fr);
			gap: 24px 0;
		}
	}
</style>
