<script lang="ts">
	import { ArrowRight, MapPin } from 'lucide-svelte';
	import {
		BellRing,
		CalendarDays,
		MapPinCheck,
		Award,
		HandCoins,
		HandHeart,
		Heart
	} from '@jis3r/icons';

	let iconHovered1 = false;
	let iconHovered2 = false;
	let iconHovered3 = false;
	let iconHovered4 = false;

	function scrollToPageTwo(e: any) {
		e.preventDefault();
		document.querySelector('#schedule')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div id="support_and_team" class="relative h-screen snap-start">
	<!-- <img src={dither} alt="header" class="h-full w-full object-cover" /> -->

	<div
		class="absolute inset-0 z-10 flex flex-col justify-center gap-y-5 px-4 text-left text-white md:px-14"
	>
		<div class="font-lexend text-2xl font-semibold">Support and Team</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex w-fit cursor-default items-center gap-x-3 rounded-xl border-none py-4 pr-0 pl-0 md:pr-6 md:pl-4"
			onmouseenter={() => (iconHovered1 = true)}
			onmouseleave={() => (iconHovered1 = false)}
		>
			<HandHeart size={40} isHovered={iconHovered1} />
			<div>
				<div class="font-semibold italic">Partners</div>
				<div>
					<a href="https://ethiopia.alxafrica.com" target="_blank" class="hover:text-emerald-400">
						ALX
					</a>
					,
					<a href="https://t.me/codenight" target="_blank" class="hover:text-emerald-400">
						Codenight
					</a>
				</div>
			</div>
		</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex w-fit cursor-default items-center gap-x-3 rounded-xl border-none py-4 pr-0 pl-0 md:pr-6 md:pl-4"
			onmouseenter={() => (iconHovered2 = true)}
			onmouseleave={() => (iconHovered2 = false)}
		>
			<HandCoins size={40} isHovered={iconHovered2} />
			<div>
				<div class="font-semibold italic">Sponsors</div>
				<div>
					<a href="https://v0.app" target="_blank" class="hover:text-emerald-400"> v0 by Vercel</a>
					,
					<a href="https://gebeta.app" target="_blank" class="hover:text-emerald-400">
						GebetaMaps
					</a>
					,
					<a href="https://horan.et" target="_blank" class="hover:text-emerald-400">
						Horan Technologies
					</a>
				</div>
			</div>
		</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex w-fit cursor-default items-center gap-x-3 rounded-xl border-none py-4 pr-0 pl-0 md:pr-6 md:pl-4"
			onmouseenter={() => (iconHovered3 = true)}
			onmouseleave={() => (iconHovered3 = false)}
		>
			<Award size={40} isHovered={iconHovered3} />
			<div>
				<div class="font-semibold italic">Merch and Stickers</div>
				<div>
					<a href="https://t.me/stickerguy" target="_blank" class="hover:text-emerald-400">
						StickerGuy
					</a>
					,
					<a href="https://t.me/erbana_clothing" target="_blank" class="hover:text-emerald-400">
						Erbana Clothing
					</a>
				</div>
			</div>
		</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex w-fit cursor-default items-center gap-x-3 rounded-xl border-none py-4 pr-0 pl-0 md:pr-6 md:pl-4"
			onmouseenter={() => (iconHovered3 = true)}
			onmouseleave={() => (iconHovered3 = false)}
		>
			<Heart size={40} isHovered={iconHovered3} />
			<div>
				<div class="font-semibold italic">Organizers</div>
				<div>
					<a href="https://t.me/Natyiu0" target="_blank" class="hover:text-emerald-400">
						@Natyiu0
					</a>
					,
					<a href="https://t.me/found_this" target="_blank" class="hover:text-emerald-400">
						@Found_this
					</a>
					,
					<a href="https://t.me/kinfishfarms" target="_blank" class="hover:text-emerald-400">
						@KinfishFarms
					</a>
					,
					<a href="https://t.me/Denbit" target="_blank" class="hover:text-emerald-400"> @Denbit </a>
				</div>
			</div>
		</div>

		<a href="#schedule" onclick={scrollToPageTwo}>
			<div
				class="mt-5 flex w-fit cursor-pointer items-center justify-between gap-x-1 rounded-full border border-none bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3"
			>
				Schedule
				<ArrowRight size={20} />
			</div>
		</a>
	</div>
</div>
