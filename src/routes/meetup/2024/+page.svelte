<script lang="ts">
	import {
		ArrowRight,
		CalendarDays,
		MapPinned,
		MoveUpRight,
		Ticket,
		TimerReset,
		Users
	} from 'lucide-svelte';

	interface NavItem {
		label: string;
		href: string;
	}

	interface ScheduleItem {
		time: string;
		title: string;
		note: string;
	}

	interface SpeakerItem {
		name: string;
		role: string;
		tag: string;
	}

	const navItems: NavItem[] = [
		{ label: 'Manifesto', href: '#manifesto' },
		{ label: 'Schedule', href: '#schedule' },
		{ label: 'Speakers', href: '#speakers' },
		{ label: 'Venue', href: '#venue' }
	];

	const scheduleItems: ScheduleItem[] = [
		{
			time: '09:00',
			title: 'Doors / Tape / Noise',
			note: 'Coffee, matte badges, monochrome installations.'
		},
		{
			time: '10:15',
			title: 'Why Interfaces Need Friction',
			note: 'A keynote on making digital work feel physical again.'
		},
		{
			time: '12:00',
			title: 'Break the Grid',
			note: 'Rapid talks from designers building outside templates.'
		},
		{
			time: '14:30',
			title: 'Live Poster Jam',
			note: 'A collective design sprint projected wall-size.'
		},
		{
			time: '17:00',
			title: 'Late Critique Session',
			note: 'Open mic reviews, portfolio pin-ups, and closing remarks.'
		}
	];

	const speakers: SpeakerItem[] = [
		{ name: 'Rina Sol', role: 'Editorial Interface Designer', tag: 'Type Systems' },
		{ name: 'Elias North', role: 'Creative Technologist', tag: 'Motion / Sound' },
		{ name: 'Mina Vale', role: 'Poster Artist', tag: 'Physical Texture' },
		{ name: 'Jo Kade', role: 'Frontend Engineer', tag: 'Experimental Layout' }
	];
</script>

<svelte:head>
	<title>Meetup 2024 | Monochrome Brutalist Edition</title>
	<meta
		name="description"
		content="A neo brutalist event page for the 2024 meetup archive, built in a monochromatic palette with hard shadows, poster typography, and editorial blocks."
	/>
</svelte:head>

