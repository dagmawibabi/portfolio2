<script lang="ts">
	import About from '../sections/about.svelte';
	import Creativity from '../sections/creativity.svelte';
	import Experience from '../sections/experience.svelte';
	import Projects from '../sections/projects.svelte';
</script>

<div class="mx-auto w-1/2 pb-56 pt-4">
	<div class="flex items-center">
		<!-- <div
			class="flex items-center justify-center gap-x-1 rounded-full bg-black py-1 pl-3 pr-5 text-2xl text-white"
		>
			<img src={logo} alt="logo" class="w-7" />
			<span> Dagmawi Babi </span>
		</div> -->
	</div>

	<About />
	<Creativity />
	<Projects />
	<Experience />
</div>
