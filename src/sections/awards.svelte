<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import SectionTitle from '../components/section_title.svelte';
	import Autoplay from 'embla-carousel-autoplay';

	// Images
	import GDSCImpactAward from '$lib/assets/awards/GDSCImpactAward.jpg';
	import unspsc from '$lib/assets/awards/UNSPSC.jpg';
	import FlutterOfTheYear from '$lib/assets/awards/FlutterOfTheYear.jpg';

	let awards = [
		{
			name: 'Flutter App of the Year',
			image: FlutterOfTheYear,
			link: 'https://flutteroftheyear.com'
		},
		{ name: 'GDSC Impact Award', image: GDSCImpactAward, link: 'https://t.me/Dagmawi_Babi/19815' },
		{ name: 'UNSPSC Cetificate', image: unspsc, link: '' }
	];
</script>

<div class="pb-10">
	<SectionTitle title={'Awards'} />
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
				{#each awards as eachAward}
					<Carousel.Item class="h-full w-full basis-80">
						<Card.Root>
							<Card.Content
								class="group/content relative m-0 aspect-square h-full w-full overflow-clip rounded border p-0 hover:border-black"
							>
								<a href={eachAward.link}>
									<img
										src={eachAward.image}
										alt=""
										class="h-full w-full object-cover transition-all hover:scale-110 hover:grayscale-0 lg:grayscale xl:grayscale 2xl:grayscale"
									/>
									<div
										class="absolute bottom-2 left-[25%] mx-auto hidden w-fit items-center justify-center rounded-full border border-black bg-white px-3 text-center group-hover/content:flex"
									>
										{eachAward.name}
									</div>
								</a>
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
