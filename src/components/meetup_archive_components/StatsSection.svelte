<script lang="ts">
	type StatItem = {
		label: string;
		value: string;
		note: string;
	};

	export let stats: StatItem[] = [];
</script>

<section id="stats" class="section-frame stats-block">
	<div class="stats-grid">
		{#each stats as stat}
			<div class="stat-card">
				<p class="stat-value">{stat.value}</p>
				<p class="stat-label">{stat.label}</p>
				<p class="stat-note">{stat.note}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.section-frame {
		width: min(100%, 1420px);
		margin: 0 auto 1.1rem;
		border: 1px solid var(--line);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 40%),
			linear-gradient(180deg, rgba(26, 26, 26, 0.96), rgba(12, 12, 12, 0.98));
	}

	.stats-block {
		padding: 1rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
	}

	.stat-card {
		display: grid;
		gap: 0.5rem;
		padding: 1.2rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.03);
	}

	.stat-value,
	.stat-label,
	.stat-note {
		margin: 0;
	}

	.stat-value {
		font-family: 'Chivo', sans-serif;
		font-size: clamp(2rem, 5vw, 3.8rem);
		font-weight: 800;
		line-height: 0.9;
		letter-spacing: -0.06em;
		text-transform: uppercase;
	}

	.stat-label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #d4d4d4;
	}

	.stat-note {
		color: var(--muted);
		font-size: 0.94rem;
		line-height: 1.7;
	}

	@media (max-width: 980px) {
		.stats-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 720px) {
		.stats-block {
			padding: 0.75rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
