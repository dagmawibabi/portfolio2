<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { untrack } from 'svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Clock from '@lucide/svelte/icons/clock';
	import Flame from '@lucide/svelte/icons/flame';
	import History from '@lucide/svelte/icons/history';
	import House from '@lucide/svelte/icons/house';
	import Info from '@lucide/svelte/icons/info';
	import Keyboard from '@lucide/svelte/icons/keyboard';
	import ListVideo from '@lucide/svelte/icons/list-video';
	import Moon from '@lucide/svelte/icons/moon';
	import Send from '@lucide/svelte/icons/send';
	import SquarePlay from '@lucide/svelte/icons/square-play';
	import Sun from '@lucide/svelte/icons/sun';
	import Users from '@lucide/svelte/icons/users';
	import X from '@lucide/svelte/icons/x';
	import Zap from '@lucide/svelte/icons/zap';
	import ShortcutsDialog from '../../components/babitube_components/shortcuts_dialog.svelte';
	import { logo, persistPrefs, prefs, resetPrefs, ui } from '$lib/babitube/prefs.svelte';
	import {
		CATEGORIES,
		TELEGRAM,
		avatarColor,
		channelHref,
		formatPostDate,
		initial,
		matchVideos,
		shuffled
	} from '$lib/babitube/utils';

	let { data, children } = $props();

	let innerWidth = $state(1400);
	let guideExpanded = $state(true);
	let drawerOpen = $state(false);
	let mobileSearch = $state(false);
	let query = $state(page.url.searchParams.get('search_query') ?? '');
	let suggesting = $state(false);

	const path = $derived<string>(page.url.pathname);
	const isWatch = $derived(path.startsWith('/babitube/watch'));
	const isWide = $derived(innerWidth >= 1312);
	const isPhone = $derived(innerWidth < 792);
	const showFullGuide = $derived(!isWatch && isWide && guideExpanded);
	const showMiniGuide = $derived(!isWatch && !isPhone && !showFullGuide);
	const contentOffset = $derived(showFullGuide ? 240 : showMiniGuide ? 72 : 0);
	const activeCategory = $derived(page.url.searchParams.get('c'));

	const suggestions = $derived(
		suggesting && query.trim().length > 1
			? matchVideos(data.babitube.videos, query)
					.slice(0, 8)
					.map((v) => v.title)
			: []
	);

	const HOME = { href: '/babitube', label: 'Home', icon: House };
	const SHORTS = { href: '/babitube/feed/shorts', label: 'Shorts', icon: Zap };
	const SUBSCRIPTIONS = { href: '/babitube/feed/channels', label: 'Subscriptions', icon: Users };
	const WATCH_LATER = { href: '/babitube/feed/watch-later', label: 'Watch later', icon: Clock };
	const you = [
		{ href: '/babitube/feed/mine', label: 'My videos', icon: SquarePlay },
		{ href: '/babitube/feed/history', label: 'History', icon: History },
		{ href: '/babitube/feed/playlists', label: 'Playlists', icon: ListVideo },
		WATCH_LATER,
		{ href: '/babitube/feed/popular', label: 'Most reacted', icon: Flame }
	];
	const primary = $derived(prefs.hideShorts ? [HOME] : [HOME, SHORTS]);
	const mini = $derived([...primary, SUBSCRIPTIONS, WATCH_LATER]);

	const SETTINGS: { heading: string; rows: { key: keyof typeof prefs; label: string }[] }[] = [
		{
			heading: 'Playback',
			rows: [
				{ key: 'autoplay', label: 'Autoplay videos' },
				{ key: 'playNext', label: 'Play next video automatically' },
				{ key: 'theater', label: 'Theater mode' }
			]
		},
		{
			heading: 'Hide',
			rows: [
				{ key: 'hideComments', label: 'Comments' },
				{ key: 'hideSuggestions', label: 'Suggested videos' },
				{ key: 'hideLikes', label: 'Like counts' },
				{ key: 'hideViews', label: 'View counts' },
				{ key: 'hideDescription', label: 'Descriptions' },
				{ key: 'hideShorts', label: 'Shorts' },
				{ key: 'hideWatched', label: 'Watched videos on Home' }
			]
		}
	];

	const COLUMN_CHOICES = [
		{ value: 0, label: 'Auto' },
		{ value: 2, label: '2' },
		{ value: 3, label: '3' },
		{ value: 4, label: '4' },
		{ value: 5, label: '5' },
		{ value: 6, label: '6' }
	];

	let profileOpen = $state(false);
	let profileEl = $state<HTMLElement>();

	// A new order every refresh and every time you move to another page.
	let shuffleRound = $state(0);
	const channels = $derived.by(() => {
		const byName = new Map<string, { name: string; img?: string }>();
		for (const v of data.babitube.videos) {
			if (v.channel && !v.cats.includes('my-channel') && !byName.has(v.channel)) {
				byName.set(v.channel, { name: v.channel, img: v.channelImg });
			}
		}
		return [...byName.values()];
	});
	const subscriptions = $derived(shuffled(channels, (c) => c.name, `subs${shuffleRound}`));

	$effect(() => {
		path;
		untrack(() => (shuffleRound += 1));
	});

	$effect(persistPrefs);

	// BabiTube keeps its own theme, so it defaults to dark without touching the rest of the site.
	$effect(() => {
		const root = document.documentElement;
		root.style.background = prefs.theme === 'dark' ? '#0f0f0f' : '#ffffff';
		root.style.colorScheme = prefs.theme;
		return () => {
			root.style.background = '';
			root.style.colorScheme = '';
		};
	});

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			if (ui.shortcutsOpen) {
				ui.shortcutsOpen = false;
				e.preventDefault();
			}
			profileOpen = false;
			return;
		}
		const target = e.target as HTMLElement;
		if (target.closest?.('input, textarea, select, [contenteditable]')) return;
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		if (e.key === '?') {
			ui.shortcutsOpen = !ui.shortcutsOpen;
			profileOpen = false;
			e.preventDefault();
		} else if (e.key === '/' && !ui.shortcutsOpen) {
			if (isPhone) mobileSearch = true;
			setTimeout(() => document.querySelector<HTMLInputElement>('.babitube input[type=search]')?.focus());
			e.preventDefault();
		}
	}

	const toggleTheme = () => (prefs.theme = prefs.theme === 'dark' ? 'light' : 'dark');

	const explore = $derived(
		CATEGORIES.filter((c) => data.babitube.meta.categoryCounts[c.key] && c.key !== 'general')
	);

	const isActive = (href: string) =>
		href === '/babitube' ? path === '/babitube' && !activeCategory : path === href;

	// Coming back Home by clicking deals a fresh feed. The Back button keeps the one you left.
	beforeNavigate(({ type, to, from }) => {
		if (type !== 'link' || to?.url.pathname !== '/babitube' || to.url.search) return;
		if (from?.url.pathname !== '/babitube' || !from.url.search) ui.feedRound += 1;
	});

	function onMenu() {
		if (!isWatch && isWide) guideExpanded = !guideExpanded;
		else drawerOpen = !drawerOpen;
	}

	function submitSearch(value = query) {
		const q = value.trim();
		suggesting = false;
		mobileSearch = false;
		if (q) goto(`/babitube/results?search_query=${encodeURIComponent(q)}`);
	}

	$effect(() => {
		path;
		activeCategory;
		drawerOpen = false;
		profileOpen = false;
	});
