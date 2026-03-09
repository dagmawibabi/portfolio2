<script lang="ts">
	import { ArrowUpRight, CalendarDays, Camera, HeartHandshake, MapPin, Users } from 'lucide-svelte';
	import ArchiveSection from '../../../components/meetup_archive_components/ArchiveSection.svelte';
	import DetailsSection from '../../../components/meetup_archive_components/DetailsSection.svelte';
	import GallerySection from '../../../components/meetup_archive_components/GallerySection.svelte';
	import HeroSection from '../../../components/meetup_archive_components/HeroSection.svelte';
	import MinimalFooter from '../../../components/meetup_archive_components/MinimalFooter.svelte';
	import SponsorsSection from '../../../components/meetup_archive_components/SponsorsSection.svelte';
	import StatsSection from '../../../components/meetup_archive_components/StatsSection.svelte';
	import TestimonialsSection from '../../../components/meetup_archive_components/TestimonialsSection.svelte';
	import TimelineSection from '../../../components/meetup_archive_components/TimelineSection.svelte';
	import type { GalleryImage, SupporterLogo, VideoSection } from '../../../components/meetup_archive_components/types';
	import heroImage from '$lib/assets/meetups/2026/announcement2.png';

	type DetailItem = {
		label: string;
		value: string;
		link?: string;
		entries?: { label: string; link?: string }[];
		icon: typeof CalendarDays;
	};

	type StatItem = {
		label: string;
		value: string;
		note: string;
	};

	type TimelineItem = {
		period: string;
		phase: string;
		title: string;
		description: string;
		anchor: string;
		time: string;
	};

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
						"The full-day event recap capturing the keynotes, showcases, live podcast, creator awards, and the overall atmosphere of Dagmawi Babi's Meetup.",
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
						"Bisrat Gizaw, Recruitment Analyst at ALX, gave remarks about the services ALX provides. Mike Atskemichael, CTO of Afriwork, shared remarks about Afriwork's future plans. Dagmawi Mekonnen, host of Gugut Podcast, also gave remarks to the attendees.",
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
						"Gemechis Elias showcases Hot Spot, an upcoming travel super app for Ethiopia, at Dagmawi Babi's Meetup.",
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
						"Moan Bekele showcases LucyAI, an AI customer service agent built under ZEMENU, and walks the audience through the product's purpose.",
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
						"In his technical talk on debugging and troubleshooting, Ezra shares resources, tools, tricks, do's and don'ts, and practical lessons on how to track issues accurately and fix full-stack products with clarity.",
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
			title: 'Podcast and Vlog',
			subtitle: 'A live conversation from the stage plus a creator-led recap of the room.',
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
				},
				{
					title: "A day at Dagmawi Babi's Meetup",
					url: 'https://www.youtube.com/watch?v=mX4H_soClwM',
					speakerOrPresenter: 'Tihitina Tesfaye',
					description:
						'I had an incredible day at Dagmawi Babi’s meetup, where I connected with fascinating individuals full of big ideas! The conversations were inspiring, and it was a privilege to meet such brilliant minds! In this video, I tried to capture the essence of the event and even got the chance to interview some of the speakers you might recognize from various tech sectors. I hope you enjoy the video.',
					secondaryLinks: [{ label: 'Tihitina Tesfaye', url: 'https://www.instagram.com/tihitnat/' }]
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
		{
			label: 'Host',
			value: '',
			icon: HeartHandshake,
			entries: [
				{ label: 'Dagmawi Babi', link: 'https://t.me/dagmawi_babi' },
				{ label: '@NaniBecoming', link: 'https://t.me/NaniBecoming' }
			]
		},
		{
			label: 'Organizers',
			value: '',
			icon: Users,
			entries: [
				{ label: '@Natyiu0', link: 'https://t.me/Natyiu0' },
				{ label: '@Found_this', link: 'https://t.me/found_this' },
				{ label: '@KinfishFarms', link: 'https://t.me/kinfishfarms' }
			]
		},
		{
			label: 'Camera Crew',
			value: '@konjo.production',
			link: 'https://www.instagram.com/konjo.production/',
			icon: Camera
		},
		{ label: 'Event Site', value: 'dagmawibabi.com/meetup', link: 'https://dagmawibabi.com/meetup', icon: ArrowUpRight }
	];

	const timelineItems: TimelineItem[] = [
		{
			period: 'Morning',
			phase: '08:30 - 10:00',
			title: 'Check-in',
			description: 'Open doors and welcome attendees.',
			anchor: '#details',
			time: '08:30 AM - 10:00 AM'
		},
		{
			period: 'Morning',
			phase: '10:00 - 10:30',
			title: 'Opening Ceremony',
			description: 'Intro to the event, schedule, sponsors, and partners.',
			anchor: '#archive',
			time: '10:00 AM - 10:30 AM'
		},
		{
			period: 'Morning',
			phase: '10:30 - 01:00',
			title: 'Keynotes and Showcases Pt.1',
			description: 'Talks and showcases across AI, design, and the community.',
			anchor: '#archive',
			time: '10:30 AM - 01:00 PM'
		},
		{
			period: 'Afternoon',
			phase: '01:00 - 02:00',
			title: 'Lunch & Networking',
			description: 'Lunch, connections, and a live Devtopia podcast session.',
			anchor: '#archive',
			time: '01:00 PM - 02:00 PM'
		},
		{
			period: 'Afternoon',
			phase: '02:30 - 04:00',
			title: 'Keynotes and Showcases Pt.2',
			description: 'More talks and showcases across dev, OSS, and the community.',
			anchor: '#archive',
			time: '02:30 PM - 04:00 PM'
		},
		{
			period: 'Afternoon',
			phase: '04:00 - 04:30',
			title: 'Creator Awards',
			description: "With Codenight, the event celebrates standout creators in the community.",
			anchor: '#archive',
			time: '04:00 PM - 04:30 PM'
		},
		{
			period: 'Afternoon',
			phase: '04:30 - 06:00',
			title: 'Closing and Networking',
			description: 'Wrap-up remarks and more room for conversations.',
			anchor: '#details',
			time: '04:30 PM - 06:00 PM'
		}
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
		{ name: 'ALX Ethiopia', link: 'https://t.me/AlxEthiopiaOfficial', group: 'Partner', src: sponsorLogosByBase.alx },
		{ name: 'v0 by Vercel', link: 'https://v0.app/', group: 'Sponsor', src: sponsorLogosByBase.v0 },
		{ name: 'Better Auth', link: 'https://www.better-auth.com/', group: 'Sponsor', src: sponsorLogosByBase.betterauth },
		{ name: 'Codenight', link: 'https://t.me/CodeNight', group: 'Partner', src: sponsorLogosByBase.codenight },
		{ name: 'Horan Technologies', link: 'https://horan.et/', group: 'Sponsor', src: sponsorLogosByBase.horantech },
		{ name: 'Lucy AI', link: 'https://lucy.zemenu.org/', group: 'Sponsor', src: sponsorLogosByBase.lucyai },
		{ name: 'Sticker Guy', link: 'https://stickerguy.et/', group: 'Sponsor', src: sponsorLogosByBase.stickerguy }
	].filter((item) => !!item.src);

	const gallerySources = import.meta.glob('/src/lib/assets/meetups/2026/gallery/*', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as Record<string, string>;

	const galleryImages: GalleryImage[] = Object.entries(gallerySources)
		.filter(([path]) => /\.(png|jpe?g|webp|avif)$/i.test(path))
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([path, src], index) => {
			const name = path.split('/').pop() ?? `image-${index + 1}`;
			return { src, alt: name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') };
		});

	const stats: StatItem[] = [
		{ label: 'Sessions', value: '19', note: 'Talks, showcases, podcast moments, and the closing archive.' },
		{ label: 'Sections', value: '8', note: 'Structured chapters that map the flow of the event.' },
		{ label: 'Partners', value: '7', note: 'Sponsors and ecosystem partners visible across the day.' },
		{ label: 'Attendees', value: '300', note: 'In the room, out of 900+ people who registered.' }
	];
</script>

<svelte:head>
	<title>Dagmawi Babi Meetup Archive 2026 | Talks, Photos, and Event Details</title>
	<meta
		name="description"
		content="Explore the 2026 Dagmawi Babi Meetup archive with full session replays, sponsor highlights, gallery moments, and event details from the gathering."
	/>
</svelte:head>

<div class="archive-page">
	<HeroSection {heroImage} />
	<SponsorsSection {supporterMarquee} />
	<StatsSection {stats} />
	<GallerySection {galleryImages} galleryLink="https://t.me/dagmawibabismeetup" />
	<ArchiveSection {videoSections} />
	<TimelineSection items={timelineItems} />
	<DetailsSection {detailItems} />
	<TestimonialsSection />
	<MinimalFooter />
</div>

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

	@media (max-width: 720px) {
		.archive-page {
			padding: 0.75rem;
		}
	}
</style>

