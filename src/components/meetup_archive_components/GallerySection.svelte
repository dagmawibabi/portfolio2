<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight, X } from 'lucide-svelte';
	import type { GalleryImage } from './types';

	export let galleryImages: GalleryImage[] = [];
	export let galleryLink = 'https://t.me/dagmawibabismeetup';

	$: marqueeRows = [
		[...galleryImages, ...galleryImages, ...galleryImages],
		[...galleryImages, ...galleryImages, ...galleryImages],
		[...galleryImages, ...galleryImages, ...galleryImages]
	];

	let isLightboxOpen = false;
	let activeImageIndex = 0;

	function openImage(index: number): void {
		if (!galleryImages.length) return;
		activeImageIndex = index;
		isLightboxOpen = true;
	}

	function closeLightbox(): void {
		isLightboxOpen = false;
	}

	function nextImage(): void {
		if (!galleryImages.length) return;
		activeImageIndex = (activeImageIndex + 1) % galleryImages.length;
	}

	function prevImage(): void {
		if (!galleryImages.length) return;
		activeImageIndex = (activeImageIndex - 1 + galleryImages.length) % galleryImages.length;
	}

	onMount(() => {
		const onKeydown = (event: KeyboardEvent) => {
			if (!isLightboxOpen) return;
			if (event.key === 'Escape') closeLightbox();
			if (event.key === 'ArrowLeft') prevImage();
			if (event.key === 'ArrowRight') nextImage();
		};

		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});
</script>

<section id="gallery" class="section-frame gallery-block">
	<div class="section-heading">
		<div>
			<p class="eyebrow">Image Gallery</p>
			<h2>Moving frames from the room.</h2>
		</div>
		<a href={galleryLink} target="_blank" rel="noreferrer" class="gallery-link">See All Photos</a>
	</div>

	{#if galleryImages.length}
		<div class="marquee-wrap" aria-label="Moving image gallery">
			{#each marqueeRows as row, rowIndex}
				<div class={`marquee-track row-${rowIndex + 1}`}>
					{#each row as image, index}
						<button
							type="button"
							class={`marquee-card row-card-${rowIndex + 1}`}
							on:click={() => openImage(index % galleryImages.length)}
						>
							<img src={image.src} alt={image.alt} />
						</button>
					{/each}
				</div>
			{/each}
		</div>
	{:else}
		<div class="empty-state">No gallery images found in the meetup asset folder.</div>
	{/if}
</section>

{#if isLightboxOpen && galleryImages.length}
	<div class="lightbox" role="dialog" aria-modal="true" aria-label="Expanded gallery image">
		<button type="button" class="icon-button close" on:click={closeLightbox} aria-label="Close">
			<X size={18} />
		</button>
		<button type="button" class="icon-button prev" on:click={prevImage} aria-label="Previous image">
			<ChevronLeft size={18} />
		</button>
		<figure class="lightbox-figure">
			<img src={galleryImages[activeImageIndex].src} alt={galleryImages[activeImageIndex].alt} />
			<figcaption>
				{galleryImages[activeImageIndex].alt} · {activeImageIndex + 1}/{galleryImages.length}
			</figcaption>
		</figure>
		<button type="button" class="icon-button next" on:click={nextImage} aria-label="Next image">
			<ChevronRight size={18} />
		</button>
	</div>
{/if}

<style>
	.section-frame {
		width: min(100%, 1420px);
		margin: 0 auto 1.1rem;
		border: 1px solid var(--line);
		background: linear-gradient(180deg, rgba(38, 38, 38, 0.8), rgba(23, 23, 23, 0.96));
	}

	.gallery-block {
		position: relative;
		padding-bottom: 1.5rem;
	}

	.section-heading,
	.marquee-wrap {
		padding: 1.5rem;
	}

	.section-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
	}

	.eyebrow {
		margin: 0;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	h2 {
		margin: 0;
		font-family: 'Chivo', sans-serif;
		font-size: clamp(1.8rem, 4.3vw, 4.2rem);
		font-weight: 800;
		line-height: 0.95;
		letter-spacing: -0.06em;
		text-transform: uppercase;
		text-wrap: balance;
	}

	.marquee-wrap {
		display: grid;
		gap: 1rem;
		overflow: hidden;
	}

	.gallery-link {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
		padding: 0.9rem 1.1rem;
		border: 1px solid var(--line);
		background: rgba(255, 255, 255, 0.03);
		color: var(--text);
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.74rem;
		letter-spacing: 0.16em;
		text-decoration: none;
		text-transform: uppercase;
	}

	.gallery-link:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.marquee-track {
		display: flex;
		gap: 1rem;
		width: max-content;
	}

	.row-1 {
		animation: marquee-left 700s linear infinite;
	}

	.row-2 {
		animation: marquee-right 700s linear infinite;
	}

	.row-3 {
		animation: marquee-left 500s linear infinite;
	}

	.marquee-card {
		position: relative;
		overflow: hidden;
		padding: 0;
		border: 1px solid var(--line);
		background: #0f0f0f;
		cursor: pointer;
	}

	.marquee-card img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.row-card-1 {
		width: 19rem;
		height: 11.5rem;
	}

	.row-card-2 {
		width: 23rem;
		height: 13rem;
	}

	.row-card-3 {
		width: 17rem;
		height: 10.5rem;
	}

	.empty-state {
		margin: 0 1.5rem;
		padding: 2rem;
		border: 1px solid var(--line);
		background: #101010;
		color: var(--muted);
		text-align: center;
	}

	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 40;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.92);
	}

	.lightbox-figure {
		margin: 0;
		max-height: calc(100svh - 2rem);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: #111111;
	}

	.lightbox-figure img {
		display: block;
		width: auto;
		height: auto;
		max-width: min(92vw, 1400px);
		max-height: calc(100svh - 5rem);
		margin: 0 auto;
		object-fit: contain;
	}

	.lightbox-figure figcaption {
		padding: 0.95rem 1rem;
		color: var(--muted);
	}

	.icon-button {
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		border: 1px solid rgba(255, 255, 255, 0.32);
		background: rgba(0, 0, 0, 0.78);
		color: #ffffff;
		cursor: pointer;
	}

	.close {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	@keyframes marquee-left {
		from {
			transform: translateX(0);
		}

		to {
			transform: translateX(-50%);
		}
	}

	@keyframes marquee-right {
		from {
			transform: translateX(-50%);
		}

		to {
			transform: translateX(0);
		}
	}

	@media (max-width: 720px) {
		.section-heading,
		.marquee-wrap {
			padding: 1rem;
		}

		.section-heading {
			align-items: start;
			flex-direction: column;
		}

		h2 {
			font-size: clamp(1.65rem, 7.4vw, 2.5rem);
		}

		.row-card-1,
		.row-card-2,
		.row-card-3 {
			width: 13rem;
			height: 8.5rem;
		}

		.lightbox {
			grid-template-columns: 1fr;
			padding-top: 4.25rem;
		}

		.prev,
		.next {
			position: fixed;
			bottom: 1rem;
		}

		.prev {
			left: 1rem;
		}

		.next {
			right: 1rem;
		}
	}
</style>
