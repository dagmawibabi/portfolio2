<script lang="ts">
	import { ArrowRight, MapPin } from 'lucide-svelte';
	import { BellRing, CalendarDays, MapPinCheck, Users } from '@jis3r/icons';

	let iconHovered1 = $state(false);
	let iconHovered2 = $state(false);
	let iconHovered3 = $state(false);
	let iconHovered4 = $state(false);

	function scrollToPageTwo(e: any) {
		e.preventDefault();
		document.querySelector('#support_and_team')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div id="event_details" class="relative h-screen snap-start">
	<!-- <img src={dither} alt="header" class="h-full w-full object-cover" /> -->

	<div
		class="absolute inset-0 z-10 flex flex-col justify-center gap-y-5 px-4 text-left text-white md:px-14"
	>
		<div class="font-lexend text-2xl font-semibold">Event Details</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex w-fit cursor-default items-center gap-x-3 rounded-xl border-none py-4 pr-6 pl-0 md:pl-4"
			onmouseenter={() => (iconHovered1 = true)}
			onmouseleave={() => (iconHovered1 = false)}
		>
			<CalendarDays size={40} isHovered={iconHovered1} />
			<div>
				<div class="font-semibold italic">Date & Time</div>
				<div>10am - 6pm | January 24, 2026</div>
			</div>
		</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex w-fit cursor-default items-center gap-x-3 rounded-xl border-none py-4 pr-6 pl-0 md:pl-4"
			onmouseenter={() => (iconHovered2 = true)}
			onmouseleave={() => (iconHovered2 = false)}
		>
			<MapPinCheck size={40} isHovered={iconHovered2} />
			<div>
				<div class="font-semibold italic">Location</div>
				<div>ALX Ethiopia | Lideta Hub - Addis Ababa, Ethiopia</div>
			</div>
		</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex w-fit cursor-default items-center gap-x-3 rounded-xl border-none py-4 pr-6 pl-0 md:pl-4"
			onmouseenter={() => (iconHovered3 = true)}
			onmouseleave={() => (iconHovered3 = false)}
		>
			<Users size={40} isHovered={iconHovered3} />
			<div>
				<div class="font-semibold italic">Attendees</div>
				<div>Developers, Designers, Content Creators, Event Organizers</div>
			</div>
		</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex w-fit cursor-default items-center gap-x-3 rounded-xl border-none py-4 pr-6 pl-0 md:pl-4"
			onmouseenter={() => (iconHovered4 = true)}
			onmouseleave={() => (iconHovered4 = false)}
		>
			<BellRing size={40} isHovered={iconHovered4} />
			<div>
				<div class="font-semibold italic">Talks and Guests</div>
				<div>Soon to be Announced</div>
			</div>
		</div>

		<a href="#support_and_team" onclick={scrollToPageTwo}>
			<div
				class="mt-5 flex w-fit cursor-pointer items-center justify-between gap-x-1 rounded-full border border-none bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3"
			>
				Sponsors and Team
				<ArrowRight size={20} />
			</div>
		</a>
	</div>
</div>
