<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import SectionTitle from '../components/section_title.svelte';
	import Autoplay from 'embla-carousel-autoplay';

	// Images
	import GugutPodcast from '$lib/assets/events/GugutPodcast.jpg';
	import HalwotEmmanuel from '$lib/assets/events/HalwotEmmanuel.jpg';
	import AASTUTechFest from '$lib/assets/events/AASTUTechFest.jpg';

	let events = [
		{ name: 'Gugut Podcast', image: GugutPodcast },
		{ name: 'Halwot Emmanuel', image: HalwotEmmanuel },
		{ name: 'AASTU TechFest', image: AASTUTechFest }
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
								<img
									src={eachEvent.image}
									alt=""
									class="h-full w-full object-cover grayscale transition-all hover:scale-110 hover:grayscale-0"
								/>
								<div
									class="absolute bottom-2 left-[25%] mx-auto hidden w-fit items-center justify-center rounded-full border border-black bg-white px-3 text-center group-hover/content:flex"
								>
									{eachEvent.name}
								</div>
							</Card.Content>
						</Card.Root>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</div>
	</Carousel.Root>
</div>
