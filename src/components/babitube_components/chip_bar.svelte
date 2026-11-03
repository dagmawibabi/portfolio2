<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	let {
		chips,
		sticky = true
	}: {
		chips: { label: string; href: string; active: boolean }[];
		sticky?: boolean;
	} = $props();

	let scroller = $state<HTMLDivElement>();
	let canLeft = $state(false);
	let canRight = $state(false);

	function measure() {
		if (!scroller) return;
		canLeft = scroller.scrollLeft > 4;
		canRight = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 4;
	}

	function move(direction: number) {
		scroller?.scrollBy({ left: direction * scroller.clientWidth * 0.7, behavior: 'smooth' });
	}

	$effect(() => {
		chips;
		const active = scroller?.querySelector<HTMLElement>('.active');
		if (scroller && active) {
			const { offsetLeft, offsetWidth } = active;
			const edge = scroller.offsetLeft;
			const inView =
				offsetLeft - edge >= scroller.scrollLeft &&
				offsetLeft - edge + offsetWidth <= scroller.scrollLeft + scroller.clientWidth;
			if (!inView) {
				scroller.scrollLeft = offsetLeft - edge - (scroller.clientWidth - offsetWidth) / 2;
			}
		}
		measure();
	});
</script>

<svelte:window onresize={measure} />

<div class="bar" class:sticky>
	{#if canLeft}
		<div class="arrow left">
			<button aria-label="Previous" onclick={() => move(-1)}><ChevronLeft size={24} strokeWidth={1.5} /></button>
		</div>
	{/if}
	<div class="chips" bind:this={scroller} onscroll={measure}>
		{#each chips as chip (chip.href)}
			<a class="chip" class:active={chip.active} href={chip.href} data-sveltekit-noscroll>
				{chip.label}
			</a>
		{/each}
	</div>
	{#if canRight}
		<div class="arrow right">
			<button aria-label="Next" onclick={() => move(1)}><ChevronRight size={24} strokeWidth={1.5} /></button>
		</div>
	{/if}
</div>

<style>
	.bar {
		position: relative;
		display: flex;
		align-items: center;
		height: 56px;
		padding: 0 24px;
		background: var(--bg);
		z-index: 10;
	}
	.bar.sticky {
		position: sticky;
		top: 56px;
	}
	.chips {
		display: flex;
		gap: 12px;
		overflow-x: auto;
		scrollbar-width: none;
		min-width: 0;
	}
	.chips::-webkit-scrollbar {
		display: none;
	}
	.chip {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		height: 32px;
		padding: 0 12px;
		border-radius: 8px;
		background: var(--chip);
		color: var(--text);
		font-weight: 500;
		white-space: nowrap;
	}
	.chip:hover {
		background: var(--hover-strong);
	}
	.chip.active {
		background: var(--chip-active-bg);
		color: var(--chip-active-text);
	}
	.arrow {
		position: absolute;
		top: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		width: 88px;
		pointer-events: none;
	}
	.arrow.left {
		left: 16px;
		background: linear-gradient(to right, var(--bg) 40%, transparent);
	}
	.arrow.right {
		right: 16px;
		justify-content: flex-end;
		background: linear-gradient(to left, var(--bg) 40%, transparent);
	}
	.arrow button {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		color: var(--text);
		cursor: pointer;
		pointer-events: auto;
	}
	.arrow button:hover {
		background: var(--hover);
	}
	@media (max-width: 640px) {
		.bar {
			padding: 0 12px;
		}
		.arrow {
			display: none;
		}
	}
</style>
