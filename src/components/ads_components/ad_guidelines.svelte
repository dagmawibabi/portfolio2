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
		Smile
	} from 'lucide-svelte';

	const guidelines = [
		{
			num: '01',
			title: 'Full Creative Freedom',
			tag: 'Non-Negotiable',
			icon: Palette,
			text: "I require full creative freedom in the content of the ad. You can review it and suggest edits and I will include those for you, but this is non-negotiable — I won't be copy-pasting things entirely. Authentic creator voice delivers the best conversion for you."
		},
		{
			num: '02',
			title: 'Prohibited Niches & Categories',
			tag: 'Strict Policy',
			icon: Ban,
			text: "If your ad is finance-related (like crypto, new wallets, p2p services), betting-related (sports, fantasy), sex-related (pornographic, dating), or secular music — I'm sorry, this isn't the right place for your ad."
		},
		{
			num: '03',
			title: 'Product Functional Standard',
			tag: 'Quality Check',
			icon: ShieldCheck,
			text: "If your ad is a product — I will try it out, and if I don't think it meets the basic standard of a functional product, I will reject it. Try to meet the basic standard of a solid product; for reference, just check out what builders produce in this community."
		},
		{
			num: '04',
			title: 'Safe Events (No Hidden Risks)',
			tag: 'Safety First',
			icon: AlertTriangle,
			text: 'If your ad is an event — and I get the sense that there are hidden intentions or high risks involved (like Bermel-style gatherings centered on drugs and hook-ups), I will decline.'
		},
		{
			num: '05',
			title: 'Dynamic & Fair Pricing',
			tag: 'Open to Negotiation',
			icon: Coins,
			text: "Price for ads isn't a constant and we can always negotiate. It's not fair to charge the same for an ad about handmade crafts and an ad about developer tools in this channel. One clearly commands different audience engagement."
		},
		{
			num: '06',
			title: 'Upfront Payment',
			tag: 'Required',
			icon: CreditCard,
			text: 'Payment should be made upfront once we agree on the ad copy, format, and scheduled date/time slot.'
		},
		{
			num: '07',
			title: 'Utilize All My Socials',
			tag: 'Cross-Platform',
			icon: Share2,
			text: "You can utilize all my socials. I can promote your ad across my Telegram, Instagram, LinkedIn, and YouTube since that's where a lot of my active followers and audience live."
		},
		{
			num: '08',
			title: 'Daytime Posting (6:00 AM – 6:00 PM)',
			tag: 'Schedule Rule',
			icon: Sun,
			text: 'You can tell me the exact day and time you want your ads released. The only request is that ads are exclusively posted during daytime hours: from morning 6:00 AM to night 6:00 PM.'
		},
		{
			num: '09',
			title: 'Limitless Possibilities Beyond These',
			tag: 'Open Categories',
			icon: Sparkles,
			text: 'These are the basic guidelines. Apart from these, you can promote anything you want: Events, Products, Companies, Crafts, Initiatives, Your Channels, Courses, Digital Products, Shops, and so much more!'
		},
		{
			num: '10',
			title: "That's It :) Big Circle of Partners",
			tag: 'The Vision',
			icon: Smile,
			text: 'Ultimately, the goal is to form a great big circle of companies, products, shops, and services that partner with my brand. High-quality partnerships elevate everyone involved.'
		}
	];
</script>

<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
	{#each guidelines as item}
		<div class="rounded border border-zinc-300 px-3 py-3 dark:border-zinc-600">
			<div class="flex items-start justify-between gap-2">
				<div class="flex min-w-0 items-center gap-2">
					<span class="font-mono text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
						{item.num}
					</span>
					<item.icon size={13} class="shrink-0 text-zinc-700 dark:text-zinc-300" />
					<h4 class="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</h4>
				</div>
				<span
					class="shrink-0 rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-zinc-600 dark:text-zinc-400"
				>
					{item.tag}
				</span>
			</div>
			<p class="mt-1.5 text-xs leading-snug text-zinc-600 dark:text-zinc-400">
				{item.text}
			</p>
		</div>
	{/each}
</div>
