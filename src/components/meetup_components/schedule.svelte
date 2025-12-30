<script lang="ts">
	import { ArrowRight, MapPin } from 'lucide-svelte';
	import { BellRing, CalendarDays, MapPinCheck, Users } from '@jis3r/icons';

	let iconHovered = false;
	let iconHovered1 = false;
	let iconHovered2 = false;
	let iconHovered3 = false;
	let iconHovered4 = false;

	function scrollToPageTwo(e: any) {
		e.preventDefault();
		document.querySelector('#registration')?.scrollIntoView({ behavior: 'smooth' });
	}

	let schedule = [
		{
			time: '08:00 AM - 10:00 AM',
			title: 'Opening Ceremony',
			description:
				"We'll kick off the event with a welcome speech from our esteemed keynote speakers."
		},
		{
			time: '10:00 AM - 12:00 PM',
			title: 'Keynote Speech',
			description:
				'Our keynote speakers will share their insights on the latest trends in the industry.'
		},
		{
			time: '12:00 PM - 1:00 PM',
			title: 'Lunch Break',
			description: 'Enjoy a delicious lunch provided by our sponsors.'
		},
		{
			time: '1:00 PM - 3:00 PM',
			title: 'Panel Discussion',
			description:
				'Join our panel of experts for a lively discussion on the future of the industry.'
		},
		{
			time: '3:00 PM - 4:00 PM',
			title: 'Networking Session',
			description: 'Meet and greet with other attendees and industry professionals.'
		},
		{
			time: '4:00 PM - 5:00 PM',
			title: 'Closing Remarks',
			description: 'Our keynote speakers will wrap up the event with a final message.'
		}
	];
</script>

<div id="schedule" class="relative h-screen snap-start">
	<!-- <img src={dither} alt="header" class="h-full w-full object-cover" /> -->

	<div
		class="absolute inset-0 z-10 flex flex-col justify-center gap-y-3 px-4 text-left text-white md:gap-y-5 md:px-14"
	>
		<div class="text-2xl font-semibold">Schedule</div>

		<div class="">
			{#each schedule as eachSession}
				<div
					class="flex flex-col border-b border-neutral-700 py-3 hover:bg-neutral-800 md:py-5 md:pl-4"
				>
					<div class="font-mono text-xs text-neutral-400 md:text-sm">{eachSession.time}</div>
					<div class="font-semibold italic md:text-xl">{eachSession.title}</div>
					<div class="pt-1 text-xs text-neutral-300 italic md:text-sm">
						{eachSession.description}
					</div>
				</div>
			{/each}
		</div>

		<a href="#registration" onclick={scrollToPageTwo}>
			<div
				class="mt-5 flex w-fit cursor-pointer items-center justify-between gap-x-1 rounded-full border border-none bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3"
			>
				Join the Event
				<ArrowRight size={20} />
			</div>
		</a>
	</div>
</div>
