<script lang="ts">
	export let heroImage: string;
</script>

<section id="hero" class="hero-block section-frame">
	<div class="hero-poster">
		<div class="poster-shell">
			<img src={heroImage} alt="Dagmawi Babi's Meetup event announcement poster" />
		</div>
	</div>

	<div class="hero-copy">
		<p class="eyebrow">Meetup Archive / 2026</p>
		<h1>Dagmawi Babi’s Meetup</h1>
		<p class="lede">
			Dagmawi Babi's Meetup is an exclusive event organized by Dagmawi Babi and his team as a
			thank you to all the incredible individuals, creators, event organizers, companies and
			communities improving and accelerating the tech and design ecosystem in Ethiopia.
		</p>
		<p class="lede secondary-lede">
			It's a thank you for taking risks, for pioneering new ventures, for taking the blame, for
			investing so much of yourself into the benefits of everyone else, for spending months
			building epic things, for spending countless nights preparing events, and for imagining a
			community that can be much better than what it is and working towards your vision.
		</p>
		<p class="lede tertiary-lede">
			The day brings together insightful keynotes, project showcases, a live Devtopia podcast,
			in-person Creator Awards by Codenight, and the kind of in-person energy that only happens
			when builders share a room.
		</p>
		<div class="hero-actions">
			<a href="#archive" class="solid-link">Watch the Archive</a>
			<a href="/" class="ghost-link">
				Portfolio
			</a>
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

	.hero-block {
		position: relative;
		display: grid;
		grid-template-columns: 0.92fr 1.08fr;
	}

	.hero-copy,
	.hero-poster {
		position: relative;
	}

	.hero-copy {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		padding: 2rem;
	}

	.hero-copy::before {
		content: '';
		position: absolute;
		inset: 1rem 1rem auto auto;
		width: 7rem;
		height: 7rem;
		border-top: 1px solid var(--line);
		border-right: 1px solid var(--line);
	}

	h1 {
		margin: 0;
		max-width: 9ch;
		font-family: 'Chivo', sans-serif;
		font-size: clamp(3.9rem, 10vw, 8rem);
		font-weight: 800;
		line-height: 0.88;
		letter-spacing: -0.06em;
		text-transform: uppercase;
	}

	.eyebrow {
		margin: 0;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.lede {
		max-width: 46rem;
		margin-top: 1.4rem;
		color: var(--muted);
		font-size: 1.02rem;
		line-height: 1.8;
	}

	.secondary-lede {
		margin-top: 1rem;
		max-width: 48rem;
	}

	.tertiary-lede {
		margin-top: 1rem;
		max-width: 48rem;
		color: #cfcfcf;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2rem;
	}

	.solid-link,
	.ghost-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.95rem 1.15rem;
		border: 1px solid var(--line);
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.74rem;
		letter-spacing: 0.16em;
		text-decoration: none;
		text-transform: uppercase;
	}

	.solid-link {
		background: var(--mono);
		color: #171717;
		border-color: var(--mono);
	}

	.ghost-link {
		color: var(--text);
	}

	.hero-poster {
		display: grid;
		grid-template-rows: 1fr auto;
		border-right: 1px solid var(--line);
	}

	.poster-shell {
		position: relative;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		border-bottom: 1px solid var(--line);
	}

	.poster-shell::after {
		content: '';
		position: absolute;
		inset: auto 1.2rem 1.2rem auto;
		width: 30%;
		height: 20%;
		border-right: 1px solid rgba(255, 255, 255, 0.25);
		border-bottom: 1px solid rgba(255, 255, 255, 0.25);
	}

	.poster-shell img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (max-width: 1180px) {
		.hero-block {
			grid-template-columns: 1fr;
		}

		.hero-poster {
			border-top: 1px solid var(--line);
			border-right: 0;
		}
	}

	@media (max-width: 720px) {
		.hero-copy {
			padding: 1rem;
		}

		h1 {
			font-size: clamp(3rem, 16vw, 4.6rem);
		}
	}
</style>
