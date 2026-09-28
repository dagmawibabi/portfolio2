<script lang="ts">
	import BlogHeader from '../../components/blog_components/blog_header.svelte';
	import LaunchVideo from '../../components/launch_video.svelte';
	import { launchGroups } from '$lib/launch';
	import { Toaster } from 'svelte-sonner';
</script>

<svelte:head>
	<title>Launch Videos and Keynotes I liked | Dagmawi Babi</title>
	<!-- X's media CDN rejects playback requests with an external referrer. -->
	<meta name="referrer" content="no-referrer" />
	<meta name="description" content="Launch videos, keynotes, and AI videos I liked." />
</svelte:head>

<div class="mx-auto w-[96%] pt-4 pb-24 lg:w-1/2">
	<BlogHeader showDescription={false} />
	<main class="pt-10">
		<h1 class="text-2xl font-semibold tracking-tight">Launch Videos and Keynotes I liked</h1>
		{#each launchGroups as group (group.id)}
			<section aria-labelledby={group.id}>
				<h2 id={group.id} class="text-lg font-medium">{group.category}</h2>
				<div class="video-grid">
					{#each group.videos as video (video.id)}
						<LaunchVideo {video} />
					{/each}
				</div>
			</section>
		{/each}
	</main>
</div>

<Toaster />

<style>
	section {
		margin-top: 3rem;
	}

	section + section {
		margin-top: 4rem;
	}

	.video-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: start;
		gap: 2.5rem 1.5rem;
		margin-top: 1.25rem;
	}

	@media (min-width: 640px) {
		.video-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
