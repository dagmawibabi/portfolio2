<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Send from '@lucide/svelte/icons/send';
	import RichText from './rich_text.svelte';
	import {
		avatarColor,
		formatPostDate,
		initial,
		loadComments,
		postUrl,
		timeAgo,
		type TubeComment
	} from '$lib/babitube/utils';

	const PAGE = 20;

	let { postIds }: { postIds: number[] } = $props();

	type Thread = { top: TubeComment; replies: TubeComment[]; post: number; score: number };

	let byPost = $state<Record<string, TubeComment[]> | null>(null);
	let sort = $state<'top' | 'newest'>('top');
	let limit = $state(PAGE);
	let open = $state<Record<number, boolean>>({});

	$effect(() => {
		loadComments().then((c) => (byPost = c));
	});

	$effect(() => {
		postIds;
		limit = PAGE;
		open = {};
	});

	const reactionsOf = (c: TubeComment) => (c.rx ?? []).reduce((sum, [, n]) => sum + n, 0);

	const threads = $derived.by(() => {
		const out: Thread[] = [];
		for (const post of postIds) {
			const groups = new Map<number, TubeComment[]>();
			for (const c of byPost?.[post] ?? []) {
				groups.set(c.thread, [...(groups.get(c.thread) ?? []), c]);
			}
			for (const group of groups.values()) {
				const top = group.find((c) => c.id === c.thread) ?? group[0];
				const replies = group.filter((c) => c !== top).sort((a, b) => a.at - b.at);
				// Replies count towards a thread's rank, since a long conversation is worth surfacing.
				out.push({ top, replies, post, score: reactionsOf(top) * 2 + replies.length });
			}
		}
		return sort === 'top'
			? out.sort((a, b) => b.score - a.score || b.top.at - a.top.at)
			: out.sort((a, b) => b.top.at - a.top.at);
	});

	const total = $derived(threads.reduce((sum, t) => sum + 1 + t.replies.length, 0));
	const commentUrl = (post: number, id: number) => `${postUrl(post)}?comment=${id}`;
</script>

{#snippet comment(c: TubeComment, post: number, small: boolean)}
	<article class="comment" class:small>
		<span class="avatar" style:background={avatarColor(c.by)} aria-hidden="true">{initial(c.by)}</span>
		<div class="body">
			<p class="head">
				<strong class:owner={c.own}>{c.by}</strong>
				<a href={commentUrl(post, c.id)} target="_blank" rel="noopener" title={formatPostDate(c.local, true)}>
					{timeAgo(c.at)}{c.edit ? ' (edited)' : ''}
				</a>
			</p>
			{#if c.media}
				<p class="media">{c.media}{c.sticker ? ` ${c.sticker}` : ''}</p>
			{/if}
			{#if c.rich?.length}<div class="text"><RichText segments={c.rich} /></div>{/if}
			{#if c.rx?.length}
				<div class="reactions">
					{#each c.rx as [emoji, count]}
						<span>{emoji} {count}</span>
					{/each}
				</div>
			{/if}
		</div>
	</article>
{/snippet}

{#if threads.length}
	<section class="comments">
		<header>
			<h2>{total.toLocaleString('en-US')} {total === 1 ? 'Comment' : 'Comments'}</h2>
			<select aria-label="Sort comments" bind:value={sort}>
				<option value="top">Top comments</option>
				<option value="newest">Newest first</option>
			</select>
		</header>
		{#each threads.slice(0, limit) as thread (thread.top.id)}
			<div class="thread">
				{@render comment(thread.top, thread.post, false)}
				{#if thread.replies.length}
					<button
						class="toggle"
						aria-expanded={!!open[thread.top.id]}
						onclick={() => (open[thread.top.id] = !open[thread.top.id])}
					>
						<span class="chevron" class:open={open[thread.top.id]}><ChevronDown size={18} /></span>
						{thread.replies.length}
						{thread.replies.length === 1 ? 'reply' : 'replies'}
					</button>
					{#if open[thread.top.id]}
						<div class="replies">
							{#each thread.replies as reply (reply.id)}
								{@render comment(reply, thread.post, true)}
							{/each}
						</div>
					{/if}
				{/if}
			</div>
		{/each}
		{#if limit < threads.length}
			<button class="more" onclick={() => (limit += PAGE)}>Show more comments</button>
		{/if}
		<a class="join" href={postUrl(postIds[0])} target="_blank" rel="noopener">
			<Send size={16} strokeWidth={1.5} /> Join the conversation on Telegram
		</a>
	</section>
{/if}

<style>
	.comments {
		margin-top: 24px;
	}
	header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;
	}
	h2 {
		font-size: 20px;
		line-height: 28px;
		font-weight: 700;
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
	option {
		background: var(--bg-raised);
		color: var(--text);
	}
	.thread {
		margin-bottom: 20px;
	}
	.comment {
		display: flex;
		gap: 16px;
	}
	.comment.small {
		gap: 12px;
		margin-top: 12px;
	}
	.avatar {
		flex-shrink: 0;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		color: #fff;
		font-size: 16px;
		font-weight: 500;
	}
	.small .avatar {
		width: 24px;
		height: 24px;
		font-size: 12px;
	}
	.body {
		flex: 1;
		min-width: 0;
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 6px;
		font-size: 12px;
		line-height: 18px;
		color: var(--text-2);
	}
	.head strong {
		color: var(--text);
		font-size: 13px;
		font-weight: 500;
	}
	.head strong.owner {
		padding: 0 6px;
		border-radius: 10px;
		background: var(--hover-strong);
	}
	.head a:hover {
		color: var(--text);
	}
	.media {
		margin-top: 2px;
		font-size: 13px;
		font-style: italic;
		color: var(--text-2);
	}
	.text {
		margin-top: 2px;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.reactions {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 6px;
		font-size: 12px;
		line-height: 18px;
	}
	.reactions span {
		padding: 1px 8px;
		border-radius: 12px;
		background: var(--chip);
	}
	.toggle {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 32px;
		margin: 4px 0 0 44px;
		padding: 0 12px;
		border-radius: 16px;
		color: var(--link);
		font-weight: 500;
		cursor: pointer;
	}
	.toggle:hover {
		background: var(--hover);
	}
	.chevron {
		display: grid;
		transition: transform 0.15s;
	}
	.chevron.open {
		transform: rotate(180deg);
	}
	.replies {
		margin-left: 56px;
	}
	.more {
		height: 36px;
		padding: 0 16px;
		border-radius: 18px;
		background: var(--chip);
		color: var(--text);
		font-weight: 500;
		cursor: pointer;
	}
	.more:hover {
		background: var(--hover-strong);
	}
	.join {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 16px;
		color: var(--link);
		font-weight: 500;
	}
	.join:hover {
		text-decoration: underline;
	}
	@media (max-width: 640px) {
		.comment {
			gap: 12px;
		}
		.toggle {
			margin-left: 40px;
		}
		.replies {
			margin-left: 40px;
		}
	}
</style>
