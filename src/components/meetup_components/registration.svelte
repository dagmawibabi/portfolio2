<script lang="ts">
	import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let attendanceType = $state('');

	function scrollToPageTwo(e: any) {
		e.preventDefault();
		document.querySelector('#thank_you')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div id="registration" class="relative h-screen snap-start">
	<!-- <img src={dither} alt="header" class="h-full w-full object-cover" /> -->

	<div
		class="absolute inset-0 z-10 flex flex-col justify-center gap-y-5 px-4 text-left text-white md:px-14"
	>
		<div class="text-2xl font-semibold">Register</div>
		<input
			placeholder="Fullname (eg. Dagmawi Babi)"
			class="w-full border-b border-dashed px-2 py-3 outline-none hover:border-solid md:w-3/4"
		/>
		<input
			type="email"
			placeholder="Email (eg. Babi@gmail.com)"
			class="w-full border-b border-dashed px-2 py-3 outline-none hover:border-solid md:w-3/4"
		/>
		<input
			type="tel"
			placeholder="Phone Number (eg. 0912345678)"
			class="w-full border-b border-dashed px-2 py-3 outline-none hover:border-solid md:w-3/4"
		/>
		<input
			placeholder="Occupation (eg. Software Engineer, Google)"
			class="w-full border-b border-dashed px-2 py-3 outline-none hover:border-solid md:w-3/4"
		/>

		<div class="mt-4 flex w-full gap-x-1 md:w-3/4">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="md:text-md w-full cursor-pointer border border-dashed py-2 text-center text-sm transition-all hover:border-solid hover:bg-neutral-700"
				class:border-solid={attendanceType == 'Attending'}
				class:bg-neutral-700={attendanceType == 'Attending'}
				class:font-semibold={attendanceType == 'Attending'}
				onclick={() => (attendanceType = 'Attending')}
			>
				Attending
			</div>

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="md:text-md w-full cursor-pointer border border-dashed py-2 text-center text-sm transition-all hover:border-solid hover:bg-neutral-700"
				class:border-solid={attendanceType == 'Showcasing'}
				class:bg-neutral-700={attendanceType == 'Showcasing'}
				class:font-semibold={attendanceType == 'Showcasing'}
				onclick={() => (attendanceType = 'Showcasing')}
			>
				Showcasing
			</div>

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="md:text-md w-full cursor-pointer border border-dashed py-2 text-center text-sm transition-all hover:border-solid hover:bg-neutral-700"
				class:border-solid={attendanceType == 'Hackathon'}
				class:bg-neutral-700={attendanceType == 'Hackathon'}
				class:font-semibold={attendanceType == 'Hackathon'}
				onclick={() => (attendanceType = 'Hackathon')}
			>
				Hackathon
			</div>

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="md:text-md w-full cursor-pointer border border-dashed py-2 text-center text-sm transition-all hover:border-solid hover:bg-neutral-700"
				class:border-solid={attendanceType == 'Guest'}
				class:bg-neutral-700={attendanceType == 'Guest'}
				class:font-semibold={attendanceType == 'Guest'}
				onclick={() => (attendanceType = 'Guest')}
			>
				Guest
			</div>
		</div>

		{#if attendanceType == 'Showcasing'}
			<input
				placeholder="Project Link (eg. Website, GitHub, Appstore Link)"
				class="w-full border-b border-dashed px-2 py-3 outline-none hover:border-solid md:w-3/4"
			/>
		{/if}

		<a href="#thank_you" onclick={scrollToPageTwo}>
			<div
				class="mt-5 flex w-fit cursor-pointer items-center justify-between gap-x-1 rounded-full border border-none bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3"
			>
				Register
				<ArrowRight size={20} />
			</div>
		</a>
	</div>
</div>
