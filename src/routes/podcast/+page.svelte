<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Episode } from '$lib/podcast/youtube';

	let { data } = $props();
	const podcast = $derived(data.podcast);
	const episodes = $derived(podcast.episodes as Episode[]);

	// ---------- formatting ----------
	const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
	const dateFmt = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });

	function clock(sec: number) {
		const h = Math.floor(sec / 3600);
		const m = Math.floor((sec % 3600) / 60);
		const s = Math.floor(sec % 60);
		return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
	}
	function length(sec: number) {
		const h = Math.floor(sec / 3600);
		const m = Math.round((sec % 3600) / 60);
		return h ? `${h} h ${m} min` : `${m} min`;
	}

	const totalHours = $derived(Math.round(episodes.reduce((a, e) => a + e.duration, 0) / 3600));
	const amharicCount = $derived(episodes.filter((e) => e.lang === 'am').length);

	// ---------- filtering & sorting ----------
	const filters = [
		{ id: 'all', label: 'All' },
		{ id: 'en', label: 'English' },
		{ id: 'am', label: 'Amharic' }
	] as const;
	const sorts = [
		{ id: 'new', label: 'Newest' },
		{ id: 'views', label: 'Most watched' },
		{ id: 'long', label: 'Longest' }
	] as const;
	let filter = $state<'all' | 'en' | 'am'>('all');
	let sort = $state<'new' | 'views' | 'long'>('new');
	const filterIndex = $derived(filters.findIndex((f) => f.id === filter));

	// ---------- transcripts & search ----------
	// A transcript is YouTube's caption cues, a couple of seconds each. Cues are grouped into
	// passages of a few sentences for reading; highlighting follows the individual cue.
	type Cue = [number, string];
	type Passage = { start: number; from: number; to: number; text: string; offsets: number[] };
	type Hit = { t: number; before: string; match: string; after: string };
	let transcriptIds = $state(new Set<string>());
	let transcripts = $state<Record<string, Cue[]>>({});
	let query = $state('');
	let allLoading: Promise<void> | null = null;
	const passageCache = new Map<string, Passage[]>();

	async function loadTranscript(id: string) {
		if (transcripts[id] || !transcriptIds.has(id)) return;
		try {
			const res = await fetch(`/podcast/transcripts/${id}.json`);
			if (!res.ok) return;
			// Read the body first: spreading `transcripts` before the await would drop files
			// that finished loading in the meantime.
			const { cues } = await res.json();
			transcripts = { ...transcripts, [id]: cues };
		} catch {
			/* transcript stays unavailable; the chapters tab still works */
		}
	}
	// Search needs every transcript; fetch them once, the first time someone searches.
	function loadAllTranscripts() {
		allLoading ??= Promise.all([...transcriptIds].map(loadTranscript)).then(() => {});
		return allLoading;
	}

	function passagesOf(id: string): Passage[] {
		const cues = transcripts[id];
		if (!cues) return [];
		const cached = passageCache.get(id);
		if (cached) return cached;
		const out: Passage[] = [];
		let p: Passage | null = null;
		let words = 0;
		cues.forEach(([t, text], i) => {
			const ended = p ? /[.?!]["”']?$/.test(cues[i - 1][1]) : false;
			if (!p || (ended && words >= 24) || words >= 48 || t - cues[i - 1][0] > 20) {
				if (p) out.push(p);
				p = { start: t, from: i, to: i, text: '', offsets: [] };
				words = 0;
			}
			p.offsets.push(p.text.length ? p.text.length + 1 : 0);
			p.text += (p.text ? ' ' : '') + text;
			p.to = i;
			words += text.split(' ').length;
		});
		if (p) out.push(p);
		passageCache.set(id, out);
		return out;
	}

	const needle = $derived(query.trim().toLowerCase());
	$effect(() => {
		if (needle.length >= 3 && transcriptIds.size) loadAllTranscripts();
	});
	const hits = $derived.by(() => {
		const map = new Map<string, Hit[]>();
		if (needle.length < 3) return map;
		for (const id of Object.keys(transcripts)) {
			const cues = transcripts[id];
			const found: Hit[] = [];
			for (const p of passagesOf(id)) {
				const lower = p.text.toLowerCase();
				let at = lower.indexOf(needle);
				while (at !== -1) {
					// Find the cue the match starts in, so playback lands on that exact phrase.
					let k = p.offsets.length - 1;
					while (k > 0 && p.offsets[k] > at) k--;
					found.push({
						t: cues[p.from + k][0],
						before: p.text.slice(Math.max(0, at - 60), at).replace(/^\S*\s/, ''),
						match: p.text.slice(at, at + needle.length),
						after: p.text.slice(at + needle.length, at + needle.length + 70).replace(/\s\S*$/, '')
					});
					at = lower.indexOf(needle, at + needle.length + 40);
				}
			}
			if (found.length) map.set(id, found);
		}
		return map;
	});
	const matchesMeta = (e: Episode) =>
		[e.guest, e.role, e.title, ...e.topics].some((s) => s.toLowerCase().includes(needle));

	const list = $derived.by(() => {
		let rows = episodes.filter((e) => filter === 'all' || e.lang === filter);
		if (needle) rows = rows.filter((e) => matchesMeta(e) || hits.has(e.id));
		if (needle && hits.size) return [...rows].sort((a, b) => (hits.get(b.id)?.length ?? 0) - (hits.get(a.id)?.length ?? 0));
		if (sort === 'views') return [...rows].sort((a, b) => b.views - a.views);
		if (sort === 'long') return [...rows].sort((a, b) => b.duration - a.duration);
		return rows;
	});
	const countFor = (id: string) => (id === 'all' ? episodes.length : episodes.filter((e) => e.lang === id).length);

	// ---------- player ----------
	let currentId = $state<string>('');
	const current = $derived(episodes.find((e) => e.id === currentId) ?? episodes[0]);
	let started = $state(false); // iframe has been created
	let playing = $state(false);
	let time = $state(0);
	let showFull = $state(false);
	let pane = $state<'chapters' | 'transcript'>('chapters');
	let scriptEl: HTMLOListElement | undefined = $state();
	let chapEl: HTMLOListElement | undefined = $state();
	let nowEl: HTMLParagraphElement | undefined = $state();
	let follow = $state(true); // keep the transcript scrolled to what is being said
	let stageEl: HTMLElement | undefined = $state();
	let mountEl: HTMLDivElement | undefined = $state();
	let player: any = null;
	let ready = false;
	let pending: { id: string; start: number } | null = null;
	let ticker: ReturnType<typeof setInterval> | undefined;

	// Watch progress is a per-viewer convenience, so it lives in this browser only.
	let progress = $state<Record<string, number>>({});
	const STORE = 'dagmawi-podcast-progress';
	function readProgress() {
		try {
			progress = JSON.parse(localStorage.getItem(STORE) ?? '{}');
		} catch {
			progress = {};
		}
	}
	function saveProgress(id: string, sec: number) {
		progress = { ...progress, [id]: Math.floor(sec) };
		try {
			localStorage.setItem(STORE, JSON.stringify(progress));
		} catch {
			/* storage unavailable: progress just isn't remembered */
		}
	}
	const fraction = (e: Episode) => Math.min(1, (progress[e.id] ?? 0) / e.duration);

	const activeChapter = $derived.by(() => {
		if (!started || current.id !== currentId) return -1;
		let idx = -1;
		current.chapters.forEach((c, i) => {
			if (time >= c.start) idx = i;
		});
		return idx;
	});

	const cues = $derived(transcripts[current.id]);
	const passages = $derived(cues ? passagesOf(current.id) : []);
	const activeCue = $derived.by(() => {
		if (!cues || !started || current.id !== currentId) return -1;
		// Binary search: the last cue that starts at or before the playhead.
		let lo = 0;
		let hi = cues.length - 1;
		let idx = -1;
		while (lo <= hi) {
			const mid = (lo + hi) >> 1;
			if (cues[mid][0] <= time + 0.15) {
				idx = mid;
				lo = mid + 1;
			} else hi = mid - 1;
		}
		return idx;
	});
	const activePassage = $derived(
		activeCue < 0 ? -1 : passages.findIndex((p) => activeCue >= p.from && activeCue <= p.to)
	);
	const nowPassage = $derived(passages[Math.max(0, activePassage)]);

	// Scrolling the chapters or transcript yourself stops them following the video until you press Sync.
	function stopFollowing() {
		follow = false;
	}
	// Scrolls `box` so `el` sits a third of the way down it, without moving the page.
	function reveal(box: HTMLElement | undefined, el: HTMLElement | null | undefined, smooth = true) {
		if (!box || !el) return;
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const offset = el.getBoundingClientRect().top - box.getBoundingClientRect().top;
		const top = box.scrollTop + offset - box.clientHeight / 3;
		box.scrollTo({ top, behavior: smooth && !reduce ? 'smooth' : 'auto' });
	}
	const revealCue = (smooth = true) =>
		reveal(scriptEl, scriptEl?.querySelector<HTMLElement>(`[data-cue="${activeCue}"]`), smooth);
	const revealChapter = (smooth = true) =>
		reveal(chapEl, chapEl?.querySelector<HTMLElement>(`[data-ch="${activeChapter}"]`), smooth);

	async function sync() {
		follow = true;
		await tick();
		revealCue();
		revealChapter();
	}
	// The transcript list scrolls when the passage changes (not on every cue), or jumps into
	// place when the list first appears.
	let lastPassage = -1;
	$effect(() => {
		const p = activePassage;
		if (!follow || !scriptEl || p < 0) return;
		const jump = lastPassage === -1;
		lastPassage = p;
		tick().then(() => revealCue(!jump));
	});
	$effect(() => {
		if (!scriptEl) lastPassage = -1;
	});
	// The chapter list follows the same way.
	let lastChapter = -1;
	$effect(() => {
		const c = activeChapter;
		if (!follow || !chapEl || c < 0) return;
		const jump = lastChapter === -1;
		lastChapter = c;
		tick().then(() => revealChapter(!jump));
	});
	$effect(() => {
		if (!chapEl) lastChapter = -1;
	});
	// The live passage under the video always keeps the spoken words in view.
	$effect(() => {
		const i = activeCue;
		if (!nowEl || i < 0) return;
		const el = nowEl.querySelector<HTMLElement>(`[data-now="${i}"]`);
		if (!el) return;
		const below = el.offsetTop + el.offsetHeight - nowEl.clientHeight;
		if (below > nowEl.scrollTop || el.offsetTop < nowEl.scrollTop) {
			nowEl.scrollTo({ top: Math.max(0, below + 8), behavior: 'smooth' });
		}
	});

	// Show the transcript tab when an episode has no chapters, and fetch the text when it's opened.
	$effect(() => {
		if (!current.chapters.length && transcriptIds.has(current.id)) pane = 'transcript';
		if (pane === 'transcript' && !transcriptIds.has(current.id)) pane = 'chapters';
		// The passage under the video needs the transcript whether or not its tab is open.
		if (transcriptIds.has(current.id)) loadTranscript(current.id);
	});

	function loadApi(): Promise<any> {
		const w = window as any;
		if (w.YT?.Player) return Promise.resolve(w.YT);
		return new Promise((resolve) => {
			const prev = w.onYouTubeIframeAPIReady;
			w.onYouTubeIframeAPIReady = () => {
				prev?.();
				resolve(w.YT);
			};
			if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
				const s = document.createElement('script');
				s.src = 'https://www.youtube.com/iframe_api';
				document.head.appendChild(s);
			}
		});
	}

	function resumeFrom(e: Episode) {
		const saved = progress[e.id] ?? 0;
		// Don't resume into the last minute; start over instead.
		return saved > 0 && saved < e.duration - 60 ? saved : 0;
	}

	async function play(e: Episode, at?: number) {
		const start = at ?? resumeFrom(e);
		currentId = e.id;
		showFull = false;
		time = start;

		if (started) {
			// The player may still be loading; queue the request until it reports ready.
			if (ready) player.loadVideoById({ videoId: e.id, startSeconds: start });
			else pending = { id: e.id, start };
			return;
		}
		started = true;
		await tick();
		const YT = await loadApi();
		player = new YT.Player(mountEl, {
			videoId: e.id,
			host: 'https://www.youtube-nocookie.com',
			playerVars: { autoplay: 1, start: Math.floor(start), rel: 0, modestbranding: 1, playsinline: 1 },
			events: {
				onReady: () => {
					ready = true;
					if (pending) {
						const p = pending;
						pending = null;
						if (p.id === e.id) player.seekTo(p.start, true);
						else player.loadVideoById({ videoId: p.id, startSeconds: p.start });
					}
				},
				onStateChange: (ev: any) => {
					playing = ev.data === YT.PlayerState.PLAYING;
					if (ev.data === YT.PlayerState.ENDED) saveProgress(currentId, current.duration);
				}
			}
		});
		clearInterval(ticker);
		let lastSave = 0;
		ticker = setInterval(() => {
			if (!ready || !player?.getCurrentTime) return;
			time = player.getCurrentTime();
			if (playing && Date.now() - lastSave > 5000) {
				lastSave = Date.now();
				saveProgress(currentId, time);
			}
		}, 250);
	}

	function seek(sec: number) {
		time = sec;
		if (ready) {
			player.seekTo(sec, true);
			player.playVideo();
		} else if (started) {
			pending = { id: current.id, start: sec };
		} else {
			play(current, sec);
		}
	}

	async function playAndShow(e: Episode, at?: number) {
		play(e, at);
		await tick();
		stageEl?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
	}

	// ---------- micro-interactions ----------
	let heroEl: HTMLElement | undefined = $state();
	function tilt(ev: PointerEvent) {
		if (!heroEl || ev.pointerType !== 'mouse') return;
		const r = heroEl.getBoundingClientRect();
		heroEl.style.setProperty('--tx', String((ev.clientX - r.left) / r.width - 0.5));
		heroEl.style.setProperty('--ty', String((ev.clientY - r.top) / r.height - 0.5));
	}
	function untilt() {
		heroEl?.style.setProperty('--tx', '0');
		heroEl?.style.setProperty('--ty', '0');
	}

	onMount(() => {
		readProgress();
		fetch('/podcast/transcripts/index.json')
			.then((r) => (r.ok ? r.json() : []))
			.then((ids: string[]) => (transcriptIds = new Set(ids)))
			.catch(() => {});
		// Deep links: /podcast?e=<videoId>&t=<seconds>
		const q = new URLSearchParams(location.search);
		const linked = episodes.find((e) => e.id === q.get('e'));
		if (linked) currentId = linked.id;
		return () => {
			clearInterval(ticker);
			if (started && currentId) saveProgress(currentId, time);
			player?.destroy?.();
		};
	});

	$effect(() => {
		if (!currentId) return;
		const url = new URL(location.href);
		url.searchParams.set('e', currentId);
		history.replaceState(history.state, '', url);
	});
