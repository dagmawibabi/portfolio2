<script lang="ts">
	import {
		Palette,
		Ban,
		ShieldCheck,
		AlertTriangle,
		Coins,
		CreditCard,
		Share2,
		Sun,
		Sparkles,
		Smile,
		CheckCircle2,
		XCircle
	} from 'lucide-svelte';

	const guidelines = [
		{
			num: '01',
			title: 'Full Creative Freedom',
			tag: 'Non-Negotiable',
			tagType: 'badge-warn',
			icon: Palette,
			text: "I require full creative freedom in the content of the ad. You can review it and suggest edits and I will include those for you, but this is non-negotiable — I won't be copy-pasting things entirely. Authentic creator voice delivers the best conversion for you."
		},
		{
			num: '02',
			title: 'Prohibited Niches & Categories',
			tag: 'Strict Policy',
			tagType: 'badge-danger',
			icon: Ban,
			text: "If your ad is finance-related (like crypto, new wallets, p2p services), betting-related (sports, fantasy), sex-related (pornographic, dating), or secular music — I'm sorry, this isn't the right place for your ad."
		},
		{
			num: '03',
			title: 'Product Functional Standard',
			tag: 'Quality Check',
			tagType: 'badge-info',
			icon: ShieldCheck,
			text: "If your ad is a product — I will try it out, and if I don't think it meets the basic standard of a functional product, I will reject it. Try to meet the basic standard of a solid product; for reference, just check out what builders produce in this community."
		},
		{
			num: '04',
			title: 'Safe Events (No Hidden Risks)',
			tag: 'Safety First',
			tagType: 'badge-warn',
			icon: AlertTriangle,
			text: 'If your ad is an event — and I get the sense that there are hidden intentions or high risks involved (like Bermel-style gatherings centered on drugs and hook-ups), I will decline.'
		},
		{
			num: '05',
			title: 'Dynamic & Fair Pricing',
			tag: 'Open to Negotiation',
			tagType: 'badge-success',
			icon: Coins,
			text: "Price for ads isn't a constant and we can always negotiate. It's not fair to charge the same for an ad about handmade crafts and an ad about developer tools in this channel. One clearly commands different audience engagement."
		},
		{
			num: '06',
			title: 'Upfront Payment',
			tag: 'Required',
			tagType: 'badge-info',
			icon: CreditCard,
			text: 'Payment should be made upfront once we agree on the ad copy, format, and scheduled date/time slot.'
		},
		{
			num: '07',
			title: 'Utilize All My Socials',
			tag: 'Cross-Platform',
			tagType: 'badge-success',
			icon: Share2,
			text: "You can utilize all my socials. I can promote your ad across my Telegram, Instagram, LinkedIn, and YouTube since that's where a lot of my active followers and audience live."
		},
		{
			num: '08',
			title: 'Daytime Posting (6:00 AM – 6:00 PM)',
			tag: 'Schedule Rule',
			tagType: 'badge-info',
			icon: Sun,
			text: 'You can tell me the exact day and time you want your ads released. The only request is that ads are exclusively posted during daytime hours: from morning 6:00 AM to night 6:00 PM.'
		},
		{
			num: '09',
			title: 'Limitless Possibilities Beyond These',
			tag: 'Open Categories',
			tagType: 'badge-success',
			icon: Sparkles,
			text: 'These are the basic guidelines. Apart from these, you can promote anything you want: Events, Products, Companies, Crafts, Initiatives, Your Channels, Courses, Digital Products, Shops, and so much more!'
		},
		{
			num: '10',
			title: "That's It :) Big Circle of Partners",
			tag: 'The Vision',
			tagType: 'badge-brand',
			icon: Smile,
			text: 'Ultimately, the goal is to form a great big circle of companies, products, shops, and services that partner with my brand. High-quality partnerships elevate everyone involved.'
		}
	];

	function getBadgeClasses(type: string) {
		switch (type) {
			case 'badge-danger':
				return 'bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400';
			case 'badge-warn':
				return 'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400';
			case 'badge-success':
				return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400';
			case 'badge-brand':
				return 'bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400';
			default:
				return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
		}
	}
</script>

<div class="w-full space-y-3">
	<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
		{#each guidelines as item}
			<div
				class="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs transition-all duration-150 hover:border-black hover:shadow-xs dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-zinc-600"
			>
				<div>
					<!-- Header -->
					<div class="flex items-center justify-between gap-2 pb-2">
						<div class="flex items-center gap-2">
							<span
								class="font-mono text-xs font-bold text-zinc-400 transition-colors group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-white"
							>
								#{item.num}
							</span>
							<div
								class="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-neutral-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
							>
								<item.icon size={15} />
							</div>
						</div>

						<span
							class={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getBadgeClasses(item.tagType)}`}
						>
							{item.tag}
						</span>
					</div>

					<!-- Title -->
					<h4 class="text-sm font-bold text-zinc-900 dark:text-white">
						{item.title}
					</h4>

					<!-- Body Text -->
					<p class="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
						{item.text}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>
