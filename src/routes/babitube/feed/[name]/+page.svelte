<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ListVideo from '@lucide/svelte/icons/list-video';
	import VideoGrid from '../../../../components/babitube_components/video_grid.svelte';
	import {
		avatarColor,
		channelHref,
		clearHistory,
		compactNumber,
		initial,
		itemToVideo,
		latestAt,
		loadPlaylistContents,
		reactionTotal,
		readHistory,
		thumb,
		timeAgo,
		type TubePlaylist,
		type TubePlaylistContents,
		type TubeVideo
	} from '$lib/babitube/utils';
	import { clearSaved, prefs, watchLater } from '$lib/babitube/prefs.svelte';

	let { data } = $props();

	const TITLES: Record<string, string> = {
		shorts: 'Shorts',
		channels: 'Subscriptions',
		playlists: 'Playlists',
		mine: 'My videos',
		history: 'History',
		popular: 'Most reacted',
		'watch-later': 'Watch later'
	};

	const name = $derived(page.params.name ?? '');
	const videos = $derived(data.babitube.videos);

	let history = $state<string[]>([]);
	let contents = $state<Record<string, TubePlaylistContents>>({});
	$effect(() => {
		name;
		history = readHistory();
	});

	// Saved and watched videos may only exist inside a playlist, not in the main catalog.
	$effect(() => {
		if (name === 'history' || name === 'watch-later') {
			loadPlaylistContents().then((c) => (contents = c));
		}
	});

	const byId = $derived.by(() => {
		const map = new Map<string, TubeVideo>();
		for (const list of Object.values(contents)) {
			for (const item of list.items) map.set(item.id, itemToVideo(item));
		}
		for (const v of videos) map.set(v.id, v);
		return map;
	});

	const shown = $derived.by(() => {
		if (name === 'shorts') return videos.filter((v) => v.cats.includes('shorts'));
		if (name === 'mine') return videos.filter((v) => v.cats.includes('my-channel'));
		if (name === 'popular') return videos.toSorted((a, b) => reactionTotal(b) - reactionTotal(a));
		if (name === 'history') return history.flatMap((id) => byId.get(id) ?? []);
		if (name === 'watch-later') return watchLater.ids.flatMap((id) => byId.get(id) ?? []);
		return [];
	});

	type ChannelRow = {
		name: string;
		subs?: number;
		count: number;
		views: number;
		discussion: number;
		lastAt: number;
	};
	const CHANNEL_SORTS: { key: string; label: string; compare: (a: ChannelRow, b: ChannelRow) => number }[] = [
		{ key: 'videos', label: 'Most videos', compare: (a, b) => b.count - a.count || b.lastAt - a.lastAt },
		{ key: 'subscribers', label: 'Most subscribers', compare: (a, b) => (b.subs ?? -1) - (a.subs ?? -1) },
		{ key: 'recent', label: 'Recently shared', compare: (a, b) => b.lastAt - a.lastAt },
		{ key: 'views', label: 'Most views', compare: (a, b) => b.views - a.views },
		{ key: 'comments', label: 'Most commented', compare: (a, b) => b.discussion - a.discussion },
		{ key: 'name', label: 'Name (A to Z)', compare: (a, b) => a.name.replace(/^@/, '').localeCompare(b.name.replace(/^@/, '')) }
	];
	const channelSort = $derived(page.url.searchParams.get('sort') ?? 'videos');

	function setChannelSort(value: string) {
		const url = new URL(page.url);
		if (value === 'videos') url.searchParams.delete('sort');
		else url.searchParams.set('sort', value);
		goto(url, { keepFocus: true, noScroll: true, replaceState: true });
	}

	// Every channel that has a shared video, plus channels only ever linked directly.
	const channels = $derived.by(() => {
		const groups = new Map<
			string,
			{
				name: string;
				img?: string;
				subs?: number;
				count: number;
				views: number;
				discussion: number;
				lastAt: number;
				href: string;
				external: boolean;
			}
		>();
		for (const v of videos) {
			if (!v.channel) continue;
			const entry = groups.get(v.channel);
			if (entry) {
				entry.count += 1;
				entry.views += v.views ?? 0;
				entry.discussion += v.discussion ?? 0;
				entry.lastAt = Math.max(entry.lastAt, latestAt(v));
			} else {
				groups.set(v.channel, {
					name: v.channel,
					img: v.channelImg,
					subs: v.subs,
					count: 1,
					views: v.views ?? 0,
					discussion: v.discussion ?? 0,
					lastAt: latestAt(v),
					href: channelHref(v.channel),
					external: false
				});
			}
		}
		const withVideos = [...groups.values()];
		const linkedOnly = data.babitube.channels
			.filter((c) => !c.own && !groups.has(c.name))
			.map((c) => ({
				name: c.name,
				img: c.img,
				subs: c.subs,
				count: 0,
				views: 0,
				discussion: 0,
				lastAt: c.lastAt,
				href: c.url,
				external: true
			}));
		const compare = CHANNEL_SORTS.find((s) => s.key === channelSort)?.compare ?? CHANNEL_SORTS[0].compare;
		return [...withVideos, ...linkedOnly].sort(compare);
	});

	function playlistThumb(p: TubePlaylist) {
		return p.thumb ?? null;
	}

	function fromVideoThumb(p: TubePlaylist) {
		const match = videos.find((v) => v.list === p.id);
		return match ? thumb(match.id) : null;
	}
