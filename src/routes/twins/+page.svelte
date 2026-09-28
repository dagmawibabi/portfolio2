<script lang="ts">
	import BlogHeader from '../../components/blog_components/blog_header.svelte';
	import { twinPhotos } from '$lib/twins';
	import { Toaster } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
</script>

<svelte:head>
	<title>Twins | Dagmawi Babi</title>
	<meta name="description" content="A growing collection of my selfies with twins." />
</svelte:head>

<div class="mx-auto w-[96%] pt-4 pb-24 lg:w-1/2">
	<BlogHeader showDescription={false} />

	<main class="pt-10">
		<h1 class="text-2xl font-semibold tracking-tight">Twins</h1>
		<p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">My selfies with twins.</p>

		<div class="mt-6 grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
			{#each twinPhotos as photo, index (photo.src)}
				<Dialog.Root>
					<Dialog.Trigger
						aria-label={`View photo ${index + 1}: ${photo.alt}`}
						class="block w-full cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
					>
						<img
							src={photo.src}
							alt={photo.alt}
							loading={index === 0 ? 'eager' : 'lazy'}
							class="aspect-[3/2] w-full rounded-sm object-cover"
						/>
					</Dialog.Trigger>
					<Dialog.Content
						class="w-[calc(100%-2rem)] max-w-5xl gap-0 overflow-hidden rounded-lg p-2 pt-12"
						aria-describedby={undefined}
					>
						<Dialog.Title class="sr-only">Photo {index + 1}: {photo.alt}</Dialog.Title>
						<img
							src={photo.src}
							alt={photo.alt}
							class="max-h-[calc(90dvh-4rem)] w-full object-contain"
						/>
					</Dialog.Content>
				</Dialog.Root>
			{/each}
		</div>
	</main>
</div>

<Toaster />
