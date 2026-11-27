<script lang="ts">
	import { X, Heart, ArrowUpRight, RotateCcw, Clock, Clapperboard } from 'lucide-svelte';
	import Poster from './poster.svelte';
	import Stars from './stars.svelte';
	import RichText from './rich_text.svelte';
	import { fmtDate, postUrl } from '$lib/channel';
	import type { Film, FilmList } from '../../routes/cinema/+page.server';

	let { film, lists, onClose }: { film: Film; lists: FilmList[]; onClose: () => void } = $props();

	let dialog: HTMLDialogElement | undefined = $state();
	$effect(() => {
		dialog?.showModal();
	});
	const m = $derived(film.meta);
	const backdrop = $derived(m?.backdrop ?? m?.poster ?? null);
	const memberOf = $derived(lists.filter((l) => film.lists.includes(l.slug)));
	const runtime = $derived(
		m?.runtime ? (m.runtime >= 60 ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : `${m.runtime}m`) : null
	);
	const kindLabel: Record<string, string> = {
		movie: 'Film', series: 'Series', documentary: 'Documentary', short: 'Short film', anime: 'Anime'
	};
</script>

<dialog
	bind:this={dialog}
	onclose={onClose}
	onclick={(e) => e.target === dialog && dialog?.close()}
	class="fm"
	aria-label={film.title}
