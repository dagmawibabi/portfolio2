<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from 'lucide-svelte';
	import header from '$lib/assets/meetups/2026/announcement2.png';

	interface VideoItem {
		title: string;
		url: string;
		section: string;
	}

	interface VideoSection {
		id: string;
		title: string;
		items: VideoItem[];
	}

	interface GalleryImage {
		src: string;
		alt: string;
	}

	const videoSections: VideoSection[] = [
		{
			id: 'recap',
			title: 'Event Recap',
			items: [
				{
					title: 'Event Recap',
					url: 'https://youtu.be/UH9V-PMrIHk?si=OaYJWE3JhitVJpyj',
					section: 'Event Recap'
				}
			]
		},
		{
			id: 'sponsors-and-guests',
			title: 'Sponsors & Guests',
			items: [
				{
					title: 'ALX and Guest Remarks',
					url: 'https://youtu.be/qFRBbuc8gkQ?si=WRLJYIUKmSMs-Jtl',
					section: 'Sponsors & Guests'
				},
				{
					title: 'Hot Spot by Horan Technologies',
					url: 'https://youtu.be/qedki5wcE0s?si=T7s8atVca0Nxh5mQ',
					section: 'Sponsors & Guests'
				},
				{
					title: 'LucyAI by ZEMENU',
					url: 'https://youtu.be/RWfEOmULgEM?si=sVkF7zD8A97HJCUt',
					section: 'Sponsors & Guests'
				}
			]
		},
		{
			id: 'talks',
			title: 'Talks',
			items: [
				{
					title: 'Building AI That Ships',
					url: 'https://youtu.be/4g6ncDSv4B4?si=EeIPxlXpYZ_5vUw-',
					section: 'Talks'
				},
				{
					title: 'Designing Visuals that Move',
					url: 'https://youtu.be/AfV2mSLjlIA?si=dFzy60g6U1ND1DL9',
					section: 'Talks'
				},
				{
					title: 'Debugging',
					url: 'https://youtu.be/qdWXYyvuCNs?si=r02O-JyaqXhSeeQ9',
					section: 'Talks'
				},
				{
					title: 'Concept & Functionality',
					url: 'https://youtu.be/qwENBQRFiOQ?si=BFUg_w7rIglzUkEC',
					section: 'Talks'
				},
				{
					title: 'Everything is Broken',
					url: 'https://youtu.be/IPzM27dJYn4?si=QQy9gci6YRoj-PSt',
					section: 'Talks'
				},
				{
					title: 'Bespoke UI',
					url: 'https://youtu.be/yG91uqjPbQc?si=qV0MZh40pcfQfSQL',
					section: 'Talks'
				},
				{
					title: 'Live Coding Music',
					url: 'https://youtu.be/SJXvTCcEknw?si=FN1TWANFRsiFlccQ',
					section: 'Talks'
				}
			]
		},
		{
			id: 'showcases',
			title: 'Showcases',
			items: [
				{
					title: 'ExamBuddy',
					url: 'https://youtu.be/eJq01B4xnPM?si=22loWQsNLLQ74zcp',
					section: 'Showcases'
				},
				{
					title: 'DBStudio',
					url: 'https://youtu.be/eUK85Y7kOLc?si=FOtII0fXCV5z4G8L',
					section: 'Showcases'
				},
				{
					title: 'Better Auth Studio',
					url: 'https://youtu.be/0gl0gg2kw20?si=-xLc_l61h2ikAOAk',
					section: 'Showcases'
				},
				{
					title: 'Ora Browser',
					url: 'https://youtu.be/mslFVIBEBgs?si=co8vERxzB2a_223V',
					section: 'Showcases'
				},
				{
					title: 'Stark',
					url: 'https://youtu.be/IBQzzWmR-1I?si=TtB8lBm8Jx6RLN4e',
					section: 'Showcases'
				}
			]
		},
		{
			id: 'podcast',
			title: 'Podcast',
			items: [
				{
					title: 'Devtopia Live Podcast',
					url: 'https://youtu.be/EiJQD4FRSSg?si=2eQAPjKYrIKTzbft',
					section: 'Podcast'
				}
			]
		},
		{
			id: 'outro',
			title: 'Outro',
			items: [
				{
					title: 'Telegram Creators Award & Closing',
					url: 'https://youtu.be/qkRayp-UY9o?si=h_FU0ltPG-vIhW0p',
					section: 'Outro'
				}
			]
		}
	];

	const selectedVideos: Record<string, VideoItem> = Object.fromEntries(
		videoSections.map((section) => [section.id, section.items[0]])
	) as Record<string, VideoItem>;

	const recapSection = videoSections[0];
	const remainingSections = videoSections.slice(1);

	const gallerySources = import.meta.glob('/src/lib/assets/meetups/2026/gallery/*', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as Record<string, string>;

	const galleryImages: GalleryImage[] = Object.entries(gallerySources)
		.filter(([path]) => /\.(png|jpe?g|webp|avif)$/i.test(path))
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([path, src], index) => {
			const parts = path.split('/');
			const filename = parts[parts.length - 1] ?? `Image ${index + 1}`;
			return {
				src,
				alt: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
			};
		});

	const loopingGallery = galleryImages.length > 1 ? [...galleryImages, ...galleryImages] : galleryImages;

	let activePlayers: Record<string, VideoItem> = selectedVideos;
	let isLightboxOpen = false;
	let activeImageIndex = 0;

	function getVideoId(url: string): string {
		try {
			const parsed = new URL(url);
			if (parsed.hostname.includes('youtu.be')) {
				return parsed.pathname.replace('/', '');
			}
			if (parsed.hostname.includes('youtube.com')) {
				const id = parsed.searchParams.get('v');
				if (id) return id;
				if (parsed.pathname.includes('/embed/')) {
					return parsed.pathname.split('/embed/')[1] ?? '';
				}
			}
		} catch {
			return '';
		}
		return '';
	}

	function toEmbedUrl(url: string): string {
		const id = getVideoId(url);
		if (!id) return '';
		return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
	}

	function switchVideo(sectionId: string, item: VideoItem): void {
		activePlayers = { ...activePlayers, [sectionId]: item };
	}

	function openImage(index: number): void {
		if (!galleryImages.length) return;
		activeImageIndex = index;
		isLightboxOpen = true;
	}

	function closeLightbox(): void {
		isLightboxOpen = false;
	}

	function showNextImage(): void {
		if (!galleryImages.length) return;
		activeImageIndex = (activeImageIndex + 1) % galleryImages.length;
	}

	function showPreviousImage(): void {
		if (!galleryImages.length) return;
		activeImageIndex = (activeImageIndex - 1 + galleryImages.length) % galleryImages.length;
	}

	function handleBackdropClick(event: MouseEvent): void {
		if (event.target === event.currentTarget) {
			closeLightbox();
		}
	}

	onMount(() => {
		const keyHandler = (event: KeyboardEvent) => {
			if (!isLightboxOpen) return;

			if (event.key === 'Escape') {
				closeLightbox();
			}
			if (event.key === 'ArrowRight') {
				showNextImage();
			}
			if (event.key === 'ArrowLeft') {
				showPreviousImage();
			}
		};

		window.addEventListener('keydown', keyHandler);

		return () => {
			window.removeEventListener('keydown', keyHandler);
		};
	});
