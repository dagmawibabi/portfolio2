<script lang="ts">
	import alettech from '$lib/assets/partners/alettech.jpg';
	import ambalaymaps from '$lib/assets/partners/ambalaymaps.jpg';

	const placeholderTestimonials = [
		{
			name: 'Binyam Dele',
			role: 'Founder, Ambalay Maps',
			product: 'Building national geospatial systems | OpenStreetMap Ethiopia',
			initials: 'BD',
			image: ambalaymaps,
			href: 'https://www.ambalaymaps.com',
			color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
			tag: 'LinkedIn Ad',
			quote:
				'Working with Dagmawi on LinkedIn was a smooth, genuine collaboration. He understood the work and shared it in a way that felt natural to his audience.'
		},
		{
			name: 'Haille Jegnamach',
			role: 'Founder and CEO, Alet Cloud',
			product: "Ethiopia's Sovereign Cloud Provider",
			initials: 'HJ',
			image: alettech,
			href: 'https://aletcloud.com',
			color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
			tag: 'Sponsorship Ad',
			quote:
				"Running a sponsorship campaign with Dagmawi Babi was hands-down one of the best ad runs we've done! We've gotten so many signups just in the first 12 hours and more. He was also great and intelligent to work with."
		}
	];
</script>

<div class="w-full">
	<div class="grid grid-cols-1 gap-3.5 md:grid-cols-2">
		{#each placeholderTestimonials as item}
			<a
				href={item.href}
				target="_blank"
				rel="noopener noreferrer"
				class="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-600"
			>
				<div>
					<!-- Top Bar -->
					<div class="flex items-center pb-3">
						<span class={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.color}`}>
							{item.tag}
						</span>
					</div>

					<!-- Quote -->
					<p class="text-xs leading-relaxed text-zinc-700 italic dark:text-zinc-300">
						"{item.quote}"
					</p>
				</div>

				<!-- Person Info -->
				<div class="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
					{#if item.image}
						<img
							src={item.image}
							alt="{item.name} logo"
							class="h-8 w-8 shrink-0 rounded-full border border-zinc-200 bg-black object-cover dark:border-zinc-700"
						/>
					{:else}
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 font-mono text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900"
						>
							{item.initials}
						</div>
					{/if}
					<div class="min-w-0">
						<div class="truncate text-xs font-bold text-zinc-900 dark:text-white">
							{item.name}
						</div>
						<div class="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
							{item.role}
						</div>
						{#if item.product}
							<div class="text-[11px] leading-snug text-zinc-400 dark:text-zinc-500">
								{item.product}
							</div>
						{/if}
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
