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

	let aimlProjects = [
		{
			title: 'ScholarXIV',
			image: ScholarXIV,
			description:
				'The Unity Project Mural is a diverse and collaborative art initiative, inviting people to contribute their artistic expressions in a way that interlinks with surrounding artworks. This interconnectedness narrates the story of human relationships, illustrating how we are all intertwined and connected through various facets of life. The artwork featured in this project stems from a vibrant and diverse global creative community, showcasing rich and complex art styles and concepts.',
			link: 'unitymural.art',
			code: 'https://github.com/DagmawiBabi/art',
			tools: ['SvelteKit', 'TailwindCSS', 'Unity', 'ChromiaDB']
		}
	];

	let christianProjects = [
		{
			title: 'My Bible',
			image: MyBible,
			description:
				'The Unity Project Mural is a diverse and collaborative art initiative, inviting people to contribute their artistic expressions in a way that interlinks with surrounding artworks. This interconnectedness narrates the story of human relationships, illustrating how we are all intertwined and connected through various facets of life. The artwork featured in this project stems from a vibrant and diverse global creative community, showcasing rich and complex art styles and concepts.',
			link: 'unitymural.art',
			code: 'https://github.com/DagmawiBabi/art',
			tools: ['SvelteKit', 'TailwindCSS', 'Unity', 'ChromiaDB']
		},
		{
			title: 'AASTU ECSF App',
			image: AASTUECSFApp,
			description:
				'The Unity Project Mural is a diverse and collaborative art initiative, inviting people to contribute their artistic expressions in a way that interlinks with surrounding artworks. This interconnectedness narrates the story of human relationships, illustrating how we are all intertwined and connected through various facets of life. The artwork featured in this project stems from a vibrant and diverse global creative community, showcasing rich and complex art styles and concepts.',
			link: 'unitymural.art',
			code: 'https://github.com/DagmawiBabi/art',
			tools: ['SvelteKit', 'TailwindCSS', 'Unity', 'ChromiaDB']
		}
	];

	let socialProjects = [
		{
			title: 'Ruthful Hearts',
			image: RuthfulHearts,
			description:
				'The Unity Project Mural is a diverse and collaborative art initiative, inviting people to contribute their artistic expressions in a way that interlinks with surrounding artworks. This interconnectedness narrates the story of human relationships, illustrating how we are all intertwined and connected through various facets of life. The artwork featured in this project stems from a vibrant and diverse global creative community, showcasing rich and complex art styles and concepts.',
			link: 'unitymural.art',
			code: 'https://github.com/DagmawiBabi/art',
			tools: ['SvelteKit', 'TailwindCSS', 'Unity', 'ChromiaDB']
		},
		{
			title: 'The Unity Project Mural',
			image: TheUnityProjectMural,
			description:
				'The Unity Project Mural is a diverse and collaborative art initiative, inviting people to contribute their artistic expressions in a way that interlinks with surrounding artworks. This interconnectedness narrates the story of human relationships, illustrating how we are all intertwined and connected through various facets of life. The artwork featured in this project stems from a vibrant and diverse global creative community, showcasing rich and complex art styles and concepts.',
			link: 'unitymural.art',
			code: 'https://github.com/DagmawiBabi/art',
			tools: ['SvelteKit', 'TailwindCSS', 'Unity', 'ChromiaDB']
		}
	];

	let notableProjects = [
		{
			title: 'API Hub',
			image: APIHub,
			description:
				'The Unity Project Mural is a diverse and collaborative art initiative, inviting people to contribute their artistic expressions in a way that interlinks with surrounding artworks. This interconnectedness narrates the story of human relationships, illustrating how we are all intertwined and connected through various facets of life. The artwork featured in this project stems from a vibrant and diverse global creative community, showcasing rich and complex art styles and concepts.',
			link: 'unitymural.art',
			code: 'https://github.com/DagmawiBabi/art',
			tools: ['SvelteKit', 'TailwindCSS', 'Unity', 'ChromiaDB']
		},
		{
			title: 'Fidel Pops',
			image: FidelPops,
			description:
				'The Unity Project Mural is a diverse and collaborative art initiative, inviting people to contribute their artistic expressions in a way that interlinks with surrounding artworks. This interconnectedness narrates the story of human relationships, illustrating how we are all intertwined and connected through various facets of life. The artwork featured in this project stems from a vibrant and diverse global creative community, showcasing rich and complex art styles and concepts.',
			link: 'unitymural.art',
			code: 'https://github.com/DagmawiBabi/art',
			tools: ['SvelteKit', 'TailwindCSS', 'Unity', 'ChromiaDB']
		},
		{
			title: 'Telegram Community Gallery',
			image: TelegramCommunityGallery,
			description:
				'The Unity Project Mural is a diverse and collaborative art initiative, inviting people to contribute their artistic expressions in a way that interlinks with surrounding artworks. This interconnectedness narrates the story of human relationships, illustrating how we are all intertwined and connected through various facets of life. The artwork featured in this project stems from a vibrant and diverse global creative community, showcasing rich and complex art styles and concepts.',
			link: 'unitymural.art',
			code: 'https://github.com/DagmawiBabi/art',
			tools: ['HonoJS', 'MongoDB', 'SvelteKit', 'TailwindCSS']
		},
		{
			title: 'The Unity Project Mural',
			image: TheUnityProjectMural,
			description:
				'The Unity Project Mural is a diverse and collaborative art initiative, inviting people to contribute their artistic expressions in a way that interlinks with surrounding artworks. This interconnectedness narrates the story of human relationships, illustrating how we are all intertwined and connected through various facets of life. The artwork featured in this project stems from a vibrant and diverse global creative community, showcasing rich and complex art styles and concepts.',
			link: 'unitymural.art',
			code: 'https://github.com/DagmawiBabi/art',
			tools: ['Rust', 'Python', 'Arduino', 'C#']
		},
		{
			title: 'The Unity Project Mural',
			image: TheUnityProjectMural,
			description:
				'The Unity Project Mural is a diverse and collaborative art initiative, inviting people to contribute their artistic expressions in a way that interlinks with surrounding artworks. This interconnectedness narrates the story of human relationships, illustrating how we are all intertwined and connected through various facets of life. The artwork featured in this project stems from a vibrant and diverse global creative community, showcasing rich and complex art styles and concepts.',
			link: 'unitymural.art',
			code: 'https://github.com/DagmawiBabi/art',
			tools: ['NextJS', 'C++', 'Kubernetes', 'Docker']
		}
	];

	let extraProjects = [
		{
			title: 'Ubuntu UI Clone',
			link: 'ubuntu.dagmawibabi.com'
		},
		{
			title: 'Ubuntu UI Clone',
			link: 'ubuntu.dagmawibabi.com'
		},
		{
			title: 'Ubuntu UI Clone',
			link: 'ubuntu.dagmawibabi.com'
		},
		{
			title: 'Ubuntu UI Clone',
			link: 'ubuntu.dagmawibabi.com'
		},
		{
			title: 'Ubuntu UI Clone',
			link: 'ubuntu.dagmawibabi.com'
		},
		{
			title: 'Ubuntu UI Clone',
			link: 'ubuntu.dagmawibabi.com'
		},
		{
			title: 'Ubuntu UI Clone',
			link: 'ubuntu.dagmawibabi.com'
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
