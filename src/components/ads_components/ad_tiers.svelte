<script lang="ts">
	import {
		Clock,
		Infinity as InfinityIcon,
		Crown,
		Check,
		Send,
		Sparkles,
		Layers,
		ArrowRight
	} from 'lucide-svelte';

	const tiers = [
		{
			id: 'temporary',
			name: 'Temporary Ads',
			subtitle: 'Fast Turnaround & Quick Reach',
			icon: Clock,
			tag: 'Standard Drop',
			tagColor: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
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
			actionText: 'Book Temporary Ad',
			telegramMsg: 'Hey Dagmawi, I would like to run a Temporary Ad on your channel.'
		},
		{
			id: 'permanent',
			name: 'Permanent Ads',
			subtitle: 'Evergreen Brand Placement',
			icon: InfinityIcon,
			tag: 'Most Popular',
			tagColor: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400',
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
			bestFor: 'Developer tools, SaaS products, startups, books, YouTube/social channels, design systems.',
			actionText: 'Book Permanent Ad',
			telegramMsg: 'Hey Dagmawi, I want to book a Permanent Ad for my product/brand.'
		},
		{
			id: 'sponsorship',
			name: 'Sponsorship Ads',
			subtitle: 'Full Omnichannel Partnership',
			icon: Crown,
			tag: 'Ultimate Synergy',
			tagColor: 'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400',
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
			bestFor: 'Established companies, hardware/gadgets, funded tech startups, key event partnerships.',
			actionText: 'Inquire for Sponsorship',
			telegramMsg: 'Hey Dagmawi, I am interested in a Full Sponsorship partnership across your socials.'
		}
	];
</script>

<div class="w-full">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		{#each tiers as tier}
			<div
				class="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-black hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-500"
			>
				<!-- Top Header -->
				<div>
					<div class="flex items-center justify-between pb-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-neutral-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
						>
							<tier.icon size={20} />
						</div>
						<span
							class={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tier.tagColor}`}
						>
							{tier.tag}
						</span>
					</div>

					<h3 class="text-lg font-bold text-zinc-900 dark:text-white">
						{tier.name}
					</h3>
					<p class="text-xs font-medium text-zinc-500 dark:text-zinc-400">
						{tier.subtitle}
					</p>

					<!-- Duration Badge -->
					<div
						class="mt-3 inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
					>
						<Sparkles size={12} class="text-emerald-500" />
						<span>{tier.duration}</span>
					</div>

					<!-- Description -->
					<p class="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
						{tier.description}
					</p>

					<!-- Feature Checklist -->
					<div class="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
						<span class="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
							What's included
						</span>
						<ul class="mt-2 space-y-2">
							{#each tier.highlights as feat}
								<li class="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
									<div
										class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
									>
										<Check size={11} strokeWidth={3} />
									</div>
									<span class="leading-tight">{feat}</span>
								</li>
							{/each}
						</ul>
					</div>

					<!-- Best For -->
					<div class="mt-4 rounded-lg bg-neutral-50 p-2.5 text-[11px] text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400">
						<span class="font-semibold text-zinc-800 dark:text-zinc-200">Best for: </span>
						{tier.bestFor}
					</div>
				</div>

				<!-- CTA -->
				<div class="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
					<a
						href="https://t.me/dagmawi_babi?direct"
						target="_blank"
						rel="noopener noreferrer"
						class="group/btn flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white py-2.5 text-xs font-semibold text-zinc-800 transition-all duration-150 hover:border-black hover:bg-neutral-900 hover:text-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-white dark:hover:bg-white dark:hover:text-zinc-900"
					>
						<span>{tier.actionText}</span>
						<ArrowRight size={14} class="transition-transform group-hover/btn:translate-x-0.5" />
					</a>
				</div>
			</div>
		{/each}
	</div>
</div>
