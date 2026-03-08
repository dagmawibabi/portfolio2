<script lang="ts">
	import type { SupporterLogo } from './types';

	export let supporterMarquee: SupporterLogo[] = [];
</script>

<section id="manifesto" class="section-frame story-block">
	<div class="section-heading">
		<p class="eyebrow">Sponsors & Partners</p>
	</div>
	<div class="logo-marquee" aria-label="Sponsors and partners">
		<div class="logo-track logo-track-left">
			{#each [...supporterMarquee, ...supporterMarquee] as item}
				<a href={item.link} target="_blank" rel="noreferrer" class="logo-chip">
					<img src={item.src} alt={item.name} class="logo-image" />
					<span class="logo-name">{item.name}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.section-frame {
		width: min(100%, 1420px);
		margin: 0 auto 1.1rem;
		border: 1px solid var(--line);
		background: linear-gradient(180deg, rgba(38, 38, 38, 0.8), rgba(23, 23, 23, 0.96));
	}

	.story-block {
		position: relative;
		padding-bottom: 1.5rem;
	}

	.section-heading,
	.logo-marquee {
		padding: 1.5rem;
	}

	.section-heading {
		display: grid;
		gap: 0.85rem;
		padding-bottom: 0;
	}

	.eyebrow {
		margin: 0;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.logo-marquee {
		overflow: hidden;
	}

	.logo-track {
		display: flex;
		gap: 1rem;
		width: max-content;
	}

	.logo-track-left {
		animation: marquee-left 32s linear infinite;
	}

	.logo-chip {
		display: grid;
		grid-template-rows: auto auto;
		gap: 0.65rem;
		align-items: start;
		justify-items: center;
		flex: 0 0 12.5rem;
		width: 12.5rem;
		padding: 0.35rem 0.5rem;
		color: var(--text);
		text-decoration: none;
	}

	.logo-chip:hover {
		transform: translateY(-2px);
	}

	.logo-image {
		display: block;
		width: 100%;
		height: 4.5rem;
		max-width: 100%;
		max-height: 4.5rem;
		object-fit: contain;
		object-position: center;
		filter: grayscale(1) contrast(1.06) brightness(0.98);
	}

	.logo-name {
		color: var(--muted);
		font-size: 0.88rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		text-align: center;
	}

	@keyframes marquee-left {
		from {
			transform: translateX(0);
		}

		to {
			transform: translateX(-50%);
		}
	}

	@media (max-width: 720px) {
		.section-heading,
		.logo-marquee {
			padding: 1rem;
		}
	}
</style>
