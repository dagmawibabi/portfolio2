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

	let events = [
		{ name: 'Gugut Podcast', image: GugutPodcast, link: 'https://youtube.com/watch?v=-Wjw37IAdIE' },
		{
			name: 'Halwot Emmanuel',
			image: HalwotEmmanuel,
			link: 'https://www.instagram.com/p/C_qfv1rI1hd/?igsh=d2gwN2hwdDhkdmln'
		},
		{ name: 'AASTU TechFest', image: AASTUTechFest, link: 'https://t.me/Dagmawi_Babi/19837' },
		{ name: 'Gara Innovation', image: GaraInnovation, link: 'https://t.me/Garainnovationhub/6' },
		{
			name: 'Tesfa Broadcasting',
			image: TesfaBroadcasting,
			link: 'https://www.youtube.com/@tbn_eth'
		}
	];
</script>

<div class="pb-10">
	<SectionTitle title={'Events'} />
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900"></div>
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
		<div class="group rounded border border-zinc-300 p-2 hover:rounded-xl hover:border-black">
			<Carousel.Content>
				{#each events as eachEvent}
					<Carousel.Item class="h-full w-full basis-80">
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
										class="absolute bottom-2 left-[25%] mx-auto hidden w-fit items-center justify-center rounded-full border border-black bg-white px-3 text-center group-hover/content:flex"
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
		</div>
	</Carousel.Root>
</div>
