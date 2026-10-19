<script lang="ts">
	import { canonicalProgram, PRESETS } from '$lib/pass/program';

	let { value = $bindable('') } = $props();

	const parsed = $derived(canonicalProgram(value));
</script>

<div class="mt-8">
	<div class="font-lexend text-2xl font-semibold">Program the foil</div>
	<p class="mt-2 max-w-md text-sm font-medium text-neutral-300">
		One instruction per line. pigment copper, tide, violet, ink. motion ribbons, orbits, lattice,
		embers. tempo 0–1.5. grain 0–1. waves 1–16.
	</p>
	<div class="mt-4 flex flex-wrap gap-2">
		{#each PRESETS as preset}
			<button
				class="cursor-pointer border border-dashed px-3 py-2 text-sm transition-all hover:border-solid hover:bg-neutral-700"
				type="button"
				onclick={() => (value = preset.source)}
			>
				{preset.name}
			</button>
		{/each}
	</div>
	<textarea
		id="foil-program"
		name="program"
		bind:value
		rows="7"
		spellcheck="false"
		autocapitalize="off"
		autocomplete="off"
		class="mt-4 w-full border border-dashed bg-black/20 p-3 font-mono text-sm outline-none hover:border-solid focus-visible:border-solid"
	></textarea>
	{#if parsed.error}
		<p class="mt-3 text-sm text-red-300" role="alert">{parsed.error}</p>
	{/if}
</div>
