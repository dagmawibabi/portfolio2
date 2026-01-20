<script lang="ts">
	import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Circle } from 'svelte-loading-spinners';
	// import QR from '@svelte-put/qr/img/QR.svelte';
	import { qr } from '@svelte-put/qr/img';
	import { createQrSvgString, createQrSvgDataUrl } from '@svelte-put/qr';
	import { Download } from '@jis3r/icons';

	function scrollToPageTwo(e: any) {
		e.preventDefault();
		document.querySelector('#thank_you')?.scrollIntoView({ behavior: 'smooth' });
	}

	let { count } = $props();
</script>

<div id="registration" class="relative h-screen snap-start">
	<!-- <img src={dither} alt="header" class="h-full w-full object-cover" /> -->

	<div
		class="absolute inset-0 z-10 flex flex-col justify-center gap-y-5 px-4 text-left text-white md:px-14"
	>
		<div class="font-lexend text-2xl font-semibold">Registration Closed</div>

		<!-- <div class="flex flex-col justify-center gap-y-5 px-4 md:px-14"> -->
		<div class="font-medium">
			Over {count} people have registered surpassing our capacity. We've whitelisted the first 200 as
			that is our capacity. Thank you for your interest, hopefully you'll attend the next one!
		</div>
		<!-- </div> -->

		<a href="#thank_you" onclick={scrollToPageTwo}>
			<div
				class="mt-10 flex w-fit cursor-pointer items-center justify-between gap-x-1 rounded-full border border-none bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3"
			>
				Continue
				<ArrowRight size={20} />
			</div>
		</a>
	</div>
</div>
