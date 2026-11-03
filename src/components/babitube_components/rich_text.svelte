<script lang="ts">
	import type { RichSegment } from '$lib/babitube/utils';

	let { segments }: { segments: RichSegment[] } = $props();

	let revealed = $state<Record<number, boolean>>({});

	// The data is already filtered, but this text comes from strangers, so check again at the door.
	const isSafe = (href: string) => /^(https?:\/\/|mailto:|tel:|\/babitube\/)/i.test(href);
	const isInternal = (href: string) => href.startsWith('/');
</script>

{#each segments as seg, i}{#if typeof seg === 'string'}{seg}{:else if seg.h && isSafe(seg.h)}{#if isInternal(seg.h)}<a class="link" href={seg.h}>{seg.t}</a>{:else}<a class="link" href={seg.h} target="_blank" rel="noopener nofollow ugc">{seg.t}</a>{/if}{:else if seg.k === 'bold'}<strong>{seg.t}</strong>{:else if seg.k === 'italic'}<em>{seg.t}</em>{:else if seg.k === 'underline'}<u>{seg.t}</u>{:else if seg.k === 'strikethrough'}<s>{seg.t}</s>{:else if seg.k === 'code'}<code>{seg.t}</code>{:else if seg.k === 'pre'}<pre>{seg.t}</pre>{:else if seg.k === 'blockquote'}<blockquote>{seg.t}</blockquote>{:else if seg.k === 'spoiler'}<button class="spoiler" class:shown={revealed[i]} aria-pressed={!!revealed[i]} onclick={() => (revealed[i] = !revealed[i])}>{seg.t}</button>{:else}{seg.t}{/if}{/each}

<style>
	.link {
		color: var(--link);
	}
	.link:hover {
		text-decoration: underline;
	}
	strong {
		font-weight: 700;
	}
	em {
		font-style: italic;
	}
	u {
		text-decoration: underline;
	}
	s {
		text-decoration: line-through;
	}
	code,
	pre {
		font-family: 'Roboto Mono', Consolas, Menlo, monospace;
		font-size: 13px;
	}
	code {
		padding: 1px 4px;
		border-radius: 4px;
		background: var(--chip);
	}
	pre {
		margin: 6px 0;
		padding: 8px 12px;
		border-radius: 8px;
		background: var(--chip);
		overflow-x: auto;
		white-space: pre;
	}
	blockquote {
		margin: 6px 0;
		padding-left: 12px;
		border-left: 3px solid var(--line);
		color: var(--text-2);
	}
	.spoiler {
		display: inline;
		padding: 0 2px;
		border-radius: 3px;
		background: var(--text-2);
		color: transparent;
		font: inherit;
		white-space: pre-wrap;
		text-align: left;
		cursor: pointer;
	}
	.spoiler.shown {
		background: var(--chip);
		color: inherit;
	}
</style>
