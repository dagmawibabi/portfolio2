<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	let { experience } = $props();
</script>

<div>
	<div class="w-fit rounded-full border border-zinc-300 px-3 py-1 text-xs font-semibold">
		{experience.date}
	</div>

	<div class="pl-10">
		<div class="w-[80%] border-l border-zinc-300 px-3 pb-5 pl-5 pt-3">
			{#if experience.logo == ''}
				<div class="text-lg font-bold">{experience.company}</div>
			{:else}
				<div class="pb-2">
					<img src={experience.logo} alt="" class="h-6 transition-all hover:scale-150" />
				</div>
			{/if}
			<div class="text-sm">{experience.role}</div>
			<div>
				<p class="text-sm">
					I'm a member of AASTU's Center of Excellence. It's a research and development program
					where I've developed multiple complex softwares and apps.
				</p>
			</div>

			<div class="text-sm">
				{#each experience.responsibilities as responsibility}
					<div class="flex items-center">
						<ChevronRight size={14} />
						{responsibility}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
