<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import SectionTitle from '../components/section_title.svelte';
	import Autoplay from 'embla-carousel-autoplay';

	// Images
	import GugutPodcast from '$lib/assets/events/GugutPodcast.jpg';
	import HalwotEmmanuel from '$lib/assets/events/HalwotEmmanuel.jpg';
	import AASTUTechFest from '$lib/assets/events/AASTUTechFest.jpg';
	import GaraInnovation from '$lib/assets/events/GaraInnovation.jpg';
	import TesfaBroadcasting from '$lib/assets/events/TesfaBroadcasting.jpg';
	import TesfaBroadcasting2 from '$lib/assets/events/TesfaBroadcasting2.jpg';
	import MuyalogyPodcast from '$lib/assets/events/MuyalogyPodcast.jpg';
	import BetterHack from '$lib/assets/events/BetterHack.jpg';
	import BetterHack2 from '$lib/assets/events/BetterHack2.jpg';
	import FutureOfWork from '$lib/assets/events/FutureOfWorkSummit.jpg';
	import FutureOfWork2 from '$lib/assets/events/FutureOfWorkSummit2.jpg';
	import FutureOfWork3 from '$lib/assets/events/FutureOfWorkSummit3.jpg';
	import FutureOfWork4 from '$lib/assets/events/FutureOfWorkSummit4.jpg';
	import FutureOfWork5 from '$lib/assets/events/FutureOfWorkSummit5.jpg';
	import FutureOfWork6 from '$lib/assets/events/FutureOfWorkSummit6.jpg';

	let events = [
		{
			name: 'Future of Work',
			image: FutureOfWork,
			link: 'https://www.instagram.com/p/DQPPHIODcXk/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
		},
		{
			name: 'Future of Work',
			image: FutureOfWork2,
			link: 'https://www.instagram.com/p/DQPPHIODcXk/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
		},
		{
			name: 'Future of Work',
			image: FutureOfWork4,
			link: 'https://www.instagram.com/p/DQPPHIODcXk/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
		},
		{
			name: 'Future of Work ',
			image: FutureOfWork3,
			link: 'https://www.instagram.com/p/DQPPHIODcXk/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
		},
		{
			name: 'Future of Work',
			image: FutureOfWork5,
			link: 'https://www.instagram.com/p/DQPPHIODcXk/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
		},
		{
			name: 'Future of Work',
			image: FutureOfWork6,
			link: 'https://www.instagram.com/p/DQPPHIODcXk/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
		},
		{ name: 'Gugut Podcast', image: GugutPodcast, link: 'https://youtube.com/watch?v=-Wjw37IAdIE' },
		{
			name: 'Halwot Emmanuel',
			image: HalwotEmmanuel,
			link: 'https://www.instagram.com/p/C_qfv1rI1hd/?igsh=d2gwN2hwdDhkdmln'
		},
		{
			name: 'Muyalogy Podcast',
			image: MuyalogyPodcast,
			link: 'https://youtube.com/watch?v=Fx59plUUW-0'
		},

		{ name: 'AASTU TechFest', image: AASTUTechFest, link: 'https://t.me/Dagmawi_Babi/19837' },
		{ name: 'Gara Innovation', image: GaraInnovation, link: 'https://t.me/Garainnovationhub/6' },
		{
			name: 'Better Hack',
			image: BetterHack2,
			link: 'https://better-hack.io'
		},
		{
			name: 'Better Hack',
			image: BetterHack,
			link: 'https://better-hack.io'
		},
		{
			name: 'Tesfa Broadcasting',
			image: TesfaBroadcasting2,
			link: 'https://youtu.be/TXq8BwZfyt4'
		},
		{
			name: 'Tesfa Broadcasting',
			image: TesfaBroadcasting,
			link: 'https://youtu.be/TXq8BwZfyt4'
		}
	];
</script>

<div class="pb-10">
	<SectionTitle title={'Events and Talks'} />
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
	</div>

	<Carousel.Root
		plugins={[
			Autoplay({
				delay: 2000
			})
		]}
		opts={{
			align: 'start',
			loop: true
		}}
		class="w-full"
	>
		<div
			class="group rounded border border-zinc-300 p-2 hover:rounded-xl hover:border-black dark:border-zinc-600"
		>
			<Carousel.Content>
				{#each events as eachEvent}
					<Carousel.Item class="h-full w-full basis-1/2">
						<Card.Root>
							<Card.Content
								class="group/content relative m-0 aspect-square h-full w-full overflow-clip rounded border p-0 hover:border-black"
							>
								<a href={eachEvent.link}>
									<img
										src={eachEvent.image}
										alt=""
										class="h-full w-full object-cover transition-all hover:scale-110"
									/>
									<!-- class="h-full w-full object-cover transition-all hover:scale-110 hover:grayscale-0 lg:grayscale xl:grayscale 2xl:grayscale" -->
									<div
										class="absolute bottom-2 left-[25%] mx-auto hidden w-fit items-center justify-center rounded-full border border-black bg-white px-3 text-center group-hover/content:flex dark:border-neutral-700 dark:bg-black dark:text-white"
									>
										{eachEvent.name}
									</div>
								</a>
							</Card.Content>
						</Card.Root>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous class="hidden lg:flex xl:flex 2xl:flex" />
			<Carousel.Next class="hidden lg:flex xl:flex 2xl:flex" />

			<Carousel.Root
				plugins={[
					Autoplay({
						delay: 2000
					})
				]}
				opts={{
					align: 'start',
					loop: true
				}}
				class="w-full pt-3"
			>
				<Carousel.Content>
					{#each events.reverse() as eachEvent}
						<Carousel.Item class="h-full w-full basis-64">
							<Card.Root>
								<Card.Content
									class="group/content relative m-0 aspect-square h-full w-full overflow-clip rounded border p-0 hover:border-black"
								>
									<a href={eachEvent.link}>
										<img
											src={eachEvent.image}
											alt=""
											class="h-full w-full object-cover transition-all hover:scale-110"
										/>
										<!-- class="h-full w-full object-cover transition-all hover:scale-110 hover:grayscale-0 lg:grayscale xl:grayscale 2xl:grayscale" -->
										<div
											class="absolute bottom-2 left-[25%] mx-auto hidden w-fit items-center justify-center rounded-full border border-black bg-white px-3 text-center group-hover/content:flex dark:border-neutral-700 dark:bg-black dark:text-white"
										>
											{eachEvent.name}
										</div>
									</a>
								</Card.Content>
							</Card.Root>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<!-- <Carousel.Previous class="hidden lg:flex xl:flex 2xl:flex" />
				<Carousel.Next class="hidden lg:flex xl:flex 2xl:flex" /> -->
			</Carousel.Root>
		</div>
	</Carousel.Root>
</div>
