<script lang="ts">
	// Renders a Telegram post body exported as [kind, text, href?] runs.
	// Bare @handles in plain text become links to their Telegram profiles.
	import type { Segment } from '$lib/channel';
	let { segments, class: klass = '' }: { segments: Segment[]; class?: string } = $props();

	// not preceded by a word char or dot, so emails (me@gmail.com) stay plain text
	const MENTION = /((?<![\w.])@[A-Za-z][A-Za-z0-9_]{3,31}(?![\w@]|\.\w))/;
	const split = (t: string) => t.split(MENTION);
</script>

<p class="whitespace-pre-line break-words {klass}">
	{#each segments as s, i (i)}
		{#if s[0] === 'a'}
			<a href={s[2]} target="_blank" rel="noopener noreferrer" class="rt-link">{s[1]}</a>
		{:else if s[0] === 'b'}
			<strong>{s[1]}</strong>
		{:else if s[0] === 'i'}
			<em>{s[1]}</em>
		{:else if s[0] === 'c'}
			<code class="rounded bg-black/5 px-1 font-mono text-[0.9em] dark:bg-white/10">{s[1]}</code>
		{:else}
			{#each split(s[1]) as part, j (j)}{#if j % 2}<a
						href="https://t.me/{part.slice(1)}"
						target="_blank"
						rel="noopener noreferrer"
						class="rt-link">{part}</a
					>{:else}{part}{/if}{/each}
		{/if}
	{/each}
</p>

<style>
	.rt-link {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
		text-decoration-color: color-mix(in oklab, currentColor 35%, transparent);
		word-break: break-all;
	}
	.rt-link:hover {
		text-decoration-color: currentColor;
	}
</style>