>
	<div class="sheet">
		<div class="hero" class:blur={!m?.backdrop}>
			{#if backdrop}<img src={backdrop} alt="" referrerpolicy="no-referrer" />{/if}
			<div class="shade"></div>
			<button class="close" onclick={() => dialog?.close()} aria-label="Close"><X size={18} /></button>
		</div>

		<div class="content">
			<div class="top">
				<Poster {film} eager class="w-28 shrink-0 sm:w-40" />
				<div class="min-w-0 self-end">
					<p class="eyebrow">
						{kindLabel[film.kind]}{#if film.year} · {film.year}{/if}{#if runtime} · {runtime}{/if}
					</p>
					<h2 class="title">{film.title}</h2>
					{#if m?.tagline}<p class="tagline">{m.tagline}</p>{/if}
					{#if m?.directors.length}<p class="by">Directed by <strong>{m.directors.join(', ')}</strong></p>{/if}
					{#if m?.network}<p class="by">On <strong>{m.network}</strong></p>{/if}
				</div>
			</div>

			<div class="facts">
				<div>
					<span class="k">My rating</span>
					{#if film.rating != null}<Stars value={film.rating} size={18} />{:else}<span class="v dim">—</span>{/if}
				</div>
				{#if m?.avg}
					<div>
						<span class="k">{m.source === 'tvmaze' ? 'TVmaze' : 'Letterboxd'} avg</span>
						<span class="v">{m.avg.toFixed(1)} <small>/ 5</small></span>
					</div>
				{/if}
				<div class="flex gap-2">
					{#if film.liked}<span class="tag"><Heart size={12} class="fill-[#ff6b6b] text-[#ff6b6b]" /> Liked</span>{/if}
					{#if film.favorite}<span class="tag gold">All-time favorite</span>{/if}
					{#if film.rewatch}<span class="tag"><RotateCcw size={12} /> Rewatched</span>{/if}
					{#if film.watchlist}<span class="tag"><Clock size={12} /> On my watchlist</span>{/if}
				</div>
			</div>

			{#if m?.genres.length}
				<div class="genres">
					{#each m.genres as g (g)}<span>{g}</span>{/each}
					{#each m.countries.filter(Boolean) as c (c)}<span class="dim">{c}</span>{/each}
				</div>
			{/if}

			{#if m?.synopsis}<p class="synopsis">{m.synopsis}</p>{/if}
			{#if m?.cast.length}<p class="cast"><span>Starring</span> {m.cast.join(', ')}</p>{/if}

			{#if film.review}
				<section>
					<h3>My Letterboxd review</h3>
					<blockquote class="review">
						“{film.review}”
						<footer>{film.reviewDate ? fmtDate(film.reviewDate) : ''}</footer>
					</blockquote>
				</section>
			{/if}

			{#if film.posts.length}
				<section>
					<h3>What I said on the channel</h3>
					<div class="posts">
						{#each film.posts as p (p.id)}
							<article class="post">
								<header>
									<time datetime={p.date}>{fmtDate(p.date)}</time>
									<a href={postUrl(p.id)} target="_blank" rel="noopener noreferrer">t.me/Dagmawi_Babi/{p.id} <ArrowUpRight size={12} /></a>
								</header>
								{#if p.segments.length}
									<RichText segments={p.segments} class="text-[14px] leading-relaxed text-[#d9d4c7]" />
								{:else}
									<p class="dim text-sm italic">A {p.media === 'photo' ? 'photo' : p.media?.includes('video') ? 'video' : 'post'} — open it on Telegram.</p>
								{/if}
							</article>
						{/each}
					</div>
				</section>
			{/if}

			{#if film.diary.length}
				<section>
					<h3>Diary</h3>
					<ul class="diary">
						{#each film.diary as d, i (i)}
							<li><span>{fmtDate(d.date)}</span><Stars value={d.rating} />{#if d.rewatch}<RotateCcw size={12} />{/if}</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if memberOf.length}
				<section>
					<h3>In my lists</h3>
					<div class="genres">{#each memberOf as l (l.slug)}<span>{l.name}</span>{/each}</div>
				</section>
			{/if}

			<div class="actions">
				{#if film.uri || m?.source === 'letterboxd'}
					<a href={film.uri ?? m?.url} target="_blank" rel="noopener noreferrer" class="btn"><Clapperboard size={14} /> Letterboxd</a>
				{/if}
				{#if m?.source === 'tvmaze' && m.url}
					<a href={m.url} target="_blank" rel="noopener noreferrer" class="btn">TVmaze <ArrowUpRight size={14} /></a>
				{/if}
				{#if film.posts.length}
					<a href={postUrl(film.posts.at(-1)!.id)} target="_blank" rel="noopener noreferrer" class="btn">Latest post <ArrowUpRight size={14} /></a>
				{/if}
			</div>
		</div>
	</div>
</dialog>

<style>
	.fm {
		margin: auto;
		width: min(760px, 94vw);
		max-height: 92vh;
		padding: 0;
		border: 0;
		border-radius: 18px;
		background: #111;
		color: #f3eee3;
		box-shadow: 0 40px 120px -20px rgb(0 0 0 / 0.9);
		overflow: auto;
		overscroll-behavior: contain;
	}
	.fm::backdrop {
		background: rgb(0 0 0 / 0.75);
		backdrop-filter: blur(6px);
	}
	.fm[open] {
		animation: rise 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(24px) scale(0.98);
		}
	}
	.hero {
		position: relative;
		height: 260px;
		background: #1a1a1a;
		overflow: hidden;
	}
	.hero img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.hero.blur img {
		filter: blur(28px) saturate(1.3);
		transform: scale(1.3);
		opacity: 0.6;
	}
	.shade {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgb(17 17 17 / 0.1), #111 96%);
	}
	.close {
		position: absolute;
		top: 14px;
		right: 14px;
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: rgb(0 0 0 / 0.55);
		color: white;
	}
	.content {
		position: relative;
		margin-top: -120px;
		padding: 0 clamp(18px, 4vw, 36px) 32px;
		display: flex;
		flex-direction: column;
		gap: 22px;
	}
	.top {
		display: flex;
		gap: 20px;
		align-items: flex-end;
	}
	.eyebrow {
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #ffb547;
	}
	.title {
		font-family: 'Bebas Neue', 'Oswald', sans-serif;
		font-size: clamp(34px, 6vw, 60px);
		line-height: 0.92;
		margin-top: 6px;
	}
	.tagline {
		margin-top: 8px;
		font-style: italic;
		color: #b9b3a5;
	}
	.by {
		margin-top: 6px;
		font-size: 14px;
		color: #b9b3a5;
	}
	.by strong {
		color: #f3eee3;
		font-weight: 500;
	}
	.facts {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 28px;
		padding: 14px 0;
		border-block: 1px solid rgb(255 255 255 / 0.08);
	}
	.facts > div {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.facts .flex {
		flex-direction: row;
	}
	.k {
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #8a8578;
	}
	.v {
		font-size: 18px;
	}
	.v small {
		font-size: 12px;
		color: #8a8578;
	}
	.dim {
		color: #8a8578;
	}
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 4px 10px;
		border-radius: 999px;
		font-size: 12px;
		background: rgb(255 255 255 / 0.06);
	}
	.tag.gold {
		background: rgb(255 181 71 / 0.15);
		color: #ffb547;
	}
	.genres {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.genres span {
		padding: 4px 10px;
		border-radius: 6px;
		font-size: 12px;
		border: 1px solid rgb(255 255 255 / 0.12);
	}
	.synopsis {
		font-size: 15px;
		line-height: 1.65;
		color: #d9d4c7;
	}
	.cast {
		font-size: 13px;
		color: #b9b3a5;
	}
	.cast span {
		color: #8a8578;
		margin-right: 4px;
	}
	h3 {
		margin-bottom: 10px;
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #8a8578;
	}
	.review {
		font-family: 'Newsreader', Georgia, serif;
		font-size: 22px;
		line-height: 1.4;
		font-style: italic;
	}
	.review footer {
		margin-top: 8px;
		font-family: 'Inter', sans-serif;
		font-style: normal;
		font-size: 12px;
		color: #8a8578;
	}
	.posts {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.post {
		padding: 14px 16px;
		border-radius: 12px;
		background: rgb(255 255 255 / 0.04);
		border: 1px solid rgb(255 255 255 / 0.06);
	}
	.post header {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 8px;
		font-size: 11px;
		color: #8a8578;
	}
	.post header a {
		display: inline-flex;
		align-items: center;
		gap: 3px;
	}
	.post header a:hover {
		color: #ffb547;
	}
	.diary {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 13px;
	}
	.diary li {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.diary li > span:first-child {
		width: 110px;
		color: #b9b3a5;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 9px 14px;
		border-radius: 999px;
		font-size: 13px;
		border: 1px solid rgb(255 255 255 / 0.15);
	}
	.btn:hover {
		border-color: #ffb547;
		color: #ffb547;
	}
</style>