</script>

<svelte:head>
	<title>{TITLES[name] ?? 'Feed'} • BabiTube</title>
</svelte:head>

<div class="feed">
	<div class="head">
		<h1>{TITLES[name] ?? 'Page not found'}</h1>
		{#if name === 'history' && history.length}
			<button
				class="clear"
				onclick={() => {
					clearHistory();
					history = [];
				}}
			>
				Clear all watch history
			</button>
		{/if}
		{#if name === 'channels'}
			<div class="channel-controls">
				<span>{channels.length.toLocaleString('en-US')} channels</span>
				<select
					aria-label="Sort channels"
					value={channelSort}
					onchange={(e) => setChannelSort(e.currentTarget.value)}
				>
					{#each CHANNEL_SORTS as option}
						<option value={option.key}>{option.label}</option>
					{/each}
				</select>
			</div>
		{/if}
		{#if name === 'watch-later' && watchLater.ids.length}
			<button class="clear" onclick={clearSaved}>Remove all</button>
		{/if}
	</div>

	{#if name === 'channels'}
		<div class="channel-grid">
			{#each channels as channel (channel.name + channel.href)}
				<a
					class="channel"
					href={channel.href}
					target={channel.external ? '_blank' : undefined}
					rel={channel.external ? 'noopener' : undefined}
				>
					<span class="avatar">
						{#if channel.img}
							<img src={channel.img} alt="" loading="lazy" referrerpolicy="no-referrer" />
						{:else}
							<span style:background={avatarColor(channel.name)}>{initial(channel.name)}</span>
						{/if}
					</span>
					<strong>{channel.name}</strong>
					{#if channel.subs != null}<small>{compactNumber(channel.subs)} subscribers</small>{/if}
					<small>
						{#if channel.count}
							{channel.count}
							{channel.count === 1 ? 'video' : 'videos'} shared
						{:else}
							Linked channel
						{/if}
					</small>
				</a>
			{/each}
		</div>
	{:else if name === 'playlists'}
		<div
			class="playlist-grid"
			class:set-columns={prefs.columns > 0}
			style:--columns={prefs.columns}
		>
			{#each data.babitube.playlists as playlist (playlist.id)}
				{@const image = playlistThumb(playlist) ?? fromVideoThumb(playlist)}
				<a class="playlist" href="/babitube/watch?list={playlist.id}">
					<span class="stack">
						<span class="stack-thumb">
							{#if image}<img src={image} alt="" loading="lazy" />{/if}
							<span class="count">
								<ListVideo size={16} strokeWidth={1.5} />
								{playlist.count != null ? `${playlist.count} videos` : 'Playlist'}
							</span>
						</span>
					</span>
					<strong>{playlist.title}</strong>
					<small>
						{playlist.channel ?? 'Playlist'} • Shared {timeAgo(latestAt(playlist))}
					</small>
				</a>
			{/each}
		</div>
	{:else if name in TITLES}
		{#if shown.length}
			<VideoGrid videos={shown} />
		{:else}
			<p class="empty">
				{#if name === 'history'}
					Videos you watch here will show up in this list.
				{:else if name === 'watch-later'}
					Videos you save will show up here. They're stored in this browser only.
				{:else}
					Nothing here yet.
				{/if}
			</p>
		{/if}
	{:else}
		<p class="empty">This page isn't available.</p>
	{/if}
</div>

<style>
	.feed {
		padding: 24px 24px 48px;
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 24px;
	}
	h1 {
		font-size: 36px;
		line-height: 50px;
		font-weight: 700;
	}
	.clear {
		height: 36px;
		padding: 0 16px;
		border-radius: 18px;
		background: var(--chip);
		color: var(--text);
		font-weight: 500;
		cursor: pointer;
	}
	.clear:hover {
		background: var(--hover-strong);
	}
	.channel-controls {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--text-2);
	}
	select {
		height: 32px;
		padding: 0 8px;
		border-radius: 8px;
		background: var(--chip);
		color: var(--text);
		font-weight: 500;
		cursor: pointer;
	}
	select:hover {
		background: var(--hover-strong);
	}
	option {
		background: var(--bg-raised);
		color: var(--text);
	}
	.channel-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 32px 16px;
	}
	.channel {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 8px;
		border-radius: 12px;
		text-align: center;
		min-width: 0;
	}
	.channel:hover {
		background: var(--hover);
	}
	.avatar {
		width: 120px;
		height: 120px;
		margin-bottom: 12px;
		border-radius: 50%;
		overflow: hidden;
	}
	.avatar img,
	.avatar > span {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		object-fit: cover;
		color: #fff;
		font-size: 48px;
		font-weight: 500;
	}
	.channel strong {
		max-width: 100%;
		font-size: 16px;
		line-height: 22px;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	small {
		font-size: 12px;
		line-height: 18px;
		color: var(--text-2);
	}
	.playlist-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
		gap: 32px 16px;
	}
	.playlist-grid.set-columns {
		grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
	}
	.playlist {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.stack {
		position: relative;
		display: block;
		padding-top: 8px;
		margin-bottom: 12px;
	}
	/* The two layered edges behind a playlist thumbnail */
	.stack::before {
		content: '';
		position: absolute;
		top: 0;
		left: 16px;
		right: 16px;
		height: 20px;
		border-radius: 12px 12px 0 0;
		background: var(--hover-strong);
	}
	.stack-thumb {
		position: relative;
		display: block;
		aspect-ratio: 16 / 9;
		border-radius: 12px;
		overflow: hidden;
		background: var(--placeholder);
	}
	.stack-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.count {
		position: absolute;
		right: 8px;
		bottom: 8px;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 1px 6px;
		border-radius: 4px;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 12px;
		line-height: 18px;
		font-weight: 500;
	}
	.playlist strong {
		font-size: 16px;
		line-height: 22px;
		font-weight: 500;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 4px;
	}
	.empty {
		padding: 64px 0;
		text-align: center;
		color: var(--text-2);
	}
	@media (max-width: 900px) {
		.playlist-grid.set-columns {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.playlist-grid.set-columns {
			grid-template-columns: minmax(0, 1fr);
		}
		.feed {
			padding: 16px 12px 32px;
		}
		h1 {
			font-size: 24px;
			line-height: 32px;
		}
		.channel-grid {
			grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		}
		.avatar {
			width: 88px;
			height: 88px;
		}
	}
</style>
