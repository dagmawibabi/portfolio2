<script lang="ts">
	// import dither from '$lib/assets/meetups/2026/bg3.png';
	import logo from '$lib/assets/logo/DagmawiBabiLogo4.png';
	import { ArrowUp, ArrowUpRight } from 'lucide-svelte';

	function scrollToPageTwo(e: any) {
		e.preventDefault();
		document.querySelector('#introduction')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div id="thank_you" class="relative h-screen snap-start font-semibold">
	<!-- <img src={dither} alt="header" class="h-full w-full object-cover" /> -->

	<div class="absolute inset-0 z-10 flex flex-col justify-center gap-y-8 text-left text-white">
		<div class="flex flex-col justify-start gap-x-5 gap-y-10 px-4 md:px-14">
			<img src={logo} alt="logo" width="150" />
			<div class="flex flex-col gap-y-1">
				<div class="font-lexend w-fit text-5xl md:text-7xl">Thank You,</div>
				<div class="font-lexend w-fit text-5xl md:text-7xl">See you Soon!</div>
			</div>
		</div>

		<div class="flex flex-col gap-y-5 px-4 md:justify-center md:px-14">
			<!-- <div class="font-medium">Event Details | Support and Team | Schedule</div> -->

			<div class="flex">
				<a href="#introduction" onclick={scrollToPageTwo}>
					<div
						class="mt-5 flex w-fit cursor-pointer items-center justify-between gap-x-1 rounded-full border-none bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3"
					>
						Back to Top
						<ArrowUp size={20} />
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
