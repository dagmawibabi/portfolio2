<script lang="ts">
	import { ExternalLink, Github } from 'lucide-svelte';

	let { vibeCodedProjects } = $props();
</script>

<div class="flex flex-col">
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
	</div>
	<div
		class="grid grid-cols-2 gap-2 rounded border border-zinc-300 p-2 shadow-xs transition-all hover:rounded-lg hover:border-black lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 dark:border-zinc-600"
	>
		{#each vibeCodedProjects as extraProject}
			<a href={extraProject.link} target="_blank" rel="noopener noreferrer">
				<div
					class="cursor-pointer border border-zinc-300 px-3 py-1 text-center transition-all hover:rounded-lg hover:bg-black hover:text-white dark:border-zinc-600 dark:text-neutral-300"
				>
					{extraProject.title}
				</div>
			</a>
		{/each}
	</div>
</div>
