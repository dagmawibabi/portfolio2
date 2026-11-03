<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { untrack } from 'svelte';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
	import Repeat from '@lucide/svelte/icons/repeat';
	import Repeat2 from '@lucide/svelte/icons/repeat-2';
	import Send from '@lucide/svelte/icons/send';
	import Share2 from '@lucide/svelte/icons/share-2';
	import Shuffle from '@lucide/svelte/icons/shuffle';
	import ThumbsUp from '@lucide/svelte/icons/thumbs-up';
	import X from '@lucide/svelte/icons/x';
	import PostComments from '../../../components/babitube_components/post_comments.svelte';
	import RichText from '../../../components/babitube_components/rich_text.svelte';
	import VideoCard from '../../../components/babitube_components/video_card.svelte';
	import { isSaved, logo, prefs, toggleSaved, ui } from '$lib/babitube/prefs.svelte';
	import {
		avatarColor,
		categoryLabel,
		channelHref,
		compactNumber,
		formatDuration,
		formatPostDate,
		initial,
		itemToVideo,
		linkify,
		loadPlaylistContents,
		postUrl,
		pushHistory,
		seededRandom,
		startSeconds,
		thumb,
		timeAgo,
		youtubeUrl,
		type TubePlaylistContents,
		type TubePost
	} from '$lib/babitube/utils';

	let { data } = $props();

	let contents = $state<Record<string, TubePlaylistContents> | null>(null);
	let descriptions = $state<Record<string, string>>({});
	let expanded = $state(false);
	let copied = $state(false);
	let filter = $state<'all' | 'channel'>('all');
	let loop = $state(false);
	let shuffle = $state(false);
	let rowsEl = $state<HTMLElement>();
	let playerEl = $state<HTMLElement>();
	let mini = $state(false);
	let osd = $state('');
	let osdTimer: ReturnType<typeof setTimeout>;
	let player: any;
	let resume = $state<{ id: string | null; at: number } | null>(null);

	const listId = $derived(page.url.searchParams.get('list'));
	const playlist = $derived(listId && contents ? contents[listId] : undefined);
	const items = $derived(playlist?.items ?? []);
	const currentId = $derived(page.url.searchParams.get('v') ?? items[0]?.id ?? null);
	const position = $derived(items.findIndex((i) => i.id === currentId));

	const catalogPlaylist = $derived(
		listId ? data.babitube.playlists.find((p) => p.id === listId) : undefined
	);
	const video = $derived.by(() => {
		if (!currentId) return undefined;
		const inCatalog = data.babitube.videos.find((v) => v.id === currentId);
		if (inCatalog) return inCatalog;
		const inList = items[position];
		return inList ? itemToVideo(inList) : undefined;
	});
	const item = $derived(video ?? catalogPlaylist);
	const title = $derived(item?.title ?? playlist?.title);

	const embed = $derived.by(() => {
		const params = new URLSearchParams({
			autoplay: untrack(() => prefs.autoplay) || resume?.id === currentId ? '1' : '0',
			rel: '0',
			enablejsapi: '1',
			origin: page.url.origin
		});
		if (currentId) {
			if (prefs.captions) params.set('cc_load_policy', '1');
			const start = resume?.id === currentId ? resume.at : startSeconds(video?.start);
			if (start) params.set('start', String(start));
			// Lists we have contents for are driven by the panel; others fall back to YouTube's own.
			if (listId && contents && !items.length) params.set('list', listId);
			return `https://www.youtube-nocookie.com/embed/${currentId}?${params}`;
		}
		if (listId && contents) {
			params.set('list', listId);
			return `https://www.youtube-nocookie.com/embed/videoseries?${params}`;
		}
		return null;
	});

	// A video shared on its own keeps its post; one found inside a playlist shows the playlist's post.
	const posts = $derived<TubePost[]>(
		[...(video?.posts.length ? video.posts : (catalogPlaylist?.posts ?? []))].sort(
			(a, b) => b.at - a.at
		)
	);
	const tags = $derived([...new Set(posts.flatMap((p) => p.tags ?? []))]);
	const firstShared = $derived(posts[posts.length - 1]);
	const cats = $derived(item?.cats.length ? item.cats : (catalogPlaylist?.cats ?? []));
	const description = $derived(currentId ? descriptions[currentId] : undefined);

	const upNext = $derived.by(() => {
		const inList = new Set(items.map((i) => i.id));
		const others = data.babitube.videos.filter(
			(v) => v.id !== currentId && !v.missing && !inList.has(v.id)
		);
		if (filter === 'channel' && item?.channel) {
			return others.filter((v) => v.channel === item.channel).slice(0, 24);
		}
		const shared = new Set(cats);
		return others
			.map((v) => {
				const overlap = v.cats.filter((c) => shared.has(c)).length;
				const sameChannel = v.channel && v.channel === item?.channel ? 1 : 0;
				return { v, score: overlap + sameChannel + seededRandom(`${currentId}${v.id}`) * 3 };
			})
			.sort((a, b) => b.score - a.score)
			.slice(0, 24)
			.map(({ v }) => v);
	});

	// Creators list chapters as timestamps in the description, and the embed API doesn't expose them.
	const chapters = $derived.by(() => {
		const found: number[] = [];
		for (const line of (description ?? '').split('\n')) {
			const m = line.match(/^\s*\(?(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\b/);
			if (m) found.push(Number(m[1] ?? 0) * 3600 + Number(m[2]) * 60 + Number(m[3]));
		}
		return found.length > 1 ? found.sort((a, b) => a - b) : [];
	});

	const showSuggestions = $derived(!prefs.hideSuggestions);
	const hasAside = $derived(items.length > 0 || showSuggestions);

	$effect(() => {
		if (currentId) pushHistory(currentId);
		expanded = false;
		filter = 'all';
	});

	$effect(() => {
		fetch('/babitube-data/descriptions.json')
			.then((r) => r.json())
			.then((d) => (descriptions = d))
			.catch(() => {});
		loadPlaylistContents().then((c) => (contents = c));
	});

	// Keep the playing row in view without moving the page itself.
	$effect(() => {
		currentId;
		const active = rowsEl?.querySelector<HTMLElement>('.row.active');
		if (rowsEl && active) rowsEl.scrollTop = active.offsetTop - rowsEl.offsetTop;
	});

	function nextInList() {
		if (shuffle && items.length > 1) {
			const others = items.filter((i) => i.id !== currentId);
			return others[Math.floor(Math.random() * others.length)];
		}
		return items[position + 1] ?? (loop ? items[0] : undefined);
	}

	function onEnded() {
		if (items.length) {
			const next = nextInList();
			if (next) goto(`/babitube/watch?v=${next.id}&list=${listId}`);
		} else if (prefs.playNext && upNext[0]) {
			goto(`/babitube/watch?v=${upNext[0].id}`);
		}
	}

	function say(message: string) {
		osd = message;
		clearTimeout(osdTimer);
		osdTimer = setTimeout(() => (osd = ''), 900);
	}

	function seekBy(seconds: number) {
		player.seekTo(Math.max(0, player.getCurrentTime() + seconds), true);
		say(`${seconds > 0 ? '+' : ''}${seconds}s`);
	}

	function togglePlay() {
		if (player.getPlayerState() === 1) player.pauseVideo();
		else player.playVideo();
	}

	function changeVolume(delta: number) {
		const volume = Math.min(100, Math.max(0, player.getVolume() + delta));
		player.setVolume(volume);
		if (player.isMuted()) player.unMute();
		say(`Volume ${volume}%`);
	}

	function changeRate(direction: number) {
		const rates: number[] = player.getAvailablePlaybackRates();
		const next = rates[rates.indexOf(player.getPlaybackRate()) + direction];
		if (next) {
			player.setPlaybackRate(next);
			say(`${next}x`);
		}
	}

	function stepFrame(direction: number) {
		// YouTube only steps frames while paused, and doesn't report the frame rate; assume 30fps.
		if (player.getPlayerState() === 2) {
			player.seekTo(Math.max(0, player.getCurrentTime() + direction / 30), true);
		}
	}

	function seekChapter(direction: number) {
		if (!chapters.length) return;
		const now = player.getCurrentTime();
		const target =
			direction > 0
				? chapters.find((c) => c > now + 1)
				: chapters.findLast((c) => c < now - 3);
		if (target !== undefined) player.seekTo(target, true);
	}

	// YouTube's captions API doesn't reliably report tracks in embeds, so captions are a player
	// setting: changing it reloads the player, picking up where the video was.
	function toggleCaptions() {
		resume = { id: currentId, at: Math.floor(player.getCurrentTime()) };
		prefs.captions = !prefs.captions;
		say(prefs.captions ? 'Captions on' : 'Captions off');
	}

	function goNext() {
		const next = items.length ? nextInList() : upNext[0];
		if (next) goto(`/babitube/watch?v=${next.id}${items.length ? `&list=${listId}` : ''}`);
	}

	function goPrevious() {
		const previous = items[position - 1];
		if (previous) goto(`/babitube/watch?v=${previous.id}&list=${listId}`);
		else history.back();
	}

	function toggleFullscreen() {
		if (document.fullscreenElement) document.exitFullscreen();
		else playerEl?.requestFullscreen();
	}

	function onKeydown(e: KeyboardEvent) {
		if (ui.shortcutsOpen || e.defaultPrevented) return;
		const target = e.target as HTMLElement;
		if (target.closest?.('input, textarea, select, [contenteditable]')) return;
		if (e.key === 'Escape') {
			mini = false;
			return;
		}
		if (e.altKey || e.metaKey) return;

		const actions: Record<string, () => void> = {
			f: toggleFullscreen,
			t: () => {
				prefs.theater = !prefs.theater;
				mini = false;
			},
			i: () => (mini = !mini),
			N: goNext,
			P: goPrevious
		};
		// These need the player itself, which isn't there until YouTube's script has loaded.
		if (player?.getPlayerState) {
			Object.assign(actions, {
				k: togglePlay,
				j: () => seekBy(-10),
				l: () => seekBy(10),
				ArrowLeft: () => seekBy(-5),
				ArrowRight: () => seekBy(5),
				m: () => {
					// isMuted() only updates after the player has processed the change.
					const muted = player.isMuted();
					if (muted) player.unMute();
					else player.mute();
					say(muted ? 'Unmuted' : 'Muted');
				},
				c: toggleCaptions,
				'<': () => changeRate(-1),
				'>': () => changeRate(1),
				',': () => stepFrame(-1),
				'.': () => stepFrame(1)
			});
			if (!target.closest?.('button, a')) actions[' '] = togglePlay;
			// Past the player these keep their usual job of scrolling the page.
			if (mini || (playerEl?.getBoundingClientRect().bottom ?? 0) > 120) {
				actions.ArrowUp = () => changeVolume(5);
				actions.ArrowDown = () => changeVolume(-5);
			}
			if (/^[0-9]$/.test(e.key)) {
				actions[e.key] = () => player.seekTo((player.getDuration() * Number(e.key)) / 10, true);
			}
		}

		if (e.ctrlKey) {
			if (player?.getPlayerState && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
				seekChapter(e.key === 'ArrowRight' ? 1 : -1);
				e.preventDefault();
			}
			return;
		}
		const action = actions[e.key];
		if (action) {
			action();
			e.preventDefault();
		}
	}

	/** Listens for the video ending through YouTube's player API. Without it, only auto-advance is lost. */
	function watchForEnd(iframe: HTMLIFrameElement) {
		const w = window as any;
		let stopped = false;
		const attach = () => {
			if (stopped) return;
			player = new w.YT.Player(iframe, {
				events: {
					onStateChange: (e: { data: number }) => {
						if (e.data === 0) onEnded();
					}
				}
			});
		};
		if (w.YT?.Player) {
			attach();
		} else {
			const previous = w.onYouTubeIframeAPIReady;
			w.onYouTubeIframeAPIReady = () => {
				previous?.();
				attach();
			};
			if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
				const script = document.createElement('script');
				script.src = 'https://www.youtube.com/iframe_api';
				document.head.append(script);
			}
		}
		return {
			destroy() {
				stopped = true;
				player = undefined;
			}
		};
	}

	async function share() {
		await navigator.clipboard?.writeText(page.url.href);
		copied = true;
		setTimeout(() => (copied = false), 1800);
	}
</script>

<svelte:window onkeydown={onKeydown} />

<svelte:head>
	<title>{title ?? 'Watch'} • BabiTube</title>
</svelte:head>

{#snippet channelAvatar(name: string | undefined, img: string | undefined, size: number)}
	<span class="avatar" style:width="{size}px" style:height="{size}px">
		{#if img}
			<img src={img} alt="" referrerpolicy="no-referrer" />
		{:else}
			<span style:background={name ? avatarColor(name) : '#717171'}>{name ? initial(name) : '?'}</span>
		{/if}
	</span>
{/snippet}

<div class="watch" class:solo={!hasAside} class:theater={prefs.theater}>
	<div class="player-slot">
		<div class="player" class:mini bind:this={playerEl}>
			{#if embed}
				{#key embed}
					<iframe
						src={embed}
						title={title ?? 'Video player'}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
						use:watchForEnd
					></iframe>
				{/key}
			{/if}
			{#if osd}<div class="osd" role="status">{osd}</div>{/if}
			{#if mini}
				<button class="mini-close" aria-label="Close miniplayer" onclick={() => (mini = false)}>
					<X size={20} strokeWidth={1.5} />
				</button>
			{/if}
		</div>
	</div>

	<div class="primary">
		{#if title}
			<div class="info">
				<h1>{title}</h1>

				<div class="actions-row">
					<div class="owner">
						{#if item?.channel}
							<a href={channelHref(item.channel)} aria-hidden="true" tabindex="-1">
								{@render channelAvatar(item.channel, video?.channelImg, 40)}
							</a>
							<div class="owner-text">
								<a class="owner-name" href={channelHref(item.channel)}>{item.channel}</a>
								{#if video?.subs != null}
									<p>{compactNumber(video.subs)} subscribers</p>
								{/if}
							</div>
							{#if item.channelUrl}
								<a class="pill subscribe" href={item.channelUrl} target="_blank" rel="noopener">
									Subscribe
								</a>
							{/if}
						{:else if playlist?.channel}
							{@render channelAvatar(playlist.channel, undefined, 40)}
							<div class="owner-text"><span class="owner-name">{playlist.channel}</span></div>
						{:else}
							{@render channelAvatar(undefined, undefined, 40)}
							<div class="owner-text"><span class="owner-name">Unavailable on YouTube</span></div>
						{/if}
					</div>

					<div class="buttons">
						{#if currentId && !video?.missing}
							<a
								class="pill"
								href={youtubeUrl(currentId)}
								target="_blank"
								rel="noopener"
								title="Like on YouTube"
							>
								<ThumbsUp size={20} strokeWidth={1.5} />
								{video?.likes != null && !prefs.hideLikes ? compactNumber(video.likes) : 'Like'}
							</a>
						{/if}
						<button class="pill" onclick={share}>
							<Share2 size={20} strokeWidth={1.5} />
							{copied ? 'Copied' : 'Share'}
						</button>
						{#if currentId}
							<button class="pill" aria-pressed={isSaved(currentId)} onclick={() => toggleSaved(currentId)}>
								{#if isSaved(currentId)}
									<BookmarkCheck size={20} strokeWidth={1.5} /> Saved
								{:else}
									<Bookmark size={20} strokeWidth={1.5} /> Save
								{/if}
							</button>
						{/if}
						{#if posts[0]}
							<a class="pill" href={postUrl(posts[0].id)} target="_blank" rel="noopener">
								<Send size={20} strokeWidth={1.5} /> Telegram
							</a>
						{/if}
					</div>
				</div>

				{#if !prefs.hideDescription}
					<div class="description">
						<p class="stats">
							{#if video?.views != null && !prefs.hideViews}
								<span>{compactNumber(video.views)} views</span>
							{/if}
							{#if video?.published}
								<span>{formatPostDate(video.published)}</span>
							{/if}
							{#if firstShared}<span>Shared {formatPostDate(firstShared.local, true)}</span>{/if}
							{#if video?.category}<span>{video.category}</span>{/if}
						</p>
						{#if cats.length || tags.length}
							<p class="tag-line">
								{#each cats as cat}
									<a href="/babitube?c={cat}">{categoryLabel(cat)}</a>
								{/each}
								{#each tags as tag}
									<a href="/babitube/results?search_query={encodeURIComponent(tag)}">#{tag}</a>
								{/each}
							</p>
						{/if}
						{#if description}
							<div class="text" class:clamped={!expanded}><RichText segments={linkify(description)} /></div>
							<button class="more" onclick={() => (expanded = !expanded)}>
								{expanded ? 'Show less' : '...more'}
							</button>
						{/if}
					</div>
				{/if}

				{#if !prefs.hideComments && posts.length}
					<section class="comments">
						<h2>{posts.length} {posts.length === 1 ? 'Post' : 'Posts'} on Telegram</h2>
						{#each posts as post (post.id)}
							<article class="comment">
								<img class="comment-avatar" src={logo()} alt="" width="40" height="40" />
								<div class="comment-body">
									<p class="comment-head">
										<a href={postUrl(post.id)} target="_blank" rel="noopener">@Dagmawi_Babi</a>
										<span title={formatPostDate(post.local, true)}>{timeAgo(post.at)}</span>
										{#if post.fwd}
											<span class="forwarded">
												<Repeat2 size={14} strokeWidth={1.5} />
												{typeof post.fwd === 'string' ? `Forwarded from ${post.fwd}` : 'Forwarded'}
											</span>
										{/if}
									</p>
									{#if post.rich?.length}<div class="comment-text"><RichText segments={post.rich} /></div>{/if}
									<div class="comment-foot">
										{#each post.rx ?? [] as [emoji, count]}
											<span class="reaction">{emoji} {count}</span>
										{/each}
										<a href={postUrl(post.id)} target="_blank" rel="noopener">View post</a>
									</div>
								</div>
							</article>
						{/each}
					</section>
					<PostComments postIds={posts.map((p) => p.id)} />
				{/if}
			</div>
		{:else if contents && !embed}
			<p class="empty">This video isn't in the archive.</p>
		{/if}
	</div>

	{#if hasAside}
		<aside class="secondary">
			{#if items.length}
				<section class="panel" aria-label="Playlist">
					<header>
						<div class="panel-title">
							<h2>{playlist?.title ?? title}</h2>
							<p>
								{#if playlist?.channel}{playlist.channel}{' - '}{/if}{position + 1} / {items.length}
							</p>
						</div>
						<a
							class="panel-btn"
							href={currentId ? `/babitube/watch?v=${currentId}` : '/babitube'}
							aria-label="Close playlist"
						>
							<X size={24} strokeWidth={1.5} />
						</a>
					</header>
					<div class="panel-actions">
						<button
							class="panel-btn"
							class:on={loop}
							aria-label="Loop playlist"
							aria-pressed={loop}
							onclick={() => (loop = !loop)}
						>
							<Repeat size={22} strokeWidth={1.5} />
						</button>
						<button
							class="panel-btn"
							class:on={shuffle}
							aria-label="Shuffle playlist"
							aria-pressed={shuffle}
							onclick={() => (shuffle = !shuffle)}
						>
							<Shuffle size={22} strokeWidth={1.5} />
						</button>
					</div>
					<div class="rows" bind:this={rowsEl}>
						{#each items as row, i (row.id + i)}
							<a
								class="row"
								class:active={row.id === currentId}
								href="/babitube/watch?v={row.id}&list={listId}"
								aria-current={row.id === currentId ? 'true' : undefined}
							>
								<span class="index">{row.id === currentId ? '▶' : i + 1}</span>
								<span class="row-thumb">
									<img src={thumb(row.id)} alt="" loading="lazy" decoding="async" />
									{#if row.duration}<span class="badge">{formatDuration(row.duration)}</span>{/if}
								</span>
								<span class="row-text">
									<strong>{row.title}</strong>
									{#if row.channel}<small>{row.channel}</small>{/if}
								</span>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			{#if showSuggestions}
				{#if item?.channel}
					<div class="next-chips">
						<button class:active={filter === 'all'} onclick={() => (filter = 'all')}>All</button>
						<button class:active={filter === 'channel'} onclick={() => (filter = 'channel')}>
							From {item.channel}
						</button>
					</div>
				{/if}
				<div class="next-list">
					{#each upNext as next (next.id)}
						<VideoCard video={next} layout="compact" />
					{/each}
				</div>
			{/if}
		</aside>
	{/if}
</div>

<style>
	.watch {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 402px;
		grid-template-rows: auto 1fr;
		grid-template-areas:
			'player aside'
			'info aside';
		gap: 0 24px;
		max-width: 1754px;
		margin: 0 auto;
		padding: 24px;
	}
	.watch.solo {
		grid-template-columns: minmax(0, 1fr);
		grid-template-areas:
			'player'
			'info';
		max-width: 1328px;
	}
	.watch.theater {
		max-width: none;
		padding-top: 0;
		grid-template-areas:
			'player player'
			'info aside';
	}
	.watch.theater.solo {
		grid-template-areas:
			'player'
			'info';
	}
	.player-slot {
		grid-area: player;
		position: relative;
		aspect-ratio: 16 / 9;
		min-width: 0;
	}
	.watch.theater .player-slot {
		aspect-ratio: auto;
		height: min(56.25vw, calc(100vh - 169px));
		margin: 0 -24px 12px;
		background: #000;
	}
	.primary {
		grid-area: info;
		min-width: 0;
	}
	.secondary {
		grid-area: aside;
		min-width: 0;
	}
	.player {
		position: absolute;
		inset: 0;
		border-radius: 12px;
		overflow: hidden;
		background: #000;
	}
	.watch.theater .player {
		border-radius: 0;
	}
	.watch .player.mini {
		position: fixed;
		inset: auto 16px 16px auto;
		width: min(400px, calc(100vw - 32px));
		aspect-ratio: 16 / 9;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		z-index: 25;
	}
	.mini-close {
		position: absolute;
		top: 8px;
		right: 8px;
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		cursor: pointer;
	}
	.osd {
		position: absolute;
		top: 12%;
		left: 50%;
		transform: translateX(-50%);
		padding: 8px 14px;
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 16px;
		font-weight: 500;
		white-space: nowrap;
		pointer-events: none;
	}
	.player iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	h1 {
		margin-top: 12px;
		font-size: 20px;
		line-height: 28px;
		font-weight: 700;
		overflow-wrap: anywhere;
	}
	.actions-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-top: 12px;
	}
	.owner {
		display: flex;
		align-items: center;
		min-width: 0;
	}
	.avatar {
		display: block;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
	}
	.avatar img,
	.avatar > span {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		object-fit: cover;
		color: #fff;
		font-size: 18px;
		font-weight: 500;
	}
	.owner-text {
		min-width: 0;
		margin: 0 24px 0 12px;
	}
	.owner-name {
		display: block;
		font-size: 16px;
		line-height: 22px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.owner-text p {
		font-size: 12px;
		line-height: 18px;
		color: var(--text-2);
	}
	.buttons {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		flex-shrink: 0;
		height: 36px;
		padding: 0 16px;
		border-radius: 18px;
		background: var(--chip);
		color: var(--text);
		font-weight: 500;
		cursor: pointer;
		white-space: nowrap;
	}
	.pill:hover {
		background: var(--hover-strong);
	}
	.subscribe {
		background: var(--chip-active-bg);
		color: var(--chip-active-text);
	}
	.subscribe:hover {
		background: var(--chip-active-bg);
		opacity: 0.85;
	}
	.description {
		margin-top: 12px;
		padding: 12px;
		border-radius: 12px;
		background: var(--chip);
	}
	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 0 8px;
		font-weight: 500;
	}
	.tag-line {
		display: flex;
		flex-wrap: wrap;
		gap: 0 8px;
		margin-top: 4px;
		color: var(--link);
	}
	.tag-line a:hover {
		text-decoration: underline;
	}
	.text {
		margin-top: 8px;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.text.clamped {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.more {
		margin-top: 4px;
		font-weight: 500;
		color: var(--text);
		cursor: pointer;
	}
	.comments {
		margin-top: 24px;
	}
	.comments h2 {
		font-size: 20px;
		line-height: 28px;
		font-weight: 700;
		margin-bottom: 24px;
	}
	.comment {
		display: flex;
		gap: 16px;
		margin-bottom: 24px;
	}
	.comment-avatar {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}
	.comment-body {
		flex: 1;
		min-width: 0;
	}
	.comment-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0 6px;
		font-size: 12px;
		line-height: 18px;
		color: var(--text-2);
	}
	.comment-head a {
		color: var(--text);
		font-weight: 500;
		font-size: 13px;
	}
	.forwarded {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.comment-text {
		margin-top: 2px;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.comment-foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		margin-top: 8px;
		font-size: 12px;
		line-height: 18px;
	}
	.reaction {
		padding: 2px 8px;
		border-radius: 12px;
		background: var(--chip);
	}
	.comment-foot a {
		padding: 2px 8px;
		color: var(--text-2);
		font-weight: 500;
	}
	.comment-foot a:hover {
		color: var(--text);
	}

	.panel {
		display: flex;
		flex-direction: column;
		max-height: min(70vh, 640px);
		margin-bottom: 16px;
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
	}
	.panel header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 8px;
		padding: 12px 8px 0 16px;
	}
	.panel-title {
		min-width: 0;
	}
	.panel-title h2 {
		font-size: 20px;
		line-height: 28px;
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.panel-title p {
		font-size: 12px;
		line-height: 18px;
		color: var(--text-2);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.panel-actions {
		display: flex;
		gap: 4px;
		padding: 4px 8px;
	}
	.panel-btn {
		flex-shrink: 0;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		color: var(--text);
		cursor: pointer;
	}
	.panel-btn:hover {
		background: var(--hover);
	}
	.panel-btn.on {
		background: var(--hover-strong);
	}
	.rows {
		position: relative;
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--hover-strong) transparent;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 8px 4px 0;
	}
	.row:hover {
		background: var(--hover);
	}
	.row.active {
		background: var(--hover-strong);
	}
	.index {
		flex: 0 0 24px;
		text-align: center;
		font-size: 12px;
		color: var(--text-2);
	}
	.row-thumb {
		position: relative;
		flex: 0 0 100px;
		height: 56px;
		border-radius: 8px;
		overflow: hidden;
		background: var(--placeholder);
	}
	.row-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.badge {
		position: absolute;
		right: 4px;
		bottom: 4px;
		padding: 0 4px;
		border-radius: 4px;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 12px;
		line-height: 16px;
		font-weight: 500;
	}
	.row-text {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}
	.row-text strong {
		font-size: 14px;
		line-height: 20px;
		font-weight: 500;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.row-text small {
		font-size: 12px;
		line-height: 18px;
		color: var(--text-2);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.next-chips {
		display: flex;
		gap: 8px;
		margin-bottom: 12px;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.next-chips button {
		flex-shrink: 0;
		max-width: 260px;
		height: 32px;
		padding: 0 12px;
		border-radius: 8px;
		background: var(--chip);
		color: var(--text);
		font-weight: 500;
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.next-chips button.active {
		background: var(--chip-active-bg);
		color: var(--chip-active-text);
	}
	.next-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.empty {
		padding: 64px 0;
		text-align: center;
		color: var(--text-2);
	}
	@media (max-width: 1016px) {
		.watch,
		.watch.theater {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto;
			grid-template-areas:
				'player'
				'info'
				'aside';
		}
	}
	@media (max-width: 640px) {
		.watch {
			padding: 0 0 24px;
		}
		.player {
			border-radius: 0;
		}
		.watch.theater .player-slot {
			margin: 0;
		}
		.info,
		.secondary {
			padding: 0 12px;
		}
		.owner {
			width: 100%;
		}
		.owner-text {
			flex: 1;
		}
	}
</style>
