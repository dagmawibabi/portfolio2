<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ArrowUpRight,
		CalendarDays,
		ChevronLeft,
		ChevronRight,
		MapPin,
		Play,
		Users,
		X
	} from 'lucide-svelte';
	import heroImage from '$lib/assets/meetups/2026/announcement2.png';

	interface SessionLink {
		label: string;
		url: string;
	}

	interface VideoItem {
		title: string;
		url: string;
		speakerOrPresenter: string;
		description: string;
		primaryLink?: SessionLink;
		secondaryLinks?: SessionLink[];
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

	interface SupporterLogo {
	name: string;
	link: string;
	group: string;
	src: string;
	}

	interface DetailItem {
		label: string;
		value: string;
		link?: string;
		icon: typeof CalendarDays;
	}

	const videoSections: VideoSection[] = [
		{
			id: 'recap',
			title: 'Event Recap',
			subtitle: 'A complete replay of the room, the rhythm, and the people who made it happen.',
			items: [
				{
					title: 'Event Recap',
					url: 'https://youtu.be/UH9V-PMrIHk?si=OaYJWE3JhitVJpyj',
					speakerOrPresenter: 'Dagmawi Babi Meetup archive',
					description:
						'The full-day event recap capturing the keynotes, showcases, live podcast, creator awards, and the overall atmosphere of Dagmawi Babi\'s Meetup.',
					secondaryLinks: [{ label: 'Event Site', url: 'https://dagmawibabi.com/meetup' }]
				}
			]
		},
		{
			id: 'sponsors-and-guests',
			title: 'Sponsors & Guests',
			subtitle: 'Partner remarks and sponsor spotlights from the stage.',
			items: [
				{
					title: 'ALX and Guest Remarks',
					url: 'https://youtu.be/qFRBbuc8gkQ?si=WRLJYIUKmSMs-Jtl',
					speakerOrPresenter: 'Bisrat Gizaw, Mike Atskemichael, and Dagmawi Mekonnen',
					description:
						'Bisrat Gizaw, Recruitment Analyst at ALX, gave remarks about the services ALX provides. Mike Atskemichael, CTO of Afriwork, shared remarks about Afriwork\'s future plans. Dagmawi Mekonnen, host of Gugut Podcast, also gave remarks to the attendees.',
					secondaryLinks: [
						{ label: 'ALX Ethiopia', url: 'https://t.me/AlxEthiopiaOfficial' },
						{ label: 'Afriwork', url: 'https://afriworket.com/' },
						{ label: 'Gugut Podcast', url: 'https://www.youtube.com/@Gugutpodcast' }
					]
				},
				{
					title: 'Hot Spot Showcase',
					url: 'https://youtu.be/qedki5wcE0s?si=T7s8atVca0Nxh5mQ',
					speakerOrPresenter: 'Gemechis Elias, co-founder of Horan Technologies',
					description:
						'Gemechis Elias showcases Hot Spot, an upcoming travel super app for Ethiopia, at Dagmawi Babi\'s Meetup.',
					primaryLink: { label: 'Product Link', url: 'https://hotspot.et/' },
					secondaryLinks: [
						{ label: 'Horan Technologies', url: 'https://horan.et/' },
						{ label: 'Gemechis Elias', url: 'https://t.me/CodeItLab' }
					]
				},
				{
					title: 'LucyAI Showcase',
					url: 'https://youtu.be/RWfEOmULgEM?si=sVkF7zD8A97HJCUt',
					speakerOrPresenter: 'Moan Bekele, co-founder of LucyAI',
					description:
						'Moan Bekele showcases LucyAI, an AI customer service agent built under ZEMENU, and walks the audience through the product\'s purpose.',
					primaryLink: { label: 'Product Link', url: 'https://lucy.zemenu.org/' }
				}
			]
		},
		{
			id: 'ai-and-dev-talks',
			title: 'AI & Dev Talks',
			subtitle: 'Technical depth, debugging, systems thinking, and creative engineering process.',
			items: [
				{
					title: 'Building AI That Ships',
					url: 'https://youtu.be/4g6ncDSv4B4?si=EeIPxlXpYZ_5vUw-',
					speakerOrPresenter: 'Biniyam Daniel, Addis AI',
					description:
						'This talk is a technical talk for every AI enthusiast covering the parts that make AI work. From infrastructure and platforms to fine-tuning and inference, it is one of the most comprehensive AI talks given in Ethiopia.',
					secondaryLinks: [{ label: 'Biniyam Daniel', url: 'https://t.me/b1n1yamBuilds' }]
				},
				{
					title: 'Debugging',
					url: 'https://youtu.be/qdWXYyvuCNs?si=r02O-JyaqXhSeeQ9',
					speakerOrPresenter: 'Ezra Ashenafi, Afriwork',
					description:
						'In his technical talk on debugging and troubleshooting, Ezra shares resources, tools, tricks, do\'s and don\'ts, and practical lessons on how to track issues accurately and fix full-stack products with clarity.',
					secondaryLinks: [{ label: 'Afriwork', url: 'https://afriworket.com/' }]
				},
				{
					title: 'Everything is Broken',
					url: 'https://youtu.be/IPzM27dJYn4?si=QQy9gci6YRoj-PSt',
					speakerOrPresenter: 'Yohanes Fikru',
					description:
						'Using game development as the frame, this talk explores how real products are often built around feeling and user desire before code purity. It walks through lessons from building games and running a studio while chasing satisfaction over theory.'
				},
				{
					title: 'Live Coding Music',
					url: 'https://youtu.be/SJXvTCcEknw?si=FN1TWANFRsiFlccQ',
					speakerOrPresenter: 'Surafel Yimam',
					description:
						'Expect a glimpse into live coding, visual thinking, sonic ideas, and the mindset behind building systems that feel as much as they function. This talk is about process, play, and possibility.'
				}
			]
		},
		{
			id: 'design-talks',
			title: 'Design Talks',
			subtitle: 'Visual thinking, concept, functionality, and bespoke interface craft.',
			items: [
				{
					title: 'Designing Visuals That Move',
					url: 'https://youtu.be/AfV2mSLjlIA?si=dFzy60g6U1ND1DL9',
					speakerOrPresenter: 'Eyuel Zerabruk',
					description:
						'Design is bigger than how things look. This talk breaks down design as intention across systems, tools, communication, and feeling, then explores motion design as designing in time through rhythm, pacing, continuity, and change.'
				},
				{
					title: 'Concept and Functionality',
					url: 'https://youtu.be/qwENBQRFiOQ?si=BFUg_w7rIglzUkEC',
					speakerOrPresenter: 'Etsub Mekonnen',
					description:
						'Good design is not only about how something looks, but also about how it works. This talk argues that every strong design begins with a clear concept and is completed through thoughtful functionality.'
				},
				{
					title: 'Bespoke UI',
					url: 'https://youtu.be/yG91uqjPbQc?si=qV0MZh40pcfQfSQL',
					speakerOrPresenter: 'Robel Mezemir',
					description:
						'This talk looks at what it takes to move UI from merely tolerable to memorable. Robel walks through bad design, bare minimum design, great design, and the workflow he uses to build half-decent interfaces that feel like experiences.'
				}
			]
		},
		{
			id: 'showcases',
			title: 'Showcases',
			subtitle: 'Products introduced live, with direct links to what was being built.',
			items: [
				{
					title: 'ExamBuddy',
					url: 'https://youtu.be/eJq01B4xnPM?si=22loWQsNLLQ74zcp',
					speakerOrPresenter: 'Mohammed Ibrahim',
					description:
						'Mohammed Ibrahim showcases ExamBuddy, an all-in-one AI-powered study assistant that helps users create exams from documents, generate concise notes, flashcards, audiobooks, and more.',
					primaryLink: { label: 'Product Link', url: 'https://exambuddy.app/' },
					secondaryLinks: [{ label: 'Mohammed Ibrahim', url: 'https://t.me/DoughNutDrops' }]
				},
				{
					title: 'DBStudio',
					url: 'https://youtu.be/eUK85Y7kOLc?si=FOtII0fXCV5z4G8L',
					speakerOrPresenter: 'Ruhama Bekele',
					description:
						'Ruhama Bekele showcases DBStudio, a modern and AI-powered workspace for data teams building, managing, and scaling database applications.',
					primaryLink: { label: 'Product Link', url: 'https://dbstudio.tech/' },
					secondaryLinks: [{ label: 'Ruhama Bekele', url: 'https://t.me/ruhambek' }]
				},
				{
					title: 'Better Auth Studio',
					url: 'https://youtu.be/0gl0gg2kw20?si=-xLc_l61h2ikAOAk',
					speakerOrPresenter: 'Kinfemichael Tariku',
					description:
						'Kinfemichael Tariku showcases Better Auth Studio, an admin dashboard for Better Auth that manages users, sessions, organizations, teams, database tooling, testing, utilities, and more.',
					primaryLink: { label: 'Product Link', url: 'https://better-auth-studio.vercel.app/' },
					secondaryLinks: [{ label: 'Kinfemichael Tariku', url: 'https://t.me/kinfishfarms' }]
				},
				{
					title: 'Ora Browser',
					url: 'https://youtu.be/mslFVIBEBgs?si=co8vERxzB2a_223V',
					speakerOrPresenter: 'Yonathan Dejene',
					description:
						'Ora Browser is an open-source macOS browser built with Swift and WebKit. Yonathan Dejene showcases it as a fast, secure, native Arc alternative with spaces, vertical sidebar, smooth tab management, and more.',
					primaryLink: { label: 'Product Link', url: 'https://www.orabrowser.com/' },
					secondaryLinks: [{ label: 'Yonathan Dejene', url: 'https://t.me/yonaries' }]
				},
				{
					title: 'Stark',
					url: 'https://youtu.be/IBQzzWmR-1I?si=TtB8lBm8Jx6RLN4e',
					speakerOrPresenter: 'Miheretab Samson',
					description:
						'Miheretab Samson showcases Stark.et, a definitive portfolio network for developers, designers, and motion creators.',
					primaryLink: { label: 'Product Link', url: 'https://stark.et/' },
					secondaryLinks: [{ label: 'Miheretab Samson', url: 'https://t.me/miheretabtrysstuff' }]
				}
			]
		},
		{
			id: 'podcast',
			title: 'Podcast',
			subtitle: 'A live interview format pulled directly into the event.',
			items: [
				{
					title: 'Devtopia Live Podcast',
					url: 'https://youtu.be/EiJQD4FRSSg?si=2eQAPjKYrIKTzbft',
					speakerOrPresenter: 'Fraol Lemecha, Yafet Getachew, and Biniyam Daniel',
					description:
						'Fraol Lemecha and Yafet Getachew host a live podcast session interviewing Addis AI CEO Biniyam Daniel. A longer version of the conversation was slated for the Devtopia YouTube channel.',
					secondaryLinks: [
						{ label: 'Fraol Lemecha', url: 'https://t.me/thefrectonz' },
						{ label: 'Yafet Getachew', url: 'https://t.me/morphandbeyond' },
						{ label: 'Devtopia', url: 'https://www.youtube.com/@thedevtopia' }
					]
				}
			]
		},
		{
			id: 'outro',
			title: 'Outro',
			subtitle: 'Awards, gratitude, and the final statement of the day.',
			items: [
				{
					title: 'Telegram Creators Award and Closing',
					url: 'https://youtu.be/qkRayp-UY9o?si=h_FU0ltPG-vIhW0p',
					speakerOrPresenter: 'Codenight and Dagmawi Babi',
					description:
						'Codenight and Dagmawi Babi partnered to host the first Telegram Creators Award, celebrating influential creators producing high-quality educational and entertaining content. Dagmawi Babi also gave the closing remarks, congratulating the winners: @SoloDevChronicles, @OnyxDesignX, and @Birhan_Nega.',
					secondaryLinks: [{ label: 'Codenight', url: 'https://t.me/codenight' }]
				}
			]
		}
	];

	const detailItems: DetailItem[] = [
		{ label: 'Date', value: 'January 24, 2026', link: 'https://calendar.app.google/RMDRcWhFHF5MPmFa6', icon: CalendarDays },
		{ label: 'Venue', value: 'ALX Hub', link: 'https://maps.app.goo.gl/sHtWNdgN28Rpa57C7', icon: MapPin },
		{ label: 'Audience', value: 'Creators, communities, companies, designers, and developers building Ethiopia’s ecosystem.', icon: Users },
		{ label: 'Event Site', value: 'dagmawibabi.com/meetup', link: 'https://dagmawibabi.com/meetup', icon: ArrowUpRight }
	];

	const sponsorLogoSources = import.meta.glob('/src/lib/assets/meetups/2026/sponsors and partners/*', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as Record<string, string>;
	const sponsorLogosByBase = Object.fromEntries(
		Object.entries(sponsorLogoSources).map(([path, src]) => [
			(path.split('/').pop() ?? '').replace(/\.[^.]+$/, '').toLowerCase(),
			src
		])
	);
	const supporterMarquee: SupporterLogo[] = [
		{ name: 'ALX Ethiopia', link: 'https://t.me/AlxEthiopiaOfficial', group: 'Partner', src: sponsorLogosByBase['alx'] },
		{ name: 'v0 by Vercel', link: 'https://v0.app/', group: 'Sponsor', src: sponsorLogosByBase['v0'] },
		{ name: 'Better Auth', link: 'https://www.better-auth.com/', group: 'Sponsor', src: sponsorLogosByBase['betterauth'] },
		{ name: 'Codenight', link: 'https://t.me/CodeNight', group: 'Partner', src: sponsorLogosByBase['codenight'] },
		{ name: 'Horan Technologies', link: 'https://horan.et/', group: 'Sponsor', src: sponsorLogosByBase['horantech'] },
		{ name: 'Lucy AI', link: 'https://lucy.zemenu.org/', group: 'Sponsor', src: sponsorLogosByBase['lucyai'] },
		{ name: 'Sticker Guy', link: 'https://stickerguy.et/', group: 'Sponsor', src: sponsorLogosByBase['stickerguy'] }
	].filter((item) => !!item.src);

	const gallerySources = import.meta.glob('/src/lib/assets/meetups/2026/gallery/*', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
	const galleryImages: GalleryImage[] = Object.entries(gallerySources)
		.filter(([path]) => /\.(png|jpe?g|webp|avif)$/i.test(path))
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([path, src], index) => {
			const name = path.split('/').pop() ?? `image-${index + 1}`;
			return { src, alt: name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') };
		});

	const marqueeRows = [
		[...galleryImages, ...galleryImages, ...galleryImages],
		[...galleryImages, ...galleryImages, ...galleryImages],
		[...galleryImages, ...galleryImages, ...galleryImages]
	];

	const initialPlayers = Object.fromEntries(videoSections.map((section) => [section.id, section.items[0]])) as Record<string, VideoItem>;

	let activePlayers: Record<string, VideoItem> = initialPlayers;
	let selectedSectionId = videoSections[0].id;
	let isLightboxOpen = false;
	let activeImageIndex = 0;

	$: selectedSection = videoSections.find((section) => section.id === selectedSectionId) ?? videoSections[0];
	$: selectedVideo = activePlayers[selectedSection.id];

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
		return id ? `https://www.youtube.com/embed/${id}?rel=0` : '';
	}

	function thumbnailUrl(url: string): string {
		const id = getVideoId(url);
		return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
	}

	function externalLink(url: string, label: string): string {
		return `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`;
	}

	function speakerMarkup(item: VideoItem): string {
		switch (item.title) {
			case 'ALX and Guest Remarks':
				return `${externalLink('https://t.me/AlxEthiopiaOfficial', 'Bisrat Gizaw')}, Recruitment Analyst at <a href="https://t.me/AlxEthiopiaOfficial" target="_blank" rel="noreferrer">ALX Ethiopia</a>; Mike Atskemichael, CTO of <a href="https://afriworket.com/" target="_blank" rel="noreferrer">Afriwork</a>; and Dagmawi Mekonnen of <a href="https://www.youtube.com/@Gugutpodcast" target="_blank" rel="noreferrer">Gugut Podcast</a>`;
			case 'Hot Spot Showcase':
				return `${externalLink('https://t.me/CodeItLab', 'Gemechis Elias')}, co-founder of <a href="https://horan.et/" target="_blank" rel="noreferrer">Horan Technologies</a>`;
			case 'LucyAI Showcase':
				return `Moan Bekele, co-founder of <a href="https://lucy.zemenu.org/" target="_blank" rel="noreferrer">Lucy AI</a>`;
			case 'Building AI That Ships':
				return `${externalLink('https://t.me/b1n1yamBuilds', 'Biniyam Daniel')}, Addis AI`;
			case 'Debugging':
				return `Ezra Ashenafi, <a href="https://afriworket.com/" target="_blank" rel="noreferrer">Afriwork</a>`;
			case 'ExamBuddy':
				return externalLink('https://t.me/DoughNutDrops', 'Mohammed Ibrahim');
			case 'DBStudio':
				return externalLink('https://t.me/ruhambek', 'Ruhama Bekele');
			case 'Better Auth Studio':
				return externalLink('https://t.me/kinfishfarms', 'Kinfemichael Tariku');
			case 'Ora Browser':
				return externalLink('https://t.me/yonaries', 'Yonathan Dejene');
			case 'Stark':
				return externalLink('https://t.me/miheretabtrysstuff', 'Miheretab Samson');
			case 'Devtopia Live Podcast':
				return `${externalLink('https://t.me/thefrectonz', 'Fraol Lemecha')}, ${externalLink('https://t.me/morphandbeyond', 'Yafet Getachew')}, and ${externalLink('https://t.me/b1n1yamBuilds', 'Biniyam Daniel')}`;
			case 'Telegram Creators Award and Closing':
				return `<a href="https://t.me/CodeNight" target="_blank" rel="noreferrer">Codenight</a> and Dagmawi Babi`;
			default:
				return item.speakerOrPresenter;
		}
	}

	function descriptionMarkup(item: VideoItem): string {
		switch (item.title) {
			case 'Event Recap':
				return `The full-day event recap capturing the keynotes, showcases, live podcast, creator awards, and the overall atmosphere of Dagmawi Babi's Meetup. Visit the <a href="https://dagmawibabi.com/meetup" target="_blank" rel="noreferrer">event site</a> for the full context.`;
			case 'Hot Spot Showcase':
				return `Gemechis Elias showcases <a href="https://hotspot.et/" target="_blank" rel="noreferrer">Hot Spot</a>, an upcoming travel super app for Ethiopia, at Dagmawi Babi's Meetup.`;
			case 'LucyAI Showcase':
				return `Moan Bekele showcases <a href="https://lucy.zemenu.org/" target="_blank" rel="noreferrer">Lucy AI</a>, an AI customer service agent built under ZEMENU, and walks the audience through the product's purpose.`;
			case 'Building AI That Ships':
				return `This talk is a technical talk for every AI enthusiast covering the parts that make AI work. From infrastructure and platforms to fine-tuning and inference, it is one of the most comprehensive AI talks given in Ethiopia.`;
			case 'Debugging':
				return `In his technical talk on debugging and troubleshooting, Ezra shares resources, tools, tricks, do's and don'ts, and practical lessons on how to track issues accurately and fix full-stack products with clarity.`;
			case 'Everything is Broken':
				return `Using game development as the frame, this talk explores how real products are often built around feeling and user desire before code purity. It walks through lessons from building games and running a studio while chasing satisfaction over theory.`;
			case 'Designing Visuals That Move':
				return `Design is bigger than how things look. This talk breaks down design as intention across systems, tools, communication, and feeling, then explores motion design as designing in time through rhythm, pacing, continuity, and change.`;
			case 'Concept and Functionality':
				return `Good design is not only about how something looks, but also about how it works. This talk argues that every strong design begins with a clear concept and is completed through thoughtful functionality.`;
			case 'Bespoke UI':
				return `This talk looks at what it takes to move UI from merely tolerable to memorable. Robel walks through bad design, bare minimum design, great design, and the workflow he uses to build half-decent interfaces that feel like experiences.`;
			case 'ExamBuddy':
				return `Mohammed Ibrahim showcases <a href="https://exambuddy.app/" target="_blank" rel="noreferrer">ExamBuddy</a>, an all-in-one AI-powered study assistant that helps users create exams from documents, generate concise notes, flashcards, audiobooks, and more.`;
			case 'DBStudio':
				return `Ruhama Bekele showcases <a href="https://dbstudio.tech/" target="_blank" rel="noreferrer">DBStudio</a>, a modern and AI-powered workspace for data teams building, managing, and scaling database applications.`;
			case 'Better Auth Studio':
				return `Kinfemichael Tariku showcases <a href="https://better-auth-studio.vercel.app/" target="_blank" rel="noreferrer">Better Auth Studio</a>, an admin dashboard for Better Auth that manages users, sessions, organizations, teams, database tooling, testing, utilities, and more.`;
			case 'Ora Browser':
				return `<a href="https://www.orabrowser.com/" target="_blank" rel="noreferrer">Ora Browser</a> is an open-source macOS browser built with Swift and WebKit. Yonathan Dejene showcases it as a fast, secure, native Arc alternative with spaces, vertical sidebar, smooth tab management, and more.`;
			case 'Stark':
				return `Miheretab Samson showcases <a href="https://stark.et/" target="_blank" rel="noreferrer">Stark.et</a>, a definitive portfolio network for developers, designers, and motion creators.`;
			case 'Devtopia Live Podcast':
				return `Fraol Lemecha and Yafet Getachew host a live podcast session interviewing Addis AI CEO Biniyam Daniel. A longer version of the conversation was slated for the <a href="https://www.youtube.com/@thedevtopia" target="_blank" rel="noreferrer">Devtopia channel</a>.`;
			default:
				return item.description;
		}
	}

	function sessionAction(item: VideoItem): SessionLink {
		switch (item.title) {
			case 'Building AI That Ships':
				return { label: 'View Slides', url: 'https://www.canva.com/design/DAG_amsGHQM/wTSvpjQ3opCZNK6BAg8nEA/edit?utm_content=DAG_amsGHQM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton' };
			case 'Debugging':
				return { label: 'View Slides', url: 'https://www.canva.com/design/DAG_ak80-A4/jwunA4Z5EZ8b_xhpTzihSw/edit?utm_content=DAG_ak80-A4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton' };
			case 'Everything is Broken':
				return { label: 'View Slides', url: 'https://www.canva.com/design/DAG_ajgvtLY/K2T6tiAG69nTNAeSPIWuow/edit?utm_content=DAG_ajgvtLY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton' };
			case 'Designing Visuals That Move':
				return { label: 'View Slides', url: 'https://t.me/Dagmawi_Babi/36254' };
			case 'Concept and Functionality':
				return { label: 'View Slides', url: 'https://t.me/Dagmawi_Babi/36253' };
			case 'Bespoke UI':
				return { label: 'View Slides', url: 'https://www.canva.com/design/DAG_av0SbgI/Jlzr83sHBoudytgzeM6FxQ/edit?utm_content=DAG_av0SbgI&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton' };
			default:
				return { label: 'Watch on YouTube', url: item.url };
		}
	}

	function selectSection(id: string): void {
		selectedSectionId = id;
	}

	function selectVideo(sectionId: string, item: VideoItem): void {
		activePlayers = { ...activePlayers, [sectionId]: item };
		selectedSectionId = sectionId;
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

<svelte:head>
	<title>Meetup 2023 Archive | Dagmawi Babi</title>
	<meta name="description" content="A monochrome archive page for Dagmawi Babi's Meetup with real talk metadata, product links, and a moving image gallery." />
</svelte:head>

<div class="archive-page">
	<section id="hero" class="hero-block section-frame">
		<div class="hero-poster">
			<div class="poster-shell">
				<img src={heroImage} alt="Dagmawi Babi's Meetup event announcement poster" />
			</div>
		</div>

		<div class="hero-copy">
			<p class="eyebrow">Meetup Archive / 2023</p>
			<h1>Dagmawi Babi’s Meetup</h1>
			<p class="lede">
				Dagmawi Babi's Meetup is an exclusive event organized by Dagmawi Babi and his team as a thank you to all the incredible individuals, creators, event organizers, companies and communities improving and accelerating the tech and design ecosystem in Ethiopia.
			</p>
			<p class="lede secondary-lede">
				It's a thank you for taking risks, for pioneering new ventures, for taking the blame, for investing so much of yourself into the benefits of everyone else, for spending months building epic things, for spending countless nights preparing events, and for imagining a community that can be much better than what it is and working towards your vision.
			</p>
			<p class="lede tertiary-lede">
				The day brings together insightful keynotes, project showcases, a live Devtopia podcast, in-person Creator Awards by Codenight, and the kind of in-person energy that only happens when builders share a room.
			</p>
			<div class="hero-actions">
				<a href="#archive" class="solid-link">Watch the Archive</a>
				<a href="https://dagmawibabi.com/meetup" target="_blank" rel="noreferrer" class="ghost-link">
					Visit Event Site
				</a>
			</div>
		</div>
	</section>

	<section id="manifesto" class="section-frame story-block">
		<div class="section-heading">
			<p class="eyebrow">Sponsors & Partners</p>
		</div>
		<div class="logo-marquee" aria-label="Sponsors and partners">
			<div class="logo-track logo-track-left">
				{#each [...supporterMarquee, ...supporterMarquee] as item}
					<a href={item.link} target="_blank" rel="noreferrer" class="logo-chip">
						<img src={item.src} alt={item.name} class="logo-image" />
						<span class="logo-name">{item.name}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section id="gallery" class="section-frame gallery-block">
		<div class="section-heading">
			<p class="eyebrow">Image Gallery</p>
			<h2>Moving frames from the room.</h2>
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

	<section id="archive" class="section-frame replay-block">
		<div class="section-heading">
			<p class="eyebrow">Video Archive</p>
			<h2>Talks, showcases, sponsor moments, and the close.</h2>
		</div>

		<div class="replay-layout">
			<div class="chapter-list">
				{#each videoSections as section}
					<button type="button" class:current={selectedSectionId === section.id} on:click={() => selectSection(section.id)}>
						<div>
							<p>{section.title}</p>
							<span>{section.subtitle}</span>
						</div>
						<strong>{section.items.length}</strong>
					</button>
				{/each}
			</div>

			<div class="player-panel">
				<div class="player-shell">
					<img src={thumbnailUrl(selectedVideo.url)} alt={selectedVideo.title} class="player-fallback" />
					<iframe
						src={embedUrl(selectedVideo.url)}
						title={selectedVideo.title}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				</div>

				<div class="player-meta">
					<div class="selected-session">
						<p class="eyebrow subtle">Selected Session</p>
						<h3>{selectedVideo.title}</h3>
						<p class="meta-line">{selectedSection.subtitle}</p>
					</div>
					<a href={sessionAction(selectedVideo).url} target="_blank" rel="noreferrer" class="ghost-link compact">{sessionAction(selectedVideo).label}</a>
				</div>

				<div class="speaker-strip">
					<div class="info-card">
						<p class="eyebrow subtle">Speaker / Presenter</p>
						<p>{@html speakerMarkup(selectedVideo)}</p>
					</div>
					<div class="info-card wide">
						<p class="eyebrow subtle">Description</p>
						<p>{@html descriptionMarkup(selectedVideo)}</p>
					</div>
				</div>


				{#if selectedSection.items.length > 1}
					<div class="session-tabs">
						{#each selectedSection.items as item}
							<button type="button" class:playing={selectedVideo.url === item.url} on:click={() => selectVideo(selectedSection.id, item)}>
								<Play size={14} />
								<span>{item.title}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</section>

	<section id="details" class="section-frame info-block">
		<div class="section-heading">
			<p class="eyebrow">Event Details</p>
			<h2>Where, when, and why people gathered.</h2>
		</div>

		<div class="details-grid">
			{#each detailItems as item}
				<div class="detail-card">
					<svelte:component this={item.icon} size={18} />
					<p class="eyebrow subtle">{item.label}</p>
					{#if item.link}
						<a href={item.link} target="_blank" rel="noreferrer">
							{item.value}
							<ArrowUpRight size={14} />
						</a>
					{:else}
						<span>{item.value}</span>
					{/if}
				</div>
			{/each}
		</div>
	</section>
</div>

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
			<figcaption>{galleryImages[activeImageIndex].alt} · {activeImageIndex + 1}/{galleryImages.length}</figcaption>
		</figure>
		<button type="button" class="icon-button next" on:click={nextImage} aria-label="Next image">
			<ChevronRight size={18} />
		</button>
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		background: #0a0a0a;
	}

	.archive-page {
		--page: #0a0a0a;
		--line: #525252;
		--line-soft: #3f3f46;
		--text: #fafafa;
		--muted: #a3a3a3;
		--mono: #e5e5e5;
		min-height: 100vh;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 22%),
			repeating-linear-gradient(90deg, transparent 0, transparent 79px, rgba(255, 255, 255, 0.02) 79px, rgba(255, 255, 255, 0.02) 80px),
			var(--page);
		color: var(--text);
		font-family: 'Chivo', sans-serif;
		padding: 1rem 1rem 1.25rem;
	}

	.section-frame {
		width: min(100%, 1420px);
		margin: 0 auto 1.1rem;
		border: 1px solid var(--line);
		background: linear-gradient(180deg, rgba(38, 38, 38, 0.8), rgba(23, 23, 23, 0.96));
	}

	.hero-block {
		display: grid;
		grid-template-columns: 0.92fr 1.08fr;
		
	}

	.hero-copy,
	.hero-poster,
	.story-block,
	.gallery-block,
	.replay-block,
	.info-block {
		position: relative;
	}

	.hero-copy {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		padding: 2rem;
	}

	.hero-copy::before {
		content: '';
		position: absolute;
		inset: 1rem 1rem auto auto;
		width: 7rem;
		height: 7rem;
		border-top: 1px solid var(--line);
		border-right: 1px solid var(--line);
	}

	h1,
	h2,
	h3 {
		margin: 0;
		font-family: 'Chivo', sans-serif;
		font-weight: 800;
		letter-spacing: -0.06em;
		text-transform: uppercase;
	}

	h1 {
		max-width: 9ch;
		font-size: clamp(3.9rem, 10vw, 8rem);
		line-height: 0.88;
	}

	h2 {
		width: 100%;
		max-width: none;
		font-size: clamp(1.8rem, 4.3vw, 4.2rem);
		line-height: 0.95;
		text-wrap: balance;
	}

	h3 {
		font-size: clamp(1.7rem, 3vw, 2.8rem);
		line-height: 0.95;
	}

	.lede,
	.meta-line,
	.info-card p:last-child,
	.detail-card span,
	.detail-card a,
	.empty-state {
		color: var(--muted);
	}

	.eyebrow {
		margin: 0;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.subtle {
		color: #737373;
	}

	.lede {
		max-width: 46rem;
		margin-top: 1.4rem;
		font-size: 1.02rem;
		line-height: 1.8;
	}

	.secondary-lede {
		margin-top: 1rem;
		max-width: 48rem;
	}

	.tertiary-lede {
		margin-top: 1rem;
		max-width: 48rem;
		color: #cfcfcf;
	}

	.hero-actions,
	.stat-row,
	.player-meta,
	.session-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
	}

	.hero-actions {
		margin-top: 2rem;
	}

	.solid-link,
	.ghost-link,
	.detail-card a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
	}

	.solid-link,
	.ghost-link {
		padding: 0.95rem 1.15rem;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.74rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		border: 1px solid var(--line);
	}

	.solid-link {
		background: var(--mono);
		color: #171717;
		border-color: var(--mono);
	}

	.ghost-link {
		color: var(--text);
	}

	.ghost-link.compact {
		padding: 0.75rem 0.95rem;
	}



	.hero-poster {
		display: grid;
		grid-template-rows: 1fr auto;
		border-right: 1px solid var(--line);
	}

	.poster-shell {
		position: relative;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		border-bottom: 1px solid var(--line);
	}

	.poster-shell::after {
		content: '';
		position: absolute;
		inset: auto 1.2rem 1.2rem auto;
		width: 30%;
		height: 20%;
		border-right: 1px solid rgba(255, 255, 255, 0.25);
		border-bottom: 1px solid rgba(255, 255, 255, 0.25);
	}

	.poster-shell img,
	.marquee-card img,
	.player-fallback,
	.lightbox-figure img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.section-heading,
	.logo-marquee,
	.marquee-wrap,
	.replay-layout,
	.details-grid {
		padding: 1.5rem;
	}


	.section-heading {
		display: grid;
		gap: 0.85rem;
		padding-bottom: 0;
	}

	.story-block,
	.gallery-block,
	.replay-block,
	.info-block {
		padding-bottom: 1.5rem;
	}

	.logo-marquee {
		padding: 1.5rem;
		overflow: hidden;
	}

	.logo-track {
		display: flex;
		gap: 1rem;
		width: max-content;
	}

	.logo-track-left {
		animation: marquee-left 32s linear infinite;
	}

	.logo-chip {
		display: grid;
		grid-template-rows: auto auto;
		gap: 0.65rem;
		align-items: start;
		justify-items: center;
		flex: 0 0 12.5rem;
		width: 12.5rem;
		padding: 0.35rem 0.5rem;
		color: var(--text);
		text-decoration: none;
	}

	.logo-image {
		display: block;
		max-width: 100%;
		max-height: 4.5rem;
		width: 100%;
		height: 4.5rem;
		object-fit: contain;
		object-position: center;
		filter: grayscale(1) contrast(1.06) brightness(0.98);
	}

	.logo-name {
		font-size: 0.88rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		text-align: center;
		color: var(--muted);
	}

	.logo-chip:hover {
		transform: translateY(-2px);
	}

	.marquee-wrap {
		display: grid;
		gap: 1rem;
		overflow: hidden;
	}

	.marquee-track {
		display: flex;
		gap: 1rem;
		width: max-content;
	}

	.row-1 { animation: marquee-left 36s linear infinite; }
	.row-2 { animation: marquee-right 42s linear infinite; }
	.row-3 { animation: marquee-left 48s linear infinite; }

	.marquee-card {
		position: relative;
		padding: 0;
		border: 1px solid var(--line);
		background: #0f0f0f;
		cursor: pointer;
		overflow: hidden;
	}

	.row-card-1 { width: 19rem; height: 11.5rem; }
	.row-card-2 { width: 23rem; height: 13rem; }
	.row-card-3 { width: 17rem; height: 10.5rem; }


	.replay-layout {
		display: grid;
		grid-template-columns: 20rem 1fr;
		gap: 1rem;
		align-items: stretch;
	}

	.chapter-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		height: 100%;
	}

	.chapter-list button,
	.session-tabs button,
	.icon-button {
		border: 1px solid var(--line);
		background: #101010;
		color: var(--text);
		font: inherit;
		cursor: pointer;
	}

	.chapter-list button {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.45rem 1rem;
		padding: 1rem;
		text-align: left;
	}

	.chapter-list button p {
		margin: 0;
		font-weight: 700;
	}

	.chapter-list button span {
		grid-column: 1 / 2;
		color: var(--muted);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.chapter-list button strong {
		grid-row: 1 / 3;
		align-self: center;
		padding: 0.35rem 0.45rem;
		border: 1px solid var(--line-soft);
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.68rem;
	}

	.chapter-list button.current,
	.chapter-list button:hover {
		background: var(--mono);
		color: #171717;
	}

	.chapter-list button.current span,
	.chapter-list button:hover span {
		color: #404040;
	}

	.player-panel {
		display: grid;
		gap: 1rem;
		height: 100%;
	}

	.player-shell {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border: 1px solid var(--line);
		background: #000;
	}

	.player-fallback,
	.player-shell iframe {
		position: absolute;
		inset: 0;
	}

	.player-shell iframe {
		width: 100%;
		height: 100%;
	}
	.player-meta {
		justify-content: space-between;
		align-items: end;
		width: 100%;
	}

	.selected-session {
		flex: 1 1 auto;
		min-width: 0;
	}

	.meta-line {
		margin-top: 0.7rem;
		font-size: 0.98rem;
	}

	.speaker-strip {
		display: grid;
		grid-template-columns: 18rem 1fr;
		gap: 1rem;
	}

	.info-card {
		padding: 1.1rem;
		border: 1px solid var(--line);
		background: #101010;
	}

	.info-card p {
		margin: 0;
	}

	.info-card p:last-child {
		margin-top: 0.65rem;
		line-height: 1.75;
	}

	.info-card :global(a) {
		color: var(--text);
		text-decoration: underline;
		text-decoration-color: rgba(255, 255, 255, 0.25);
		text-underline-offset: 0.16em;
	}

	.info-card :global(a:hover) {
		text-decoration-color: rgba(255, 255, 255, 0.6);
	}

	.session-links a {
		background: #101010;
	}

	.session-tabs button {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.9rem 1rem;
	}

	.session-tabs button.playing,
	.session-tabs button:hover {
		background: #262626;
	}

	.details-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
	}

	.detail-card {
		display: grid;
		align-content: start;
		gap: 0.7rem;
		min-height: 15rem;
		padding: 1.2rem;
		border: 1px solid var(--line);
		background: #101010;
	}

	.detail-card a,
	.detail-card span {
		font-size: 0.96rem;
		line-height: 1.7;
	}

	.detail-card a {
		color: var(--text);
	}

	.empty-state {
		margin: 0 1.5rem;
		padding: 2rem;
		border: 1px solid var(--line);
		background: #101010;
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
		width: auto;
		height: auto;
		max-width: min(92vw, 1400px);
		max-height: calc(100svh - 5rem);
		object-fit: contain;
		margin: 0 auto;
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
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.32);
		background: rgba(0, 0, 0, 0.78);
	}

	.close {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	@keyframes marquee-left {
		from { transform: translateX(0); }
		to { transform: translateX(-50%); }
	}

	@keyframes marquee-right {
		from { transform: translateX(-50%); }
		to { transform: translateX(0); }
	}

	@media (max-width: 1180px) {
		.hero-block,
		.logo-marquee,
		.replay-layout,
		.speaker-strip,
		.details-grid {
			grid-template-columns: 1fr;
		}

		.hero-poster {
			border-left: 0;
			border-top: 1px solid var(--line);
		}
	}

	@media (max-width: 720px) {
		.archive-page {
			padding: 0.75rem;
		}

		.hero-copy,
		.section-heading,
		.logo-marquee,
		.marquee-wrap,
		.replay-layout,
		.details-grid {
			padding: 1rem;
		}

		h1 {
			font-size: clamp(3rem, 16vw, 4.6rem);
		}

		h2 {
			font-size: clamp(1.65rem, 7.4vw, 2.5rem);
		}

		.player-shell {
			aspect-ratio: 16 / 9;
			min-height: auto;
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























