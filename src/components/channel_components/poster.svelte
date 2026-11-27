<script lang="ts">
	// A film poster, or a typographic stand-in when no artwork was found.
	import { hash } from '$lib/channel';
	import type { Film } from '../../routes/movies/+page.server';

	let { film, eager = false, class: klass = '' }: { film: Film; eager?: boolean; class?: string } = $props();
	let failed = $state(false);
	const src = $derived(film.meta?.poster ?? null);
	const hue = $derived(hash(film.key) % 360);
</script>

<div class="poster {klass}" style="--h:{hue}">
	{#if src && !failed}
		<img
			{src}
			alt="{film.title} poster"
			loading={eager ? 'eager' : 'lazy'}
			decoding="async"
			referrerpolicy="no-referrer"
			onerror={() => (failed = true)}
		/>
	{:else}
		<div class="fallback">
			<span class="kind">{film.kind}</span>
			<span class="t">{film.title}</span>
			{#if film.year}<span class="y">{film.year}</span>{/if}
		</div>
	{/if}
</div>

<style>
	.poster {
		position: relative;
		aspect-ratio: 2 / 3;
		overflow: hidden;
		border-radius: 6px;
		background: #1a1a1a;
		box-shadow:
			inset 0 0 0 1px rgb(255 255 255 / 0.08),
			0 10px 30px -12px rgb(0 0 0 / 0.8);
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.fallback {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 4px;
		padding: 12%;
		background:
			radial-gradient(120% 80% at 0% 0%, hsl(var(--h) 60% 35%), transparent 60%),
			linear-gradient(160deg, hsl(var(--h) 40% 16%), #0b0b0b);
		color: #f3eee3;
	}
	.kind {
		font-family: 'Inter', sans-serif;
		font-size: 9px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		opacity: 0.6;
	}
	.t {
		font-family: 'Bebas Neue', 'Oswald', sans-serif;
		font-size: clamp(16px, 2.2cqw + 12px, 30px);
		line-height: 0.95;
		letter-spacing: 0.01em;
		overflow-wrap: anywhere;
	}
	.y {
		font-family: 'Inter', sans-serif;
		font-size: 11px;
		opacity: 0.6;
	}
</style>
