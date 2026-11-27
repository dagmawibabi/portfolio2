<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, X, Heart, MessageCircle, ArrowUpRight, ArrowLeft, Clapperboard, Shuffle } from 'lucide-svelte';
	import Poster from '../../components/channel_components/poster.svelte';
	import Stars from '../../components/channel_components/stars.svelte';
	import RichText from '../../components/channel_components/rich_text.svelte';
	import FilmModal from '../../components/channel_components/film_modal.svelte';
	import { fmtDate, postUrl, relative } from '$lib/channel';
	import type { Film, FilmList, LogPost, Kind } from './+page.server';

	let { data } = $props();
	const films = $derived(data.films as Film[]);
	const lists = $derived(data.lists as FilmList[]);
	const allChannelLog = $derived(data.channelLog as LogPost[]);
	// Posts that were mostly a photo with tags, emojis or a short caption say nothing here; keep ones with real text.
	const wordChars = (p: LogPost) =>
		(p.segments.map((s) => s[1]).join('').match(/[A-Za-z0-9ሀ-᎟]/g) ?? []).length;
	const channelLog = $derived(allChannelLog.filter((p) => wordChars(p) >= 30));
	const byKey = $derived(new Map(films.map((f) => [f.key, f])));

	// ---------- stats ----------
	const seen = $derived(films.filter((f) => f.watched || f.posts.length));
	const rated = $derived(films.filter((f) => f.rating != null));
	const avgRating = $derived(rated.reduce((a, f) => a + f.rating!, 0) / (rated.length || 1));
	const fives = $derived(rated.filter((f) => f.rating === 5).length);
	const hours = $derived(
		Math.round(seen.filter((f) => f.kind !== 'series' && f.kind !== 'anime').reduce((a, f) => a + (f.meta?.runtime ?? 0), 0) / 60)
	);
	const seriesCount = $derived(seen.filter((f) => f.kind === 'series' || f.kind === 'anime').length);
	const postCount = $derived(films.reduce((a, f) => a + f.posts.length, 0) + allChannelLog.length);
	const distribution = $derived(
		[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((r) => ({ r, n: rated.filter((f) => f.rating === r).length }))
	);
	const maxDist = $derived(Math.max(...distribution.map((d) => d.n)));
	const modeRating = $derived(distribution.reduce((a, d) => (d.n > a.n ? d : a), distribution[0]));
	const fourPlus = $derived(Math.round((rated.filter((f) => f.rating! >= 4).length / (rated.length || 1)) * 100));
	// my rating against the Letterboxd crowd, on the films both of us rated
	const compared = $derived(rated.filter((f) => f.meta?.avg != null && f.meta.source === 'letterboxd'));
	const crowdAvg = $derived(compared.reduce((a, f) => a + f.meta!.avg!, 0) / (compared.length || 1));
	const myAvgCompared = $derived(compared.reduce((a, f) => a + f.rating!, 0) / (compared.length || 1));
	const gap = (f: Film) => f.rating! - f.meta!.avg!;
	const lovedMore = $derived([...compared].sort((a, b) => gap(b) - gap(a)).slice(0, 5));
	const lovedLess = $derived([...compared].sort((a, b) => gap(a) - gap(b)).slice(0, 5));
	const crowdCols = $derived([
		{ t: 'I loved more than most', items: lovedMore, up: true },
		{ t: 'Everyone loved, I did not', items: lovedLess, up: false }
	]);
	let hoverRating = $state<number | null>(null);
	const hoverFilms = $derived(
		hoverRating == null
			? []
			: rated
					.filter((f) => f.rating === hoverRating && f.meta?.poster)
					.sort((a, b) => (b.meta?.avg ?? 0) - (a.meta?.avg ?? 0))
					.slice(0, 7)
	);

	// ---------- hero poster wall ----------
	const wallFilms = $derived.by(() => {
		const pool = films
			.filter((f) => f.meta?.poster && (f.favorite || f.lists.length || (f.rating ?? 0) >= 4 || f.posts.length))
			.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
		return [0, 1, 2, 3].map((r) => pool.filter((_, i) => i % 4 === r).slice(0, 18));
	});

	// ---------- reviews from the channel ----------
	const reviewed = $derived(
		films
			.filter((f) => f.posts.length || f.review)
			.sort((a, b) => lastSaid(b).localeCompare(lastSaid(a)))
	);
	function lastSaid(f: Film) {
		return f.posts.at(-1)?.date ?? f.reviewDate ?? '';
	}
	/** The main post of the latest batch: the longest one posted on the most recent day. */
	function mainPost(f: Film) {
		const last = f.posts.at(-1);
		if (!last) return undefined;
		const day = last.date.slice(0, 10);
		const len = (p: Film['posts'][number]) => p.segments.reduce((a, s) => a + s[1].length, 0);
		return f.posts.filter((p) => p.date.startsWith(day)).sort((a, b) => len(b) - len(a))[0];
	}
	let reviewsShown = $state(9);
	const latest = $derived(reviewed[0]);

	// ---------- library filters ----------
	type Shelf = 'watched' | 'lists' | 'watchlist';
	// all-time favourites first, then the rest by size
	const orderedLists = $derived(
		[...lists].sort(
			(a, b) =>
				Number(b.slug === 'favorite-movies-of-all-time') - Number(a.slug === 'favorite-movies-of-all-time') ||
				b.films.length - a.films.length
		)
	);
	let activeList = $state('');
	const currentList = $derived(orderedLists.find((l) => l.slug === activeList) ?? orderedLists[0]);
	const currentListFilms = $derived(
		(currentList?.films.map((k) => byKey.get(k)).filter(Boolean) as Film[]) ?? []
	);
	function listPosters(l: FilmList) {
		return l.films.map((k) => byKey.get(k)).filter((f) => f?.meta?.poster).slice(0, 3) as Film[];
	}
	let shelf = $state<Shelf>('watched');
	let kind = $state<'all' | Kind>('all');
	let genre = $state('all');
	let decade = $state('all');
	let minRating = $state<number | null>(null);
	let onlyLiked = $state(false);
	let onlyTalked = $state(false);
	let sort = $state<'rating' | 'recent' | 'year' | 'title' | 'avg'>('rating');
	let query = $state('');
	let limit = $state(60);

	const shelfFilms = $derived(films.filter((f) => (shelf === 'watchlist' ? f.watchlist : !f.watchlist)));
	const genres = $derived(
		[...new Set(shelfFilms.flatMap((f) => f.meta?.genres ?? []))].sort((a, b) => a.localeCompare(b))
	);
	const decades = $derived(
		[...new Set(shelfFilms.map((f) => f.year && Math.floor(f.year / 10) * 10).filter(Boolean) as number[])].sort((a, b) => b - a)
	);
	const kinds = $derived(
		(['movie', 'series', 'documentary', 'short', 'anime'] as Kind[])
			.map((k) => ({ k, n: shelfFilms.filter((f) => f.kind === k).length }))
			.filter((k) => k.n)
	);
	const KIND_LABEL: Record<string, string> = { all: 'Everything', movie: 'Films', series: 'Series', documentary: 'Docs', short: 'Shorts', anime: 'Anime' };

	const library = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const out = shelfFilms.filter(
			(f) =>
				(kind === 'all' || f.kind === kind) &&
				(genre === 'all' || f.meta?.genres.includes(genre)) &&
				(decade === 'all' || (f.year && Math.floor(f.year / 10) * 10 === +decade)) &&
				(minRating == null || f.rating === minRating) &&
				(!onlyLiked || f.liked) &&
				(!onlyTalked || f.posts.length > 0 || !!f.review) &&
				(!q ||
					f.title.toLowerCase().includes(q) ||
					f.meta?.directors.some((d) => d.toLowerCase().includes(q)) ||
					f.meta?.cast.some((d) => d.toLowerCase().includes(q)) ||
					String(f.year) === q)
		);
		const recent = (f: Film) => f.posts.at(-1)?.date ?? f.diary.at(-1)?.date ?? f.watchedOn ?? '';
		const cmp: Record<string, (a: Film, b: Film) => number> = {
			rating: (a, b) => (b.rating ?? -1) - (a.rating ?? -1) || (b.meta?.avg ?? 0) - (a.meta?.avg ?? 0),
			recent: (a, b) => recent(b).localeCompare(recent(a)),
			year: (a, b) => (b.year ?? 0) - (a.year ?? 0),
			title: (a, b) => a.title.localeCompare(b.title),
			avg: (a, b) => (b.meta?.avg ?? 0) - (a.meta?.avg ?? 0)
		};
		return out.sort(cmp[sort]);
	});
	const shownLib = $derived(library.slice(0, limit));
	const filtering = $derived(kind !== 'all' || genre !== 'all' || decade !== 'all' || minRating != null || onlyLiked || onlyTalked || !!query);

	$effect(() => {
		void [shelf, kind, genre, decade, minRating, onlyLiked, onlyTalked, sort, query];
		limit = 60;
	});

	function resetFilters() {
		kind = 'all';
		genre = 'all';
		decade = 'all';
		minRating = null;
		onlyLiked = false;
		onlyTalked = false;
		query = '';
	}
	function jumpToRating(r: number) {
		shelf = 'watched';
		resetFilters();
		minRating = r;
		document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' });
	}

	// ---------- modal ----------
	let open = $state<Film | null>(null);
	function show(f: Film) {
		open = f;
		history.replaceState(history.state, '', `#${f.key}`);
	}
	function closeModal() {
		open = null;
		history.replaceState(history.state, '', location.pathname);
	}
	function surprise() {
		const pool = films.filter((f) => (f.rating ?? 0) >= 4 && f.meta?.poster);
		show(pool[Math.floor(Math.random() * pool.length)]);
	}

	// ---------- channel log ----------
	let logShown = $state(8);
	const KIND_TAG: Record<string, string> = { movie: 'Film', series: 'Series', documentary: 'Doc', short: 'Short', anime: 'Anime' };

	let sentinel: HTMLDivElement | undefined = $state();
	onMount(() => {
		const prev = document.body.style.background;
		document.body.style.background = '#0b0b0b';
		const key = decodeURIComponent(location.hash.slice(1));
		if (key && byKey.get(key)) open = byKey.get(key)!;
		const io = new IntersectionObserver((es) => {
			if (es[0].isIntersecting && limit < library.length) limit += 60;
		}, { rootMargin: '900px' });
		if (sentinel) io.observe(sentinel);
		return () => {
			io.disconnect();
			document.body.style.background = prev;
		};
	});