</script>

<svelte:head>
	<title>BabiTube • Dagmawi Babi</title>
	<meta
		name="description"
		content="Every YouTube video Dagmawi Babi has shared on Telegram, sorted into categories."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<svelte:window
	bind:innerWidth
	onclick={(e) => {
		if (profileOpen && !profileEl?.contains(e.target as Node)) profileOpen = false;
	}}
	onkeydown={onKeydown}
/>

{#snippet sectionHead(label: string, open: boolean, toggle: () => void)}
	<button class="guide-head" aria-expanded={open} onclick={toggle}>
		<span>{label}</span>
		<span class="chevron" class:open><ChevronRight size={18} strokeWidth={2} /></span>
	</button>
{/snippet}

{#snippet guideLink(item: { href: string; label: string; icon: any }, active: boolean)}
	<a class="guide-item" class:active href={item.href} aria-current={active ? 'page' : undefined}>
		<item.icon size={24} strokeWidth={active ? 2.2 : 1.5} />
		<span>{item.label}</span>
	</a>
{/snippet}

{#snippet guide()}
	<div class="guide-section">
		{#each primary as item}{@render guideLink(item, isActive(item.href))}{/each}
	</div>
	<div class="guide-section">
		{@render sectionHead('Subscriptions', prefs.openSubscriptions, () => {
			prefs.openSubscriptions = !prefs.openSubscriptions;
			shuffleRound += 1;
		})}
		{#if prefs.openSubscriptions}
			<div class="subs">
				{#each subscriptions as channel (channel.name)}
					<a class="guide-item sub" href={channelHref(channel.name)}>
						<span class="sub-avatar">
							{#if channel.img}
								<img src={channel.img} alt="" loading="lazy" referrerpolicy="no-referrer" />
							{:else}
								<span style:background={avatarColor(channel.name)}>{initial(channel.name)}</span>
							{/if}
						</span>
						<span>{channel.name}</span>
					</a>
				{/each}
			</div>
			{@render guideLink(
				{ href: SUBSCRIPTIONS.href, label: 'All subscriptions', icon: Users },
				isActive(SUBSCRIPTIONS.href)
			)}
		{/if}
	</div>
	<div class="guide-section">
		{@render sectionHead('You', prefs.openYou, () => (prefs.openYou = !prefs.openYou))}
		{#if prefs.openYou}
			{#each you as item}{@render guideLink(item, isActive(item.href))}{/each}
		{/if}
	</div>
	<div class="guide-section">
		{@render sectionHead('Explore', prefs.openExplore, () => (prefs.openExplore = !prefs.openExplore))}
		{#if prefs.openExplore}
			{#each explore as cat}
				{@render guideLink(
					{ href: `/babitube?c=${cat.key}`, label: cat.label, icon: cat.icon },
					activeCategory === cat.key
				)}
			{/each}
		{/if}
	</div>
	<div class="guide-section">
		{@render guideLink({ href: '/babitube/about', label: 'About', icon: Info }, path === '/babitube/about')}
		<a class="guide-item" href={TELEGRAM} target="_blank" rel="noopener">
			<Send size={24} strokeWidth={1.5} />
			<span>Telegram channel</span>
		</a>
	</div>
	<footer class="guide-footer">
		<p class="links">
			<a href="/babitube/about">About</a>
			<a href={TELEGRAM} target="_blank" rel="noopener">Telegram</a>
			<a href="/">Portfolio</a>
		</p>
		<p class="last-post">Last post: {formatPostDate(data.babitube.meta.exportLastPostAt)}</p>
		<p>© {new Date().getFullYear()} Dagmawi Babi</p>
		<p>Not affiliated with YouTube.</p>
	</footer>
{/snippet}

{#snippet brand()}
	<a class="logo" href="/babitube" aria-label="BabiTube home">
		<svg viewBox="0 0 30 20" width="30" height="20" aria-hidden="true">
			<rect width="30" height="20" rx="5.5" fill="#ff0033" />
			<path d="M12 5.8v8.4l7.2-4.2z" fill="#fff" />
		</svg>
		<span>BabiTube</span><sup>ET</sup>
	</a>
{/snippet}

<div class="babitube" class:dark={prefs.theme === 'dark'}>
	<header class="masthead">
		{#if mobileSearch}
			<button class="icon-btn" aria-label="Close search" onclick={() => (mobileSearch = false)}>
				<ArrowLeft size={24} strokeWidth={1.5} />
			</button>
		{:else}
			<div class="start">
				<button class="icon-btn" aria-label="Guide" onclick={onMenu}>
					<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
						<path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z" />
					</svg>
				</button>
				{@render brand()}
			</div>
		{/if}

		{#if !isPhone || mobileSearch}
			<form
				class="center"
				role="search"
				onsubmit={(e) => {
					e.preventDefault();
					submitSearch();
				}}
			>
				<div class="search-box">
					<input
						type="search"
						placeholder="Search"
						aria-label="Search"
						autocomplete="off"
						bind:value={query}
						oninput={() => (suggesting = true)}
						onfocus={() => (suggesting = true)}
						onblur={() => setTimeout(() => (suggesting = false), 150)}
					/>
					{#if query}
						<button
							type="button"
							class="clear"
							aria-label="Clear search"
							onclick={() => (query = '')}
						>
							<X size={22} strokeWidth={1.5} />
						</button>
					{/if}
					{#if suggestions.length}
						<ul class="suggestions">
							{#each suggestions as title}
								<li>
									<button type="button" onclick={() => submitSearch(title)}>
										<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
											<path
												d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
											/>
										</svg>
										<span>{title}</span>
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
				<button class="search-btn" type="submit" aria-label="Search">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
						<path
							d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
						/>
					</svg>
				</button>
			</form>
		{/if}

		{#if !mobileSearch}
			<div class="end">
				{#if isPhone}
					<button class="icon-btn" aria-label="Search" onclick={() => (mobileSearch = true)}>
						<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
							<path
								d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
							/>
						</svg>
					</button>
				{/if}
				<button
					class="icon-btn theme-btn"
					aria-label={prefs.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
					onclick={toggleTheme}
				>
					{#if prefs.theme === 'dark'}
						<Sun size={24} strokeWidth={1.5} />
					{:else}
						<Moon size={24} strokeWidth={1.5} />
					{/if}
				</button>
				<div class="profile" bind:this={profileEl}>
					<button
						class="avatar"
						aria-label="Account menu"
						aria-expanded={profileOpen}
						onclick={() => (profileOpen = !profileOpen)}
					>
						<img src={logo()} alt="" width="32" height="32" />
					</button>
					{#if profileOpen}
						<div class="profile-menu" role="dialog" aria-label="Account menu">
							<a class="profile-head" href="/">
								<img src={logo()} alt="" width="40" height="40" />
								<span>
									<strong>Dagmawi Babi</strong>
									<small>@Dagmawi_Babi</small>
									<em>View portfolio</em>
								</span>
							</a>
							<button class="menu-row" onclick={toggleTheme}>
								{#if prefs.theme === 'dark'}
									<Moon size={20} strokeWidth={1.5} />
								{:else}
									<Sun size={20} strokeWidth={1.5} />
								{/if}
								<span>Appearance: {prefs.theme === 'dark' ? 'Dark' : 'Light'}</span>
							</button>
							<p class="menu-heading">Columns in feeds</p>
							<div class="segments" role="radiogroup" aria-label="Columns in feeds">
								{#each COLUMN_CHOICES as choice}
									<button
										role="radio"
										aria-checked={prefs.columns === choice.value}
										class:active={prefs.columns === choice.value}
										onclick={() => (prefs.columns = choice.value)}
									>
										{choice.label}
									</button>
								{/each}
							</div>
							{#each SETTINGS as group}
								<p class="menu-heading">{group.heading}</p>
								{#each group.rows as row}
									<label class="menu-row switch-row">
										<span>{row.label}</span>
										<input
											type="checkbox"
											role="switch"
											checked={prefs[row.key] as boolean}
											onchange={(e) => ((prefs as any)[row.key] = e.currentTarget.checked)}
										/>
										<i aria-hidden="true"></i>
									</label>
								{/each}
							{/each}
							<button
								class="menu-row shortcuts-row"
								onclick={() => {
									profileOpen = false;
									ui.shortcutsOpen = true;
								}}
							>
								<Keyboard size={20} strokeWidth={1.5} />
								<span>Keyboard shortcuts</span>
							</button>
							<button class="menu-reset" onclick={resetPrefs}>Restore defaults</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</header>

	{#if showFullGuide}
		<nav class="guide" aria-label="Guide">{@render guide()}</nav>
	{/if}

	{#if showMiniGuide}
		<nav class="mini-guide" aria-label="Guide">
			{#each mini as item}
				<a class="mini-item" class:active={isActive(item.href)} href={item.href}>
					<item.icon size={24} strokeWidth={isActive(item.href) ? 2.2 : 1.5} />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
	{/if}

	{#if ui.shortcutsOpen}
		<ShortcutsDialog onclose={() => (ui.shortcutsOpen = false)} />
	{/if}

	{#if drawerOpen}
		<button class="scrim" aria-label="Close guide" onclick={() => (drawerOpen = false)}></button>
		<nav class="drawer" aria-label="Guide">
			<div class="drawer-head">
				<button class="icon-btn" aria-label="Close guide" onclick={() => (drawerOpen = false)}>
					<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
						<path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z" />
					</svg>
				</button>
				{@render brand()}
			</div>
			{@render guide()}
		</nav>
	{/if}

	<main style:margin-left="{contentOffset}px" class:phone={isPhone}>
		{@render children()}
	</main>

	{#if isPhone}
		<nav class="pivot-bar" aria-label="Primary">
			{#each mini as item}
				<a class="mini-item" class:active={isActive(item.href)} href={item.href}>
					<item.icon size={22} strokeWidth={isActive(item.href) ? 2.2 : 1.5} />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
	{/if}
</div>

<style>
	.babitube {
		--bg: #ffffff;
		--bg-raised: #ffffff;
		--text: #0f0f0f;
		--text-2: #606060;
		--hover: rgba(0, 0, 0, 0.05);
		--hover-strong: rgba(0, 0, 0, 0.1);
		--line: rgba(0, 0, 0, 0.1);
		--input-border: #cccccc;
		--search-btn: #f8f8f8;
		--chip: rgba(0, 0, 0, 0.05);
		--chip-active-bg: #0f0f0f;
		--chip-active-text: #ffffff;
		--link: #065fd4;
		--placeholder: #e5e5e5;
		--menu-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
		min-height: 100vh;
		background: var(--bg);
		color: var(--text);
		font-family: Roboto, Arial, sans-serif;
		font-size: 14px;
		line-height: 20px;
	}
	.babitube.dark {
		--bg: #0f0f0f;
		--bg-raised: #282828;
		--text: #f1f1f1;
		--text-2: #aaaaaa;
		--hover: rgba(255, 255, 255, 0.1);
		--hover-strong: rgba(255, 255, 255, 0.2);
		--line: rgba(255, 255, 255, 0.2);
		--input-border: #303030;
		--search-btn: #222222;
		--chip: rgba(255, 255, 255, 0.1);
		--chip-active-bg: #f1f1f1;
		--chip-active-text: #0f0f0f;
		--link: #3ea6ff;
		--placeholder: #272727;
		--menu-shadow: none;
	}

	.masthead {
		position: fixed;
		inset: 0 0 auto 0;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 0 16px;
		background: var(--bg);
		z-index: 30;
	}
	.start,
	.end {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}
	.end {
		gap: 8px;
	}
	.icon-btn {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		color: var(--text);
		cursor: pointer;
		flex-shrink: 0;
	}
	.icon-btn:hover {
		background: var(--hover);
	}
	.logo {
		display: flex;
		align-items: center;
		padding: 0 14px 0 16px;
		height: 56px;
		color: var(--text);
		font-size: 20px;
		font-weight: 700;
		letter-spacing: -0.8px;
	}
	.logo svg {
		margin-right: 4px;
	}
	.logo sup {
		font-size: 10px;
		font-weight: 400;
		letter-spacing: 0;
		color: var(--text-2);
		margin: -12px 0 0 3px;
	}
	.center {
		display: flex;
		flex: 0 1 732px;
		min-width: 0;
		height: 40px;
		margin-left: 40px;
	}
	.search-box {
		position: relative;
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		height: 40px;
		padding: 0 4px 0 16px;
		background: transparent;
		border: 1px solid var(--input-border);
		border-right: none;
		border-radius: 40px 0 0 40px;
	}
	.search-box:focus-within {
		border-color: #1c62b9;
	}
	.search-box input {
		flex: 1;
		min-width: 0;
		height: 100%;
		background: transparent;
		color: var(--text);
		font-size: 16px;
		outline: none;
	}
	.search-box input::-webkit-search-cancel-button {
		display: none;
	}
	.search-box input::placeholder {
		color: #888888;
	}
	.clear {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		color: var(--text);
		cursor: pointer;
	}
	.clear:hover {
		background: var(--hover);
	}
	.search-btn {
		width: 64px;
		flex-shrink: 0;
		display: grid;
		place-items: center;
		background: var(--search-btn);
		border: 1px solid var(--input-border);
		border-radius: 0 40px 40px 0;
		color: var(--text);
		cursor: pointer;
	}
	.search-btn:hover {
		background: var(--hover-strong);
	}
	.suggestions {
		position: absolute;
		top: 46px;
		left: 0;
		right: 0;
		padding: 16px 0 8px;
		background: var(--bg-raised);
		border-radius: 12px;
		box-shadow: var(--menu-shadow);
		list-style: none;
		z-index: 40;
		overflow: hidden;
	}
	.suggestions button {
		display: flex;
		align-items: center;
		gap: 16px;
		width: 100%;
		padding: 6px 16px;
		color: var(--text);
		font-size: 16px;
		font-weight: 500;
		text-align: left;
		cursor: pointer;
	}
	.suggestions button:hover {
		background: var(--hover);
	}
	.suggestions svg {
		flex-shrink: 0;
	}
	.suggestions span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.profile {
		position: relative;
		margin: 0 8px;
	}
	.avatar {
		display: block;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		overflow: hidden;
		background: var(--placeholder);
		cursor: pointer;
	}
	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.profile-menu {
		position: absolute;
		top: 40px;
		right: 0;
		width: 300px;
		max-height: calc(100vh - 64px);
		padding: 8px 0;
		overflow-y: auto;
		background: var(--bg-raised);
		border-radius: 12px;
		box-shadow: var(--menu-shadow);
		z-index: 40;
		scrollbar-width: thin;
	}
	.profile-head {
		display: flex;
		gap: 16px;
		padding: 8px 16px 16px;
		border-bottom: 1px solid var(--line);
		margin-bottom: 8px;
	}
	.profile-head img {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}
	.profile-head span {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.profile-head strong {
		font-size: 16px;
		line-height: 22px;
		font-weight: 500;
	}
	.profile-head small {
		font-size: 14px;
		color: var(--text-2);
	}
	.profile-head em {
		margin-top: 4px;
		font-style: normal;
		color: var(--link);
	}
	.segments {
		display: grid;
		grid-template-columns: 1.5fr repeat(5, 1fr);
		gap: 4px;
		padding: 4px 16px 4px;
	}
	.segments button {
		height: 32px;
		border-radius: 8px;
		background: var(--chip);
		color: var(--text);
		font-weight: 500;
		cursor: pointer;
	}
	.segments button:hover {
		background: var(--hover-strong);
	}
	.segments button.active {
		background: var(--chip-active-bg);
		color: var(--chip-active-text);
	}
	.menu-heading {
		padding: 12px 16px 4px;
		font-size: 12px;
		line-height: 18px;
		font-weight: 500;
		color: var(--text-2);
	}
	.menu-row {
		display: flex;
		align-items: center;
		gap: 16px;
		width: 100%;
		min-height: 40px;
		padding: 0 16px;
		color: var(--text);
		text-align: left;
		cursor: pointer;
	}
	.menu-row:hover {
		background: var(--hover);
	}
	.switch-row {
		position: relative;
		justify-content: space-between;
	}
	.switch-row input {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		left: 0;
		margin: 0;
		cursor: pointer;
	}
	.switch-row i {
		position: relative;
		flex-shrink: 0;
		width: 36px;
		height: 20px;
		border-radius: 10px;
		background: var(--hover-strong);
		transition: background 0.15s;
	}
	.switch-row i::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
		transition: transform 0.15s;
	}
	.switch-row input:checked ~ i {
		background: var(--link);
	}
	.switch-row input:checked ~ i::after {
		transform: translateX(16px);
	}
	.switch-row input:focus-visible ~ i {
		outline: 2px solid var(--link);
		outline-offset: 2px;
	}
	.shortcuts-row {
		margin-top: 8px;
		border-top: 1px solid var(--line);
	}
	.menu-reset {
		display: block;
		margin: 12px 16px 8px;
		color: var(--link);
		font-weight: 500;
		cursor: pointer;
	}

	.guide {
		position: fixed;
		top: 56px;
		bottom: 0;
		left: 0;
		width: 240px;
		padding: 12px;
		overflow-y: hidden;
		background: var(--bg);
		z-index: 20;
	}
	.guide:hover,
	.drawer:hover {
		overflow-y: auto;
	}
	.guide,
	.drawer {
		scrollbar-width: thin;
		scrollbar-color: var(--hover-strong) transparent;
		scrollbar-gutter: stable;
	}
	.guide-section {
		padding-bottom: 12px;
		margin-bottom: 12px;
		border-bottom: 1px solid var(--line);
	}
	.guide-head {
		display: flex;
		align-items: center;
		gap: 4px;
		width: 100%;
		height: 40px;
		padding: 0 12px;
		border-radius: 10px;
		color: var(--text);
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
	}
	.guide-head:hover {
		background: var(--hover);
	}
	.chevron {
		display: grid;
		transition: transform 0.15s;
	}
	.chevron.open {
		transform: rotate(90deg);
	}
	.subs {
		max-height: 280px;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--hover-strong) transparent;
	}
	.sub-avatar {
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		overflow: hidden;
	}
	.sub-avatar img,
	.sub-avatar > span {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		object-fit: cover;
		color: #fff;
		font-size: 12px;
		font-weight: 500;
	}
	.guide-item {
		display: flex;
		align-items: center;
		gap: 24px;
		height: 40px;
		padding: 0 12px;
		border-radius: 10px;
		color: var(--text);
		white-space: nowrap;
	}
	.guide-item span {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.guide-item:hover {
		background: var(--hover);
	}
	.guide-item.active {
		background: var(--hover);
		font-weight: 500;
	}
	.guide-item.active:hover {
		background: var(--hover-strong);
	}
	.guide-footer {
		padding: 4px 12px 24px;
		font-size: 12px;
		line-height: 18px;
		color: var(--text-2);
	}
	.guide-footer p + p {
		margin-top: 4px;
	}
	.guide-footer .links {
		display: flex;
		flex-wrap: wrap;
		gap: 0 8px;
		font-weight: 500;
		margin-bottom: 12px;
	}
	.guide-footer a:hover {
		color: var(--text);
	}
	.guide-footer .last-post {
		color: var(--text);
		font-weight: 500;
	}

	.mini-guide {
		position: fixed;
		top: 56px;
		bottom: 0;
		left: 0;
		width: 72px;
		padding: 4px;
		background: var(--bg);
		z-index: 20;
	}
	.mini-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 16px 0 14px;
		border-radius: 10px;
		font-size: 10px;
		line-height: 14px;
		color: var(--text);
	}
	.mini-item:hover {
		background: var(--hover);
	}
	.mini-item.active {
		font-weight: 500;
	}

	.scrim {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 40;
	}
	.drawer {
		position: fixed;
		inset: 0 auto 0 0;
		width: 240px;
		padding: 0 12px 12px;
		background: var(--bg);
		overflow-y: auto;
		z-index: 50;
	}
	.drawer-head {
		display: flex;
		align-items: center;
		height: 56px;
		margin: 0 -12px 12px;
		padding: 0 16px;
	}

	main {
		padding-top: 56px;
	}
	main.phone {
		padding-bottom: 56px;
	}

	.pivot-bar {
		position: fixed;
		inset: auto 0 0 0;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		height: 56px;
		background: var(--bg);
		border-top: 1px solid var(--line);
		z-index: 30;
	}
	.pivot-bar .mini-item {
		justify-content: center;
		gap: 2px;
		padding: 0;
		border-radius: 0;
	}

	@media (max-width: 791px) {
		.masthead {
			padding: 0 8px 0 4px;
			gap: 4px;
		}
		.logo {
			padding: 0 0 0 8px;
		}
		.center {
			margin-left: 0;
			flex: 1;
		}
		.search-btn {
			width: 48px;
		}
		.theme-btn {
			display: none;
		}
		.profile-menu {
			width: min(300px, calc(100vw - 24px));
		}
	}
</style>
