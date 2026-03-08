<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from 'lucide-svelte';
	import heroImage from '$lib/assets/meetups/2026/announcement2.png';

	interface VideoItem {
		title: string;
		url: string;
		section: string;
	}

	interface VideoSection {
		id: string;
		title: string;
		subtitle: string;
		items: VideoItem[];
	}

	interface GalleryImage {
		src: string;
		alt: string;
	}

	interface DetailItem {
		label: string;
		value: string;
		link?: string;
	}

	interface ScheduleItem {
		time: string;
		title: string;
		description: string;
	}

	interface SupportGroup {
		label: string;
		items: { name: string; link: string }[];
	}

	const videoSections: VideoSection[] = [
		{
			id: 'recap',
			title: 'Event Recap',
			subtitle: 'One complete replay of the day',
			items: [
				{ title: 'Event Recap', url: 'https://youtu.be/UH9V-PMrIHk?si=OaYJWE3JhitVJpyj', section: 'Event Recap' }
			]
		},
		{
			id: 'sponsors-and-guests',
			title: 'Sponsors & Guests',
			subtitle: 'Partner remarks and sponsor spotlights',
			items: [
				{ title: 'ALX and Guest Remarks', url: 'https://youtu.be/qFRBbuc8gkQ?si=WRLJYIUKmSMs-Jtl', section: 'Sponsors & Guests' },
				{ title: 'Hot Spot by Horan Technologies', url: 'https://youtu.be/qedki5wcE0s?si=T7s8atVca0Nxh5mQ', section: 'Sponsors & Guests' },
				{ title: 'LucyAI by ZEMENU', url: 'https://youtu.be/RWfEOmULgEM?si=sVkF7zD8A97HJCUt', section: 'Sponsors & Guests' }
			]
		},
		{
			id: 'talks',
			title: 'Talks',
			subtitle: 'Core talks from the stage',
			items: [
				{ title: 'Building AI That Ships', url: 'https://youtu.be/4g6ncDSv4B4?si=EeIPxlXpYZ_5vUw-', section: 'Talks' },
				{ title: 'Designing Visuals that Move', url: 'https://youtu.be/AfV2mSLjlIA?si=dFzy60g6U1ND1DL9', section: 'Talks' },
				{ title: 'Debugging', url: 'https://youtu.be/qdWXYyvuCNs?si=r02O-JyaqXhSeeQ9', section: 'Talks' },
				{ title: 'Concept & Functionality', url: 'https://youtu.be/qwENBQRFiOQ?si=BFUg_w7rIglzUkEC', section: 'Talks' },
				{ title: 'Everything is Broken', url: 'https://youtu.be/IPzM27dJYn4?si=QQy9gci6YRoj-PSt', section: 'Talks' },
				{ title: 'Bespoke UI', url: 'https://youtu.be/yG91uqjPbQc?si=qV0MZh40pcfQfSQL', section: 'Talks' },
				{ title: 'Live Coding Music', url: 'https://youtu.be/SJXvTCcEknw?si=FN1TWANFRsiFlccQ', section: 'Talks' }
			]
		},
		{
			id: 'showcases',
			title: 'Showcases',
			subtitle: 'Product demos from the community',
			items: [
				{ title: 'ExamBuddy', url: 'https://youtu.be/eJq01B4xnPM?si=22loWQsNLLQ74zcp', section: 'Showcases' },
				{ title: 'DBStudio', url: 'https://youtu.be/eUK85Y7kOLc?si=FOtII0fXCV5z4G8L', section: 'Showcases' },
				{ title: 'Better Auth Studio', url: 'https://youtu.be/0gl0gg2kw20?si=-xLc_l61h2ikAOAk', section: 'Showcases' },
				{ title: 'Ora Browser', url: 'https://youtu.be/mslFVIBEBgs?si=co8vERxzB2a_223V', section: 'Showcases' },
				{ title: 'Stark', url: 'https://youtu.be/IBQzzWmR-1I?si=TtB8lBm8Jx6RLN4e', section: 'Showcases' }
			]
		},
		{
			id: 'podcast',
			title: 'Podcast',
			subtitle: 'Live conversation from the meetup',
			items: [{ title: 'Devtopia Live Podcast', url: 'https://youtu.be/EiJQD4FRSSg?si=2eQAPjKYrIKTzbft', section: 'Podcast' }]
		},
		{
			id: 'outro',
			title: 'Outro',
			subtitle: 'Creators award and closing',
			items: [{ title: 'Telegram Creators Award & Closing', url: 'https://youtu.be/qkRayp-UY9o?si=h_FU0ltPG-vIhW0p', section: 'Outro' }]
		}
	];

	const initialPlayers = Object.fromEntries(videoSections.map((section) => [section.id, section.items[0]])) as Record<string, VideoItem>;
	const initialLoading = Object.fromEntries(videoSections.map((section) => [section.id, true])) as Record<string, boolean>;

	const recapSection = videoSections[0];
	const remainingSections = videoSections.slice(1);

	const detailItems: DetailItem[] = [
		{ label: 'Date & Time', value: '9am - 6pm | January 24, 2026' },
		{
			label: 'Location',
			value: 'ALX Ethiopia | Lideta Hub - Addis Ababa, Ethiopia',
			link: 'https://maps.app.goo.gl/ntzyK5MFYv5KwzgT9'
		},
		{ label: 'Attendees', value: 'Developers, Designers, Content Creators, Event Organizers' },
		{ label: 'Talks & Guests', value: 'Announced on my channel', link: 'https://t.me/dagmawi_babi' }
	];

	const morningSchedule: ScheduleItem[] = [
		{ time: '08:30 AM - 10:00 AM', title: 'Check-in', description: 'Open doors and welcome attendees.' },
		{
			time: '10:00 AM - 10:30 AM',
			title: 'Opening Ceremony',
			description: 'Brief introduction of the event, schedule, sponsors and partners.'
		},
		{
			time: '10:30 AM - 01:00 PM',
			title: 'Keynotes and Showcases Pt.1',
			description: 'Incredible individuals will take the stage to give talks and showcase their works.'
		},
		{
			time: '01:00 PM - 02:00 PM',
			title: 'Lunch & Networking',
			description: 'Enjoy a delicious lunch while connecting with other attendees.'
		}
	];

	const afternoonSchedule: ScheduleItem[] = [
		{ time: '02:00 PM - 02:30 PM', title: 'Live Podcast', description: 'Join us on a live podcast session by Devtopia.' },
		{
			time: '02:30 PM - 04:00 PM',
			title: 'Keynotes and Showcases Pt.2',
			description: 'More incredible individuals will take the stage to give talks and showcase their works.'
		},
		{
			time: '04:00 PM - 04:30 PM',
			title: 'Creator Awards',
			description: "Partnering with Codenight, we'll celebrate the best creators in the community."
		},
		{
			time: '04:30 PM - 06:00 PM',
			title: 'Closing and Networking',
			description: 'The event will wrap up and allow for networking opportunities.'
		}
	];

	const supportGroups: SupportGroup[] = [
		{
			label: 'Partners',
			items: [
				{ name: 'ALX Ethiopia', link: 'https://maps.app.goo.gl/ntzyK5MFYv5KwzgT9' },
				{ name: 'Codenight', link: 'https://t.me/codenight' }
			]
		},
		{
			label: 'Sponsors',
			items: [
				{ name: 'v0 by Vercel', link: 'https://v0.app' },
				{ name: 'Better-Auth', link: 'https://better-auth.com' },
				{ name: 'Horan Technologies', link: 'https://horan.et' }
			]
		},
		{
			label: 'Merch and Stickers',
			items: [
				{ name: 'StickerGuy', link: 'https://t.me/stickerguy' },
				{ name: 'Erbana Clothing', link: 'https://t.me/erbana_clothing' }
			]
		},
		{
			label: 'Organizers',
			items: [
				{ name: '@Natyiu0', link: 'https://t.me/Natyiu0' },
				{ name: '@Found_this', link: 'https://t.me/found_this' },
				{ name: '@KinfishFarms', link: 'https://t.me/kinfishfarms' },
				{ name: '@Denbit', link: 'https://t.me/Denbit' },
				{ name: '@NaniBecoming', link: 'https://t.me/NaniBecoming' }
			]
		}
	];

	const gallerySources = import.meta.glob('/src/lib/assets/meetups/2026/gallery/*', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as Record<string, string>;

	const galleryImages: GalleryImage[] = Object.entries(gallerySources)
		.filter(([path]) => /\.(png|jpe?g|webp|avif)$/i.test(path))
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([path, src], index) => {
			const file = path.split('/').pop() ?? `image-${index + 1}`;
			return { src, alt: file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') };
		});

	const loopingGallery = galleryImages.length > 1 ? [...galleryImages, ...galleryImages] : galleryImages;

	let activePlayers: Record<string, VideoItem> = initialPlayers;
	let playerLoading: Record<string, boolean> = initialLoading;
	let isLightboxOpen = false;
	let activeImageIndex = 0;

	function getVideoId(url: string): string {
		try {
			const parsed = new URL(url);
			if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1);
			if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v') ?? '';
		} catch {
			return '';
		}
		return '';
	}

	function embedUrl(url: string): string {
		const id = getVideoId(url);
		return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : '';
	}

	function thumbnailUrl(url: string): string {
		const id = getVideoId(url);
		return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
	}

	function switchVideo(sectionId: string, item: VideoItem): void {
		activePlayers = { ...activePlayers, [sectionId]: item };
		playerLoading = { ...playerLoading, [sectionId]: true };
	}

	function onPlayerLoaded(sectionId: string): void {
		playerLoading = { ...playerLoading, [sectionId]: false };
	}

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

	function handleBackdropClick(event: MouseEvent): void {
		if (event.target === event.currentTarget) closeLightbox();
	}

	onMount(() => {
		const handleKey = (event: KeyboardEvent) => {
			if (!isLightboxOpen) return;
			if (event.key === 'Escape') closeLightbox();
			if (event.key === 'ArrowRight') nextImage();
			if (event.key === 'ArrowLeft') prevImage();
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});
</script>

<main class="min-h-screen bg-neutral-950 text-neutral-100">
	<div class="mx-auto grid w-[95%] max-w-[1400px] gap-6 py-6 md:grid-cols-[260px_minmax(0,1fr)] md:py-10">
		<aside class="h-fit rounded-3xl border border-neutral-800 bg-neutral-900/70 p-5 md:sticky md:top-6">
			<p class="text-[10px] tracking-[0.28em] uppercase text-neutral-400">Archive Navigation</p>
			<h2 class="font-lexend mt-3 text-2xl">Meetup 2026</h2>
			<div class="mt-5 space-y-2">
				<a href="#details" class="block rounded-xl border border-neutral-800 px-3 py-2 text-xs uppercase tracking-[0.15em] text-neutral-300 hover:border-neutral-600">Details</a>
				<a href="#schedule" class="block rounded-xl border border-neutral-800 px-3 py-2 text-xs uppercase tracking-[0.15em] text-neutral-300 hover:border-neutral-600">Schedule</a>
				<a href="#more-info" class="block rounded-xl border border-neutral-800 px-3 py-2 text-xs uppercase tracking-[0.15em] text-neutral-300 hover:border-neutral-600">More Info</a>
				<a href="#recap" class="block rounded-xl border border-neutral-800 px-3 py-2 text-xs uppercase tracking-[0.15em] text-neutral-300 hover:border-neutral-600">Recap</a>
				<a href="#gallery" class="block rounded-xl border border-neutral-800 px-3 py-2 text-xs uppercase tracking-[0.15em] text-neutral-300 hover:border-neutral-600">Gallery</a>
				{#each remainingSections as section}
					<a href={`#${section.id}`} class="block rounded-xl border border-neutral-800 px-3 py-2 text-xs uppercase tracking-[0.15em] text-neutral-300 hover:border-neutral-600">{section.title}</a>
				{/each}
			</div>
		</aside>

		<div class="space-y-8">
			<section class="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900">
				<div class="hero-grid">
					<div class="hero-ink"></div>
					<div class="p-6 md:p-10">
						<p class="text-[11px] tracking-[0.25em] uppercase text-neutral-400">January 24, 2026</p>
						<h1 class="font-lexend mt-4 text-4xl leading-[0.95] md:text-6xl">Dagmawi Babi's Meetup</h1>
						<p class="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-300 md:text-base">
							A cinematic replay archive with full sessions, showcased projects, and closing moments.
						</p>
						<div class="mt-6 flex flex-wrap gap-3">
							<a href="#recap" class="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-5 py-2 text-xs uppercase tracking-[0.15em] text-neutral-900 hover:bg-white">
								Play Recap <Play size={14} />
							</a>
							<a href="#gallery" class="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-2 text-xs uppercase tracking-[0.15em] text-neutral-200 hover:border-neutral-500">
								Browse Gallery
							</a>
						</div>
					</div>
					<div class="relative overflow-hidden border-l border-neutral-800">
						<img src={heroImage} alt="Meetup banner" class="h-full min-h-[290px] w-full object-cover" />
						<div class="absolute inset-0 bg-linear-to-t from-neutral-950/50 to-transparent"></div>
					</div>
				</div>
			</section>

			<section id="details" class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
				<div class="mb-4">
					<p class="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Event Details</p>
					<h2 class="font-lexend mt-1 text-3xl">Information</h2>
				</div>
				<div class="grid gap-3 md:grid-cols-2">
					{#each detailItems as item}
						<div class="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
							<p class="text-[10px] uppercase tracking-[0.18em] text-neutral-500">{item.label}</p>
							{#if item.link}
								<a href={item.link} target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-1 text-sm text-neutral-200 hover:text-white">
									{item.value}
									<ArrowUpRight size={14} />
								</a>
							{:else}
								<p class="mt-2 text-sm text-neutral-200">{item.value}</p>
							{/if}
						</div>
					{/each}
				</div>
			</section>

			<section id="schedule" class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
				<div class="mb-4">
					<p class="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Event Schedule</p>
					<h2 class="font-lexend mt-1 text-3xl">Morning & Afternoon</h2>
				</div>
				<div class="grid gap-4 md:grid-cols-2">
					<div class="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
						<p class="mb-3 text-xs uppercase tracking-[0.17em] text-neutral-400">Morning</p>
						<div class="space-y-3">
							{#each morningSchedule as item}
								<div class="rounded-lg border border-neutral-800 p-3">
									<p class="text-[11px] text-neutral-400">{item.time}</p>
									<p class="mt-1 text-sm font-semibold text-neutral-200">{item.title}</p>
									<p class="mt-1 text-xs text-neutral-400">{item.description}</p>
								</div>
							{/each}
						</div>
					</div>
					<div class="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
						<p class="mb-3 text-xs uppercase tracking-[0.17em] text-neutral-400">Afternoon</p>
						<div class="space-y-3">
							{#each afternoonSchedule as item}
								<div class="rounded-lg border border-neutral-800 p-3">
									<p class="text-[11px] text-neutral-400">{item.time}</p>
									<p class="mt-1 text-sm font-semibold text-neutral-200">{item.title}</p>
									<p class="mt-1 text-xs text-neutral-400">{item.description}</p>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</section>

			<section id="more-info" class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
				<div class="mb-4">
					<p class="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Support & Team</p>
					<h2 class="font-lexend mt-1 text-3xl">More Info</h2>
				</div>
				<div class="grid gap-3 md:grid-cols-2">
					{#each supportGroups as group}
						<div class="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
							<p class="text-xs uppercase tracking-[0.17em] text-neutral-400">{group.label}</p>
							<div class="mt-3 flex flex-wrap gap-2">
								{#each group.items as entry}
									<a href={entry.link} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300 hover:border-neutral-500 hover:text-white">
										{entry.name}
										<ArrowUpRight size={12} />
									</a>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</section>

			<section id="recap" class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
				<div class="mb-4 flex items-end justify-between gap-4">
					<div>
						<p class="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Featured</p>
						<h2 class="font-lexend mt-1 text-3xl">{recapSection.title}</h2>
					</div>
					<a href={activePlayers[recapSection.id].url} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-neutral-300 hover:text-white">
						Open YouTube <ArrowUpRight size={14} />
					</a>
				</div>
				<div class="player-shell">
					{#if playerLoading[recapSection.id]}
						<div class="player-loader">
							<img src={thumbnailUrl(activePlayers[recapSection.id].url)} alt={activePlayers[recapSection.id].title} class="h-full w-full object-cover" />
							<div class="player-mask"></div>
							<div class="loader-dot"></div>
						</div>
					{/if}
					<iframe
						src={embedUrl(activePlayers[recapSection.id].url)}
						title={activePlayers[recapSection.id].title}
						class="h-full w-full"
						onload={() => onPlayerLoaded(recapSection.id)}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				</div>
			</section>

			<section id="gallery" class="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
				<div class="mb-4">
					<p class="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Memory Strip</p>
					<h2 class="font-lexend mt-1 text-3xl">Gallery</h2>
				</div>
				{#if galleryImages.length}
					<div class="overflow-hidden rounded-2xl border border-neutral-800">
						<div class={`gallery-reel flex gap-3 bg-neutral-950 p-3 ${galleryImages.length > 1 ? 'is-animated' : ''}`}>
							{#each loopingGallery as image, index}
								<button type="button" onclick={() => openImage(index % galleryImages.length)} class="w-56 shrink-0 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 md:w-64">
									<img src={image.src} alt={image.alt} loading="lazy" class="h-40 w-full object-cover transition duration-500 hover:scale-105 md:h-48" />
								</button>
							{/each}
						</div>
					</div>
				{:else}
					<div class="rounded-xl border border-dashed border-neutral-700 bg-neutral-950 px-4 py-10 text-center text-sm text-neutral-400">
						No gallery images found in <code>/src/lib/assets/meetups/2026/gallery</code>.
					</div>
				{/if}
			</section>

			{#each remainingSections as section, i}
				<section id={section.id} class={`rounded-3xl border border-neutral-800 p-4 md:p-6 ${i % 2 === 0 ? 'bg-neutral-900' : 'bg-neutral-950'}`}>
					<div class="mb-4 flex flex-wrap items-end justify-between gap-3">
						<div>
							<p class="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Section</p>
							<h3 class="font-lexend mt-1 text-3xl">{section.title}</h3>
							<p class="mt-1 text-sm text-neutral-400">{section.subtitle}</p>
						</div>
						<a href={activePlayers[section.id].url} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-neutral-300 hover:text-white">
							Open YouTube <ArrowUpRight size={14} />
						</a>
					</div>

					<div class="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
						<div class="max-h-[420px] space-y-2 overflow-auto pr-1 no-scrollbar">
							{#each section.items as item}
								<button
									type="button"
									onclick={() => switchVideo(section.id, item)}
									class={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${activePlayers[section.id].url === item.url ? 'border-neutral-100 bg-neutral-100 text-neutral-950' : 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-neutral-500'}`}
								>
									{item.title}
								</button>
							{/each}
						</div>

						<div class="player-shell">
							{#if playerLoading[section.id]}
								<div class="player-loader">
									<img src={thumbnailUrl(activePlayers[section.id].url)} alt={activePlayers[section.id].title} class="h-full w-full object-cover" />
									<div class="player-mask"></div>
									<div class="loader-dot"></div>
								</div>
							{/if}
							<iframe
								src={embedUrl(activePlayers[section.id].url)}
								title={activePlayers[section.id].title}
								class="h-full w-full"
								onload={() => onPlayerLoaded(section.id)}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowfullscreen
							></iframe>
						</div>
					</div>
				</section>
			{/each}

			<footer class="rounded-3xl border border-neutral-800 bg-neutral-900 px-5 py-7">
				<div class="flex flex-col gap-2 text-xs uppercase tracking-[0.16em] text-neutral-400 md:flex-row md:items-center md:justify-between">
					<p>Dagmawi Babi's Meetup 2026 Archive</p>
					<p>Neutral Edition</p>
				</div>
			</footer>
		</div>
	</div>
</main>

{#if isLightboxOpen && galleryImages.length}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" onclick={handleBackdropClick}>
		<button type="button" onclick={closeLightbox} class="absolute top-4 right-4 rounded-full border border-white/30 bg-black/40 p-2 text-white hover:bg-black" aria-label="Close image viewer">
			<X size={18} />
		</button>
		<button type="button" onclick={prevImage} class="absolute left-3 rounded-full border border-white/30 bg-black/40 p-2 text-white hover:bg-black md:left-6" aria-label="Previous image">
			<ChevronLeft size={22} />
		</button>
		<img src={galleryImages[activeImageIndex].src} alt={galleryImages[activeImageIndex].alt} class="max-h-[86vh] max-w-[92vw] rounded-xl object-contain" />
		<button type="button" onclick={nextImage} class="absolute right-3 rounded-full border border-white/30 bg-black/40 p-2 text-white hover:bg-black md:right-6" aria-label="Next image">
			<ChevronRight size={22} />
		</button>
		<p class="absolute bottom-4 text-xs uppercase tracking-[0.2em] text-neutral-200">{activeImageIndex + 1} / {galleryImages.length}</p>
	</div>
{/if}

<style>
	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
		position: relative;
	}

	.hero-ink {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image: radial-gradient(circle at 8% 12%, rgba(255, 255, 255, 0.08) 0, transparent 42%);
	}

	.player-shell {
		position: relative;
		overflow: hidden;
		border-radius: 1rem;
		border: 1px solid rgba(115, 115, 115, 0.5);
		background: #000;
		aspect-ratio: 16 / 9;
	}

	.player-loader {
		position: absolute;
		inset: 0;
		z-index: 10;
	}

	.player-mask {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.28));
	}

	.loader-dot {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 38px;
		height: 38px;
		border-radius: 999px;
		border: 3px solid rgba(255, 255, 255, 0.35);
		border-top-color: #fff;
		animation: spin 0.8s linear infinite;
	}

	.gallery-reel.is-animated {
		animation: reel-slide 28s linear infinite;
	}

	@keyframes reel-slide {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	@keyframes spin {
		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	@media (max-width: 900px) {
		.hero-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.gallery-reel.is-animated,
		.loader-dot {
			animation: none;
		}
	}
</style>
