<script lang="ts">
	import { ExternalLink, Github, MoveDiagonal } from 'lucide-svelte';
	import EachProject from '../components/each_project.svelte';
	import EachProject_2 from '../components/each_project_2.svelte';
	import MoreProjects from '../components/extra_projects.svelte';
	import SectionTitles from '../components/section_title.svelte';

	// Project Images
	import ScholarXIV from '$lib/assets/projects/ScholarXIV.png';
	import TheUnityProjectMural from '$lib/assets/projects/TheUnityProjectMural.png';
	import ExtraProjects from '../components/extra_projects.svelte';

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

	let socialProjects = [
		{
			title: 'The Unity Project Mural',
			image: TheUnityProjectMural,
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
			tools: ['HonoJS', 'MongoDB', 'SvelteKit', 'TailwindCSS']
		}
	];

	let projects = [
		{
			title: 'The Unity Project Mural',
			image: TheUnityProjectMural,
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

	<!-- SOCIAL PROJECTS -->
	<div class="pb-10">
		<SectionTitles title={'Social Projects'} />
		{#each socialProjects as project}
			<EachProject_2 {project} />
		{/each}
	</div>

	<!-- PERSONAL PROJECTS -->
	<div class="pb-10">
		<SectionTitles title={'Personal Projects'} />
		{#each projects as project}
			<EachProject_2 {project} />
		{/each}
	</div>

	<!-- GAMES?? -->

	<!-- EXTRA PROJECTS -->
	<SectionTitles title={'Extra Projects'} />
	<ExtraProjects {extraProjects} />
</div>
