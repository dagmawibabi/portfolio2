<script lang="ts">
	import SectionTitles from '../components/section_title.svelte';
	import EachCreativeOutlet from '../components/each_creative_outlet.svelte';
	import { Mic, NotebookPen, Users } from 'lucide-svelte';
	import podcast from '$lib/assets/creativity/podcast2.jpg';
	import dagmawibabi from '$lib/assets/creativity/community.jpg';
	import blog from '$lib/assets/creativity/blog.jpg';

	let creativeOutlets = [
		{
			name: 'Blog',
			description:
				'I like to write here and there about tech, philosophical and spiritual things that interest me. My blog site is called DBlogs',
			icon: NotebookPen,
			image: blog
		},
		{
			name: 'Podcast',
			description:
				'I like to write here and there about tech, philosophical and spiritual things that interest me. My blog site is called DBlogs',
			icon: Mic,
			image: podcast
		},
		{
			name: 'Community',
			description:
				'I like to write here and there about tech, philosophical and spiritual things that interest me. My blog site is called DBlogs',
			icon: Users,
			image: dagmawibabi
		}
	];
</script>

<div class="pb-10">
	<SectionTitles title={'Creativity'} />
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900"></div>
	</div>

	<div
		class="flex justify-evenly gap-x-2 rounded border border-zinc-300 p-2 shadow-md hover:rounded-xl hover:border-black hover:shadow-lg"
	>
		{#each creativeOutlets as creativeOutlet}
			<EachCreativeOutlet {creativeOutlet} />
		{/each}
	</div>
</div>
