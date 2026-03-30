<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import SectionTitle from '../../section_title.svelte';
	import Autoplay from 'embla-carousel-autoplay';

	// Images
	import GugutPodcast from '$lib/assets/interviews/GugutPodcast.jpg';
	import TesfaBroadcasting from '$lib/assets/interviews/TesfaBroadcasting.jpg';
	import TesfaBroadcasting2 from '$lib/assets/interviews/TesfaBroadcasting2.jpg';
	import MuyalogyPodcast from '$lib/assets/interviews/MuyalogyPodcast.jpg';
	import HalakPodcast from '$lib/assets/interviews/HalakPodcast.jpg';
	import HalakPodcast2 from '$lib/assets/interviews/HalakPodcast2.jpg';
	import { ExternalLink, Video } from 'lucide-svelte';

	let events = [
		{ name: 'Gugut Podcast', image: GugutPodcast, link: 'https://youtube.com/watch?v=-Wjw37IAdIE' },
		{
			name: 'Muyalogy Podcast',
			image: MuyalogyPodcast,
			link: 'https://youtube.com/watch?v=Fx59plUUW-0'
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
		},
		{
			name: 'Halak Podcast',
			image: HalakPodcast,
			link: 'https://youtu.be/BjF84Y9CH_Y'
		},
		{
			name: 'Halak Podcast',
			image: HalakPodcast2,
			link: 'https://youtu.be/qN8IE8ZnmnA'
		}
	];
</script>

<div class="pb-10">
	<SectionTitle title={'Interviews and Podcasts'} />
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
			<!-- <Carousel.Content>
				{#each events as eachEvent}
					<Carousel.Item class="h-full w-full basis-1/2">
						<Card.Root>
							<Card.Content
								class="group/content relative m-0 aspect-square h-full w-full overflow-clip rounded border p-0 hover:border-black"
							>
								<a href={eachEvent.link} target="_blank">
									<img
										src={eachEvent.image}
										alt=""
										class="h-full w-full object-cover transition-all hover:scale-110"
									/>
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
			<Carousel.Next class="hidden lg:flex xl:flex 2xl:flex" /> -->

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
				class="w-full pt-0"
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
				<Carousel.Previous class="hidden lg:flex xl:flex 2xl:flex" />
				<Carousel.Next class="hidden lg:flex xl:flex 2xl:flex" />
			</Carousel.Root>
		</div>
	</Carousel.Root>

	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900"></div>
	</div>

	<a href="https://www.youtube.com/@dagmawi_babi" target="_blank" rel="noopener noreferrer">
		<div
			class="group/moreProjects flex w-fit cursor-pointer items-center justify-center gap-x-1 rounded-full px-3 py-1 transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
		>
			<span class=""> Checkout My Podcast&nbsp;</span>
			<Video class="hidden group-hover/moreProjects:block" size={18} />
			<ExternalLink class="block group-hover/moreProjects:hidden" size={18} />
		</div>
	</a>
</div>
