<script lang="ts">
	import { Github, MoveDiagonal } from 'lucide-svelte';
	import EachProject from '../components/each_project.svelte';
	import EachProject_2 from '../components/each_project_2.svelte';
	import MoreProjects from '../components/more_projects.svelte';
	import SectionTitles from '../components/section_title.svelte';

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
	<SectionTitles title={'Projects'} />

	<EachProject_2 />
	<EachProject_2 />
	<EachProject_2 />

	<div class="flex flex-col gap-y-4 pt-5">
		<div class="grid grid-cols-4 gap-2 border border-zinc-300 p-2 shadow-sm">
			{#each extraProjects as extraProject}
				<MoreProjects {extraProject} />
			{/each}
		</div>
		<div
			class="group/moreProjects mx-auto flex w-fit cursor-pointer items-center justify-center gap-x-1 rounded-full px-3 py-1 pr-4 hover:bg-black hover:text-white"
		>
			<Github class="hidden group-hover/moreProjects:block" />
			<MoveDiagonal class="block group-hover/moreProjects:hidden" />
			<!-- <div class="block w-6 group-hover/moreProjects:hidden"></div> -->
			<span class="text-lg"> More Projects </span>
		</div>
	</div>
</div>
