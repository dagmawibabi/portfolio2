<script lang="ts">
	// import dither from '$lib/assets/meetups/2026/bg3.png';
	import logo from '$lib/assets/logo/DagmawiBabiLogo4.png';
	import { ArrowRight, ArrowUpRight } from 'lucide-svelte';

	function scrollToPageTwo(e: any) {
		e.preventDefault();
		document.querySelector('#event_details')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div id="introduction" class="relative h-screen snap-start font-semibold">
	<!-- <img src={dither} alt="header" class="h-full w-full object-cover" /> -->

	<div class="absolute inset-0 z-10 flex flex-col justify-center gap-y-5 text-left text-white">
		<div class="flex flex-col justify-start gap-x-5 gap-y-10 px-4 md:px-14">
			<div class="hidden md:block">
				<img src={logo} alt="logo" width="250" />
			</div>
			<div class="block md:hidden">
				<img src={logo} alt="logo" width="100" />
			</div>
			<div class="flex flex-col gap-y-1">
				<div class="font-lexend w-fit text-2xl md:text-5xl">Dagmawi Babi's Meetup</div>
				<!-- <div class="w-fit italic">The very first Dagmawi Babi event</div> -->
			</div>
		</div>

		<div class="flex flex-col justify-center gap-y-5 px-4 md:px-14">
			<div class="font-medium">
				This is an independently organized event by Dagmawi Babi and his team. The event is a yearly
				event organized as a thank you to all the incredible individuals, creators, event
				organizers, companies, and communities contributing to improve and accelerate the tech and
				design ecosystem.
			</div>
			<div class="font-medium">
				It's a thank you for taking risks, for pioneering new ventures, for taking the blame, for
				investing so much of yourself into the benefits of everyone else, for spending months
				building epic things, for spending countless nights preparing events, for imagining a
				community that can be much better than what it is and working towards your vision.
			</div>

			<div class="flex">
				<a href="#event_details" onclick={scrollToPageTwo}>
					<div
						class="mt-5 flex w-fit cursor-pointer items-center justify-between gap-x-1 rounded-full border-none bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3"
					>
						Read More
						<ArrowRight size={20} />
					</div>
				</a>
				<a href="/" target="_self">
					<div
						class="mt-5 w-fit cursor-pointer py-2 pl-6 font-semibold text-white uppercase hover:text-emerald-500"
					>
						Portfolio
					</div>
				</a>
			</div>
		</div>
	</div>
</div>