</script>

<svelte:head>
	<title>Podcast | Dagmawi Babi</title>
	<meta
		name="description"
		content="Long conversations with founders, engineers and creators, including Guillermo Rauch of Vercel and Akshay Kothari of Notion. In English and Amharic."
	/>
	<meta property="og:title" content="The Dagmawi Babi Podcast" />
	<meta property="og:description" content="Long conversations with people who build things." />
	<meta property="og:image" content="https://www.dagmawi.dev/podcast/og.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@400;500;600;700;800&family=Funnel+Sans:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
	<link rel="preconnect" href="https://i.ytimg.com" />
</svelte:head>

<div class="pod">
	{#if currentId}
		<!-- The chosen episode tints the whole page: its thumbnail, heavily blurred, under a wash
		     of the page colour so text and controls keep their contrast. -->
		<div class="backdrop" aria-hidden="true">
			{#key current.id}
				<img src={current.thumb.replace('maxresdefault', 'mqdefault')} alt="" />
			{/key}
		</div>
	{/if}
	<nav class="top">
		<a href="/" class="home">Dagmawi Babi</a>
		<a href={podcast.channel.url} target="_blank" rel="noopener noreferrer" class="yt">
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" /></svg>
			{compact.format(podcast.channel.subscribers)} subscribers
		</a>
	</nav>

	<!-- HERO -->
	<header class="hero" bind:this={heroEl} onpointermove={tilt} onpointerleave={untilt}>
		<div class="hero-copy">
			<h1>
				<span class="line"><span>Long conversations</span></span>
				<span class="line"><span>with people who</span></span>
				<span class="line"><span>build things.</span></span>
			</h1>
			<p class="lede">
				Founders, engineers and creators on where they grew up, what they believe and the work they're known for.
				{episodes.length} episodes and {totalHours} hours so far, in English and Amharic.
			</p>
			<div class="cta">
				<button class="btn primary" onclick={() => playAndShow(episodes[0])}>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
					Play the latest episode
				</button>
				<a class="btn ghost" href={`${podcast.channel.url}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer">
					Subscribe on YouTube
				</a>
			</div>
		</div>
		<div class="hero-art" aria-hidden="true">
			<img src="/podcast/host.webp" alt="" width="1000" height="1000" />
		</div>
		<ul class="guest-ticker" aria-label="Guests">
			{#each [...episodes].sort((a, b) => b.views - a.views).slice(0, 6) as e (e.id)}
				<li><button onclick={() => playAndShow(e)}>{e.guest}</button></li>
			{/each}
		</ul>
	</header>

	<!-- STAGE -->
	<section class="stage" bind:this={stageEl} aria-label="Now playing">
		<div class="watch">
			<div class="screen" class:live={started}>
				{#if started}
					<div class="frame"><div bind:this={mountEl}></div></div>
				{:else}
					<button class="poster" onclick={() => play(current)} aria-label={`Play ${current.guest}`}>
						<img src={current.thumb} alt="" loading="eager" />
						<span class="big-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg></span>
						{#if resumeFrom(current)}
							<span class="resume">Resume at {clock(resumeFrom(current))}</span>
						{/if}
					</button>
				{/if}
			</div>

			{#if transcriptIds.has(current.id)}
				<div class="now" aria-live="off">
					<div class="now-bar">
						<span class="now-time">
							{#if activeCue >= 0 && nowPassage}
								{clock(nowPassage.start)}
							{:else}
								Transcript
							{/if}
						</span>
						<button
							class="sync"
							class:off={started && !follow}
							onclick={sync}
							disabled={!started}
							title={follow ? 'Following the video' : 'Jump back to what is being said now'}
							aria-label="Sync transcript and chapters with the video"
						>
							<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" /><path d="M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" /><path d="M20 20v-4h-4" /></svg>
							Sync
						</button>
					</div>
					{#if !cues}
						<p class="now-text muted">Loading the transcript…</p>
					{:else if activeCue < 0}
						<p class="now-text muted">Press play and the words appear here as they're spoken.</p>
					{:else if nowPassage}
						{#key nowPassage.start}
							<p class="now-text" bind:this={nowEl}>
								{#each cues.slice(nowPassage.from, nowPassage.to + 1) as [t, text], k (t)}
									{@const i = nowPassage.from + k}
									<button class="cue" class:said={i < activeCue} class:on={i === activeCue} data-now={i} onclick={() => seek(t)}>{text}</button>{' '}
								{/each}
							</p>
						{/key}
					{/if}
				</div>
			{/if}
		</div>

		<div class="notes">
			<div class="ep-head">
				<p class="ep-meta">
					{#if current.number}Episode {current.number}{/if}
					<span>{dateFmt.format(new Date(current.published))}</span>
					<span>{length(current.duration)}</span>
					{#if current.lang === 'am'}<span class="lang">Amharic</span>{/if}
				</p>
				<h2>
					{#if playing && current.id === currentId}<span class="eq" aria-label="Playing"><i></i><i></i><i></i></span>{/if}
					{current.guest}
				</h2>
				{#if current.role}<p class="role">{current.role}</p>{/if}
			</div>

			{#if current.summary}
				<p class="summary" class:open={showFull}>{current.summary}</p>
				{#if current.summary.length > 260}
					<button class="link" onclick={() => (showFull = !showFull)}>{showFull ? 'Show less' : 'Read more'}</button>
				{/if}
			{/if}

			{#if current.chapters.length || transcriptIds.has(current.id)}
				<div class="chapters">
					<div class="tabs" role="tablist" aria-label="Episode guide">
						{#if current.chapters.length}
							<button role="tab" aria-selected={pane === 'chapters'} class:on={pane === 'chapters'} onclick={() => (pane = 'chapters')}>
								Chapters
							</button>
						{/if}
						{#if transcriptIds.has(current.id)}
							<button role="tab" aria-selected={pane === 'transcript'} class:on={pane === 'transcript'} onclick={() => (pane = 'transcript')}>
								Transcript
							</button>
						{/if}
						{#if started && !follow}
							<button class="sync small off" onclick={sync} aria-label="Sync transcript and chapters with the video">
								<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" /><path d="M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" /><path d="M20 20v-4h-4" /></svg>
								Sync
							</button>
						{/if}
					</div>

					{#if pane === 'transcript' && transcriptIds.has(current.id)}
						<ol class="script" bind:this={scriptEl} onwheel={stopFollowing} ontouchmove={stopFollowing}>
							{#if !cues}
								<li class="loading">Loading the transcript…</li>
							{:else}
								{#each passages as p, pi (p.start)}
									<li class="passage" class:on={pi === activePassage}>
										<button class="t" onclick={() => seek(p.start)} aria-label={`Play from ${clock(p.start)}`}>{clock(p.start)}</button>
										<p>
											{#each cues.slice(p.from, p.to + 1) as [t, text], k (t)}
												{@const i = p.from + k}
												<button class="cue" class:said={pi === activePassage && i < activeCue} class:on={i === activeCue} data-cue={i} onclick={() => seek(t)}>{text}</button>{' '}
											{/each}
										</p>
									</li>
								{/each}
							{/if}
						</ol>
						<p class="hint">Captions are generated automatically by YouTube, so some words may be misheard.</p>
					{:else if current.chapters.length}
						<ol bind:this={chapEl} onwheel={stopFollowing} ontouchmove={stopFollowing}>
							{#each current.chapters as c, i (c.start + c.label)}
								<li>
									<button class:on={i === activeChapter} data-ch={i} onclick={() => seek(c.start)}>
										<span class="t">{clock(c.start)}</span>
										<span class="l">{c.label}</span>
									</button>
								</li>
							{/each}
						</ol>
					{/if}
				</div>
			{/if}
		</div>
	</section>

	<!-- EPISODES -->
	<section class="episodes" aria-labelledby="all-episodes">
		<div class="list-head">
			<h2 id="all-episodes">Every episode</h2>
			<div class="controls">
				<label class="search">
					<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
					<span class="sr">Search episodes and transcripts</span>
					<input
						type="search"
						placeholder="Search what guests said"
						bind:value={query}
						onfocus={loadAllTranscripts}
						autocomplete="off"
					/>
				</label>
				<div class="seg" role="radiogroup" aria-label="Language" style={`--i:${filterIndex}`}>
					<span class="pill" aria-hidden="true"></span>
					{#each filters as f (f.id)}
						<button role="radio" aria-checked={filter === f.id} class:on={filter === f.id} onclick={() => (filter = f.id)}>
							{f.label} <span class="n">{countFor(f.id)}</span>
						</button>
					{/each}
				</div>
				<label class="sort">
					<span class="sr">Sort by</span>
					<select bind:value={sort}>
						{#each sorts as s (s.id)}<option value={s.id}>{s.label}</option>{/each}
					</select>
				</label>
			</div>
		</div>

		<ol class="rows">
			{#each list as e (e.id)}
				<li class:current={e.id === currentId} class:am={e.lang === 'am'}>
					<button class="row" onclick={() => playAndShow(e)} aria-label={`Play episode ${e.number ?? ''} with ${e.guest}`}>
						<span class="num">{e.number ?? '–'}</span>
						<span class="thumb">
							<img src={e.thumb.replace('maxresdefault', 'mqdefault')} alt="" loading="lazy" width="320" height="180" />
							<span class="len">{clock(e.duration)}</span>
							<span class="go" aria-hidden="true">
								<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
							</span>
						</span>
						<span class="who">
							<span class="g">
								{#if e.id === currentId && playing}<span class="eq small"><i></i><i></i><i></i></span>{/if}
								{e.guest}
							</span>
							<span class="r">{e.role}</span>
						</span>
						<span class="topics">
							{#each e.topics.slice(0, 3) as t (t)}<span>{t}</span>{/each}
						</span>
						<span class="facts">
							<span>{dateFmt.format(new Date(e.published))}</span>
							<span class="v">{compact.format(e.views)} views</span>
						</span>
						{#if fraction(e) > 0}
							<span class="bar" style={`--p:${fraction(e)}`} aria-label={`${Math.round(fraction(e) * 100)}% watched`}></span>
						{/if}
					</button>
					{#if hits.get(e.id)?.length}
						{@const found = hits.get(e.id)!}
						<ul class="quotes">
							{#each found.slice(0, 3) as h (h.t)}
								<li>
									<button onclick={() => playAndShow(e, Math.max(0, h.t - 2))}>
										<span class="t">{clock(h.t)}</span>
										<span class="q">…{h.before}<mark>{h.match}</mark>{h.after}…</span>
									</button>
								</li>
							{/each}
							{#if found.length > 3}
								<li class="more">{found.length - 3} more {found.length - 3 === 1 ? 'mention' : 'mentions'} in this episode</li>
							{/if}
						</ul>
					{/if}
				</li>
			{:else}
				<li class="empty">
					No episode mentions “{query.trim()}”. Try a shorter word, or clear the search to see every episode.
				</li>
			{/each}
		</ol>
	</section>

	{#if podcast.extras.length}
		<section class="extras" aria-labelledby="extras">
			<h2 id="extras">Between episodes</h2>
			<div class="extra-row">
				{#each podcast.extras as x (x.id)}
					<a href={`https://www.youtube.com/watch?v=${x.id}`} target="_blank" rel="noopener noreferrer" class="extra">
						<img src={x.thumb} alt="" loading="lazy" />
						<span>{x.title}</span>
						<small>{clock(x.duration)}</small>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<footer class="foot">
		<p>
			Have someone in mind for the show? Reach out on
			<a href="https://t.me/dagmawi_babi" target="_blank" rel="noopener noreferrer">Telegram</a>
			or <a href="mailto:1babidagi@gmail.com">email</a>.
		</p>
		<p class="small">{compact.format(podcast.channel.views)} views across the channel. <a href="/">Back to dagmawi.dev</a></p>
	</footer>
</div>

<style>
	.pod {
		--teal: #00a4b1;
		--teal-deep: #00707a;
		--teal-wash: #e3f4f5;
		--nose: #ee4f7c;
		--fur: #b1714e;
		--ink: #142426;
		--ink-soft: #4d6164;
		--paper: #f4f8f8;
		--surface: #ffffff;
		--rule: #d6e3e4;
		--on-teal: #04272b;
		--guide-h: 300px; /* chapters, transcript and the live passage share this height */

		font-family: 'Funnel Sans', 'Lexend', system-ui, sans-serif;
		background: var(--paper);
		color: var(--ink);
		min-height: 100vh;
		padding: 0 clamp(16px, 3vw, 40px) 64px;
		-webkit-font-smoothing: antialiased;
		position: relative;
		isolation: isolate;
	}
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
	}
	.backdrop img {
		position: absolute;
		inset: -15%;
		width: 130%;
		height: 130%;
		object-fit: cover;
		filter: blur(70px) saturate(1.5);
		animation: backdrop-in 0.9s ease both;
	}
	/* A wash of the page colour keeps text contrast the same as without the image. */
	.backdrop::after {
		content: '';
		position: absolute;
		inset: 0;
		background: color-mix(in srgb, var(--paper) 74%, transparent);
	}
	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
	}
	:global(.dark) .pod {
		--teal-deep: #4fd0da;
		--teal-wash: #0f2a2d;
		--ink: #e6f0f0;
		--ink-soft: #93a9ab;
		--paper: #0c1617;
		--surface: #122021;
		--rule: #20383a;
	}
	.pod :global(*) {
		box-sizing: border-box;
	}
	.pod button,
	.pod select {
		font: inherit;
		color: inherit;
	}
	.pod :focus-visible {
		outline: 2px solid var(--nose);
		outline-offset: 3px;
		border-radius: 6px;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}
	.top,
	.hero,
	.stage,
	.episodes,
	.extras,
	.foot {
		max-width: 1180px;
		margin-inline: auto;
	}

	/* ---------- nav ---------- */
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 4px;
	}
	.home {
		font-family: 'Funnel Display', sans-serif;
		font-weight: 700;
		font-size: 17px;
		letter-spacing: -0.01em;
		color: var(--ink);
		text-decoration: none;
	}
	.yt {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: var(--ink-soft);
		text-decoration: none;
		transition: color 0.2s;
	}
	.yt svg {
		width: 20px;
		fill: currentColor;
	}
	.yt:hover {
		color: var(--ink);
	}

	/* ---------- hero ---------- */
	.hero {
		--tx: 0;
		--ty: 0;
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		align-items: center;
		background: var(--teal);
		color: var(--on-teal);
		border-radius: 28px;
		overflow: hidden;
		min-height: 520px;
		isolation: isolate;
	}
	.hero-copy {
		padding: clamp(28px, 5vw, 64px);
		padding-bottom: 96px;
		max-width: 62%;
		position: relative;
		z-index: 2;
	}
	h1 {
		font-family: 'Funnel Display', sans-serif;
		font-weight: 700;
		font-size: clamp(38px, 4.6vw, 66px);
		line-height: 0.96;
		white-space: nowrap;
		letter-spacing: -0.035em;
		margin: 0;
	}
	h1 .line {
		display: block;
		overflow: hidden;
		padding-bottom: 0.06em;
	}
	h1 .line > span {
		display: inline-block;
		animation: rise 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	h1 .line:nth-child(2) > span {
		animation-delay: 0.08s;
	}
	h1 .line:nth-child(3) > span {
		animation-delay: 0.16s;
	}
	@keyframes rise {
		from {
			transform: translateY(105%);
		}
	}
	.lede {
		margin: 24px 0 0;
		max-width: 46ch;
		font-size: clamp(16px, 1.4vw, 18px);
		line-height: 1.55;
		color: color-mix(in srgb, var(--on-teal) 82%, transparent);
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 28px;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		height: 48px;
		padding: 0 20px;
		border-radius: 999px;
		font-weight: 600;
		font-size: 15px;
		text-decoration: none;
		cursor: pointer;
		border: 1.5px solid var(--on-teal);
		transition:
			transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.2s,
			color 0.2s;
	}
	.btn svg {
		width: 18px;
		fill: currentColor;
		transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.btn.primary {
		background: var(--on-teal);
		color: #fff !important;
	}
	.btn.primary:hover svg {
		transform: scale(1.18);
	}
	.btn.ghost {
		color: var(--on-teal);
	}
	.btn.ghost:hover {
		background: color-mix(in srgb, var(--on-teal) 10%, transparent);
	}
	.btn:active {
		transform: scale(0.97);
	}

	.hero-art {
		position: absolute;
		right: -3%;
		bottom: -9%;
		width: min(54%, 660px);
		aspect-ratio: 1;
		z-index: 1;
		pointer-events: none;
	}
	.hero-art img {
		width: 100%;
		height: 100%;
		transform: perspective(900px) rotateY(calc(var(--tx) * 10deg)) rotateX(calc(var(--ty) * -6deg))
			translate3d(calc(var(--tx) * 14px), calc(var(--ty) * 8px), 0);
		transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
		animation: arrive 1.1s 0.15s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		/* The avatar is shot on the same teal as the panel, so its square edges disappear. */
		transform-origin: 50% 100%;
	}
	@keyframes arrive {
		from {
			opacity: 0;
			translate: 0 12%;
		}
	}
	.guest-ticker {
		position: absolute;
		left: clamp(28px, 5vw, 64px);
		right: 0;
		bottom: 22px;
		z-index: 2;
		display: flex;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.guest-ticker button {
		white-space: nowrap;
		background: color-mix(in srgb, #fff 22%, transparent);
		border: 0;
		border-radius: 999px;
		padding: 7px 13px;
		font-size: 13px;
		font-weight: 500;
		color: var(--on-teal);
		cursor: pointer;
		transition: background 0.2s;
	}
	.guest-ticker button:hover {
		background: #fff;
	}

	/* ---------- stage ---------- */
	.stage {
		display: grid;
		grid-template-columns: minmax(0, 1.55fr) minmax(300px, 1fr);
		gap: clamp(20px, 3vw, 40px);
		margin-top: clamp(24px, 4vw, 48px);
		scroll-margin-top: 20px;
	}
	.screen {
		position: relative;
		aspect-ratio: 16 / 9;
		border-radius: 18px;
		overflow: hidden;
		background: #000;
		box-shadow: 0 0 0 1px var(--rule);
		width: 100%;
		transition: box-shadow 0.4s;
	}
	.screen.live {
		box-shadow:
			0 0 0 1px var(--rule),
			0 24px 60px -24px rgba(0, 112, 122, 0.45);
	}
	.frame,
	.frame :global(iframe) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.poster {
		position: absolute;
		inset: 0;
		padding: 0;
		border: 0;
		cursor: pointer;
		background: #000;
	}
	.poster img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition:
			transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.3s;
		opacity: 0.88;
	}
	.poster:hover img {
		transform: scale(1.03);
		opacity: 1;
	}
	.big-play {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 84px;
		height: 84px;
		margin: -42px 0 0 -42px;
		border-radius: 50%;
		background: var(--nose);
		display: grid;
		place-items: center;
		box-shadow: 0 12px 30px rgba(238, 79, 124, 0.45);
		transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.big-play svg {
		width: 34px;
		fill: #fff;
		margin-left: 4px;
	}
	.poster:hover .big-play {
		transform: scale(1.08);
	}
	.poster:active .big-play {
		transform: scale(0.95);
	}
	.resume {
		position: absolute;
		left: 16px;
		bottom: 16px;
		background: rgba(0, 0, 0, 0.65);
		color: #fff;
		font-size: 13px;
		padding: 6px 12px;
		border-radius: 999px;
		backdrop-filter: blur(6px);
	}

	.notes {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}
	.ep-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 14px;
		margin: 0;
		font-size: 14px;
		color: var(--ink-soft);
	}
	.ep-meta .lang {
		color: var(--fur);
		font-weight: 600;
	}
	.notes h2 {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 6px 0 0;
		font-family: 'Funnel Display', sans-serif;
		font-weight: 700;
		font-size: clamp(30px, 3.4vw, 44px);
		line-height: 1;
		letter-spacing: -0.03em;
	}
	.role {
		margin: 8px 0 0;
		font-size: 16px;
		color: var(--teal-deep);
		font-weight: 500;
	}
	.summary {
		margin: 18px 0 0;
		font-size: 15px;
		line-height: 1.6;
		color: var(--ink-soft);
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.summary.open {
		display: block;
	}
	.link {
		align-self: flex-start;
		margin-top: 6px;
		padding: 0;
		background: none;
		border: 0;
		cursor: pointer;
		font-size: 14px;
		font-weight: 600;
		color: var(--teal-deep);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}
	.chapters {
		margin-top: 22px;
		min-height: 0;
	}
	.tabs {
		display: flex;
		gap: 4px;
		margin-bottom: 8px;
	}
	.tabs button {
		padding: 6px 12px;
		border: 0;
		border-radius: 999px;
		background: none;
		font-size: 14px;
		font-weight: 600;
		color: var(--ink-soft);
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.tabs button:hover {
		color: var(--ink);
	}
	.tabs button.on {
		background: var(--ink);
		color: var(--paper);
	}
	.chapters ol {
		list-style: none;
		margin: 0;
		padding: 0;
		height: var(--guide-h);
		overflow-y: auto;
		scrollbar-width: thin;
		mask-image: linear-gradient(#000 85%, transparent);
		-webkit-mask-image: linear-gradient(#000 85%, transparent);
		padding-bottom: 24px;
	}
	.chapters ol.script {
		position: relative;
	}
	.chapters ol button {
		position: relative;
		display: grid;
		grid-template-columns: 64px 1fr;
		gap: 8px;
		width: 100%;
		padding: 7px 10px;
		background: none;
		border: 0;
		border-radius: 8px;
		text-align: left;
		cursor: pointer;
		font-size: 14px;
		line-height: 1.5;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.chapters .t {
		color: var(--ink-soft);
		font-variant-numeric: tabular-nums;
	}
	.chapters ol button:hover {
		background: var(--teal-wash);
	}
	.chapters ol button.on {
		background: var(--teal-wash);
		font-weight: 600;
	}
	.chapters ol button.on::before {
		content: '';
		position: absolute;
		left: 0;
		top: 8px;
		bottom: 8px;
		width: 3px;
		border-radius: 3px;
		background: var(--nose);
	}
	.loading {
		padding: 10px;
		color: var(--ink-soft);
		font-size: 14px;
	}
	.hint {
		margin: 4px 0 0;
		font-size: 12.5px;
		color: var(--ink-soft);
	}

	/* transcript: passages made of clickable caption cues */
	.script .passage {
		display: grid;
		grid-template-columns: 52px 1fr;
		gap: 6px;
		padding: 8px 6px;
		border-radius: 10px;
		transition: background 0.3s;
	}
	.script .passage.on {
		background: var(--teal-wash);
	}
	.script .passage p {
		margin: 0;
		font-size: 14px;
		line-height: 1.6;
		color: var(--ink-soft);
	}
	.script .passage .t {
		display: block;
		width: auto;
		padding: 2px 0 0;
		background: none;
		font-size: 13px;
		color: var(--teal-deep);
		font-weight: 600;
	}
	.script .passage .t:hover {
		background: none;
		text-decoration: underline;
	}
	.script .cue,
	.now .cue {
		display: inline;
		width: auto;
		padding: 0;
		border: 0;
		border-radius: 3px;
		background: none;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			color 0.25s,
			background 0.25s,
			box-shadow 0.25s;
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
	}
	.script .cue:hover,
	.now .cue:hover {
		background: color-mix(in srgb, var(--teal) 16%, transparent);
	}
	.script .passage.on p {
		color: color-mix(in srgb, var(--ink) 55%, transparent);
	}
	.script .cue.said,
	.now .cue.said {
		color: var(--ink);
	}
	.script .cue.on,
	.now .cue.on {
		color: var(--ink);
		background: color-mix(in srgb, var(--nose) 18%, transparent);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--nose) 18%, transparent);
	}
	.script .cue.on::before {
		content: none;
	}

	/* the passage being spoken, under the video */
	.watch {
		display: flex;
		flex-direction: column;
		gap: 14px;
		min-width: 0;
	}
	.now {
		padding: 4px 2px 0;
	}
	.now-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin-bottom: 8px;
	}
	.now-time {
		font-size: 13px;
		font-weight: 600;
		color: var(--teal-deep);
		font-variant-numeric: tabular-nums;
	}
	.sync {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		height: 26px;
		padding: 0 10px;
		border: 0;
		border-radius: 999px;
		background: color-mix(in srgb, var(--teal) 14%, transparent);
		color: var(--teal-deep);
		font-size: 12.5px;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s,
			transform 0.2s;
	}
	.sync svg {
		width: 13px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.sync.off {
		background: var(--nose);
		color: #fff;
	}
	.sync.off:hover svg {
		transform: rotate(180deg);
	}
	.sync:active {
		transform: scale(0.96);
	}
	.sync:disabled {
		opacity: 0.55;
		cursor: default;
	}
	.sync.small {
		margin-left: auto;
		align-self: center;
	}
	.now-text {
		margin: 0;
		font-family: 'Funnel Display', sans-serif;
		font-size: clamp(17px, 1.6vw, 21px);
		line-height: 1.5;
		letter-spacing: -0.01em;
		color: color-mix(in srgb, var(--ink) 40%, transparent);
		animation: passage-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
		/* A fixed height, matching the chapter list, so the page never jumps. */
		position: relative;
		height: var(--guide-h);
		overflow: hidden;
		mask-image: linear-gradient(#000 82%, transparent);
		-webkit-mask-image: linear-gradient(#000 82%, transparent);
	}
	.now-text.muted {
		font-family: 'Funnel Sans', sans-serif;
		font-size: 15px;
		color: var(--ink-soft);
		animation: none;
	}
	@keyframes passage-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}

	/* search */
	.search {
		position: relative;
		display: flex;
		align-items: center;
	}
	.search svg {
		position: absolute;
		left: 14px;
		width: 16px;
		fill: none;
		stroke: var(--ink-soft);
		stroke-width: 2.2;
		stroke-linecap: round;
		pointer-events: none;
	}
	.search input {
		height: 42px;
		width: 260px;
		padding: 0 16px 0 38px;
		border: 0;
		border-radius: 999px;
		background: var(--surface);
		box-shadow: inset 0 0 0 1px var(--rule);
		font: inherit;
		font-size: 14px;
		color: var(--ink);
		transition:
			box-shadow 0.2s,
			width 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.search input::placeholder {
		color: var(--ink-soft);
	}
	.search input:focus {
		outline: none;
		width: 320px;
		box-shadow: inset 0 0 0 1.5px var(--teal-deep);
	}
	.quotes {
		list-style: none;
		margin: -6px 0 0;
		padding: 0 8px 16px calc(36px + 168px + 32px + 8px);
		display: grid;
		gap: 2px;
	}
	.quotes button {
		display: grid;
		grid-template-columns: 64px 1fr;
		gap: 8px;
		width: 100%;
		padding: 7px 10px;
		border: 0;
		border-radius: 8px;
		background: none;
		text-align: left;
		cursor: pointer;
		font-size: 14px;
		line-height: 1.5;
		transition: background 0.2s;
	}
	.quotes button:hover {
		background: var(--teal-wash);
	}
	.quotes .t {
		color: var(--teal-deep);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.quotes .q {
		color: var(--ink-soft);
	}
	.quotes mark {
		background: color-mix(in srgb, var(--nose) 22%, transparent);
		color: var(--ink);
		border-radius: 3px;
		padding: 0 2px;
	}
	.quotes .more {
		padding: 4px 10px 0 82px;
		font-size: 13px;
		color: var(--ink-soft);
	}
	.rows .empty {
		padding: 40px 8px;
		font-size: 16px;
		color: var(--ink-soft);
		border-bottom: 0;
	}

	/* playing bars */
	.eq {
		display: inline-flex;
		align-items: flex-end;
		gap: 3px;
		height: 22px;
	}
	.eq i {
		width: 4px;
		height: 100%;
		border-radius: 2px;
		background: var(--nose);
		transform-origin: bottom;
		animation: bounce 0.9s ease-in-out infinite;
	}
	.eq i:nth-child(2) {
		animation-delay: -0.3s;
	}
	.eq i:nth-child(3) {
		animation-delay: -0.6s;
	}
	.eq.small {
		height: 13px;
		gap: 2px;
		margin-right: 8px;
	}
	.eq.small i {
		width: 3px;
	}
	@keyframes bounce {
		0%,
		100% {
			transform: scaleY(0.3);
		}
		50% {
			transform: scaleY(1);
		}
	}

	/* ---------- episode list ---------- */
	.episodes {
		margin-top: clamp(48px, 7vw, 96px);
	}
	.list-head {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: end;
		gap: 16px;
		padding-bottom: 18px;
		border-bottom: 1.5px solid var(--ink);
	}
	.list-head h2,
	.extras h2 {
		margin: 0;
		font-family: 'Funnel Display', sans-serif;
		font-weight: 700;
		font-size: clamp(28px, 3vw, 40px);
		letter-spacing: -0.03em;
		line-height: 1;
	}
	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		align-items: center;
	}
	.seg {
		--i: 0;
		position: relative;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		padding: 4px;
		border-radius: 999px;
		background: var(--surface);
		box-shadow: inset 0 0 0 1px var(--rule);
	}
	.seg .pill {
		position: absolute;
		top: 4px;
		bottom: 4px;
		left: 4px;
		width: calc((100% - 8px) / 3);
		border-radius: 999px;
		background: var(--ink);
		transform: translateX(calc(var(--i) * 100%));
		transition: transform 0.35s cubic-bezier(0.3, 1.3, 0.5, 1);
	}
	.seg button {
		position: relative;
		z-index: 1;
		border: 0;
		background: none;
		padding: 8px 16px;
		border-radius: 999px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.25s;
	}
	.seg button.on {
		color: var(--paper);
	}
	.seg .n {
		opacity: 0.55;
		font-variant-numeric: tabular-nums;
		margin-left: 2px;
	}
	.sort select {
		appearance: none;
		height: 42px;
		padding: 0 38px 0 16px;
		border-radius: 999px;
		border: 0;
		box-shadow: inset 0 0 0 1px var(--rule);
		background: var(--surface)
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300707a' stroke-width='2.4' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")
			no-repeat right 14px center / 14px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
	}

	.rows {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.rows li {
		border-bottom: 1px solid var(--rule);
	}
	.row {
		position: relative;
		display: grid;
		grid-template-columns: 36px 168px minmax(0, 1.2fr) minmax(0, 1fr) 96px;
		align-items: center;
		gap: 16px;
		width: 100%;
		padding: 20px 8px;
		background: none;
		border: 0;
		text-align: left;
		cursor: pointer;
		border-radius: 0;
		transition: background 0.25s;
	}
	.row:hover {
		background: var(--teal-wash);
	}
	.num {
		font-family: 'Funnel Display', sans-serif;
		font-size: 15px;
		font-weight: 600;
		color: var(--ink-soft);
		font-variant-numeric: tabular-nums;
	}
	.who {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.who .g {
		display: flex;
		align-items: center;
		font-family: 'Funnel Display', sans-serif;
		font-weight: 600;
		font-size: clamp(19px, 2vw, 24px);
		letter-spacing: -0.02em;
		line-height: 1.15;
		transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.row:hover .who .g {
		transform: translateX(6px);
	}
	.who .r {
		margin-top: 2px;
		font-size: 14px;
		color: var(--ink-soft);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	li.am .who .r::after {
		content: 'Amharic';
		margin-left: 10px;
		color: var(--fur);
		font-weight: 600;
	}
	.topics {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.topics span {
		font-size: 13px;
		padding: 4px 10px;
		border-radius: 999px;
		background: var(--surface);
		box-shadow: inset 0 0 0 1px var(--rule);
		color: var(--ink-soft);
		white-space: nowrap;
	}
	.facts {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}
	.facts .v {
		color: var(--ink-soft);
		font-size: 13px;
	}
	.go {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 40px;
		height: 40px;
		margin: -20px 0 0 -20px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: var(--nose);
		box-shadow: 0 6px 16px rgba(238, 79, 124, 0.45);
		transform: scale(0.6);
		opacity: 0;
		transition:
			transform 0.3s cubic-bezier(0.3, 1.4, 0.5, 1),
			opacity 0.2s,
			background 0.2s;
	}
	.go svg {
		width: 16px;
		fill: #fff;
		margin-left: 2px;
	}
	.row:hover .go,
	.row:focus-visible .go,
	li.current .go {
		transform: scale(1);
		opacity: 1;
	}
	li.current .num {
		color: var(--nose);
	}
	.bar {
		position: absolute;
		left: 8px;
		right: 8px;
		bottom: -1px;
		height: 2px;
		background: linear-gradient(90deg, var(--nose) calc(var(--p) * 100%), transparent 0);
	}
	.thumb {
		position: relative;
		display: block;
		aspect-ratio: 16 / 9;
		border-radius: 10px;
		overflow: hidden;
		background: var(--teal-wash);
		box-shadow: 0 0 0 1px var(--rule);
		transition: box-shadow 0.25s;
	}
	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.row:hover .thumb img {
		transform: scale(1.06);
	}
	li.current .thumb {
		box-shadow: 0 0 0 2px var(--nose);
	}
	.len {
		position: absolute;
		right: 6px;
		bottom: 6px;
		padding: 2px 6px;
		border-radius: 5px;
		background: rgba(4, 20, 22, 0.78);
		color: #fff;
		font-size: 11.5px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	/* ---------- extras & footer ---------- */
	.extras {
		margin-top: 72px;
	}
	.extra-row {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 16px;
		margin-top: 18px;
	}
	.extra {
		display: grid;
		gap: 8px;
		text-decoration: none;
		color: var(--ink);
	}
	.extra img {
		width: 100%;
		aspect-ratio: 16/9;
		object-fit: cover;
		border-radius: 12px;
		transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.extra:hover img {
		transform: translateY(-3px);
	}
	.extra span {
		font-weight: 600;
		font-size: 15px;
	}
	.extra small {
		color: var(--ink-soft);
		font-size: 13px;
	}
	.foot {
		margin-top: 88px;
		padding-top: 28px;
		border-top: 1px solid var(--rule);
	}
	.foot p {
		margin: 0;
		font-family: 'Funnel Display', sans-serif;
		font-size: clamp(20px, 2.4vw, 28px);
		letter-spacing: -0.02em;
		max-width: 30ch;
		line-height: 1.25;
	}
	.foot a {
		color: var(--teal-deep);
		text-decoration-thickness: 1.5px;
		text-underline-offset: 4px;
	}
	.foot .small {
		margin-top: 14px;
		font-family: 'Funnel Sans', sans-serif;
		font-size: 14px;
		letter-spacing: 0;
		color: var(--ink-soft);
		max-width: none;
	}

	/* ---------- responsive ---------- */
	@media (max-width: 960px) {
		.stage {
			grid-template-columns: 1fr;
		}
		.row {
			grid-template-columns: 32px 150px minmax(0, 1fr) auto;
		}
		.topics {
			display: none;
		}
		.quotes {
			padding-left: calc(32px + 150px + 32px + 8px);
		}
	}
	@media (max-width: 760px) {
		.hero {
			min-height: 0;
		}
		h1 {
			white-space: normal;
		}
		.hero-copy {
			max-width: none;
			padding-bottom: 0;
		}
		.hero-art {
			position: relative;
			right: auto;
			bottom: auto;
			width: min(92%, 380px);
			margin: -10px auto -14%;
		}
		.guest-ticker {
			position: relative;
			left: auto;
			bottom: auto;
			padding: 0 24px 20px;
			z-index: 2;
		}
	}
	@media (max-width: 560px) {
		.row {
			grid-template-columns: 120px minmax(0, 1fr);
			gap: 12px;
			padding: 14px 4px;
		}
		.num,
		.facts {
			display: none;
		}
		.quotes {
			padding-left: 0;
		}
		.search,
		.search input,
		.search input:focus {
			width: 100%;
		}
		.list-head {
			flex-direction: column;
			align-items: stretch;
		}
		.seg button {
			padding: 8px 10px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pod :global(*),
		.pod :global(*::before) {
			animation-duration: 0.001ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.001ms !important;
		}
		.hero-art img {
			transform: none;
		}
	}
</style>
