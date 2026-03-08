<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';

	// import AiChat from '../components/portfolio_components/sections/ai_chat.svelte';
	import About from '../components/portfolio_components/sections/about.svelte';
	import Awards from '../components/portfolio_components/sections/awards.svelte';
	import Creativity from '../components/portfolio_components/sections/creativity.svelte';
	import Education from '../components/portfolio_components/sections/education.svelte';
	import Events from '../components/portfolio_components/sections/events.svelte';
	import Experience from '../components/portfolio_components/sections/experience.svelte';
	import Projects from '../components/portfolio_components/sections/projects.svelte';
	import Remarks from '../components/portfolio_components/sections/remarks.svelte';
	import Sponsors from '../components/portfolio_components/sections/sponsors.svelte';
	import { Toaster } from 'svelte-sonner';
</script>

<svelte:head>
	<title>Dagmawi Babi</title>
</svelte:head>

<div
	class="no-scrollbar relative mx-auto w-[96%] pt-0 pb-56 md:w-[96%] lg:w-1/2 xl:w-1/2 2xl:w-1/2"
>
	<a href="/meetup">
		<div
			class="mx-auto mt-2 mb-4 flex w-fit cursor-pointer items-center justify-center gap-x-2 rounded-full bg-neutral-900 py-2 pr-4 pl-5 text-center text-sm text-white hover:text-emerald-400 dark:bg-neutral-700"
		>
			DAGMAWI BABI'S MEETUP - 2026
			<ArrowRight size={20} />
		</div>
	</a>
	<About />
	<Creativity />
	<Events />
	<Projects />
	<Education />
	<Experience />
	<Awards />
	<Remarks />
	<!-- <AiChat isFullscreen={false} /> -->
	<Sponsors />
</div>

<Toaster expand={true} />