<main id="top" class="neo-shell min-h-screen overflow-x-clip bg-neutral-900 text-neutral-100">
	<div class="noise-layer"></div>
	<div class="mx-auto flex w-[94%] max-w-[1500px] flex-col gap-6 py-5 md:py-8">
		<header
			class="panel brutal-shadow grid gap-4 border-2 border-neutral-700 bg-neutral-800 p-4 md:grid-cols-[220px_minmax(0,1fr)_220px] md:p-5"
		>
			<div class="flex items-center justify-between gap-3 md:block">
				<p class="display-stack text-2xl uppercase md:text-4xl">DB</p>
				<div class="tape-chip rotate-[-3deg]">Meetup Archive</div>
			</div>

			<div class="flex flex-col justify-between gap-4">
				<div class="flex flex-wrap gap-2">
					{#each navItems as item}
						<a href={item.href} class="nav-chip">
							{item.label}
						</a>
					{/each}
				</div>
				<div>
					<p class="eyebrow">Monochrome city session / 2024</p>
					<h1 class="display-stack mt-3 text-[3.1rem] leading-[0.86] uppercase md:text-[6.5rem]">
						Neo<br />Brutalist<br />Meetup
					</h1>
				</div>
			</div>

			<div class="flex flex-col justify-between gap-4">
				<div class="stamp-card rotate-[2deg]">
					<p class="eyebrow">Edition</p>
					<p class="mt-2 text-4xl font-black">24</p>
				</div>
				<p class="text-right text-xs tracking-[0.3em] text-neutral-400 uppercase">
					Neutral-800 / Neutral-900 / White
				</p>
			</div>
		</header>

		<section class="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
			<div
				class="panel brutal-shadow relative overflow-hidden border-2 border-neutral-700 bg-neutral-900 p-5 md:p-8"
			>
				<div
					class="absolute inset-y-0 right-0 hidden w-[26%] border-l-2 border-dashed border-neutral-700 md:block"
				></div>
				<div
					class="absolute top-5 right-5 h-24 w-24 rounded-full border-2 border-neutral-600 bg-neutral-800/50"
				></div>
				<div
					class="absolute right-10 bottom-10 h-10 w-32 -rotate-12 border-2 border-neutral-600 bg-neutral-100"
				></div>

				<div class="relative z-10 max-w-4xl">
					<div class="flex flex-wrap items-center gap-3">
						<div class="badge-rail"><CalendarDays size={16} /> October 19, 2024</div>
						<div class="badge-rail"><MapPinned size={16} /> Industrial Hall / Addis Ababa</div>
						<div class="badge-rail"><Users size={16} /> 280 seats only</div>
					</div>

					<p class="mt-8 max-w-2xl text-base leading-7 text-neutral-300 md:text-lg">
						A deliberately loud one-day gathering for designers, frontend engineers, and visual
						storytellers building interfaces that feel printed, stamped, cut, and assembled by hand.
					</p>

					<div class="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
						<div class="poster-grid">
							<div class="poster-cell bg-neutral-800 text-neutral-100">
								<p class="eyebrow text-neutral-400">Focus</p>
								<p class="mt-3 text-xl font-bold uppercase">
									Editorial web / raw motion / hard edges
								</p>
							</div>
							<div class="poster-cell invert-cell">
								<p class="eyebrow text-neutral-700">Memory</p>
								<p class="mt-3 text-xl font-black uppercase">
									A page that reads like a poster wall
								</p>
							</div>
							<div class="poster-cell striped-cell md:col-span-2">
								<p class="eyebrow">Direction</p>
								<p class="mt-3 max-w-2xl text-sm leading-6 text-neutral-200">
									No gradients pretending to be premium. No soft cards. Only offset shadows, rigid
									frames, strict contrast, and a rhythm that feels screen-printed.
								</p>
							</div>
						</div>

						<div class="callout-stack">
							<a href="#schedule" class="action-tile bg-neutral-100 text-neutral-900">
								View Program <ArrowRight size={18} />
							</a>
							<a href="#venue" class="action-tile bg-neutral-800 text-neutral-100">
								See Venue Notes <MoveUpRight size={18} />
							</a>
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-6">
				<div
					class="panel brutal-shadow rotate-[-1deg] border-2 border-neutral-700 bg-neutral-800 p-5"
				>
					<p class="eyebrow">Admission Block</p>
					<div class="mt-4 space-y-4">
						<div class="ticket-row">
							<Ticket size={18} />
							<div>
								<p class="text-xs tracking-[0.2em] text-neutral-400 uppercase">Pass</p>
								<p class="text-lg font-bold uppercase">Free RSVP / curated entry</p>
							</div>
						</div>
						<div class="ticket-row">
							<TimerReset size={18} />
							<div>
								<p class="text-xs tracking-[0.2em] text-neutral-400 uppercase">Check-in</p>
								<p class="text-lg font-bold uppercase">08:20 to 09:00 sharp</p>
							</div>
						</div>
					</div>
				</div>

				<div
					id="manifesto"
					class="panel brutal-shadow border-2 border-neutral-700 bg-neutral-900 p-5"
				>
					<p class="eyebrow">Manifesto</p>
					<p class="mt-4 text-sm leading-7 text-neutral-300">
						This edition is built around one idea: digital experiences should stop apologizing for
						taking up space. We celebrate interface design that is visible, structural, opinionated,
						and impossible to confuse for a template.
					</p>
				</div>
			</div>
		</section>

		<section class="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
			<div class="panel brutal-shadow border-2 border-neutral-700 bg-neutral-800 p-5">
				<p class="eyebrow">Poster Notes</p>
				<div class="mt-5 space-y-3">
					<div class="note-card">
						<p class="text-xs tracking-[0.18em] text-neutral-400 uppercase">Palette</p>
						<p class="mt-1 text-sm text-neutral-200">
							Monochromatic only. Neutral 800. Neutral 900. White. Nothing ornamental.
						</p>
					</div>
					<div class="note-card">
						<p class="text-xs tracking-[0.18em] text-neutral-400 uppercase">Surface</p>
						<p class="mt-1 text-sm text-neutral-200">
							Every panel uses solid fill, visible borders, offset drop shadows, and a paper-noise
							skin.
						</p>
					</div>
					<div class="note-card">
						<p class="text-xs tracking-[0.18em] text-neutral-400 uppercase">Tempo</p>
						<p class="mt-1 text-sm text-neutral-200">
							Load-in reveals use stagger and slide. Hover states shift like moved print blocks.
						</p>
					</div>
				</div>
			</div>

			<div
				id="schedule"
				class="panel brutal-shadow border-2 border-neutral-700 bg-neutral-900 p-5 md:p-6"
			>
				<div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
					<div>
						<p class="eyebrow">Program Sheet</p>
						<h2 class="display-stack mt-2 text-4xl uppercase md:text-5xl">Schedule</h2>
					</div>
					<p class="max-w-sm text-sm leading-6 text-neutral-400">
						Every block is tuned for conversation, critique, and visual experimentation.
					</p>
				</div>

				<div class="mt-6 grid gap-3">
					{#each scheduleItems as item, index}
						<div class="schedule-row" style={`animation-delay: ${index * 90}ms`}>
							<div class="schedule-time">{item.time}</div>
							<div>
								<p class="text-lg font-black text-neutral-100 uppercase">{item.title}</p>
								<p class="mt-1 text-sm leading-6 text-neutral-400">{item.note}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
			<div
				id="speakers"
				class="panel brutal-shadow border-2 border-neutral-700 bg-neutral-800 p-5 md:p-6"
			>
				<div class="flex items-end justify-between gap-4">
					<div>
						<p class="eyebrow">Voice Stack</p>
						<h2 class="display-stack mt-2 text-4xl uppercase md:text-5xl">Speakers</h2>
					</div>
					<div class="tape-chip rotate-[4deg]">4 featured voices</div>
				</div>

				<div class="mt-6 grid gap-4 md:grid-cols-2">
					{#each speakers as speaker, index}
						<article class="speaker-card" style={`animation-delay: ${index * 120}ms`}>
							<p class="text-xs tracking-[0.22em] text-neutral-500 uppercase">0{index + 1}</p>
							<h3 class="mt-4 text-2xl font-black uppercase">{speaker.name}</h3>
							<p class="mt-2 text-sm tracking-[0.14em] text-neutral-300 uppercase">
								{speaker.role}
							</p>
							<div
								class="mt-6 inline-flex border-2 border-neutral-600 bg-neutral-900 px-3 py-2 text-xs tracking-[0.16em] text-neutral-200 uppercase"
							>
								{speaker.tag}
							</div>
						</article>
					{/each}
				</div>
			</div>

			<div id="venue" class="flex flex-col gap-6">
				<div class="panel brutal-shadow border-2 border-neutral-700 bg-neutral-900 p-5">
					<p class="eyebrow">Venue System</p>
					<h3 class="display-stack mt-3 text-3xl uppercase">Concrete Hall A</h3>
					<p class="mt-4 text-sm leading-7 text-neutral-300">
						Raw floor, exposed structure, oversized projection wall, pinned posters, and directional
						tape instead of polished signage.
					</p>
				</div>

				<div class="map-block brutal-shadow">
					<div class="map-grid">
						<div></div>
						<div></div>
						<div class="filled"></div>
						<div></div>
						<div class="filled"></div>
						<div></div>
						<div></div>
						<div class="filled"></div>
						<div></div>
					</div>
					<div
						class="absolute inset-x-5 bottom-5 border-2 border-neutral-700 bg-neutral-900 px-4 py-3"
					>
						<p class="text-xs tracking-[0.24em] text-neutral-500 uppercase">Arrival</p>
						<p class="mt-1 text-lg font-black text-neutral-100 uppercase">
							South gate / hall A / level 01
						</p>
					</div>
				</div>
			</div>
		</section>

		<footer
			class="panel brutal-shadow flex flex-col gap-4 border-2 border-neutral-700 bg-neutral-800 p-5 md:flex-row md:items-center md:justify-between"
		>
			<div>
				<p class="eyebrow">Meetup 2024</p>
				<p class="mt-2 text-sm leading-6 text-neutral-300">
					Poster-minded event page for a monochrome neo brutalist edition.
				</p>
			</div>
			<a href="#top" class="nav-chip">Back to Top</a>
		</footer>
	</div>
</main>

<style>
	:global(body) {
		background:
			radial-gradient(circle at top left, rgba(64, 64, 64, 0.18), transparent 28%), #171717;
	}

	.neo-shell {
		font-family: 'Lexend', 'Segoe UI', sans-serif;
		position: relative;
	}

	.noise-layer {
		position: fixed;
		inset: 0;
		pointer-events: none;
		opacity: 0.12;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
		background-size: 22px 22px;
		mask-image: radial-gradient(circle at center, black, transparent 92%);
	}

	.display-stack {
		font-family: 'Arial Black', 'Impact', 'Haettenschweiler', sans-serif;
		letter-spacing: 0.04em;
	}

	.panel {
		position: relative;
	}

	.brutal-shadow {
		box-shadow: 10px 10px 0 rgba(255, 255, 255, 0.08);
	}

	.eyebrow {
		font-size: 0.72rem;
		line-height: 1;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: rgb(163 163 163);
	}

	.tape-chip,
	.nav-chip,
	.badge-rail,
	.action-tile,
	.note-card,
	.schedule-row,
	.speaker-card,
	.ticket-row {
		transition:
			transform 180ms ease,
			box-shadow 180ms ease,
			background-color 180ms ease,
			border-color 180ms ease;
	}

	.tape-chip {
		width: fit-content;
		border: 2px solid rgb(115 115 115);
		background: rgb(250 250 250);
		padding: 0.55rem 0.85rem;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgb(23 23 23);
		box-shadow: 6px 6px 0 rgba(255, 255, 255, 0.08);
	}

	.nav-chip {
		display: inline-flex;
		align-items: center;
		border: 2px solid rgb(82 82 82);
		background: rgb(23 23 23);
		padding: 0.8rem 1rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgb(245 245 245);
	}

	.nav-chip:hover,
	.action-tile:hover,
	.speaker-card:hover,
	.schedule-row:hover {
		transform: translate(-4px, -4px);
		box-shadow: 8px 8px 0 rgba(255, 255, 255, 0.1);
	}

	.stamp-card {
		border: 2px solid rgb(115 115 115);
		background: repeating-linear-gradient(
			-45deg,
			rgb(38 38 38),
			rgb(38 38 38) 10px,
			rgb(23 23 23) 10px,
			rgb(23 23 23) 20px
		);
		padding: 1rem;
		text-transform: uppercase;
		box-shadow: 8px 8px 0 rgba(255, 255, 255, 0.08);
	}

	.badge-rail {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		border: 2px solid rgb(82 82 82);
		background: rgb(38 38 38);
		padding: 0.8rem 1rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.poster-grid {
		display: grid;
		gap: 0.9rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.poster-cell {
		min-height: 10rem;
		border: 2px solid rgb(82 82 82);
		padding: 1.2rem;
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
	}

	.invert-cell {
		background: rgb(250 250 250);
		color: rgb(23 23 23);
	}

	.striped-cell {
		background:
			repeating-linear-gradient(
				90deg,
				rgba(255, 255, 255, 0.04),
				rgba(255, 255, 255, 0.04) 14px,
				transparent 14px,
				transparent 28px
			),
			rgb(23 23 23);
	}

	.callout-stack {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.action-tile {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 2px solid rgb(82 82 82);
		padding: 1rem;
		font-size: 0.82rem;
		font-weight: 900;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		box-shadow: 8px 8px 0 rgba(255, 255, 255, 0.06);
	}

	.ticket-row {
		display: flex;
		gap: 0.9rem;
		border: 2px solid rgb(82 82 82);
		background: rgb(23 23 23);
		padding: 1rem;
	}

	.note-card {
		border: 2px solid rgb(82 82 82);
		background: rgb(23 23 23);
		padding: 1rem;
	}

	.schedule-row {
		display: grid;
		gap: 1rem;
		border: 2px solid rgb(82 82 82);
		background: rgb(23 23 23);
		padding: 1rem;
		opacity: 0;
		animation: rise-in 600ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
		grid-template-columns: 110px minmax(0, 1fr);
	}

	.schedule-time {
		font-family: 'Arial Black', 'Impact', sans-serif;
		font-size: 1.15rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgb(250 250 250);
	}

	.speaker-card {
		border: 2px solid rgb(82 82 82);
		background: rgb(23 23 23);
		padding: 1.25rem;
		opacity: 0;
		animation: rise-in 650ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
	}

	.map-block {
		position: relative;
		min-height: 24rem;
		border: 2px solid rgb(82 82 82);
		background: rgb(23 23 23);
		overflow: hidden;
	}

	.map-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		height: 100%;
	}

	.map-grid > div {
		border-right: 2px solid rgba(115, 115, 115, 0.35);
		border-bottom: 2px solid rgba(115, 115, 115, 0.35);
	}

	.map-grid > .filled {
		background:
			linear-gradient(
				135deg,
				transparent 0 44%,
				rgba(255, 255, 255, 0.12) 44% 56%,
				transparent 56% 100%
			),
			rgb(38 38 38);
	}

	@keyframes rise-in {
		from {
			opacity: 0;
			transform: translateY(18px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 900px) {
		.poster-grid,
		.schedule-row {
			grid-template-columns: 1fr;
		}

		.brutal-shadow {
			box-shadow: 6px 6px 0 rgba(255, 255, 255, 0.08);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.nav-chip,
		.action-tile,
		.speaker-card,
		.schedule-row,
		.ticket-row {
			transition: none;
			animation: none;
			opacity: 1;
		}
	}
</style>
