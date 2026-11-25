<script lang="ts">
	import Reader from '$lib/aiscifi/Reader.svelte';
	import { BASE, series, parts } from '$lib/aiscifi/heartbeat/story';

	let { data } = $props();
</script>

<Reader
	{data}
	base={BASE}
	slug={series.slug}
	title={series.title}
	totalRoman={parts[parts.length - 1].roman}
	unit="Episode"
	logTag="MSG ▸"
	finLine="To be continued."
	finNote="The next episode is being written. Your progress is saved."
/>
