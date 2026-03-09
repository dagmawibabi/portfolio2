<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import { BellRing, CalendarDays, HandHeart, Heart, MapPinCheck, Users } from '@jis3r/icons';

	let iconHovered1 = $state(false);
	let iconHovered2 = $state(false);
	let iconHovered3 = $state(false);
	let iconHovered4 = $state(false);
	let iconHovered5 = $state(false);
	let iconHovered6 = $state(false);

	function scrollToPageTwo(e: any) {
		e.preventDefault();
		document.querySelector('#support_and_team')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div id="event_details" class="relative min-h-screen snap-start">
	<!-- <img src={dither} alt="header" class="h-full w-full object-cover" /> -->

	<div class="relative z-10 flex min-h-screen flex-col justify-center gap-y-4 px-4 py-20 text-left text-white md:gap-y-5 md:px-14 md:py-0">
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
				<div>9am - 6pm | January 24, 2026</div>
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
				<a
					href="https://maps.app.goo.gl/ntzyK5MFYv5KwzgT9"
					target="_blank"
					class="hover:text-emerald-400"
				>
					<div>ALX Ethiopia | Lideta Hub - Addis Ababa, Ethiopia</div>
				</a>
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
				<div>
					Soon to be Announced on <a
						href="https://t.me/dagmawi_babi"
						target="_blank"
						class="italic underline underline-offset-8 hover:text-emerald-400">my channel</a
					>
				</div>
			</div>
		</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex w-fit cursor-default items-center gap-x-3 rounded-xl border-none py-4 pr-6 pl-0 md:pl-4"
			onmouseenter={() => (iconHovered5 = true)}
			onmouseleave={() => (iconHovered5 = false)}
		>
			<Heart size={40} isHovered={iconHovered5} />
			<div>
				<div class="font-semibold italic">Host</div>
				<div>
					<a href="https://t.me/dagmawi_babi" target="_blank" class="hover:text-emerald-400">
						Dagmawi Babi
					</a>
				</div>
			</div>
		</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex w-fit cursor-default items-center gap-x-3 rounded-xl border-none py-4 pr-6 pl-0 md:pl-4"
			onmouseenter={() => (iconHovered6 = true)}
			onmouseleave={() => (iconHovered6 = false)}
		>
			<HandHeart size={40} isHovered={iconHovered6} />
			<div>
				<div class="font-semibold italic">Organizers</div>
				<div class="flex flex-wrap gap-x-2 gap-y-1">
					<a href="https://t.me/Natyiu0" target="_blank" class="hover:text-emerald-400">@Natyiu0</a>
					<span class="text-white/55">,</span>
					<a href="https://t.me/found_this" target="_blank" class="hover:text-emerald-400">
						@Found_this
					</a>
					<span class="text-white/55">,</span>
					<a href="https://t.me/kinfishfarms" target="_blank" class="hover:text-emerald-400">
						@KinfishFarms
					</a>
					<span class="text-white/55">,</span>
					<a href="https://t.me/Denbit" target="_blank" class="hover:text-emerald-400">@Denbit</a>
					<span class="text-white/55">,</span>
					<a href="https://t.me/NaniBecoming" target="_blank" class="hover:text-emerald-400">
						@NaniBecoming
					</a>
				</div>
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
