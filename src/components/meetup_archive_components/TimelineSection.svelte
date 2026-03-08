<script lang="ts">
	type TimelineItem = {
		period: string;
		phase: string;
		title: string;
		description: string;
		anchor: string;
		time: string;
	};

	export let items: TimelineItem[] = [];

	let activePeriod = 'Morning';

	$: availablePeriods = [...new Set(items.map((item) => item.period))];
	$: if (availablePeriods.length && !availablePeriods.includes(activePeriod)) {
		activePeriod = availablePeriods[0];
	}
	$: filteredItems = items.filter((item) => item.period === activePeriod);
</script>

<section id="timeline" class="section-frame timeline-block">
	<div class="section-heading">
		<p class="eyebrow">Timeline</p>
		<h2>How the day flowed.</h2>
	</div>

	<div class="period-tabs" role="tablist" aria-label="Timeline period">
		{#each availablePeriods as period}
			<button
				type="button"
				role="tab"
				class:active={period === activePeriod}
				aria-selected={period === activePeriod}
				on:click={() => (activePeriod = period)}
			>
				{period}
			</button>
		{/each}
	</div>

	<div class="timeline-list">
		{#each filteredItems as item, index}
			<a href={item.anchor} class="timeline-item">
				<div class="timeline-rail" aria-hidden="true">
					<span class="timeline-dot"></span>
					{#if index !== filteredItems.length - 1}
						<span class="timeline-line"></span>
					{/if}
				</div>
				<div class="timeline-content">
					<div class="timeline-meta">
						<p class="phase">{item.phase}</p>
						<p class="time">{item.time}</p>
					</div>
					<h3>{item.title}</h3>
					<p class="description">{item.description}</p>
				</div>
			</a>
		{/each}
	</div>
</section>

<style>
	.section-frame {
		width: min(100%, 1420px);
		margin: 0 auto 1.1rem;
		border: 1px solid var(--line);
		background:
			radial-gradient(circle at top right, rgba(255, 255, 255, 0.08), transparent 28%),
			linear-gradient(180deg, rgba(30, 30, 30, 0.94), rgba(11, 11, 11, 0.99));
	}

	.timeline-block {
		padding: 1.5rem;
	}

	.section-heading {
		display: grid;
		gap: 0.85rem;
		margin-bottom: 1.25rem;
	}

	.eyebrow,
	.phase,
	.time {
		margin: 0;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	h2,
	h3 {
		margin: 0;
		font-family: 'Chivo', sans-serif;
		font-weight: 800;
		letter-spacing: -0.05em;
		text-transform: uppercase;
	}

	h2 {
		font-size: clamp(2rem, 4.8vw, 4.4rem);
		line-height: 0.92;
	}

	h3 {
		font-size: clamp(1.2rem, 2vw, 1.7rem);
		line-height: 1;
	}

	.timeline-list {
		display: grid;
		gap: 0.2rem;
	}

	.period-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		margin-bottom: 1rem;
	}

	.period-tabs button {
		padding: 0.75rem 0.95rem;
		border: 1px solid var(--line);
		background: rgba(255, 255, 255, 0.03);
		color: var(--muted);
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.period-tabs button.active,
	.period-tabs button:hover {
		background: var(--mono);
		color: #171717;
	}

	.timeline-item {
		display: grid;
		grid-template-columns: 2.25rem minmax(0, 1fr);
		gap: 1rem;
		padding: 1rem 0;
		color: inherit;
		text-decoration: none;
	}

	.timeline-item:hover h3 {
		color: #ffffff;
	}

	.timeline-rail {
		display: grid;
		justify-items: center;
		grid-template-rows: auto 1fr;
	}

	.timeline-dot {
		width: 0.8rem;
		height: 0.8rem;
		border: 1px solid rgba(255, 255, 255, 0.28);
		background: #e8e8e8;
	}

	.timeline-line {
		width: 1px;
		height: 100%;
		margin-top: 0.5rem;
		background: rgba(255, 255, 255, 0.18);
	}

	.timeline-content {
		display: grid;
		gap: 0.7rem;
		padding-bottom: 0.4rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.timeline-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		align-items: center;
	}

	.phase {
		color: #f0f0f0;
	}

	.time {
		color: #909090;
	}

	.description {
		margin: 0;
		max-width: 60rem;
		color: var(--muted);
		font-size: 0.98rem;
		line-height: 1.8;
	}

	@media (max-width: 720px) {
		.timeline-block {
			padding: 1rem;
		}

		h2 {
			font-size: clamp(1.7rem, 7.5vw, 2.7rem);
		}
	}
</style>
