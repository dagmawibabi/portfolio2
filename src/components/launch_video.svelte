<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { LaunchVideo } from '$lib/launch';
	import { Play, ExternalLink } from 'lucide-svelte';

	let { video }: { video: LaunchVideo } = $props();
	let open = $state(false);
	let playbackFailed = $state(false);
	let thumbnailFailed = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class="group block w-full cursor-pointer rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-4"
		aria-label={`Watch ${video.title}`}
		onclick={() => (playbackFailed = false)}
	>
		<span
			class="video-preview relative flex w-full items-center justify-center overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900"
		>
			{#if !thumbnailFailed}
				<img
					src={video.thumbnail}
					alt=""
					loading="lazy"
					class="absolute inset-0 h-full w-full object-cover"
					onerror={() => (thumbnailFailed = true)}
				/>
			{/if}
			<span
				class="play-icon relative flex items-center justify-center rounded-full bg-black/65 text-white transition-colors group-hover:bg-black/85"
			>
				<Play size={19} fill="currentColor" aria-hidden="true" />
			</span>
		</span>
		<span class="mt-3 block text-sm font-medium">{video.title}</span>
		<span class="mt-1 block text-xs text-neutral-500 dark:text-neutral-400"
			>{video.creator} · {video.platform} ·
			<time datetime={video.date}
				>{new Date(`${video.date}T00:00:00Z`).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric',
					timeZone: 'UTC'
				})}</time
			></span
		>
	</Dialog.Trigger>
	<Dialog.Content
		class="max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-lg p-4 pt-5"
		aria-describedby={undefined}
	>
		<Dialog.Title class="pr-9 text-base leading-snug">{video.title}</Dialog.Title>
		{#if open}
			{#if video.platform === 'YouTube'}
				<iframe
					src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0${video.startSeconds ? `&start=${video.startSeconds}` : ''}`}
					title={video.title}
					class="video-preview max-h-[65dvh] w-full rounded-sm border-0 bg-black"
					allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen
				></iframe>
			{:else if playbackFailed}
				<p class="py-12 text-center text-sm text-neutral-500">
					This video couldn't load. Watch the original using the link below.
				</p>
			{:else}
				<!-- Captions are not provided by the source posts; keep native playback controls. -->
				<!-- svelte-ignore a11y_media_has_caption -->
				<video
					src={video.videoUrl}
					poster={video.thumbnail}
					aria-label={video.title}
					controls
					autoplay
					playsinline
					preload="metadata"
					class="max-h-[65dvh] w-full rounded-sm bg-black object-contain"
					onerror={() => (playbackFailed = true)}
				></video>
			{/if}
		{/if}
		<a
			href={video.url}
			target="_blank"
			rel="noopener noreferrer"
			class="flex w-fit items-center gap-1.5 text-xs text-neutral-500 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-neutral-400"
		>
			Watch on {video.platform}<ExternalLink size={13} aria-hidden="true" />
		</a>
	</Dialog.Content>
</Dialog.Root>

<style>
	.video-preview {
		aspect-ratio: 16 / 9;
	}

	.play-icon {
		width: 2.75rem;
		height: 2.75rem;
		background-color: rgb(0 0 0 / 65%);
		transition:
			transform 180ms ease,
			background-color 180ms ease;
	}

	.video-preview img {
		transition:
			transform 220ms ease,
			filter 220ms ease;
	}

	:global(button:hover) .video-preview img,
	:global(button:focus-visible) .video-preview img {
		transform: scale(1.035);
		filter: brightness(0.9);
	}

	:global(button:hover) .play-icon,
	:global(button:focus-visible) .play-icon {
		transform: scale(1.1);
		background-color: rgb(0 0 0 / 85%);
	}

	@media (prefers-reduced-motion: reduce) {
		.video-preview img,
		.play-icon {
			transition: none;
			transform: none !important;
		}
	}
</style>
