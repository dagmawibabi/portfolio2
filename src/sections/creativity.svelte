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
				'I like to write here and there about tech, philosophical and spiritual topics that interest me. My blog site is called DBlogs',
			icon: NotebookPen,
			image: blog,
			link: '/blog'
		},
		{
			name: 'Podcast',
			description:
				'I like having deep and long conversations with people that inspire me. My podcast is about these conversations',
			icon: Mic,
			image: podcast,
			link: 'https://www.youtube.com/@dagmawi_babi'
		},
		{
			name: 'Community',
			description:
				'Building a community of supportive, driven, caring and brilliant people around me is something I love to do',
			icon: Users,
			image: dagmawibabi,
			link: 'https://t.me/dagmawi_babi'
		}
	];
</script>

<div class="pb-10">
	<SectionTitles title={'Creativity'} />
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900 dark:border-zinc-600"></div>
	</div>

	<div
		class="flex flex-col justify-evenly gap-y-2 rounded border border-zinc-300 p-2 shadow-md hover:rounded-xl hover:border-black hover:shadow-lg dark:border-zinc-600 md:flex-col md:gap-y-2 lg:flex-row lg:gap-x-2 xl:flex-row xl:gap-x-2 2xl:flex-row 2xl:gap-x-2"
	>
		{#each creativeOutlets as creativeOutlet}
			<EachCreativeOutlet {creativeOutlet} />
		{/each}
	</div>
</div>
