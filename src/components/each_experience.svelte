<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	let { experience } = $props();
</script>

<div>
	<div
		class="w-fit rounded-full border border-zinc-300 px-3 py-1 text-xs font-semibold dark:border-zinc-600"
	>
		{experience.date}
	</div>

	<div class="pl-10">
		<div
			class="w-full border-l border-zinc-300 px-3 pb-5 pl-5 pt-3 dark:border-zinc-600 lg:w-[80%] xl:w-[80%] 2xl:w-[80%]"
		>
			<a href={experience.link} target="_blank">
				{#if experience.logo == ''}
					<div class="text-lg font-bold underline-offset-4 transition-all hover:underline">
						{experience.company}
					</div>
				{:else}
					<div class="pb-2">
						{#if experience.company == 'Afriwork'}
							<img src={experience.logo} alt="" class="h-5 transition-all hover:scale-150" />
						{:else}
							<img src={experience.logo} alt="" class="h-12 transition-all hover:scale-150" />
						{/if}
					</div>
				{/if}
			</a>
			<div class="text-sm font-semibold dark:text-neutral-200">{experience.role}</div>
			<div class="py-1">
				<p class="text-sm dark:text-neutral-300">
					{experience.description}
				</p>
			</div>

			<div class="text-sm">
				{#each experience.responsibilities as responsibility}
					<div class="flex pt-1 dark:text-neutral-400">
						<div class="pt-1">
							<ChevronRight size={14} />
						</div>
						{responsibility}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
