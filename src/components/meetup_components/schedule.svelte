<script lang="ts">
	import { ArrowRight, MapPin } from 'lucide-svelte';
	import { BellRing, CalendarDays, MapPinCheck, Users } from '@jis3r/icons';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let iconHovered = false;
	let iconHovered1 = false;
	let iconHovered2 = false;
	let iconHovered3 = false;
	let iconHovered4 = false;

	function scrollToPageTwo(e: any) {
		e.preventDefault();
		document.querySelector('#registration')?.scrollIntoView({ behavior: 'smooth' });
	}

	let morningSchedule = [
		{
			time: '08:30 AM - 10:00 AM',
			title: 'Check-in',
			description: 'Open doors and welcome attendees.'
		},
		{
			time: '10:00 AM - 10:30 AM',
			title: 'Opening Ceremony',
			description: 'Brief introduction of the event, schedule, sponsors and partners.'
		},
		{
			time: '10:30 AM - 01:00 PM',
			title: 'Keynotes and Showcases Pt.1 ',
			description:
				'Incredible individuals will take the stage to give talks and showcase their works.',
			tags: ['AI', 'Design', 'Community Showcase']
		},
		{
			time: '01:00 PM - 02:00 PM',
			title: 'Lunch & Networking',
			description: 'Enjoy a delicious lunch while connecting with other attendees.'
		}
	];

	let afternoonSchedule = [
		{
			time: '02:00 PM - 02:30 PM',
			title: 'Live Podcast',
			description: 'Join us on a live podcast session by Devtopia.'
		},
		{
			time: '02:30 PM - 04:00 PM',
			title: 'Keynotes and Showcases Pt.2',
			description:
				'More incredible individuals will take the stage to give talks and showcase their works.',
			tags: ['Dev', 'OSS', 'Community Showcase']
		},
		{
			time: '04:00 PM - 04:30 PM',
			title: 'Creator Awards',
			description: "Partnering with Codenight, we'll celebrate the best creators in the community."
		},
		{
			time: '04:30 PM - 06:00 PM',
			title: 'Closing and Networking',
			description: 'The event will wrap up and allow for networking opportunities.'
		}
	];

	let isMorning = $state(true);
	let schedule = $state(morningSchedule);
</script>

<Dialog.Root>
	<div id="schedule" class="relative h-screen snap-start">
		<!-- <img src={dither} alt="header" class="h-full w-full object-cover" /> -->

		<div
			class="absolute inset-0 z-10 flex flex-col justify-center gap-y-3 px-4 text-left text-white md:gap-y-5 md:px-14"
		>
			<div class="font-lexend text-2xl font-semibold">Schedule</div>

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
						{#if eachSession.title.includes('Keynotes')}
							<div class="mt-2 flex gap-x-2">
								{#each eachSession.tags as tag}
									<div
										class="rounded-full border border-neutral-500 px-3 py-0.5 text-xs text-neutral-400"
									>
										{tag}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>

			{#if isMorning}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="mt-5 flex w-fit cursor-pointer items-center justify-between gap-x-1 rounded-full border border-none bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3"
					onclick={() => {
						isMorning = false;
						schedule = afternoonSchedule;
					}}
				>
					Afternoon Schedule
					<ArrowRight size={20} />
				</div>
			{:else}
				<div class="flex flex-col md:flex-row">
					<a href="#registration" onclick={scrollToPageTwo}>
						<div
							class="mt-5 flex w-fit cursor-pointer items-center justify-between gap-x-1 rounded-full border border-none bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3"
						>
							Join the Event
							<ArrowRight size={20} />
						</div>
					</a>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="mt-5 w-fit cursor-pointer py-2 pl-3 font-semibold text-white uppercase hover:text-emerald-500 md:pl-6"
						onclick={() => {
							isMorning = true;
							schedule = morningSchedule;
						}}
					>
						Morning Schedule
					</div>
				</div>
				<Dialog.Trigger>
					<div
						class="w-fit cursor-pointer py-2 pl-3 text-xs font-semibold text-neutral-400 uppercase italic hover:text-emerald-500 md:pl-3"
					>
						Click here if you are a Creator
					</div>
				</Dialog.Trigger>
			{/if}
		</div>
	</div>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>THE NIGHT IS ALSO OURS 🎉</Dialog.Title>
			<Dialog.Description class="text-black">
				Once the event during the day is over, DxValley will exclusively be open for us creators
				during the night. We'll have dinner, connect more, share experiences, play games, watch
				movies, vibe-code and so much more. So if you wanna bring your laptop, PJs and toothbrush
				feel free!
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
