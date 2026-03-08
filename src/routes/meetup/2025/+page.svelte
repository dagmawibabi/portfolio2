<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, MapPin, Play, Users, X } from 'lucide-svelte';
	import heroImage from '$lib/assets/meetups/2026/announcement2.png';

	interface VideoItem { title: string; url: string; section: string; }
	interface VideoSection { id: string; title: string; subtitle: string; items: VideoItem[]; }
	interface GalleryImage { src: string; alt: string; }
	interface DetailItem { label: string; value: string; link?: string; icon: typeof CalendarDays; }
	interface ScheduleItem { time: string; title: string; description: string; }
	interface SupportGroup { label: string; items: { name: string; link: string }[]; }

	const videoSections: VideoSection[] = [
		{ id: 'recap', title: 'Event Recap', subtitle: 'One complete replay of the day', items: [{ title: 'Event Recap', url: 'https://youtu.be/UH9V-PMrIHk?si=OaYJWE3JhitVJpyj', section: 'Event Recap' }] },
		{ id: 'sponsors', title: 'Sponsors & Guests', subtitle: 'Partner remarks and sponsor spotlights', items: [
			{ title: 'ALX and Guest Remarks', url: 'https://youtu.be/qFRBbuc8gkQ?si=WRLJYIUKmSMs-Jtl', section: 'Sponsors & Guests' },
			{ title: 'Hot Spot by Horan Technologies', url: 'https://youtu.be/qedki5wcE0s?si=T7s8atVca0Nxh5mQ', section: 'Sponsors & Guests' },
			{ title: 'LucyAI by ZEMENU', url: 'https://youtu.be/RWfEOmULgEM?si=sVkF7zD8A97HJCUt', section: 'Sponsors & Guests' }
		] },
		{ id: 'talks', title: 'Talks', subtitle: 'Core talks from the stage', items: [
			{ title: 'Building AI That Ships', url: 'https://youtu.be/4g6ncDSv4B4?si=EeIPxlXpYZ_5vUw-', section: 'Talks' },
			{ title: 'Designing Visuals that Move', url: 'https://youtu.be/AfV2mSLjlIA?si=dFzy60g6U1ND1DL9', section: 'Talks' },
			{ title: 'Debugging', url: 'https://youtu.be/qdWXYyvuCNs?si=r02O-JyaqXhSeeQ9', section: 'Talks' },
			{ title: 'Concept & Functionality', url: 'https://youtu.be/qwENBQRFiOQ?si=BFUg_w7rIglzUkEC', section: 'Talks' },
			{ title: 'Everything is Broken', url: 'https://youtu.be/IPzM27dJYn4?si=QQy9gci6YRoj-PSt', section: 'Talks' },
			{ title: 'Bespoke UI', url: 'https://youtu.be/yG91uqjPbQc?si=qV0MZh40pcfQfSQL', section: 'Talks' },
			{ title: 'Live Coding Music', url: 'https://youtu.be/SJXvTCcEknw?si=FN1TWANFRsiFlccQ', section: 'Talks' }
		] },
		{ id: 'showcases', title: 'Showcases', subtitle: 'Product demos from the community', items: [
			{ title: 'ExamBuddy', url: 'https://youtu.be/eJq01B4xnPM?si=22loWQsNLLQ74zcp', section: 'Showcases' },
			{ title: 'DBStudio', url: 'https://youtu.be/eUK85Y7kOLc?si=FOtII0fXCV5z4G8L', section: 'Showcases' },
			{ title: 'Better Auth Studio', url: 'https://youtu.be/0gl0gg2kw20?si=-xLc_l61h2ikAOAk', section: 'Showcases' },
			{ title: 'Ora Browser', url: 'https://youtu.be/mslFVIBEBgs?si=co8vERxzB2a_223V', section: 'Showcases' },
			{ title: 'Stark', url: 'https://youtu.be/IBQzzWmR-1I?si=TtB8lBm8Jx6RLN4e', section: 'Showcases' }
		] },
		{ id: 'podcast', title: 'Podcast', subtitle: 'Live conversation from the meetup', items: [{ title: 'Devtopia Live Podcast', url: 'https://youtu.be/EiJQD4FRSSg?si=2eQAPjKYrIKTzbft', section: 'Podcast' }] },
		{ id: 'outro', title: 'Outro', subtitle: 'Creators award and closing', items: [{ title: 'Telegram Creators Award & Closing', url: 'https://youtu.be/qkRayp-UY9o?si=h_FU0ltPG-vIhW0p', section: 'Outro' }] }
	];

	const detailItems: DetailItem[] = [
		{ label: 'Date & Time', value: '9am - 6pm | January 24, 2026', icon: CalendarDays },
		{ label: 'Location', value: 'ALX Ethiopia | Lideta Hub - Addis Ababa, Ethiopia', link: 'https://maps.app.goo.gl/ntzyK5MFYv5KwzgT9', icon: MapPin },
		{ label: 'Attendees', value: 'Developers, Designers, Content Creators, Event Organizers', icon: Users },
		{ label: 'Talks & Guests', value: 'Announced on my channel', link: 'https://t.me/dagmawi_babi', icon: ArrowUpRight }
	];

	const morningSchedule: ScheduleItem[] = [
		{ time: '08:30 AM - 10:00 AM', title: 'Check-in', description: 'Open doors and welcome attendees.' },
		{ time: '10:00 AM - 10:30 AM', title: 'Opening Ceremony', description: 'Introduction, schedule, sponsors and partners.' },
		{ time: '10:30 AM - 01:00 PM', title: 'Keynotes and Showcases Pt.1', description: 'Talks and product showcases.' },
		{ time: '01:00 PM - 02:00 PM', title: 'Lunch & Networking', description: 'Lunch and time to connect.' }
	];

	const afternoonSchedule: ScheduleItem[] = [
		{ time: '02:00 PM - 02:30 PM', title: 'Live Podcast', description: 'A live session by Devtopia.' },
		{ time: '02:30 PM - 04:00 PM', title: 'Keynotes and Showcases Pt.2', description: 'More talks and showcases.' },
		{ time: '04:00 PM - 04:30 PM', title: 'Creator Awards', description: 'Recognition with Codenight.' },
		{ time: '04:30 PM - 06:00 PM', title: 'Closing and Networking', description: 'Wrap-up and networking.' }
	];

	const supportGroups: SupportGroup[] = [
		{ label: 'Partners', items: [{ name: 'ALX Ethiopia', link: 'https://maps.app.goo.gl/ntzyK5MFYv5KwzgT9' }, { name: 'Codenight', link: 'https://t.me/codenight' }] },
		{ label: 'Sponsors', items: [{ name: 'v0 by Vercel', link: 'https://v0.app' }, { name: 'Better-Auth', link: 'https://better-auth.com' }, { name: 'Horan Technologies', link: 'https://horan.et' }] },
		{ label: 'Merch and Stickers', items: [{ name: 'StickerGuy', link: 'https://t.me/stickerguy' }, { name: 'Erbana Clothing', link: 'https://t.me/erbana_clothing' }] },
		{ label: 'Organizers', items: [{ name: '@Natyiu0', link: 'https://t.me/Natyiu0' }, { name: '@Found_this', link: 'https://t.me/found_this' }, { name: '@KinfishFarms', link: 'https://t.me/kinfishfarms' }, { name: '@Denbit', link: 'https://t.me/Denbit' }, { name: '@NaniBecoming', link: 'https://t.me/NaniBecoming' }] }
	];

	const nav = [
		{ id: 'hero', label: 'Intro' },
		{ id: 'replay', label: 'Replay' },
		{ id: 'gallery', label: 'Gallery' },
		{ id: 'archive', label: 'Archive' },
		{ id: 'credits', label: 'Credits' }
	];

	const gallerySources = import.meta.glob('/src/lib/assets/meetups/2026/gallery/*', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
	const galleryImages: GalleryImage[] = Object.entries(gallerySources)
		.filter(([path]) => /\.(png|jpe?g|webp|avif)$/i.test(path))
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([path, src], index) => ({ src, alt: (path.split('/').pop() ?? `image-${index + 1}`).replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') }));

	const totalVideos = videoSections.reduce((sum, section) => sum + section.items.length, 0);
	const stats = [`${videoSections.length} replay chapters`, `${totalVideos} videos`, `${galleryImages.length} gallery stills`];
	const initialPlayers = Object.fromEntries(videoSections.map((section) => [section.id, section.items[0]])) as Record<string, VideoItem>;

	let activePlayers: Record<string, VideoItem> = initialPlayers;
	let selectedSectionId = videoSections[0].id;
	let activeAnchor = 'hero';
	let isLightboxOpen = false;
	let activeImageIndex = 0;

	$: selectedSection = videoSections.find((section) => section.id === selectedSectionId) ?? videoSections[0];
	$: activeVideo = activePlayers[selectedSection.id];

	function getVideoId(url: string): string {
		try {
			const parsed = new URL(url);
			if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1);
			if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v') ?? '';
		} catch { return ''; }
		return '';
	}
	function embedUrl(url: string): string { const id = getVideoId(url); return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : ''; }
	function thumbnailUrl(url: string): string { const id = getVideoId(url); return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''; }
	function selectSection(id: string): void { selectedSectionId = id; }
	function selectVideo(sectionId: string, item: VideoItem): void { activePlayers = { ...activePlayers, [sectionId]: item }; selectedSectionId = sectionId; }
	function openImage(index: number): void { activeImageIndex = index; isLightboxOpen = true; }
	function closeLightbox(): void { isLightboxOpen = false; }
	function nextImage(): void { activeImageIndex = (activeImageIndex + 1) % galleryImages.length; }
	function prevImage(): void { activeImageIndex = (activeImageIndex - 1 + galleryImages.length) % galleryImages.length; }

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
			if (visible?.target?.id) activeAnchor = visible.target.id;
		}, { threshold: [0.4, 0.6] });

		nav.forEach((item) => {
			const node = document.getElementById(item.id);
			if (node) observer.observe(node);
		});

		const onKeydown = (event: KeyboardEvent) => {
			if (!isLightboxOpen) return;
			if (event.key === 'Escape') closeLightbox();
			if (event.key === 'ArrowRight') nextImage();
			if (event.key === 'ArrowLeft') prevImage();
		};
		window.addEventListener('keydown', onKeydown);
		return () => { observer.disconnect(); window.removeEventListener('keydown', onKeydown); };
	});
