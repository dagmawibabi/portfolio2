<script lang="ts">
	import { CATEGORIES, TELEGRAM, formatPostDate } from '$lib/babitube/utils';

	const REPO = 'https://github.com/dagmawibabi/portfolio2';

	let { data } = $props();

	const meta = $derived(data.babitube.meta);
	const years = $derived(`${meta.firstPostAt.slice(0, 4)}–${meta.lastPostAt.slice(0, 4)}`);
	const stats = $derived([
		{ value: meta.uniqueVideoCount.toLocaleString('en-US'), label: 'videos' },
		{ value: meta.postCount.toLocaleString('en-US'), label: 'posts with YouTube links' },
		{ value: (meta.commentCount ?? 0).toLocaleString('en-US'), label: 'comments' },
		{ value: (meta.commenterCount ?? 0).toLocaleString('en-US'), label: 'people commenting' },
		{ value: meta.uniquePlaylistCount.toLocaleString('en-US'), label: 'playlists' },
		{ value: years, label: 'years of posts' }
	]);
	const mostDiscussed = $derived(
		data.babitube.videos
			.filter((v) => v.discussion)
			.toSorted((a, b) => (b.discussion ?? 0) - (a.discussion ?? 0))
			.slice(0, 5)
	);
	const categories = $derived(
		CATEGORIES.filter((c) => meta.categoryCounts[c.key]).sort(
			(a, b) => meta.categoryCounts[b.key] - meta.categoryCounts[a.key]
		)
	);
</script>

<svelte:head>
	<title>About • BabiTube</title>
</svelte:head>

