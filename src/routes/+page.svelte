<script lang="ts">
	import About from '../sections/about.svelte';
	import AiChat from '../sections/ai_chat.svelte';
	import Awards from '../sections/awards.svelte';
	import Creativity from '../sections/creativity.svelte';
	import Education from '../sections/education.svelte';
	import Events from '../sections/events.svelte';
	import Experience from '../sections/experience.svelte';
	import Projects from '../sections/projects.svelte';
	import Remarks from '../sections/remarks.svelte';
	import Sponsors from '../sections/sponsors.svelte';
	import { Toaster } from 'svelte-sonner';
</script>

<svelte:head>
	<title>Dagmawi Babi</title>
</svelte:head>

<div
	class="no-scrollbar relative mx-auto min-h-screen w-full bg-emerald-500 pb-56 pt-4"
>
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
