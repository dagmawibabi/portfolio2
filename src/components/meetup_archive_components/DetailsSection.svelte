<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	type DetailItem = {
		label: string;
		value: string;
		link?: string;
		entries?: { label: string; link?: string }[];
		icon: ComponentType;
	};

	export let detailItems: DetailItem[] = [];
</script>

<section id="details" class="section-frame info-block">
	<div class="footer-shell">
		<div class="section-heading">
			<p class="eyebrow">Event Details</p>
			<h2>The room, the date, and the venue.</h2>
		</div>

		<div class="details-grid">
			{#each detailItems as item}
				<div class="detail-card">
					<div class="detail-icon">
						<svelte:component this={item.icon} size={18} />
					</div>
					<p class="eyebrow subtle">{item.label}</p>
					{#if item.entries?.length}
						<div class="detail-list">
							{#each item.entries as entry}
								{#if entry.link}
									<a href={entry.link} target="_blank" rel="noreferrer">
										{entry.label}
										<ArrowUpRight size={14} />
									</a>
								{:else}
									<span>{entry.label}</span>
								{/if}
							{/each}
						</div>
					{:else if item.link}
						<a href={item.link} target="_blank" rel="noreferrer">
							{item.value}
							<ArrowUpRight size={14} />
						</a>
					{:else}
						<span>{item.value}</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.section-frame {
		width: min(100%, 1420px);
		margin: 0 auto 1.1rem;
		border: 1px solid var(--line);
		background:
			radial-gradient(circle at top left, rgba(255, 255, 255, 0.09), transparent 36%),
			linear-gradient(180deg, rgba(38, 38, 38, 0.94), rgba(13, 13, 13, 0.98));
	}

	.info-block {
		position: relative;
		padding-bottom: 0;
	}

	.footer-shell {
		position: relative;
		overflow: hidden;
	}

	.footer-shell::before {
		content: '';
		position: absolute;
		inset: 1rem 1rem auto auto;
		width: 10rem;
		height: 10rem;
		border-top: 1px solid rgba(255, 255, 255, 0.16);
		border-right: 1px solid rgba(255, 255, 255, 0.16);
		pointer-events: none;
	}

	.section-heading,
	.details-grid {
		padding: 1.5rem;
	}

	.section-heading {
		display: grid;
		gap: 1rem;
		padding-bottom: 0;
	}

	.eyebrow {
		margin: 0;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.subtle {
		color: #737373;
	}

	h2 {
		margin: 0;
		font-family: 'Chivo', sans-serif;
		width: 100%;
		max-width: none;
		font-size: clamp(2rem, 4.6vw, 4.8rem);
		font-weight: 800;
		line-height: 0.9;
		letter-spacing: -0.06em;
		text-transform: uppercase;
		text-wrap: balance;
	}

	.details-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
	}

	.detail-card {
		display: grid;
		align-content: start;
		gap: 0.9rem;
		min-height: 16rem;
		padding: 1.35rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01)),
			rgba(16, 16, 16, 0.88);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}

	.detail-icon {
		display: inline-grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text);
	}

	.detail-card a,
	.detail-card span {
		font-size: 0.98rem;
		line-height: 1.75;
	}

	.detail-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem 0.8rem;
	}

	.detail-card a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text);
		text-decoration: none;
	}

	.detail-card span {
		color: var(--muted);
	}

	.detail-card a:hover {
		color: #ffffff;
	}

	@media (max-width: 1180px) {
		.details-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 720px) {
		.section-heading,
		.details-grid {
			padding: 1rem;
		}

		h2 {
			font-size: clamp(1.65rem, 7.4vw, 2.5rem);
		}
	}
</style>
