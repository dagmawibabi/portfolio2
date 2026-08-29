<script lang="ts">
	import {
		Send,
		Instagram,
		Linkedin,
		Youtube,
		Mail,
		Sparkles,
		CheckCircle2,
		ArrowRight,
		Copy,
		ExternalLink,
		Check,
		ShieldCheck,
		Zap,
		MessageSquare,
		Handshake
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
			color: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400',
			icon: Send,
			badge: 'Highest Engagement',
			metric: 'Unmatched share & forward rate per post'
		},
		{
			name: 'Instagram',
			handle: '@dagmawibabi',
			link: 'https://www.instagram.com/dagmawibabi',
			color: 'border-pink-500/30 bg-pink-500/5 text-pink-600 dark:text-pink-400',
			icon: Instagram,
			badge: 'Visual & Stories',
			metric: 'Creative professionals, designers & youth'
		},
		{
			name: 'LinkedIn',
			handle: 'dagmawibabi',
			link: 'https://www.linkedin.com/in/dagmawibabi',
			color: 'border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400',
			icon: Linkedin,
			badge: 'B2B & Founders',
			metric: 'Founders, hiring managers & tech leaders'
		},
		{
			name: 'YouTube & Podcast',
			handle: '@dagmawi_babi',
			link: 'https://www.youtube.com/@dagmawi_babi',
			color: 'border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400',
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
	class="no-scrollbar relative mx-auto w-[96%] pt-4 pb-40 md:w-[96%] lg:w-1/2 xl:w-1/2 2xl:w-1/2"
>
	<!-- Navigation & Brand Header -->
	<AdsHeader />

	<!-- Hero Section -->
	<section class="pb-10">
		<div class="flex flex-col gap-6 md:flex-row md:items-center">
			<!-- Image on left -->
			<div class="group/me mx-auto h-48 w-44 shrink-0 cursor-pointer rounded md:mx-0 md:h-56 md:w-52">
				<img src={me2} alt="Dagmawi Babi" class="h-full w-full object-contain group-hover/me:hidden" />
				<img
					src={me}
					alt="Dagmawi Babi"
					class="hidden h-full w-full object-contain group-hover/me:block"
				/>
			</div>

			<!-- Right side content -->
			<div class="flex flex-1 flex-col justify-center">
				<h1 class="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
					Partner with an ultra-engaged community of builders, creators, and innovators.
				</h1>

				<p class="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
					Promote your startup, digital product, event, channel, shop, or craft directly to thousands of
					forward-thinking builders. High share rates, authentic voice, and deep cross-platform reach
					across Telegram, Instagram, LinkedIn, and YouTube.
				</p>

				<!-- Direct CTA Button -->
				<div class="mt-5 flex flex-wrap items-center gap-3">
					<a
						href="https://t.me/dagmawi_babi?direct"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-neutral-800 hover:shadow-md dark:bg-white dark:text-neutral-900 dark:hover:bg-zinc-200"
					>
						<Send size={15} />
						<span>Book an Ad on Telegram</span>
						<ArrowRight size={14} />
					</a>

					<button
						onclick={copyTelegramHandle}
						class="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-xs font-medium text-zinc-700 transition-colors hover:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500"
					>
						{#if copied}
							<Check size={14} class="text-emerald-500" />
							<span class="text-emerald-600 dark:text-emerald-400">Link Copied!</span>
						{:else}
							<Copy size={14} />
							<span>Copy Direct Link</span>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Story & Context Section -->
	<section class="pb-10">
		<SectionTitle title={'The Backstory'} />
		<div class="pl-10">
			<div class="h-7 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>

		<div
			class="space-y-3.5 rounded-xl border border-zinc-200 bg-neutral-50/50 p-5 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
		>
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

	<!-- Multi-Social Platforms Section -->
	<section class="pb-10">
		<SectionTitle title={'Available Channels'} />
		<div class="pl-10">
			<div class="h-7 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			{#each channels as ch}
				<a
					href={ch.link}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs transition-all hover:border-black hover:shadow-xs dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-zinc-600"
				>
					<div>
						<div class="flex items-center justify-between pb-2">
							<div class="flex items-center gap-2">
								<div class={`flex h-8 w-8 items-center justify-center rounded-lg border ${ch.color}`}>
									<ch.icon size={16} />
								</div>
								<div>
									<div class="text-sm font-bold text-zinc-900 dark:text-white">
										{ch.name}
									</div>
									<div class="text-xs text-zinc-500 dark:text-zinc-400">
										{ch.handle}
									</div>
								</div>
							</div>
							<span
								class="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
							>
								{ch.badge}
							</span>
						</div>

						<p class="mt-2 text-xs text-zinc-600 dark:text-zinc-300">
							{ch.metric}
						</p>
					</div>

					<div class="mt-3 flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-black dark:group-hover:text-white">
						<span>View profile</span>
						<ExternalLink size={12} />
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- What Changes vs What Doesn't -->
	<section class="pb-10">
		<SectionTitle title={'Transparency First'} />
		<div class="pl-10">
			<div class="h-7 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>

		<div class="grid grid-cols-1 gap-3.5 md:grid-cols-2">
			<!-- What Doesn't Change -->
			<div
				class="rounded-xl border border-emerald-500/30 bg-emerald-50/40 p-4.5 dark:border-emerald-500/20 dark:bg-emerald-950/20"
			>
				<div class="flex items-center gap-2 pb-2 text-emerald-700 dark:text-emerald-300">
					<CheckCircle2 size={18} />
					<h3 class="text-sm font-bold">What DOES NOT Change</h3>
				</div>
				<ul class="space-y-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
					<li class="flex items-start gap-1.5">
						<span class="font-bold text-emerald-600">•</span>
						<span>
							I will continue to support and showcase creator projects and community works <strong
								>free of charge</strong
							>. That is never going to change.
						</span>
					</li>
					<li class="flex items-start gap-1.5">
						<span class="font-bold text-emerald-600">•</span>
						<span>
							Continued free support for companies and individuals that have partnered with and
							supported ScholarXIV.
						</span>
					</li>
					<li class="flex items-start gap-1.5">
						<span class="font-bold text-emerald-600">•</span>
						<span>
							Zero drop in organic content, community vibe, personal writings, and developer
							education.
						</span>
					</li>
				</ul>
			</div>

			<!-- What Changes -->
			<div
				class="rounded-xl border border-blue-500/30 bg-blue-50/40 p-4.5 dark:border-blue-500/20 dark:bg-blue-950/20"
			>
				<div class="flex items-center gap-2 pb-2 text-blue-700 dark:text-blue-300">
					<Sparkles size={18} />
					<h3 class="text-sm font-bold">What Changes</h3>
				</div>
				<ul class="space-y-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
					<li class="flex items-start gap-1.5">
						<span class="font-bold text-blue-600">•</span>
						<span>
							You will see <strong>clearly labelled ad posts</strong> that last temporarily or permanently
							depending on the agreed package.
						</span>
					</li>
					<li class="flex items-start gap-1.5">
						<span class="font-bold text-blue-600">•</span>
						<span>
							Ads will not be spammed; every placement is tested thoughtfully to preserve feed
							quality.
						</span>
					</li>
					<li class="flex items-start gap-1.5">
						<span class="font-bold text-blue-600">•</span>
						<span>
							From a subscriber perspective, nothing changes in daily experience except one clearly
							marked high-quality ad post.
						</span>
					</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- Ad Packages / Tiers -->
	<section class="pb-10">
		<SectionTitle title={'Ad Packages & Tiers'} />
		<div class="pl-10">
			<div class="h-7 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>

		<AdTiers />
	</section>

	<!-- Categories You Can Promote -->
	<section class="pb-10">
		<SectionTitle title={'What You Can Promote'} />
		<div class="pl-10">
			<div class="h-7 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>

		<div
			class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/70"
		>
			<p class="text-xs text-zinc-600 dark:text-zinc-300">
				As long as your ad complies with the core guidelines, you have total flexibility to promote
				a wide range of offerings:
			</p>

			<div class="mt-3 flex flex-wrap gap-2">
				{#each categories as cat}
					<span
						class="rounded-full border border-zinc-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500"
					>
						{cat}
					</span>
				{/each}
				<span
					class="rounded-full border border-dashed border-zinc-300 px-3 py-1 text-xs italic text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
				>
					+ and much more!
				</span>
			</div>
		</div>
	</section>

	<!-- Guidelines & Rules -->
	<section class="pb-10">
		<SectionTitle title={'Guidelines & Rules'} />
		<div class="pl-10">
			<div class="h-7 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>

		<div class="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
			Please review these 10 guidelines before submitting your ad request:
		</div>

		<AdGuidelines />
	</section>

	<!-- Testimonials Section -->
	<section class="pb-10">
		<SectionTitle title={'Testimonials & Partner Feedback'} />
		<div class="pl-10">
			<div class="h-7 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
		</div>

		<AdTestimonials />
	</section>

	<!-- Final Booking CTA -->
	<section class="pb-10">
		<div
			class="relative overflow-hidden rounded-2xl border border-zinc-200 bg-linear-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-6 text-white shadow-xl dark:border-zinc-800 md:p-8"
		>
			<div class="relative z-10 max-w-xl">
				<div class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur-md">
					<Sparkles size={13} />
					<span>Let's collaborate</span>
				</div>

				<h2 class="mt-3 text-xl font-bold tracking-tight md:text-2xl">
					Ready to run an ad or launch a partnership?
				</h2>

				<p class="mt-2 text-xs leading-relaxed text-zinc-300 md:text-sm">
					Send me a direct message on Telegram with details about what you want to promote, your
					preferred timeline, and target format.
				</p>

				<!-- Buttons -->
				<div class="mt-5 flex flex-wrap items-center gap-3">
					<a
						href="https://t.me/dagmawi_babi?direct"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-neutral-900 transition-all hover:bg-zinc-100 hover:shadow-lg"
					>
						<Send size={15} />
						<span>Text on Telegram (@dagmawi_babi)</span>
						<ArrowRight size={14} />
					</a>

					<a
						href="mailto:1babidagi@gmail.com?subject=Ad%20or%20Sponsorship%20Inquiry%20-%20Dagmawi%20Babi"
						class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
					>
						<Mail size={14} />
						<span>Email Inquiry</span>
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer remark -->
	<div class="border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
		<p>© {new Date().getFullYear()} Dagmawi Babi • Creative Developer & Brand Platform</p>
	</div>
</div>

<Toaster expand={true} />