</script>

<svelte:head>
	<title>Meetup 2025 Archive | Dagmawi Babi</title>
	<meta name="description" content="Full-screen modern neutral archive page for Dagmawi Babi's meetup." />
</svelte:head>

<div class="page-shell">
	<nav class="rail" aria-label="Sections">
		{#each nav as item}
			<a href={`#${item.id}`} class:active={activeAnchor === item.id}>{item.label}</a>
		{/each}
	</nav>

	<section id="hero" class="screen hero-screen">
		<div class="hero-copy card">
			<div>
				<p class="eyebrow">Meetup Archive / 2025</p>
				<h1>Modern, full-screen, and replay-first.</h1>
				<p class="body-copy">The event has passed. This route now works as a flat archive surface centered on watching, browsing, and revisiting the day.</p>
			</div>
			<div class="action-row">
				<a href="#replay" class="solid-btn">Open replay</a>
				<a href="#archive" class="ghost-btn">Past-event details</a>
			</div>
			<div class="stats-row">
				{#each stats as stat}<div>{stat}</div>{/each}
			</div>
		</div>
		<div class="hero-visual">
			<div class="poster card"><img src={heroImage} alt="Meetup poster" /></div>
			<div class="note card">
				<p class="eyebrow subtle">Archive note</p>
				<p>Schedule and location stay subtle below. The primary purpose of this page is the replay and the visual record.</p>
			</div>
		</div>
	</section>

	<section id="replay" class="screen">
		<div class="section-copy"><p class="eyebrow">Replay Library</p><h2>Browse the meetup by chapter.</h2></div>
		<div class="replay-layout">
			<div class="section-list card">
				{#each videoSections as section}
					<button type="button" class:current={selectedSectionId === section.id} on:click={() => selectSection(section.id)}>
						<div><p>{section.title}</p><span>{section.subtitle}</span></div>
						<strong>{section.items.length}</strong>
					</button>
				{/each}
			</div>
			<div class="stage card">
				<div class="player"><img src={thumbnailUrl(activeVideo.url)} alt={activeVideo.title} class="fallback" /><iframe src={embedUrl(activeVideo.url)} title={activeVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
				<div class="stage-meta"><div><p class="eyebrow subtle">Selected chapter</p><h3>{activeVideo.title}</h3><span>{selectedSection.subtitle}</span></div><a href={activeVideo.url} target="_blank" rel="noreferrer">Watch on YouTube</a></div>
				<div class="video-tabs">{#each selectedSection.items as item}<button type="button" class:playing={activeVideo.url === item.url} on:click={() => selectVideo(selectedSection.id, item)}><Play size={14} />{item.title}</button>{/each}</div>
			</div>
		</div>
	</section>

	<section id="gallery" class="screen">
		<div class="section-copy"><p class="eyebrow">Gallery</p><h2>Hover-heavy flat image panels.</h2></div>
		{#if galleryImages.length}
			<div class="gallery-grid">{#each galleryImages as image, index}<button type="button" class="gallery-item" on:click={() => openImage(index)}><img src={image.src} alt={image.alt} /><div class="gallery-meta"><span>Frame {String(index + 1).padStart(2, '0')}</span><p>{image.alt}</p></div></button>{/each}</div>
		{:else}
			<div class="card empty">No gallery images found in <code>/src/lib/assets/meetups/2026/gallery</code>.</div>
		{/if}
	</section>

	<section id="archive" class="screen">
		<div class="section-copy"><p class="eyebrow">Archive Details</p><h2>Quiet logistics and timeline.</h2></div>
		<div class="archive-layout">
			<div class="details-grid">{#each detailItems as item}<div class="detail card"><svelte:component this={item.icon} size={18} /><p>{item.label}</p>{#if item.link}<a href={item.link} target="_blank" rel="noreferrer">{item.value}</a>{:else}<span>{item.value}</span>{/if}</div>{/each}</div>
			<div class="schedule-grid">
				<div class="card schedule-card"><p class="eyebrow subtle">Morning</p>{#each morningSchedule as item}<details><summary><span>{item.title}</span><small>{item.time}</small></summary><p>{item.description}</p></details>{/each}</div>
				<div class="card schedule-card"><p class="eyebrow subtle">Afternoon</p>{#each afternoonSchedule as item}<details><summary><span>{item.title}</span><small>{item.time}</small></summary><p>{item.description}</p></details>{/each}</div>
			</div>
		</div>
	</section>

	<section id="credits" class="screen">
		<div class="section-copy"><p class="eyebrow">Credits</p><h2>People, partners, sponsors.</h2></div>
		<div class="credits-grid">{#each supportGroups as group}<section class="card credit-card"><p>{group.label}</p><div>{#each group.items as item}<a href={item.link} target="_blank" rel="noreferrer"><span>{item.name}</span><ArrowUpRight size={14} /></a>{/each}</div></section>{/each}</div>
	</section>
</div>

{#if isLightboxOpen && galleryImages.length}
	<div class="lightbox" role="dialog" aria-modal="true" aria-label="Gallery viewer">
		<button type="button" class="icon close" on:click={closeLightbox} aria-label="Close viewer"><X size={18} /></button>
		<button type="button" class="icon prev" on:click={prevImage} aria-label="Previous image"><ChevronLeft size={18} /></button>
		<figure class="lightbox-figure"><img src={galleryImages[activeImageIndex].src} alt={galleryImages[activeImageIndex].alt} /><figcaption>{galleryImages[activeImageIndex].alt}</figcaption></figure>
		<button type="button" class="icon next" on:click={nextImage} aria-label="Next image"><ChevronRight size={18} /></button>
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
	:global(html){scroll-behavior:smooth}
	:global(body){margin:0;background:#dcd7cf}
	.page-shell{--bg:#dcd7cf;--surface:#ece8e1;--surface-2:#f6f3ee;--surface-3:#d7d1c8;--text:#171411;--muted:#69635d;--line:#b7afa5;background:var(--bg);color:var(--text);font-family:'Archivo',sans-serif;scroll-snap-type:y mandatory}
	.rail{position:fixed;top:1rem;right:1rem;z-index:10;display:flex;gap:.5rem;padding:.45rem;border:1px solid var(--line);background:rgba(246,243,238,.95)}
	.rail a{padding:.7rem .9rem;text-decoration:none;color:var(--muted);font-size:.72rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
	.rail a:hover,.rail a.active{background:var(--text);color:var(--surface-2)}
	.screen{min-height:100svh;padding:5rem 1rem 1rem;display:grid;align-content:start;scroll-snap-align:start}
	.hero-screen,.replay-layout,.archive-layout{display:grid;gap:1rem}
	.hero-screen{grid-template-columns:1.08fr .92fr;align-items:stretch}
	.card{border:1px solid var(--line);background:var(--surface)}
	.hero-copy,.note,.section-list,.stage,.schedule-card,.credit-card,.empty{padding:1.2rem}
	.hero-copy{display:flex;flex-direction:column;justify-content:space-between;min-height:calc(100svh - 6rem)}
	.hero-visual{display:grid;grid-template-rows:1fr auto;gap:1rem}.poster{overflow:hidden}.poster img,.gallery-item img,.lightbox-figure img,.fallback{width:100%;height:100%;object-fit:cover}
	.eyebrow{margin:0;font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase}.subtle,.body-copy,.note p,.stage-meta span,.detail span,.detail a,.schedule-card details p,.credit-card a{color:var(--muted)}
	h1,h2,h3{margin:0;font-family:'Instrument Serif',serif;font-weight:400;line-height:.9;letter-spacing:-.05em} h1{max-width:10ch;font-size:clamp(4rem,10vw,8rem)} h2{max-width:9ch;font-size:clamp(2.7rem,6vw,5rem)} h3{font-size:clamp(1.8rem,3vw,3rem)}
	.body-copy{max-width:38rem;line-height:1.75;font-size:1.02rem}.action-row,.stats-row,.stage-meta,.video-tabs,.schedule-grid{display:flex;gap:1rem;flex-wrap:wrap}.action-row a,.stage-meta a,.detail a,.credit-card a{text-decoration:none}
	.solid-btn,.ghost-btn,.stage-meta a{padding:1rem 1.1rem;border:1px solid var(--text);font-size:.78rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase}.solid-btn{background:var(--text);color:var(--surface-2)}.ghost-btn,.stage-meta a{color:var(--text)}
	.solid-btn:hover,.ghost-btn:hover,.stage-meta a:hover,.video-tabs button:hover,.gallery-item:hover,.credit-card a:hover,.section-list button:hover{transform:translateY(-2px)}
	.stats-row div{padding:.85rem .95rem;border:1px solid var(--line);background:var(--surface-2);font-size:.8rem;font-weight:600}.section-copy{display:grid;gap:.8rem;margin-bottom:1rem}
	.replay-layout{grid-template-columns:21rem 1fr}.section-list{display:flex;flex-direction:column;gap:.75rem}.section-list button,.video-tabs button,.gallery-item,.icon{border:1px solid var(--line);font:inherit;cursor:pointer}
	.section-list button{display:grid;grid-template-columns:1fr auto;gap:.3rem 1rem;padding:1rem;background:var(--surface-2);text-align:left}.section-list button span{grid-column:1/2;font-size:.9rem;color:var(--muted)}.section-list button strong{grid-row:1/3;align-self:center;font-size:.72rem;padding:.4rem .5rem;border:1px solid var(--line)}
	.section-list button.current,.section-list button:hover{background:var(--text);color:var(--surface-2)}.section-list button.current span,.section-list button:hover span,.section-list button.current strong,.section-list button:hover strong{color:rgba(246,243,238,.78);border-color:rgba(246,243,238,.2)}
	.stage{display:grid;gap:1rem}.player{position:relative;min-height:48vh;border:1px solid var(--line);background:#000;overflow:hidden}.player iframe,.player img{position:absolute;inset:0}.player iframe{width:100%;height:100%}
	.stage-meta{justify-content:space-between;align-items:end}.video-tabs button{display:inline-flex;align-items:center;gap:.5rem;padding:.95rem 1rem;background:var(--surface-2)}.video-tabs button.playing,.video-tabs button:hover{background:var(--surface-3)}
	.gallery-grid{display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:10rem;gap:1rem;min-height:calc(100svh - 12rem)}.gallery-item{position:relative;overflow:hidden;padding:0;background:var(--surface)}.gallery-item:nth-child(6n+1),.gallery-item:nth-child(6n+4){grid-column:span 5;grid-row:span 2}.gallery-item:nth-child(6n+2),.gallery-item:nth-child(6n+5){grid-column:span 3;grid-row:span 1}.gallery-item:nth-child(6n+3),.gallery-item:nth-child(6n+6){grid-column:span 4;grid-row:span 2}.gallery-item img{transition:transform .16s ease}.gallery-item:hover img{transform:scale(1.03)}
	.gallery-meta{position:absolute;left:0;right:0;bottom:0;padding:.9rem 1rem;background:linear-gradient(180deg,transparent,rgba(23,20,17,.82));text-align:left}.gallery-meta span,.gallery-meta p{margin:0;color:#f6f3ee}.empty{display:grid;place-items:center;min-height:18rem}
	.archive-layout{grid-template-columns:1.05fr 1fr}.details-grid,.credits-grid{display:grid;gap:1rem}.details-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.detail{display:grid;gap:.7rem;padding:1.1rem;min-height:14rem}.detail p,.credit-card p{margin:0}.detail a{color:var(--text)}
	.schedule-grid{align-items:stretch}.schedule-grid>*{flex:1 1 0}.schedule-card{display:grid;gap:.75rem;background:var(--surface-2)}.schedule-card details{padding:.95rem 1rem;border:1px solid var(--line);background:var(--surface)}.schedule-card summary{display:flex;justify-content:space-between;gap:.8rem;cursor:pointer;list-style:none}.schedule-card summary::-webkit-details-marker{display:none}.schedule-card small{color:var(--muted)}.schedule-card details p{margin:.75rem 0 0}
	.credits-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.credit-card{display:grid;gap:1rem;align-content:start}.credit-card div{display:grid;gap:.75rem}.credit-card a{display:flex;justify-content:space-between;align-items:center;padding:.9rem .95rem;border:1px solid var(--line);background:var(--surface-2);color:var(--text)}.credit-card a:hover{background:var(--text);color:var(--surface-2)}
	.lightbox{position:fixed;inset:0;z-index:30;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:1rem;padding:1rem;background:rgba(20,18,16,.92)}.lightbox-figure{margin:0;max-height:calc(100svh - 2rem);border:1px solid rgba(246,243,238,.18);background:rgba(255,255,255,.04);overflow:hidden}.lightbox-figure img{max-height:calc(100svh - 5rem)}.lightbox-figure figcaption{padding:.9rem 1rem;color:rgba(246,243,238,.72)}.icon{display:grid;place-items:center;width:3rem;height:3rem;background:rgba(246,243,238,.08);color:#f6f3ee}.close{position:absolute;top:1rem;right:1rem}
	@media (max-width:1100px){.hero-screen,.replay-layout,.archive-layout,.credits-grid{grid-template-columns:1fr}.gallery-grid{grid-template-columns:repeat(2,1fr);grid-auto-rows:16rem}.gallery-item:nth-child(n){grid-column:span 1;grid-row:span 1}}
	@media (max-width:720px){.rail{left:.75rem;right:.75rem;overflow-x:auto}.screen{padding:4.75rem .75rem .75rem}.hero-copy{min-height:auto}h1{font-size:clamp(3.3rem,16vw,5.4rem)}h2{font-size:clamp(2.4rem,11vw,3.7rem)}.details-grid,.schedule-grid,.credits-grid,.gallery-grid{grid-template-columns:1fr;display:grid}.lightbox{grid-template-columns:1fr;padding-top:4.5rem}.prev,.next{position:fixed;bottom:1rem}.prev{left:1rem}.next{right:1rem}}
</style>

