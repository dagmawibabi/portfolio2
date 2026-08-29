<script lang="ts">
	import {
		Clock,
		Infinity as InfinityIcon,
		Crown,
		Check,
		ArrowRight
	} from 'lucide-svelte';

	const tiers = [
		{
			id: 'temporary',
			name: 'Temporary Ads',
			subtitle: 'Fast Turnaround & Quick Reach',
			icon: Clock,
			tag: 'Standard Drop',
			featured: false,
			duration: 'Active for a few days (then deleted)',
			description:
				'Your typical high-impact Telegram channel ad. Perfect for quick hype, time-sensitive drops, launches, or temporary event buzz.',
			highlights: [
				'Prime daytime release (6:00 AM – 6:00 PM)',
				'Instant direct access to thousands of daily active builders',
				'Clearly labelled official ad post',
				'Clean link & custom button formatting',
				'Negotiable pricing suited to community size'
			],
			bestFor: 'Events, limited-time offers, new channel launches, surveys, seasonal discounts.',
			actionText: 'Book Temporary Ad'
		},
		{
			id: 'permanent',
			name: 'Permanent Ads',
			subtitle: 'Evergreen Brand Placement',
			icon: InfinityIcon,
			tag: 'Most Popular',
			featured: true,
			duration: 'Never deleted • Part of channel archive',
			description:
				'Permanent posts that stay forever in the channel history. Highly aligned with the brand aesthetic and searchable for future readers.',
			highlights: [
				'Zero deletion — stays forever in the channel archive',
				'Ongoing evergreen impressions & continuous link clicks',
				'Carefully crafted copy to match the voice of the channel',
				'Cross-promoted where relevant across socials',
				'Highest trust factor among long-time subscribers'
			],
			bestFor:
				'Developer tools, SaaS products, startups, books, YouTube/social channels, design systems.',
			actionText: 'Book Permanent Ad'
		},
		{
			id: 'sponsorship',
			name: 'Sponsorship Ads',
			subtitle: 'Full Omnichannel Partnership',
			icon: Crown,
			tag: 'Full Partnership',
			featured: false,
			duration: 'Multi-platform campaign & deep collaboration',
			description:
				'A multi-layer partnership spanning Telegram, Instagram, LinkedIn, and YouTube. Includes in-depth product review & personalized showcase.',
			highlights: [
				'Full multi-platform blitz (Telegram + Instagram + LinkedIn + YouTube)',
				'Software review & direct architectural/UX advice for your team',
				'Physical products: Custom photo/media with Dagmawi wearing/using it',
				'In-depth storytelling & multiple dedicated posts',
				'Priority timing and custom strategic alignment'
			],
			bestFor:
				'Established companies, hardware/gadgets, funded tech startups, key event partnerships.',
			actionText: 'Inquire for Sponsorship'
		}
	];
</script>

<div class="grid grid-cols-1 gap-2 md:grid-cols-3">
	{#each tiers as tier}
		<div
			class="flex flex-col justify-between rounded border p-3.5 transition-colors {tier.featured
				? 'border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-900'
				: 'border-zinc-300 bg-white hover:border-black dark:border-zinc-600 dark:bg-zinc-950 dark:hover:border-zinc-400'}"
		>
			<div>
				<div class="flex items-start justify-between gap-2">
					<div class="flex items-center gap-2">
						<div
							class="flex h-8 w-8 items-center justify-center rounded border border-zinc-300 text-zinc-900 dark:border-zinc-600 dark:text-white"
						>
							<tier.icon size={16} />
						</div>
						<div>
							<h3 class="text-sm font-semibold text-zinc-900 dark:text-white">{tier.name}</h3>
							<p class="text-[11px] text-zinc-500 dark:text-zinc-400">{tier.subtitle}</p>
						</div>
					</div>
					<span
						class="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium {tier.featured
							? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
							: 'border-zinc-300 text-zinc-600 dark:border-zinc-600 dark:text-zinc-300'}"
					>
						{tier.tag}
					</span>
				</div>

				<p class="mt-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{tier.duration}</p>
				<p class="mt-1.5 text-xs leading-snug text-zinc-600 dark:text-zinc-300">{tier.description}</p>

				<ul class="mt-3 space-y-1">
					{#each tier.highlights as feat}
						<li class="flex items-start gap-1.5 text-[11px] text-zinc-700 dark:text-zinc-300">
							<Check size={12} strokeWidth={2.25} class="mt-0.5 shrink-0" />
							<span class="leading-snug">{feat}</span>
						</li>
					{/each}
				</ul>

				<p class="mt-3 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
					<span class="font-medium text-zinc-800 dark:text-zinc-200">Best for: </span>
					{tier.bestFor}
				</p>
			</div>

			<a
				href="https://t.me/dagmawi_babi?direct"
				target="_blank"
				rel="noopener noreferrer"
				class="group/btn mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-zinc-300 py-2 text-xs font-medium text-zinc-800 transition-colors hover:border-black hover:bg-neutral-900 hover:text-white dark:border-zinc-600 dark:text-zinc-100 dark:hover:border-white dark:hover:bg-white dark:hover:text-zinc-900"
			>
				<span>{tier.actionText}</span>
				<ArrowRight size={14} class="transition-transform group-hover/btn:translate-x-0.5" />
			</a>
		</div>
	{/each}
</div>
