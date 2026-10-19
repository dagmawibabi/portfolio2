<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { SeriesInfo } from '$lib/blogs';

	let { series }: { series: SeriesInfo } = $props();
</script>

<nav
	aria-label={`${series.name} series`}
	class="mt-14 border-t border-dashed border-zinc-300 pt-6 dark:border-zinc-800"
>
	<div class="pb-3 text-sm text-neutral-500 italic">
		Part {series.part} of {series.total} · {series.name}
	</div>

	<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
		{#if series.previous}
			<a href={`/blog/${series.previous.slug}`} rel="prev">
				<div
					class="group h-full rounded border border-zinc-300 bg-neutral-50 p-2 px-3 shadow-xs transition-all hover:border-zinc-400 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
				>
					<div class="flex items-center gap-1 pb-1 text-xs text-neutral-500 italic">
						<ChevronLeft class="size-3" /> Previous
					</div>
					<div class="text-md font-semibold dark:text-neutral-300 dark:group-hover:text-white">
						{series.previous.title}
					</div>
				</div>
			</a>
		{:else}
			<div class="hidden md:block"></div>
		{/if}

		{#if series.next}
			<a href={`/blog/${series.next.slug}`} rel="next">
				<div
					class="group h-full rounded border border-zinc-300 bg-neutral-50 p-2 px-3 text-right shadow-xs transition-all hover:border-zinc-400 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
				>
					<div class="flex items-center justify-end gap-1 pb-1 text-xs text-neutral-500 italic">
						Next <ChevronRight class="size-3" />
					</div>
					<div class="text-md font-semibold dark:text-neutral-300 dark:group-hover:text-white">
						{series.next.title}
					</div>
				</div>
			</a>
		{/if}
	</div>
</nav>
