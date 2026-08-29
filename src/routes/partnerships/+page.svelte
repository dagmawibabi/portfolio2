<script lang="ts">
	import {
		Send,
		Instagram,
		Linkedin,
		Youtube,
		Mail,
		ArrowRight,
		Copy,
		ExternalLink,
		Check
	} from 'lucide-svelte';
	import { toast, Toaster } from 'svelte-sonner';
	import SectionTitle from '../../components/section_title.svelte';
	import AdsHeader from '../../components/ads_components/ads_header.svelte';
	import AdTiers from '../../components/ads_components/ad_tiers.svelte';
	import AdGuidelines from '../../components/ads_components/ad_guidelines.svelte';
	import AdTestimonials from '../../components/ads_components/ad_testimonials.svelte';
	import me from '$lib/assets/me/Me.png';
	import me2 from '$lib/assets/me/Me2.png';

	let copied = $state(false);

	function copyTelegramHandle() {
		navigator.clipboard.writeText('t.me/dagmawi_babi?direct');
		copied = true;
		toast.success('Telegram direct link copied to clipboard!', {
			class:
				'bg-white dark:bg-neutral-800 text-black dark:text-white dark:border-none dark:outline-neutral-700 dark:outline-solid dark:outline-2'
		});
		setTimeout(() => {
			copied = false;
		}, 2500);
	}

	const categories = [
		'Startups',
		'Software & Dev Tools',
		'Tech Events & Meetups',
		'Digital Products',
		'Telegram Channels',
		'Instagram Pages',
		'Courses & Education',
		'Hardware & Gadgets',
		'Art & Creative Crafts',
		'Physical Shops',
		'Community Initiatives',
		'Surveys & Research',
		'Design Systems',
		'Agency Services'
	];

	const channels = [
		{
			name: 'Telegram Channel',
			handle: '@dagmawi_babi',
			link: 'https://t.me/dagmawi_babi',
			icon: Send,
			badge: 'Highest Engagement',
			metric: 'Unmatched share & forward rate per post'
		},
		{
			name: 'Instagram',
			handle: '@dagmawibabi',
			link: 'https://www.instagram.com/dagmawibabi',
			icon: Instagram,
			badge: 'Visual & Stories',
			metric: 'Creative professionals, designers & youth'
		},
		{
			name: 'LinkedIn',
			handle: 'dagmawibabi',
			link: 'https://www.linkedin.com/in/dagmawibabi',
			icon: Linkedin,
			badge: 'B2B & Founders',
			metric: 'Founders, hiring managers & tech leaders'
		},
		{
			name: 'YouTube & Podcast',
			handle: '@dagmawi_babi',
			link: 'https://www.youtube.com/@dagmawi_babi',
			icon: Youtube,
			badge: 'Long-Form Depth',
			metric: 'Deep dives, builder interviews & tech talks'
		}
	];
</script>

<svelte:head>
	<title>Ads & Brand Partnerships | Dagmawi Babi</title>
	<meta
		name="description"
		content="Advertise on Dagmawi Babi's brand across Telegram, Instagram, LinkedIn, and YouTube. Reach thousands of highly engaged builders, creators, and tech enthusiasts."
	/>
</svelte:head>

<div
	class="no-scrollbar relative mx-auto w-[96%] pt-4 pb-24 md:w-[96%] lg:w-1/2 xl:w-1/2 2xl:w-1/2"
