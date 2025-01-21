<script lang="ts">
	import { ExternalLink, Github } from 'lucide-svelte';

	let { extraProjects } = $props();
</script>

<div class="flex flex-col">
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900"></div>
	</div>
	<div
		class="grid grid-cols-2 gap-2 rounded border border-zinc-300 p-2 shadow-sm transition-all hover:rounded-lg hover:border-black lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4"
	>
		{#each extraProjects as extraProject}
			<a href={extraProject.link} target="_blank" rel="noopener noreferrer">
				<div
					class="cursor-pointer border border-zinc-300 px-3 py-1 text-center hover:rounded-lg hover:bg-black hover:text-white"
				>
					{extraProject.title}
				</div>
			</a>
		{/each}
	</div>
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900"></div>
	</div>
</div>

<a href="https://www.github.com/dagmawibabi" target="_blank" rel="noopener noreferrer">
	<div
		class="group/moreProjects flex w-fit cursor-pointer items-center justify-center gap-x-1 rounded-full px-3 py-1 hover:bg-black hover:text-white"
	>
		<span class=""> More on Github </span>
		<Github class="hidden group-hover/moreProjects:block" size={18} />
		<ExternalLink class="block group-hover/moreProjects:hidden" size={18} />
	</div>
</a>
