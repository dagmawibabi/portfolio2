<script lang="ts">
	import Reader from '$lib/aiscifi/Reader.svelte';
	import Plate from '$lib/aiscifi/perihelion/Plate.svelte';
	import { BASE, series, parts } from '$lib/aiscifi/perihelion/story';

	let { data } = $props();
</script>

<Reader
	{data}
	base={BASE}
	slug={series.slug}
	title={series.title}
	totalRoman={parts[parts.length - 1].roman}
	finLine="The sum is kept."
	finNote="Perihelion is complete. Thank you for reading."
>
	{#snippet plate(n: number)}<Plate {n} />{/snippet}
</Reader>
