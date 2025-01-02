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
			<div class="text-sm font-semibold">{experience.role}</div>
			<div class="py-1">
				<p class="text-sm">
					{experience.description}
				</p>
			</div>

			<div class="text-sm">
				{#each experience.responsibilities as responsibility}
					<div class="flex pt-1">
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
