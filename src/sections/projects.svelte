<script lang="ts">
	import { ExternalLink, Github, MoveDiagonal } from 'lucide-svelte';
	import EachProject_2 from '../components/each_project_2.svelte';
	import SectionTitles from '../components/section_title.svelte';
	import ExtraProjects from '../components/extra_projects.svelte';

	// Project Images
	import ScholarXIV from '$lib/assets/projects/ScholarXIV.png';
	import TheUnityProjectMural from '$lib/assets/projects/TheUnityProjectMural.png';
	import RuthfulHearts from '$lib/assets/projects/RuthfulHearts.png';
	import APIHub from '$lib/assets/projects/APIHub.png';
	import TelegramCommunityGallery from '$lib/assets/projects/TelegramCommunityGallery.jpg';
	import MyBible from '$lib/assets/projects/MyBible.png';
	import AASTUECSFApp from '$lib/assets/projects/AASTUECSFApp.png';
	import FidelPops from '$lib/assets/projects/FidelPops.jpg';
	import MenenArts from '$lib/assets/projects/MenenArts.png';
	import EthioDatasets from '$lib/assets/projects/EthioDatasets.png';
	import StatiCall from '$lib/assets/projects/StatiCall.jpg';

	let aimlProjects = [
		{
			title: 'ScholarXIV',
			image: ScholarXIV,
			description:
				'ScholarXIV is an open-source, aesthetic, minimal and AI powered app that allows users to search, read, bookmark, share, download and view summaries of academic papers from the arXiv repository. You can configure your Gemini API key and converse with AI to expand and dive deeper into the papers you are exploring. This app has won flutter app of the year in 2024 (FlutterofTheYear.com) and has been featued on countless articles and YouTube videos.',
			link: 'https://github.com/dagmawibabi/Scholarxiv/releases/latest',
			code: 'https://github.com/DagmawiBabi/scholarxiv',
			tools: ['Flutter', 'Gemini']
		}
	];

	let christianProjects = [
		{
			title: 'My Bible',
			image: MyBible,
			description:
				'My Bible is an aesthetic, minimally designed and feature rich Bible app with 9 major translations. This Bible app is built around the idea that in order to grasp a fuller picture of the meaning of scriptures, multiple versions should be read and studied in parallel. And so it is designed and built in a way that puts the Bible at the center of the user experience with as little distractions as possible, allowing a single click on any verse to show multiple translations instantly.',
			link: 'https://t.me/Dagmawi_Babi/13687',
			code: 'https://github.com/dagmawibabi/mybible',
			tools: ['Flutter']
		},
		{
			title: 'AASTU ECSF App',
			image: AASTUECSFApp,
			description:
				'I had the privilege of developing the app for my fellowship along with some amazing Christians. So if you want to read incredible spiritual blogs, get daily devotions, set Christian wallpapers, listen to Christian songs, browse our gallery of images from all the teams and even get anonymous counceling about whatever you are going through in life you can check out the app!',
			link: 'https://apkpure.net/aastu-ecsf/com.aastu.ecsf.aastu_ecsf',
			code: 'https://github.com/gemechis-elias/aastu_ecsf',
			tools: ['Flutter']
		}
	];

	let socialProjects = [
		{
			title: 'Ruthful Hearts',
			image: RuthfulHearts,
			description:
				"Ruthful Hearts is aiming to change people's lives one person at a time. Using anonymous donations we make meaningful changes on the lives of people in need. We have these core principles: Anonymous Donations, For All Kinds of People, One at a Time and Private and Graceful. We focus on the people being helped instead of focusing on who donated how much and we value a person simply because each human life is valuable. Let's change lives! ",
			link: 'https://www.RuthfulHearts.com',
			code: 'https://github.com/dagmawibabi/RuthfulHearts',
			tools: ['ReactJS', 'TailwindCSS']
		},
		{
			title: 'The Unity Project Mural',
			image: TheUnityProjectMural,
			description:
				'The Unity Project Mural is a diverse and collaborative art initiative, inviting people to contribute their artistic expressions in a way that interlinks with surrounding artworks. This interconnectedness narrates the story of human relationships, illustrating how we are all intertwined and connected through various facets of life. The artwork featured in this project stems from a vibrant and diverse global creative community, showcasing rich and complex art styles and concepts.',
			link: 'https://www.UnityMural.art',
			code: 'https://github.com/DagmawiBabi/TheUnityProjectMural',
			tools: ['SvelteKit', 'TailwindCSS']
		}
	];

	let notableProjects = [
		{
			title: 'Fidel Pops',
			image: FidelPops,
			description:
				'FidelPops is an engaging educational game designed with a unique Ethiopian themed interface. Players shoot fire balls at the Amharic alphabet letters, and they scale up so big they explode. The game features four distinct categories, each named after major Ethiopian cities and reflecting their unique themes. With a total of 33 levels. FidelPops offers a fun and interactive way for players to learn the Ethiopian Alphabet while exploring the rich cultural backdrop of Ethiopia.',
			link: 'https://dagmawibabi.itch.io/fidelpops',
			code: 'https://github.com/dagmawibabi/FidelPops',
			tools: ['Godot']
		},
		{
			title: 'API Hub',
			image: APIHub,
			description:
				"APIHub is an all-in-one API destination. It is a wrapper around major and popular APIs to have a uniform way of accessing all of them. It's a parent API to all other APIs. I don't have to relearn end-points, dig through their documentations, convert responses to JSON and go through the hassle anymore. It goes further than the basic API usage provided; it handles calculations, date conversions, response limits, data filters, date ranges and so much more.",
			link: 'https://apihub-seven.vercel.app',
			code: 'https://github.com/dagmawibabi/APIHub',
			tools: ['HonoJS']
		},
		{
			title: 'Telegram Community Gallery',
			image: TelegramCommunityGallery,
			description:
				'Telegram Community Gallery is a platform where users can discover and submit their favorite Telegram channels and groups, creating a vibrant space for community exploration. Explore a wide range of Telegram channels and groups, curated by fellow users. Share your favorite Telegram communities with the world by submitting them to the gallery. Easily find communities that match your interests with powerful tagging and filtering options. The platform thrives on community contributions and is completely open source.',
			link: 'https://telegram.dagmawi.dev',
			code: 'https://github.com/dagmawibabi/TelegramCommunityGallery',
			tools: ['SvelteKit', 'TailwindCSS', 'HonoJS', 'MongoDB']
		},

		{
			title: 'StatiCall',
			image: StatiCall,
			description:
				"StatiCall, a minimal and aesthetic app that I built that scans through your call history and gives you incredible analysis. It has the following features: Search for a specific contact's analysis, Sort and filter calls through different parameters, Visualize data through Pie Charts and Bar Graphs. Analyze minimum and maximum frequency and duration of calls, date range of calls and much more.",
			link: 'https://github.com/dagmawibabi/StatiCall/releases/latest',
			code: 'https://github.com/dagmawibabi/StatiCall',
			tools: ['Flutter']
		},
		{
			title: 'Menen Arts',
			image: MenenArts,
			description:
				'A fashion illustration app rich with essential features to design, color, and export custom fashion clothings along with lots of presets to get your design started. It creates flat fashion sketches professionally for beginners or professionals as well. It comes with premade clothings and accesories along with male and female characters to get you started. Once you finish you can export your designs.  Made for Menen Arts Start Up.',
			link: 'https://play.google.com/store/apps/details?id=com.menenartsapp.menenarts',
			code: '',
			tools: ['Flutter']
		},
		{
			title: 'EthioDatasets',
			image: EthioDatasets,
			description:
				'EthioDatasets is a secure, complex data collection, organization and visualization web tool built for the Ministry of Finance in Ethiopia to track and manage all imported and exported items. This is one of the most complex projects I have ever worked on which led to an award from my univeristy AASTU and UNSPSC. I worked as a fullstack developer focused on backend and devops. I had to manage and secure deployments along with orchestrating them. ',
			link: '',
			code: '',
			tools: ['NextJS', 'TailwindCSS', 'NodeJS', 'MongoDB', 'Docker']
		}
	];

	let extraProjects = [
		{
			title: 'Ubuntu UI Clone',
			link: 'https://ubuntu.dagmawibabi.com'
		},
		{
			title: 'Out of Pocket',
			link: 'https://github.com/dagmawibabi/OutOfPocket/releases/latest'
		},
		{
			title: 'Telegram to PDF',
			link: 'https://github.com/dagmawibabi/TelegramToPDF'
		},
		{
			title: 'TG Chat Analyzer',
			link: 'https://chat-dagmawibabi.vercel.app/'
		},
		{
			title: 'Lexicon',
			link: 'https://github.com/dagmawibabi/Lexicon/releases/latest'
		},
		{
			title: 'Survival Manual',
			link: 'https://github.com/dagmawibabi/OfflineSurvivalManual/releases/latest'
		},
		{
			title: 'I Am Ninja',
			link: 'https://github.com/dagmawibabi/IAmNinja'
		},
		{
			title: 'Beautiful OS',
			link: 'https://github.com/dagmawibabi/beautifulelectronsurface'
		}
	];
</script>

<div class="pb-10">
	<!-- AI/ML PROJECTS -->
	<div class="pb-10">
		<SectionTitles title={'AI/ML Projects'} />
		{#each aimlProjects as project}
			<EachProject_2 {project} />
		{/each}
	</div>

	<!-- CHRISTIAN PROJECTS -->
	<div class="pb-10">
		<SectionTitles title={'Christian Projects'} />
		{#each christianProjects as project}
			<EachProject_2 {project} />
		{/each}
	</div>

	<!-- SOCIAL PROJECTS -->
	<div class="pb-10">
		<SectionTitles title={'Social Projects'} />
		{#each socialProjects as project}
			<EachProject_2 {project} />
		{/each}
	</div>

	<!-- Notable PROJECTS -->
	<div class="pb-10">
		<SectionTitles title={'Notable Projects'} />
		{#each notableProjects as project}
			<EachProject_2 {project} />
		{/each}
	</div>

	<!-- GAMES?? -->

	<!-- EXTRA PROJECTS -->
	<SectionTitles title={'Extra Projects'} />
	<ExtraProjects {extraProjects} />
</div>