</script>

<svelte:head>
	<title>Movies — Dagmawi Babi</title>
	<meta
		name="description"
		content="Every film, series and documentary Dagmawi Babi has logged on Letterboxd or talked about on Telegram — ratings, lists and reviews."
	/>
	<meta name="theme-color" content="#0b0b0b" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&family=Newsreader:ital,opsz,wght@1,6..72,400&display=swap"
	/>
	<link rel="preconnect" href="https://a.ltrbxd.com" />
</svelte:head>

<div class="cine">
	<div class="grain" aria-hidden="true"></div>

	<!-- top nav -->
	<nav class="nav">
		<a href="/" class="flex items-center gap-2 text-sm text-[#b9b3a5] hover:text-white"><ArrowLeft size={16} /> Dagmawi Babi</a>
		<div class="hidden items-center gap-6 text-sm text-[#b9b3a5] md:flex">
			<a href="#reviews" class="hover:text-white">Reviews</a>
			<a href="#library" onclick={() => (shelf = 'lists')} class="hover:text-white">Lists</a>
			<a href="#library" class="hover:text-white">Library</a>
			<a href="#channel" class="hover:text-white">Channel</a>
		</div>
		<a
			href="https://letterboxd.com/{data.profile.username}/"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs hover:border-[#ffb547] hover:text-[#ffb547]"
		>
			<span class="lb"><i></i><i></i><i></i></span> Letterboxd
		</a>
	</nav>

	<!-- HERO -->
	<header class="hero">
		<div class="wall" aria-hidden="true">
			{#each wallFilms as row, r (r)}
				<div class="wrow" style="--d:{90 + r * 15}s; --dir:{r % 2 ? 'reverse' : 'normal'}">
					{#each [...row, ...row] as f, i (i)}
						<img src={f.meta?.poster} alt="" loading={r < 2 ? 'eager' : 'lazy'} referrerpolicy="no-referrer" />
					{/each}
				</div>
			{/each}
		</div>
		<div class="vignette"></div>

		<div class="hero-in">
			<div class="bulbs" aria-hidden="true">
				{#each Array(18) as _, i (i)}<span style="--i:{i}"></span>{/each}
			</div>
			<p class="now">Now showing</p>
			<h1>Dagmawi Babi<br /><span>at the movies</span></h1>
			<p class="lede">
				Everything I've watched, rated, listed and rambled about: {seen.length} films and shows across my
				Letterboxd diary and {postCount} posts on my Telegram channel, all in one theatre.
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<a href="#library" class="cta">Browse the library</a>
				<button class="cta ghost" onclick={surprise}><Shuffle size={15} /> Pick me something</button>
			</div>

			<dl class="ticker">
				<div><dd>{seen.length}</dd><dt>titles seen</dt></div>
				<div><dd>{hours.toLocaleString()}</dd><dt>hours of film</dt></div>
				<div><dd>{seriesCount}</dd><dt>series</dt></div>
				<div><dd>{avgRating.toFixed(1)}<small>★</small></dd><dt>avg rating</dt></div>
				<div><dd>{fives}</dd><dt>five-star films</dt></div>
			</dl>
		</div>
	</header>

	<main>
		<!-- latest -->
		{#if latest}
			<section class="feature" style="--bg:url('{latest.meta?.backdrop ?? latest.meta?.poster ?? ''}')">
				<div class="feature-bg"></div>
				<div class="wrap feature-in">
					<button class="w-36 shrink-0 sm:w-52" onclick={() => show(latest)}><Poster film={latest} eager /></button>
					<div class="min-w-0">
						<p class="label">Latest review · {relative(lastSaid(latest))}</p>
						<h2 class="display text-[clamp(40px,7vw,88px)]">{latest.title}</h2>
						<p class="mb-4 text-sm text-[#b9b3a5]">
							{latest.year ?? ''}{#if latest.meta?.directors.length} · {latest.meta.directors[0]}{/if}
							{#if latest.rating != null}<span class="ml-2"><Stars value={latest.rating} size={16} /></span>{/if}
						</p>
						{#if mainPost(latest)?.segments.length}
							<div class="quote"><RichText segments={mainPost(latest)!.segments} /></div>
						{:else if latest.review}
							<p class="quote">“{latest.review}”</p>
						{/if}
						<div class="mt-5 flex flex-wrap gap-3 text-sm">
							<button class="link" onclick={() => show(latest)}>Full details</button>
							{#if latest.posts.length}
								<a class="link" href={postUrl(mainPost(latest)!.id)} target="_blank" rel="noopener noreferrer">Read on Telegram ↗</a>
							{/if}
						</div>
					</div>
				</div>
			</section>
		{/if}

		<!-- reviews -->
		<section id="reviews" class="wrap py-20">
			<div class="head">
				<h2 class="display">Reviews &amp; ramblings</h2>
				<p>{reviewed.length} titles I've talked about on the channel, newest first.</p>
			</div>
			<div class="reviews">
				{#each reviewed.slice(0, reviewsShown) as f (f.key)}
					{@const p = mainPost(f)}
					<!-- the whole card opens the film; links inside it still go to their own pages -->
					<article
						class="rv"
						role="button"
						tabindex="0"
						aria-label="Open {f.title}"
						onclick={(e) => !(e.target as HTMLElement).closest('a') && show(f)}
						onkeydown={(e) => {
							if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
								e.preventDefault();
								show(f);
							}
						}}
					>
						<div class="w-24 shrink-0"><Poster film={f} /></div>
						<div class="min-w-0 flex-1">
							<h3 class="rv-title">{f.title}</h3>
							<p class="rv-meta">
								<span class="kind {f.kind}">{KIND_TAG[f.kind]}</span>
								{#if f.year}<span>{f.year}</span>{/if}
								{#if f.rating != null}<Stars value={f.rating} />{/if}
								{#if f.liked}<Heart size={12} class="fill-[#ff6b6b] text-[#ff6b6b]" />{/if}
							</p>
							{#if p?.segments.length}
								<div class="rv-text"><RichText segments={p.segments} /></div>
							{:else if f.review}
								<p class="rv-text italic">“{f.review}”</p>
							{:else}
								<p class="rv-text text-[#8a8578] italic">Shared a {p?.media === 'photo' ? 'still' : 'clip'} from it.</p>
							{/if}
							<p class="rv-foot">
								{#if p}
									<time datetime={p.date}>{fmtDate(p.date)}</time>
									<a href={postUrl(p.id)} target="_blank" rel="noopener noreferrer">t.me/Dagmawi_Babi/{p.id} ↗</a>
								{:else if f.reviewDate}
									<time datetime={f.reviewDate}>{fmtDate(f.reviewDate)}</time><span>Letterboxd</span>
								{/if}
								{#if f.posts.length > 1}<span class="more">+{f.posts.length - 1} more</span>{/if}
							</p>
						</div>
					</article>
				{/each}
			</div>
			{#if reviewsShown < reviewed.length}
				<div class="mt-10 text-center">
					<button class="cta ghost" onclick={() => (reviewsShown += 12)}>More reviews ({reviewed.length - reviewsShown})</button>
				</div>
			{/if}
		</section>

		<!-- ratings -->
		<section class="wrap pb-24">
			<div class="rate">
				<div class="rate-head">
					<p class="label">The scorecard</p>
					<h2 class="display text-[clamp(48px,7vw,88px)]">How I rate</h2>
				</div>

				<div class="rate-grid">
					<div class="rate-score">
						<div class="big">{avgRating.toFixed(1)}</div>
						<Stars value={Math.round(avgRating * 2) / 2} size={20} />
						<p class="mt-3 text-sm text-[#b9b3a5]">
							average across <strong class="text-[#f3eee3]">{rated.length}</strong> ratings
						</p>
						<dl class="mini">
							<div><dt>Most given</dt><dd>{modeRating.r}<span>★</span></dd></div>
							<div><dt>4★ and up</dt><dd>{fourPlus}<span>%</span></dd></div>
							<div><dt>Perfect 5s</dt><dd>{fives}</dd></div>
						</dl>
					</div>

					<div class="rate-hist">
						<div class="hist" role="group" aria-label="Ratings distribution">
							{#each distribution as d (d.r)}
								<button
									onclick={() => jumpToRating(d.r)}
									onmouseenter={() => (hoverRating = d.r)}
									onmouseleave={() => (hoverRating = null)}
									onfocus={() => (hoverRating = d.r)}
									onblur={() => (hoverRating = null)}
									class:active={hoverRating === d.r}
									aria-label="{d.n} films rated {d.r} stars"
								>
									<span class="n">{d.n}</span>
									<span class="track"><span class="fill" style="height:{(d.n / maxDist) * 100}%"></span></span>
									<span class="r">{Math.floor(d.r) || ''}{d.r % 1 ? '½' : ''}</span>
								</button>
							{/each}
						</div>
						<div class="axis"><span>Harsh</span><span>Stars given</span><span>Loved it</span></div>
						<div class="peek" aria-live="polite">
							{#if hoverRating != null}
								<Stars value={hoverRating} size={12} />
								{#each hoverFilms as f (f.key)}
									<Poster film={f} class="w-9 shrink-0" />
								{/each}
								<span class="peek-hint">click to see all</span>
							{:else}
								<span class="peek-hint">Hover a bar to peek at those films, click to open them in the library.</span>
							{/if}
						</div>
					</div>
				</div>

				{#if compared.length > 5}
					<div class="crowd">
						<div class="crowd-head">
							<div>
								<p class="label">Me vs. the Letterboxd crowd</p>
								<p class="text-sm leading-relaxed text-[#b9b3a5]">
									On the {compared.length} films we've both rated, the crowd averages
									<strong class="text-[#f3eee3]">{crowdAvg.toFixed(1)}</strong> and I give
									<strong class="text-[#f3eee3]">{myAvgCompared.toFixed(1)}</strong>, about
									{Math.abs(crowdAvg - myAvgCompared).toFixed(1)} stars {myAvgCompared < crowdAvg ? 'harsher' : 'kinder'}.
								</p>
							</div>
							<div class="meter" aria-hidden="true">
								<span class="m-track"></span>
								<span class="m-dot crowd-dot" style="left:{(crowdAvg / 5) * 100}%"><i>Crowd</i></span>
								<span class="m-dot me-dot" style="left:{(myAvgCompared / 5) * 100}%"><i>Me</i></span>
							</div>
						</div>
						<div class="crowd-cols">
							{#each crowdCols as col (col.t)}
								<div>
									<h3>{col.t}</h3>
									<ul>
										{#each col.items as f (f.key)}
											<li>
												<button onclick={() => show(f)}>
													<Poster film={f} class="w-10 shrink-0" />
													<span class="min-w-0 flex-1">
														<span class="block truncate text-sm">{f.title}</span>
														<span class="text-xs text-[#8a8578]">me {f.rating} · crowd {f.meta?.avg?.toFixed(1)}</span>
													</span>
													<span class="delta" class:up={col.up}>{gap(f) > 0 ? '+' : ''}{gap(f).toFixed(1)}</span>
												</button>
											</li>
										{/each}
									</ul>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</section>

		<!-- library -->
		<section id="library" class="wrap pb-16">
			<div class="head">
				<h2 class="display">The library</h2>
				<div class="tabs">
					<button class:on={shelf === 'watched'} onclick={() => (shelf = 'watched')}>Seen <small>{films.filter((f) => !f.watchlist).length}</small></button>
				<button class:on={shelf === 'lists'} onclick={() => (shelf = 'lists')}>Lists <small>{lists.length}</small></button>
					<button class:on={shelf === 'watchlist'} onclick={() => (shelf = 'watchlist')}>Watchlist <small>{films.filter((f) => f.watchlist).length}</small></button>
				</div>
			</div>

			{#if shelf === 'lists'}
				<div class="no-scrollbar list-pick">
					{#each orderedLists as l (l.slug)}
						<button class="list-card" class:on={currentList?.slug === l.slug} onclick={() => (activeList = l.slug)}>
							<span class="stack">
								{#each listPosters(l) as f, i (f.key)}
									<img src={f.meta?.poster} alt="" loading="lazy" referrerpolicy="no-referrer" style="--i:{i}" />
								{/each}
							</span>
							<span class="list-name">{l.name}</span>
							<span class="list-count">{l.films.length} {l.films.length === 1 ? 'film' : 'films'}</span>
						</button>
					{/each}
				</div>
				{#if currentList}
					<div class="list-head">
						<h3 class="display text-[clamp(32px,4.5vw,54px)]">{currentList.name}</h3>
						<p>
							{#if currentList.description}{currentList.description} · {/if}{currentListFilms.length} titles, ranked · made
							{fmtDate(currentList.date)} on Letterboxd
						</p>
					</div>
					<div class="grid-lib ranked">
						{#each currentListFilms as f, i (f.key + i)}
							<button class="tile" onclick={() => show(f)}>
								<span class="pos">{i + 1}</span>
								<Poster film={f} />
								<span class="tile-over">
									<span class="tile-title">{f.title}</span>
									<span class="tile-sub">{f.year ?? ''}{#if f.meta?.directors[0]} · {f.meta.directors[0]}{/if}</span>
								</span>
								<span class="tile-rating"><Stars value={f.rating} size={11} /></span>
							</button>
						{/each}
					</div>
				{/if}
			{:else}
			<div class="filters">
				<label class="search">
					<Search size={15} />
					<input bind:value={query} placeholder="Title, director, actor, year…" />
					{#if query}<button onclick={() => (query = '')} aria-label="Clear"><X size={14} /></button>{/if}
				</label>
				<div class="no-scrollbar chips">
					<button class:on={kind === 'all'} onclick={() => (kind = 'all')}>Everything</button>
					{#each kinds as k (k.k)}
						<button class:on={kind === k.k} onclick={() => (kind = k.k)}>{KIND_LABEL[k.k]} <small>{k.n}</small></button>
					{/each}
				</div>
				<div class="selects">
					<select bind:value={genre} aria-label="Genre">
						<option value="all">All genres</option>
						{#each genres as g (g)}<option value={g}>{g}</option>{/each}
					</select>
					<select bind:value={decade} aria-label="Decade">
						<option value="all">All decades</option>
						{#each decades as d (d)}<option value={String(d)}>{d}s</option>{/each}
					</select>
					{#if shelf === 'watched'}
						<select bind:value={minRating} aria-label="Rating">
							<option value={null}>Any rating</option>
							{#each [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5] as r (r)}<option value={r}>{r} ★</option>{/each}
						</select>
					{/if}
					<select bind:value={sort} aria-label="Sort">
						<option value="rating">My rating</option>
						<option value="avg">Letterboxd avg</option>
						<option value="recent">Recently talked about</option>
						<option value="year">Release year</option>
						<option value="title">Title A–Z</option>
					</select>
					<button class="toggle" class:on={onlyLiked} onclick={() => (onlyLiked = !onlyLiked)}><Heart size={13} /> Liked</button>
					<button class="toggle" class:on={onlyTalked} onclick={() => (onlyTalked = !onlyTalked)}><MessageCircle size={13} /> Talked about</button>
				</div>
			</div>

			<p class="count">
				{library.length} {library.length === 1 ? 'title' : 'titles'}
				{#if filtering}<button onclick={resetFilters}>Reset</button>{/if}
			</p>

			{#if shownLib.length}
				<div class="grid-lib">
					{#each shownLib as f (f.key)}
						<button class="tile" onclick={() => show(f)}>
							<Poster film={f} />
							<span class="tile-over">
								<span class="tile-title">{f.title}</span>
								<span class="tile-sub">{f.year ?? ''}{#if f.meta?.directors[0]} · {f.meta.directors[0]}{/if}</span>
							</span>
							<span class="tile-badges">
								{#if f.liked}<Heart size={11} class="fill-[#ff6b6b] text-[#ff6b6b]" />{/if}
								{#if f.posts.length}<MessageCircle size={11} />{/if}
							</span>
							<span class="tile-rating"><Stars value={f.rating} size={11} /></span>
						</button>
					{/each}
				</div>
			{:else}
				<p class="py-24 text-center text-[#8a8578]">No film matches those filters.</p>
			{/if}
			{/if}
			<div bind:this={sentinel} class="h-px"></div>
		</section>

		<!-- channel log -->
		{#if channelLog.length}
			<section id="channel" class="wrap pb-24">
				<div class="head">
					<h2 class="display">More from the channel</h2>
					<p>Scenes, nostalgia, trailers and recommendations that aren't about one title.</p>
				</div>
				<div class="log">
					{#each channelLog.slice(0, logShown) as p (p.id)}
						<article>
							<p class="log-meta">
								<span class="kind {p.kind}">{KIND_TAG[p.kind]}</span>
								<time datetime={p.date}>{fmtDate(p.date)}</time>
							</p>
							<div class="log-text"><RichText segments={p.segments} /></div>
							<a href={postUrl(p.id)} target="_blank" rel="noopener noreferrer" class="log-link">t.me/Dagmawi_Babi/{p.id} <ArrowUpRight size={12} /></a>
						</article>
					{/each}
				</div>
				{#if logShown < channelLog.length}
					<div class="mt-8 text-center"><button class="cta ghost" onclick={() => (logShown += 16)}>Show more ({channelLog.length - logShown})</button></div>
				{/if}
			</section>
		{/if}

		<footer class="wrap credits">
			<Clapperboard size={18} />
			<p>
				Ratings, lists and diary from <a href="https://letterboxd.com/{data.profile.username}/" target="_blank" rel="noopener noreferrer">Letterboxd</a>;
				thoughts from <a href="https://t.me/Dagmawi_Babi" target="_blank" rel="noopener noreferrer">@Dagmawi_Babi</a>. Posters and film info via
				Letterboxd, series info via <a href="https://www.tvmaze.com" target="_blank" rel="noopener noreferrer">TVmaze</a>.
			</p>
		</footer>
	</main>
</div>

{#if open}
	{#key open.key}
		<FilmModal film={open} {lists} onClose={closeModal} />
	{/key}
{/if}

<style>
	.cine {
		--gold: #ffb547;
		--ink: #f3eee3;
		--mute: #8a8578;
		position: relative;
		min-height: 100vh;
		background: #0b0b0b;
		color: var(--ink);
		font-family: 'Inter', system-ui, sans-serif;
		overflow-x: clip;
	}
	.grain {
		position: fixed;
		inset: -50%;
		z-index: 50;
		pointer-events: none;
		opacity: 0.06;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		animation: grain 1.2s steps(6) infinite;
	}
	@keyframes grain {
		0% { transform: translate(0, 0); }
		20% { transform: translate(-3%, 2%); }
		40% { transform: translate(2%, -3%); }
		60% { transform: translate(-2%, -1%); }
		80% { transform: translate(3%, 3%); }
	}
	.wrap {
		width: min(1280px, 92vw);
		margin-inline: auto;
	}
	.display {
		font-family: 'Bebas Neue', 'Oswald', sans-serif;
		font-weight: 400;
		line-height: 0.9;
		letter-spacing: 0.01em;
	}
	.nav {
		position: absolute;
		inset: 0 0 auto 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px max(4vw, 16px);
	}
	.lb {
		display: inline-flex;
	}
	.lb i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		margin-left: -2px;
		mix-blend-mode: screen;
	}
	.lb i:nth-child(1) { background: #ff8000; }
	.lb i:nth-child(2) { background: #00e054; }
	.lb i:nth-child(3) { background: #40bcf4; }

	/* ---------- hero ---------- */
	.hero {
		position: relative;
		min-height: 100svh;
		display: flex;
		align-items: center;
		overflow: hidden;
	}
	.wall {
		position: absolute;
		inset: -10% -5%;
		display: flex;
		flex-direction: column;
		gap: 14px;
		transform: rotate(-8deg) scale(1.1);
		opacity: 0.55;
	}
	.wrow {
		display: flex;
		gap: 14px;
		width: max-content;
		animation: pan var(--d) linear infinite;
		animation-direction: var(--dir);
	}
	.wrow img {
		width: 150px;
		aspect-ratio: 2/3;
		object-fit: cover;
		border-radius: 6px;
		background: #1a1a1a;
	}
	@keyframes pan {
		to { transform: translateX(-50%); }
	}
	.vignette {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(70% 60% at 30% 50%, rgb(11 11 11 / 0.55), rgb(11 11 11 / 0.92) 70%),
			linear-gradient(180deg, rgb(11 11 11 / 0.6), transparent 30%, transparent 70%, #0b0b0b);
	}
	.hero-in {
		position: relative;
		width: min(1280px, 92vw);
		margin-inline: auto;
		padding: 120px 0 80px;
	}
	.bulbs {
		display: flex;
		gap: 14px;
		margin-bottom: 18px;
	}
	.bulbs span {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--gold);
		box-shadow: 0 0 10px var(--gold), 0 0 22px rgb(255 181 71 / 0.5);
		animation: bulb 1.6s infinite;
		animation-delay: calc(var(--i) * 0.09s);
	}
	@keyframes bulb {
		50% { opacity: 0.25; box-shadow: none; }
	}
	.now {
		font-size: 12px;
		letter-spacing: 0.4em;
		text-transform: uppercase;
		color: var(--gold);
	}
	h1 {
		margin-top: 14px;
		font-family: 'Bebas Neue', 'Oswald', sans-serif;
		font-size: clamp(72px, 14vw, 200px);
		line-height: 0.82;
		letter-spacing: 0.005em;
		text-shadow: 0 10px 60px rgb(0 0 0 / 0.6);
	}
	h1 span {
		color: transparent;
		-webkit-text-stroke: 1.5px var(--ink);
	}
	.lede {
		margin-top: 26px;
		max-width: 520px;
		font-size: 17px;
		line-height: 1.6;
		color: #cfc9bb;
	}
	.cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 22px;
		border-radius: 999px;
		font-size: 14px;
		font-weight: 500;
		background: var(--gold);
		color: #1a1206;
		transition: transform 0.2s;
	}
	.cta:hover {
		transform: translateY(-2px);
	}
	.cta.ghost {
		background: rgb(255 255 255 / 0.06);
		color: var(--ink);
		border: 1px solid rgb(255 255 255 / 0.18);
		backdrop-filter: blur(6px);
	}
	.ticker {
		display: flex;
		flex-wrap: wrap;
		gap: 14px 44px;
		margin-top: 60px;
	}
	.ticker div {
		display: flex;
		flex-direction: column;
	}
	.ticker dd {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 54px;
		line-height: 0.9;
	}
	.ticker small {
		font-size: 0.55em;
		color: var(--gold);
		margin-left: 2px;
	}
	.ticker dt {
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--mute);
	}

	/* ---------- feature ---------- */
	.feature {
		position: relative;
		padding: 90px 0;
		overflow: hidden;
		border-block: 1px solid rgb(255 255 255 / 0.06);
	}
	.feature-bg {
		position: absolute;
		inset: 0;
		background-image: var(--bg);
		background-size: cover;
		background-position: center 30%;
		opacity: 0.22;
		filter: saturate(0.9);
		mask-image: linear-gradient(90deg, transparent, black 40%, black);
	}
	.feature-in {
		position: relative;
		display: flex;
		gap: clamp(20px, 4vw, 56px);
		align-items: center;
	}
	@media (max-width: 640px) {
		.feature-in {
			flex-direction: column;
			align-items: flex-start;
		}
	}
	.label {
		font-size: 11px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--gold);
		margin-bottom: 10px;
	}
	.quote {
		max-width: 640px;
		font-family: 'Newsreader', Georgia, serif;
		font-style: italic;
		font-size: clamp(17px, 1.6vw, 21px);
		line-height: 1.55;
		color: #e4dfd2;
		display: -webkit-box;
		-webkit-line-clamp: 7;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.link {
		border-bottom: 1px solid rgb(255 255 255 / 0.25);
	}
	.link:hover {
		color: var(--gold);
		border-color: var(--gold);
	}

	/* ---------- section heads ---------- */
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 12px 24px;
		margin-bottom: 30px;
	}
	.head h2 {
		font-size: clamp(48px, 7vw, 88px);
	}
	.head > p {
		color: var(--mute);
		font-size: 14px;
	}

	/* ---------- reviews ---------- */
	.reviews {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));
		gap: 14px;
	}
	.rv {
		display: flex;
		gap: 16px;
		padding: 16px;
		border-radius: 14px;
		background: linear-gradient(180deg, rgb(255 255 255 / 0.045), rgb(255 255 255 / 0.015));
		border: 1px solid rgb(255 255 255 / 0.07);
		transition: border-color 0.2s;
	}
	.rv:hover {
		border-color: rgb(255 181 71 / 0.35);
	}
	.rv-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 28px;
		line-height: 0.95;
	}
	.rv {
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s,
			transform 0.2s;
	}
	.rv:hover {
		transform: translateY(-2px);
		background: linear-gradient(180deg, rgb(255 255 255 / 0.07), rgb(255 255 255 / 0.025));
	}
	.rv:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}
	.rv:hover .rv-title,
	.rv:focus-visible .rv-title {
		color: var(--gold);
	}
	.rv .more {
		color: #cfc9bb;
	}
	.rv-meta,
	.log-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 6px;
		font-size: 12px;
		color: var(--mute);
	}
	.kind {
		padding: 1px 7px;
		border-radius: 4px;
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background: rgb(255 255 255 / 0.08);
		color: #cfc9bb;
	}
	.kind.series, .kind.anime { background: rgb(64 188 244 / 0.15); color: #7fd3fa; }
	.kind.documentary { background: rgb(0 224 84 / 0.12); color: #6fe79b; }
	.kind.short { background: rgb(255 128 0 / 0.15); color: #ffad5c; }
	.rv-text {
		margin-top: 10px;
		font-size: 13.5px;
		line-height: 1.6;
		color: #cfc9bb;
		display: -webkit-box;
		-webkit-line-clamp: 5;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.rv-foot {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 12px;
		margin-top: 10px;
		font-size: 11px;
		color: var(--mute);
	}
	.rv-foot a:hover,
	.rv-foot button:hover {
		color: var(--gold);
	}

	/* ---------- ratings ---------- */
	.rate {
		position: relative;
		overflow: hidden;
		padding: clamp(22px, 4vw, 48px);
		border-radius: 24px;
		background:
			radial-gradient(700px 320px at 100% 0%, rgb(255 181 71 / 0.1), transparent 60%),
			linear-gradient(180deg, rgb(255 255 255 / 0.04), rgb(255 255 255 / 0.015));
		border: 1px solid rgb(255 255 255 / 0.08);
	}
	.rate-head {
		margin-bottom: 30px;
	}
	.rate-grid {
		display: grid;
		grid-template-columns: minmax(220px, 300px) 1fr;
		gap: clamp(28px, 5vw, 64px);
	}
	@media (max-width: 760px) {
		.rate-grid {
			grid-template-columns: 1fr;
		}
	}
	.rate-score .big {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(110px, 14vw, 170px);
		line-height: 0.8;
		margin-bottom: 12px;
		background: linear-gradient(180deg, #fff1d6, var(--gold) 60%, #b35c00);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.mini {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		margin-top: 22px;
	}
	.mini div {
		padding: 10px 12px;
		border-radius: 12px;
		background: rgb(255 255 255 / 0.04);
		border: 1px solid rgb(255 255 255 / 0.06);
	}
	.mini dt {
		font-size: 9.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--mute);
	}
	.mini dd {
		margin-top: 4px;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 30px;
		line-height: 1;
	}
	.mini dd span {
		margin-left: 1px;
		font-size: 0.6em;
		color: var(--gold);
	}
	.rate-hist {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.hist {
		display: flex;
		gap: clamp(4px, 1vw, 10px);
		height: 240px;
	}
	.hist button {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}
	.hist .track {
		position: relative;
		flex: 1;
		width: 100%;
		border-radius: 8px;
		overflow: hidden;
		background: repeating-linear-gradient(0deg, rgb(255 255 255 / 0.04) 0 1px, transparent 1px 24px);
	}
	.hist .fill {
		position: absolute;
		inset: auto 0 0 0;
		min-height: 3px;
		border-radius: 8px 8px 3px 3px;
		background: linear-gradient(180deg, #ffd48a, var(--gold) 35%, #b35c00);
		transform-origin: bottom;
		animation: grow 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		transition: filter 0.2s;
	}
	@keyframes grow {
		from {
			transform: scaleY(0);
		}
	}
	.hist button:hover .fill,
	.hist button.active .fill {
		filter: brightness(1.2) saturate(1.1);
		box-shadow: 0 0 30px rgb(255 181 71 / 0.35);
	}
	.hist .n {
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		color: #b9b3a5;
		transition: color 0.2s;
	}
	.hist button.active .n {
		color: var(--gold);
	}
	.hist .r {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 20px;
		line-height: 1;
		color: var(--gold);
	}
	.axis {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
		padding-top: 10px;
		border-top: 1px solid rgb(255 255 255 / 0.08);
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--mute);
	}
	.peek {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 64px;
		margin-top: 14px;
		overflow: hidden;
	}
	.peek-hint {
		font-size: 12px;
		color: var(--mute);
	}
	.crowd {
		margin-top: 36px;
		padding-top: 30px;
		border-top: 1px dashed rgb(255 255 255 / 0.1);
	}
	.crowd-head {
		display: grid;
		grid-template-columns: 1fr minmax(200px, 360px);
		gap: 20px 48px;
		align-items: center;
		margin-bottom: 22px;
	}
	@media (max-width: 760px) {
		.crowd-head {
			grid-template-columns: 1fr;
		}
	}
	.meter {
		position: relative;
		height: 52px;
	}
	.m-track {
		position: absolute;
		left: 0;
		right: 0;
		top: 24px;
		height: 4px;
		border-radius: 4px;
		background: linear-gradient(90deg, #3a2a14, var(--gold));
	}
	.m-dot {
		position: absolute;
		top: 19px;
		width: 14px;
		height: 14px;
		margin-left: -7px;
		border-radius: 50%;
		border: 2px solid #0b0b0b;
	}
	.m-dot i {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-style: normal;
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		white-space: nowrap;
	}
	.crowd-dot {
		background: #40bcf4;
	}
	.crowd-dot i {
		bottom: 16px;
		color: #7fd3fa;
	}
	.me-dot {
		background: var(--gold);
	}
	.me-dot i {
		top: 16px;
		color: var(--gold);
	}
	.crowd-cols {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 20px 36px;
	}
	.crowd-cols h3 {
		margin-bottom: 10px;
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--mute);
	}
	.crowd-cols ul {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.crowd-cols li button {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 6px 8px;
		border-radius: 10px;
		text-align: left;
		transition: background 0.15s;
	}
	.crowd-cols li button:hover {
		background: rgb(255 255 255 / 0.05);
	}
	.delta {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 22px;
		color: #ff8a8a;
	}
	.delta.up {
		color: #6fe79b;
	}

	/* ---------- lists (a library tab) ---------- */
	.list-pick {
		display: flex;
		gap: 12px;
		overflow-x: auto;
		padding: 4px 2px 20px;
		margin-bottom: 22px;
		border-bottom: 1px solid rgb(255 255 255 / 0.06);
	}
	.list-card {
		flex: 0 0 auto;
		width: 186px;
		padding: 12px;
		border-radius: 14px;
		text-align: left;
		background: rgb(255 255 255 / 0.03);
		border: 1px solid rgb(255 255 255 / 0.08);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.list-card:hover {
		border-color: rgb(255 255 255 / 0.25);
	}
	.list-card.on {
		border-color: var(--gold);
		background: rgb(255 181 71 / 0.07);
	}
	.stack {
		position: relative;
		display: block;
		height: 108px;
		margin-bottom: 12px;
	}
	.stack img {
		position: absolute;
		top: 0;
		left: calc(var(--i) * 40px);
		width: 72px;
		aspect-ratio: 2/3;
		object-fit: cover;
		border-radius: 5px;
		box-shadow: -6px 0 16px rgb(0 0 0 / 0.6);
		z-index: calc(3 - var(--i));
		transform: rotate(calc((var(--i) - 1) * 3deg));
		transition: transform 0.25s;
	}
	.list-card:hover .stack img {
		transform: rotate(calc((var(--i) - 1) * 6deg)) translateY(-3px);
	}
	.list-name {
		display: block;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.25;
	}
	.list-count {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		color: var(--mute);
	}
	.list-head {
		margin-bottom: 22px;
	}
	.list-head p {
		margin-top: 6px;
		font-size: 13px;
		color: var(--mute);
	}
	.ranked {
		padding-left: 14px;
	}
	.pos {
		position: absolute;
		left: -14px;
		bottom: 20px;
		z-index: 3;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 52px;
		line-height: 1;
		color: #0b0b0b;
		-webkit-text-stroke: 1.5px rgb(255 255 255 / 0.75);
		pointer-events: none;
	}

	/* ---------- library ---------- */
	.tabs {
		display: flex;
		gap: 4px;
		padding: 4px;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.05);
	}
	.tabs button {
		padding: 8px 16px;
		border-radius: 999px;
		font-size: 14px;
		color: #b9b3a5;
	}
	.tabs button.on {
		background: var(--ink);
		color: #0b0b0b;
	}
	.tabs small,
	.chips small {
		opacity: 0.55;
		margin-left: 3px;
	}
	.filters {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 0 -2vw 14px;
		padding: 12px 2vw;
		background: rgb(11 11 11 / 0.85);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid rgb(255 255 255 / 0.06);
	}
	.search {
		display: flex;
		align-items: center;
		gap: 10px;
		height: 44px;
		padding: 0 16px;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.06);
		border: 1px solid rgb(255 255 255 / 0.08);
		color: var(--mute);
	}
	.search:focus-within {
		border-color: rgb(255 181 71 / 0.5);
	}
	.search input {
		flex: 1;
		background: none;
		outline: none;
		color: var(--ink);
		font-size: 14px;
	}
	.chips,
	.selects {
		display: flex;
		gap: 8px;
		overflow-x: auto;
	}
	.selects {
		flex-wrap: wrap;
	}
	.chips button,
	.toggle,
	.selects select {
		flex-shrink: 0;
		height: 34px;
		padding: 0 14px;
		border-radius: 999px;
		font-size: 13px;
		background: rgb(255 255 255 / 0.04);
		border: 1px solid rgb(255 255 255 / 0.1);
		color: #cfc9bb;
	}
	.selects select option {
		background: #161616;
	}
	.toggle {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.chips button.on,
	.toggle.on {
		background: var(--gold);
		color: #1a1206;
		border-color: var(--gold);
	}
	.count {
		margin-bottom: 16px;
		font-size: 13px;
		color: var(--mute);
	}
	.count button {
		margin-left: 10px;
		color: var(--gold);
		text-decoration: underline;
	}
	.grid-lib {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
		gap: 14px 12px;
	}
	.tile {
		position: relative;
		text-align: left;
		border-radius: 6px;
		transition: transform 0.2s;
	}
	.tile:hover {
		transform: scale(1.04);
		z-index: 2;
	}
	.tile-over {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 3px;
		padding: 10px;
		border-radius: 6px;
		background: linear-gradient(180deg, transparent 35%, rgb(0 0 0 / 0.92));
		opacity: 0;
		transition: opacity 0.2s;
	}
	.tile:hover .tile-over,
	.tile:focus-visible .tile-over {
		opacity: 1;
	}
	.tile-title {
		font-size: 13px;
		font-weight: 600;
		line-height: 1.2;
	}
	.tile-sub {
		font-size: 10.5px;
		color: #b9b3a5;
	}
	.tile-badges {
		position: absolute;
		top: 6px;
		right: 6px;
		display: flex;
		gap: 4px;
	}
	.tile-badges:empty {
		display: none;
	}
	.tile-badges :global(svg) {
		filter: drop-shadow(0 1px 2px #000);
	}
	.tile-rating {
		display: block;
		margin-top: 6px;
		min-height: 11px;
	}

	/* ---------- channel log ---------- */
	.log {
		columns: 320px;
		column-gap: 14px;
	}
	.log article {
		break-inside: avoid;
		margin-bottom: 14px;
		padding: 16px;
		border-radius: 14px;
		border: 1px solid rgb(255 255 255 / 0.07);
		background: rgb(255 255 255 / 0.025);
	}
	.log-text {
		margin-top: 10px;
		font-size: 13.5px;
		line-height: 1.6;
		color: #cfc9bb;
	}
	.log-link {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		margin-top: 10px;
		font-size: 11px;
		color: var(--mute);
	}
	.log-link:hover {
		color: var(--gold);
	}
	.credits {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 40px 0 80px;
		border-top: 1px solid rgb(255 255 255 / 0.06);
		font-size: 13px;
		color: var(--mute);
	}
	.credits a {
		color: #cfc9bb;
		text-decoration: underline;
	}

	@media (prefers-reduced-motion: reduce) {
		.wrow,
		.bulbs span,
		.grain {
			animation: none;
		}
	}
</style>
