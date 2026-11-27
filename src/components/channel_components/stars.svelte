<script lang="ts">
	// Letterboxd-style half-star rating.
	let { value, size = 14, class: klass = '' }: { value: number | null; size?: number; class?: string } = $props();
	const full = $derived(Math.floor(value ?? 0));
	const half = $derived((value ?? 0) - full >= 0.5);
</script>

{#if value != null}
	<span class="stars {klass}" style="font-size:{size}px" aria-label="{value} out of 5 stars" title="{value} / 5">
		{'★'.repeat(full)}{#if half}<span class="half">½</span>{/if}
	</span>
{/if}

<style>
	.stars {
		color: #ffb547;
		letter-spacing: 0.04em;
		white-space: nowrap;
		line-height: 1;
	}
	.half {
		font-size: 0.85em;
		margin-left: 1px;
	}
</style>
