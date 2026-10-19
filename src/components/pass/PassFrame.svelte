<script lang="ts">
	import type { Snippet } from 'svelte';
	import poster from '$lib/assets/meetups/2026/announcement2.png';

	let { card, children }: { card: Snippet; children: Snippet } = $props();
</script>

<div
	class="font-lexend min-h-screen bg-neutral-900 text-white md:flex md:h-screen md:overflow-hidden"
>
	<div class="relative flex h-svh items-center justify-center overflow-hidden md:h-screen md:w-1/2">
		<img src={poster} alt="" class="absolute inset-0 h-full w-full object-cover" />
		<div class="absolute inset-0 bg-black/50"></div>
		<div class="relative z-10 h-full w-full">
			{@render card()}
		</div>
	</div>
	<div
		class="no-scrollbar relative bg-linear-to-bl from-neutral-900 to-neutral-800 md:h-screen md:w-1/2 md:overflow-y-scroll"
	>
		{@render children()}
	</div>
</div>