>
	<AdsHeader />

	<section class="pb-7">
		<div class="flex flex-col gap-6 md:flex-row md:items-center">
			<div class="group/me mx-auto h-40 w-36 shrink-0 cursor-pointer rounded md:mx-0 md:h-48 md:w-44">
				<img src={me2} alt="Dagmawi Babi" class="h-full w-full object-contain group-hover/me:hidden" />
				<img
					src={me}
					alt="Dagmawi Babi"
					class="hidden h-full w-full object-contain group-hover/me:block"
				/>
			</div>

			<div class="flex flex-1 flex-col justify-center">
				<p class="text-[11px] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
					Ads & Partnerships
				</p>
				<h1 class="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
					Partner with an ultra-engaged community of builders, creators, and innovators.
				</h1>
				<p class="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
					Promote your startup, digital product, event, channel, shop, or craft directly to thousands of
					forward-thinking builders. High share rates, authentic voice, and deep cross-platform reach
					across Telegram, Instagram, LinkedIn, and YouTube.
				</p>
				<div class="mt-5 flex flex-wrap items-center gap-2.5">
					<a
						href="https://t.me/dagmawi_babi?direct"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-zinc-200"
					>
						<Send size={15} />
						<span>Book an Ad on Telegram</span>
						<ArrowRight size={14} />
					</a>
					<button
						onclick={copyTelegramHandle}
						class="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-xs font-medium text-zinc-700 transition-colors hover:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-400"
					>
						{#if copied}
							<Check size={14} />
							<span>Link Copied!</span>
						{:else}
							<Copy size={14} />
							<span>Copy Direct Link</span>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</section>

	<section class="pb-7">
		<SectionTitle title={'The Backstory'} />
		<div class="pl-10">
			<div class="h-4 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>
		<div class="space-y-3 rounded border border-zinc-300 p-4 text-sm leading-relaxed text-zinc-600 dark:border-zinc-600 dark:text-zinc-300">
			<p>
				In the process of content creating I have built this incredible community and channel. This
				channel has the highest engagement and shares per post of any platform in its space, and
				it's mind-blowing to see how influential this community has become.
			</p>
			<p>
				For as long as I can remember, I've been asked to post ads in this channel, but I hate
				generic spam ads so I kept refusing. The offers kept increasing, and I kept refusing. But
				one thing changed my mind: most of the community and company showcases I run here are
				fundamentally promotions — the only difference was that I wasn't charging for them.
			</p>
			<p>
				So I figured why not monetize the brand properly, the exact same way I have done with my
				podcast, public speaking, Instagram, and LinkedIn. I've been running paid ads on my other
				socials for a while, so it's time to bring that same high standard here.
			</p>
			<p class="font-medium text-zinc-900 dark:text-white">
				Ultimately, the goal is to form a great big circle of companies, products, shops, and
				services that partner with my brand. High quality ads and sponsorships make a brand more
				influential, which is deeply useful for everyone involved.
			</p>
		</div>
	</section>

	<section class="pb-7">
		<SectionTitle title={'Available Channels'} />
		<div class="pl-10">
			<div class="h-4 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{#each channels as ch}
				<a
					href={ch.link}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex items-start justify-between gap-3 rounded border border-zinc-300 px-3 py-3 transition-colors hover:border-black dark:border-zinc-600 dark:hover:border-zinc-400"
				>
					<div class="flex min-w-0 items-start gap-2.5">
						<div
							class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border border-zinc-300 text-zinc-800 dark:border-zinc-600 dark:text-zinc-200"
						>
							<ch.icon size={15} />
						</div>
						<div class="min-w-0">
							<div class="flex flex-wrap items-baseline gap-x-2">
								<span class="text-sm font-semibold text-zinc-900 dark:text-white">{ch.name}</span>
								<span class="text-xs text-zinc-500 dark:text-zinc-400">{ch.handle}</span>
							</div>
							<p class="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">{ch.metric}</p>
							<span
								class="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"
							>
								View
								<ExternalLink size={11} />
							</span>
						</div>
					</div>
					<span
						class="shrink-0 rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:border-zinc-600 dark:text-zinc-300"
					>
						{ch.badge}
					</span>
				</a>
			{/each}
		</div>
	</section>

	<section class="pb-7">
		<SectionTitle title={'Transparency First'} />
		<div class="pl-10">
			<div class="h-4 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<div class="rounded border border-zinc-300 p-4 dark:border-zinc-600">
				<h3 class="text-sm font-semibold text-zinc-900 dark:text-white">What does not change</h3>
				<ul class="mt-3 space-y-2.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
					<li>
						I will continue to support and showcase creator projects and community works
						<span class="font-medium text-zinc-900 dark:text-white">free of charge</span>. That is
						never going to change.
					</li>
					<li>
						Continued free support for companies and individuals that have partnered with and
						supported ScholarXIV.
					</li>
					<li>Zero drop in organic content, community vibe, personal writings, and developer education.</li>
				</ul>
			</div>
			<div class="rounded border border-zinc-900 bg-neutral-900 p-4 text-white dark:border-zinc-200 dark:bg-white dark:text-zinc-900">
				<h3 class="text-sm font-semibold">What changes</h3>
				<ul class="mt-3 space-y-2.5 text-xs leading-relaxed text-zinc-300 dark:text-zinc-600">
					<li>
						You will see
						<span class="font-medium text-white dark:text-zinc-900">clearly labelled ad posts</span>
						that last temporarily or permanently depending on the agreed package.
					</li>
					<li>Ads will not be spammed; every placement is tested thoughtfully to preserve feed quality.</li>
					<li>
						From a subscriber perspective, nothing changes in daily experience except one clearly
						marked high-quality ad post.
					</li>
				</ul>
			</div>
		</div>
	</section>

	<section class="pb-7">
		<SectionTitle title={'Ad Packages & Tiers'} />
		<div class="pl-10">
			<div class="h-4 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>
		<AdTiers />
	</section>

	<section class="pb-7">
		<SectionTitle title={'What You Can Promote'} />
		<div class="pl-10">
			<div class="h-4 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>
		<p class="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
			As long as your ad complies with the core guidelines, you have total flexibility:
		</p>
		<div class="flex flex-wrap gap-1.5">
			{#each categories as cat}
				<span
					class="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
				>
					{cat}
				</span>
			{/each}
			<span
				class="rounded-full border border-dashed border-zinc-400 px-3 py-1 text-xs text-zinc-500 dark:border-zinc-600 dark:text-zinc-400"
			>
				+ and much more
			</span>
		</div>
	</section>

	<section class="pb-7">
		<SectionTitle title={'Guidelines & Rules'} />
		<div class="pl-10">
			<div class="h-4 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>
		<p class="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
			Ten rules. Read them before you submit an ad request.
		</p>
		<AdGuidelines />
	</section>

	<section class="pb-7">
		<SectionTitle title={'Testimonials & Partner Feedback'} />
		<div class="pl-10">
			<div class="h-4 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>
		<AdTestimonials />
	</section>

	<section class="pb-7">
		<div class="rounded border border-zinc-900 bg-neutral-900 px-5 py-6 text-white md:px-7 md:py-8 dark:border-zinc-200 dark:bg-white dark:text-zinc-900">
			<p class="text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-400 dark:text-zinc-500">
				Let's collaborate
			</p>
			<h2 class="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
				Ready to run an ad or launch a partnership?
			</h2>
			<p class="mt-2 max-w-xl text-xs leading-relaxed text-zinc-400 md:text-sm dark:text-zinc-600">
				Send me a direct message on Telegram with details about what you want to promote, your
				preferred timeline, and target format.
			</p>
			<div class="mt-5 flex flex-wrap items-center gap-2.5">
				<a
					href="https://t.me/dagmawi_babi?direct"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-neutral-900 transition-colors hover:bg-zinc-200 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
				>
					<Send size={15} />
					<span>Text on Telegram (@dagmawi_babi)</span>
					<ArrowRight size={14} />
				</a>
				<a
					href="mailto:1babidagi@gmail.com?subject=Ad%20or%20Sponsorship%20Inquiry%20-%20Dagmawi%20Babi"
					class="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/10 dark:border-zinc-400 dark:text-zinc-900 dark:hover:bg-zinc-100"
				>
					<Mail size={14} />
					<span>Email Inquiry</span>
				</a>
			</div>
		</div>
	</section>

	<div class="border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
		<p>© {new Date().getFullYear()} Dagmawi Babi • Creative Developer & Brand Platform</p>
	</div>
</div>

<Toaster expand={true} />