</script>

<main
	class="relative min-h-screen bg-linear-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-neutral-100"
>
	<div class="pointer-events-none absolute inset-0 opacity-30">
		<div class="absolute top-0 right-0 h-80 w-80 rounded-full bg-neutral-700/30 blur-3xl"></div>
		<div class="absolute bottom-20 left-0 h-72 w-72 rounded-full bg-neutral-600/20 blur-3xl"></div>
	</div>

	<div class="relative mx-auto w-[94%] max-w-6xl py-8 md:py-14">
		<section class="overflow-hidden rounded-3xl border border-neutral-700/80 bg-neutral-900/60">
			<div class="grid min-h-[75vh] md:grid-cols-2">
				<div class="order-2 flex flex-col justify-center gap-6 p-6 md:order-2 md:p-10 lg:p-14">
					<p class="w-fit rounded-full border border-neutral-600 px-4 py-1 text-xs tracking-[0.2em] uppercase">
						January 24, 2026 Event Archive
					</p>
					<h1 class="font-lexend text-3xl leading-tight font-semibold md:text-5xl">
						Dagmawi Babi's Meetup
					</h1>
					<p class="max-w-xl text-sm leading-relaxed text-neutral-300 md:text-base">
						The full recap is now available, including talks, showcases, sponsor sessions, podcast,
						awards, and closing moments. Everything is organized below so you can watch it directly
						here.
					</p>
					<a
						href="#recap"
						class="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-100 px-5 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-white"
					>
						Start With Recap
						<Play size={16} />
					</a>
				</div>
				<div class="order-1 min-h-72 md:order-1 md:min-h-full">
					<img src={header} alt="Dagmawi Babi meetup highlight" class="h-full w-full object-cover" />
				</div>
			</div>
		</section>

		<section id="recap" class="mt-12">
			<div class="mb-5 flex items-end justify-between gap-4">
				<h2 class="font-lexend text-2xl font-semibold md:text-3xl">{recapSection.title}</h2>
			</div>
			<div class="overflow-hidden rounded-2xl border border-neutral-700 bg-black/60">
				<div class="aspect-video">
					<iframe
						src={toEmbedUrl(activePlayers[recapSection.id].url)}
						title={activePlayers[recapSection.id].title}
						class="h-full w-full"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				</div>
			</div>
			<div class="mt-3 flex items-center justify-between gap-4">
				<div>
					<p class="text-base font-semibold">{activePlayers[recapSection.id].title}</p>
					<p class="text-xs tracking-[0.18em] uppercase text-neutral-400">
						{activePlayers[recapSection.id].section}
					</p>
				</div>
				<a
					href={activePlayers[recapSection.id].url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1 text-xs tracking-[0.14em] uppercase text-neutral-300 hover:text-white"
				>
					Watch on YouTube
					<ArrowUpRight size={14} />
				</a>
			</div>
		</section>

		<section class="mt-10" id="gallery">
			<div class="mb-4 flex items-end justify-between gap-4">
				<h2 class="font-lexend text-2xl font-semibold md:text-3xl">Gallery</h2>
				<p class="text-xs tracking-[0.18em] uppercase text-neutral-400">Click Any Image</p>
			</div>

			{#if galleryImages.length}
				<div class="gallery-window overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900/70 p-3 md:p-4">
					<div class={`gallery-track grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 ${galleryImages.length > 1 ? 'is-animated' : ''}`}>
						{#each loopingGallery as image, index}
							<button
								type="button"
								onclick={() => openImage(index % galleryImages.length)}
								class="group overflow-hidden rounded-xl border border-neutral-700/80 bg-neutral-800/70"
							>
								<img
									src={image.src}
									alt={image.alt}
									loading="lazy"
									class="h-32 w-full object-cover transition duration-500 group-hover:scale-105 md:h-44"
								/>
							</button>
						{/each}
					</div>
				</div>
			{:else}
				<div class="rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/60 px-4 py-10 text-center text-sm text-neutral-400">
					Add images to <code>/src/lib/assets/meetups/2026/gallery</code> to populate this gallery.
				</div>
			{/if}
		</section>

		{#each remainingSections as section}
			<section class="mt-14">
				<div class="mb-5 flex items-end justify-between gap-4">
					<h2 class="font-lexend text-2xl font-semibold md:text-3xl">{section.title}</h2>
				</div>

				<div class="overflow-hidden rounded-2xl border border-neutral-700 bg-black/60">
					<div class="aspect-video">
						<iframe
							src={toEmbedUrl(activePlayers[section.id].url)}
							title={activePlayers[section.id].title}
							class="h-full w-full"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
						></iframe>
					</div>
				</div>

				<div class="mt-4 flex items-center justify-between gap-4">
					<div>
						<p class="text-base font-semibold">{activePlayers[section.id].title}</p>
						<p class="text-xs tracking-[0.18em] uppercase text-neutral-400">
							{activePlayers[section.id].section}
						</p>
					</div>
					<a
						href={activePlayers[section.id].url}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1 text-xs tracking-[0.14em] uppercase text-neutral-300 hover:text-white"
					>
						Watch on YouTube
						<ArrowUpRight size={14} />
					</a>
				</div>

				{#if section.items.length > 1}
					<div class="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
						{#each section.items as item}
							<button
								type="button"
								onclick={() => switchVideo(section.id, item)}
								class={`w-full rounded-xl border px-4 py-3 text-left transition ${activePlayers[section.id].url === item.url ? 'border-neutral-400 bg-neutral-100/5' : 'border-neutral-700 bg-neutral-900/40 hover:border-neutral-500'}`}
							>
								<p class="text-sm font-semibold">{item.title}</p>
								<p class="mt-1 text-[10px] tracking-[0.15em] uppercase text-neutral-400">Play Inline</p>
							</button>
						{/each}
					</div>
				{/if}
			</section>
		{/each}
		<footer class="mt-16 border-t border-neutral-800 py-8">
			<div class="flex flex-col items-start justify-between gap-3 text-xs tracking-[0.16em] uppercase text-neutral-400 md:flex-row md:items-center">
				<p>Dagmawi Babi's Meetup Archive</p>
				<p>All sessions, showcases, and moments in one place</p>
			</div>
		</footer>
	</div>
</main>

{#if isLightboxOpen && galleryImages.length}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
		role="dialog"
		aria-modal="true"
		onclick={handleBackdropClick}
	>
		<button
			type="button"
			onclick={closeLightbox}
			class="absolute top-4 right-4 rounded-full border border-neutral-600 bg-black/50 p-2 text-neutral-100 hover:bg-black"
			aria-label="Close image viewer"
		>
			<X size={18} />
		</button>

		<button
			type="button"
			onclick={showPreviousImage}
			class="absolute left-3 rounded-full border border-neutral-600 bg-black/50 p-2 text-neutral-100 hover:bg-black md:left-6"
			aria-label="Previous image"
		>
			<ChevronLeft size={22} />
		</button>

		<img
			src={galleryImages[activeImageIndex].src}
			alt={galleryImages[activeImageIndex].alt}
			class="max-h-[86vh] max-w-[92vw] rounded-xl object-contain"
		/>

		<button
			type="button"
			onclick={showNextImage}
			class="absolute right-3 rounded-full border border-neutral-600 bg-black/50 p-2 text-neutral-100 hover:bg-black md:right-6"
			aria-label="Next image"
		>
			<ChevronRight size={22} />
		</button>

		<p class="absolute bottom-4 text-xs tracking-[0.18em] text-neutral-300 uppercase">
			{activeImageIndex + 1} / {galleryImages.length}
		</p>
	</div>
{/if}

<style>
	.gallery-window {
		max-height: 34rem;
	}

	.gallery-track.is-animated {
		animation: gallery-pan 32s linear infinite;
	}

	@keyframes gallery-pan {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.gallery-track.is-animated {
			animation: none;
		}
	}
</style>