<article class="about">
	<h1>BabiTube</h1>
	<p class="lead">Every YouTube video I've posted on my Telegram channel, in one place.</p>

	<dl class="stats">
		{#each stats as stat}
			<div>
				<dd>{stat.value}</dd>
				<dt>{stat.label}</dt>
			</div>
		{/each}
	</dl>

	<p class="updated">
		Last post on the channel:
		<a href={meta.exportLastPostUrl} target="_blank" rel="noopener">
			{formatPostDate(meta.exportLastPostAt, true)}
		</a>. Latest post with a video: {formatPostDate(meta.lastPostAt, true)}.
	</p>

	<h2>Why</h2>
	<p>
		Since {meta.firstPostAt.slice(0, 4)} I've been sharing videos on
		<a href={TELEGRAM} target="_blank" rel="noopener">my Telegram channel</a>: talks, sermons, songs,
		documentaries, games and my own uploads. A channel is a good place to share something and a bad
		place to find it again, because each video ends up buried somewhere in tens of thousands of
		messages. BabiTube pulls them out so you can browse them, search them and read what I said about each
		one.
	</p>

	<h2>How it was built</h2>
	<ol>
		<li>
			<strong>Read the whole channel.</strong> A Telegram export of the channel was scanned for
			YouTube links, whether they were plain URLs, links hidden behind text, polls or buttons.
		</li>
		<li>
			<strong>Keep the context.</strong> Each post stays attached to its video: the text, hashtags,
			date, reactions, whether it was forwarded, and a link back to the original.
		</li>
		<li>
			<strong>Add YouTube's details.</strong> Titles, upload dates, durations, view counts and
			playlist contents come from the YouTube Data API.
		</li>
		<li>
			<strong>Bring in the comments.</strong> An export of the channel's discussion group was linked
			back to the posts, so each video shows the real conversation under it.
		</li>
		<li>
			<strong>Sort into categories.</strong> Each video is grouped using my hashtags, its channel, its
			title and YouTube's category. These are rules rather than judgment calls, so a few will be off.
		</li>
	</ol>

	<h2>What you can do</h2>
	<ul>
		<li><strong>Home</strong> shuffles on every refresh, leaning towards recent and well-received videos.</li>
		<li>
			<strong>Filter and sort</strong> by length, upload date, views, likes, comments or reactions on Home, search and
			channel pages.
		</li>
		<li><strong>Every video page</strong> shows what I said about it and what people said in the comments, with links back to Telegram.</li>
		<li><strong>Playlists</strong> play through in order, with loop and shuffle, and can be sorted by size, runtime and more.</li>
		<li><strong>Watch later and History</strong> work like you'd expect.</li>
		<li>
			<strong>Keyboard shortcuts</strong> follow YouTube's. Press <kbd>?</kbd> to see them all.
		</li>
		<li>
			<strong>The profile menu</strong> can hide comments, suggestions, like and view counts,
			descriptions, Shorts and videos you've already watched.
		</li>
	</ul>

	<h2>The comments</h2>
	<p>
		People talk under these posts in the channel's discussion group, and that conversation comes along.
		There are {(meta.commentCount ?? 0).toLocaleString('en-US')} comments from
		{(meta.commenterCount ?? 0).toLocaleString('en-US')} people across
		{(meta.postsWithComments ?? 0).toLocaleString('en-US')} video posts{#if meta.firstCommentAt}, going
			back to {formatPostDate(meta.firstCommentAt)}{/if}. Each one links back to the
		original on Telegram, and you can sort Home, search and channels by the most commented.
	</p>
	{#if mostDiscussed.length}
		<h3>Most discussed</h3>
		<ol class="discussed">
			{#each mostDiscussed as video (video.id)}
				<li>
					<a href="/babitube/watch?v={video.id}">{video.title}</a>
					<span>{video.discussion} comments</span>
				</li>
			{/each}
		</ol>
	{/if}

	<h2>Categories</h2>
	<div class="chips">
		{#each categories as cat}
			<a href="/babitube?c={cat.key}">
				<cat.icon size={18} strokeWidth={1.5} />
				{cat.label}
				<span>{meta.categoryCounts[cat.key]}</span>
			</a>
		{/each}
	</div>

	<h2>Fork it</h2>
	<p>
		The whole project is open source at
		<a href={REPO} target="_blank" rel="noopener">github.com/dagmawibabi/portfolio2</a>. Point the
		pipeline at your own Telegram channel export and you get your own BabiTube, or hand the repo to an AI
		agent and ask it for something different.
	</p>
	<div class="files">
		<table>
			<tbody>
				<tr>
					<td><code>scripts/babitube/</code></td>
					<td>The pipeline: extract, enrich, categorize and build, with a README</td>
				</tr>
				<tr>
					<td><code>src/lib/assets/youtube_posts.json</code></td>
					<td>The full dataset: every post, its links, categories and YouTube details</td>
				</tr>
				<tr>
					<td><code>src/lib/assets/youtube_comments.json</code></td>
					<td>The comments on those posts, keyed by post</td>
				</tr>
				<tr>
					<td><code>static/babitube-data/</code></td>
					<td>The slimmed-down files this site loads</td>
				</tr>
				<tr>
					<td><code>src/routes/babitube/</code></td>
					<td>The interface itself, built with SvelteKit</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2>Privacy</h2>
	<p>
		There are no accounts. Your settings, history and Watch later list are stored only in this browser.
		Videos play through YouTube's privacy-enhanced embed, and thumbnails load from YouTube's servers.
	</p>

	<h2>Credits</h2>
	<p>
		Built by <a href="/">Dagmawi Babi</a> with Claude Code. Video data comes from the YouTube Data API.
		Videos belong to their creators.
	</p>
	<p class="note">BabiTube is an independent project and isn't affiliated with YouTube, Google or Telegram.</p>
</article>

<style>
	.about {
		max-width: 760px;
		margin: 0 auto;
		padding: 40px 24px 80px;
		font-size: 16px;
		line-height: 26px;
	}
	h1 {
		font-size: 44px;
		line-height: 52px;
		font-weight: 700;
		letter-spacing: -0.5px;
	}
	h2 {
		margin: 40px 0 12px;
		font-size: 22px;
		line-height: 30px;
		font-weight: 700;
	}
	h3 {
		margin: 20px 0 8px;
		font-size: 16px;
		line-height: 24px;
		font-weight: 500;
	}
	.discussed span {
		margin-left: 6px;
		font-size: 14px;
		color: var(--text-2);
	}
	.lead {
		margin-top: 8px;
		font-size: 20px;
		line-height: 30px;
		color: var(--text-2);
	}
	a {
		color: var(--link);
	}
	a:hover {
		text-decoration: underline;
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
		gap: 16px;
		margin-top: 32px;
		padding: 20px 0;
		border-block: 1px solid var(--line);
	}
	.stats dd {
		font-size: 28px;
		line-height: 36px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.stats dt {
		font-size: 14px;
		line-height: 20px;
		color: var(--text-2);
	}
	.updated {
		margin-top: 16px;
		font-size: 14px;
		line-height: 20px;
		color: var(--text-2);
	}
	ol,
	ul {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-left: 22px;
	}
	ol {
		list-style: decimal;
	}
	ul {
		list-style: disc;
	}
	strong {
		font-weight: 500;
	}
	p + p {
		margin-top: 12px;
	}
	kbd,
	code {
		font-family: 'Roboto Mono', Consolas, Menlo, monospace;
		font-size: 13px;
	}
	kbd {
		padding: 1px 6px;
		border-radius: 4px;
		background: var(--chip);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.chips a {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 32px;
		padding: 0 12px;
		border-radius: 8px;
		background: var(--chip);
		color: var(--text);
		font-size: 14px;
		font-weight: 500;
	}
	.chips a:hover {
		background: var(--hover-strong);
		text-decoration: none;
	}
	.chips span {
		color: var(--text-2);
		font-weight: 400;
	}
	.files {
		margin-top: 16px;
		overflow-x: auto;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
		line-height: 20px;
	}
	td {
		padding: 10px 16px 10px 0;
		border-top: 1px solid var(--line);
		vertical-align: top;
	}
	td:first-child {
		white-space: nowrap;
	}
	.note {
		font-size: 14px;
		line-height: 20px;
		color: var(--text-2);
	}
	@media (max-width: 640px) {
		.about {
			padding: 24px 16px 48px;
		}
		h1 {
			font-size: 34px;
			line-height: 42px;
		}
	}
</style>
