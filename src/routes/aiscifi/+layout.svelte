<script lang="ts">
	import { onMount } from 'svelte';
	import { prefs, loadPrefs } from '$lib/aiscifi/prefs.svelte';

	let { children } = $props();
	let ready = $state(false);

	onMount(() => {
		loadPrefs();
		ready = true;
		const prev = document.body.style.background;
		return () => {
			document.body.style.background = prev;
		};
	});

	$effect(() => {
		if (!ready) return;
		document.body.style.background = prefs.theme === 'light' ? '#efeee9' : '#0b0b0b';
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&display=swap"
	/>
	<meta name="theme-color" content={prefs.theme === 'light' ? '#efeee9' : '#0b0b0b'} />
</svelte:head>

<div class="ax" data-theme={prefs.theme}>
	<div class="grain" aria-hidden="true"></div>
	{@render children()}
</div>

<style>
	.ax {
		--bg: #0b0b0b;
		--bg-2: #121212;
		--fg: #e9e8e4;
		--fg-2: #bdbcb7;
		--mute: #85847f;
		--faint: #4a4a47;
		--line: rgba(233, 232, 228, 0.12);
		--line-2: rgba(233, 232, 228, 0.24);
		--sel-bg: #e9e8e4;
		--sel-fg: #0b0b0b;
		--serif: 'Newsreader', 'Iowan Old Style', Georgia, serif;
		--mono: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
		--ease: cubic-bezier(0.2, 0.7, 0.1, 1);

		position: relative;
		min-height: 100vh;
		min-height: 100dvh;
		background: var(--bg);
		color: var(--fg);
		font-family: var(--serif);
		-webkit-font-smoothing: antialiased;
		transition:
			background-color 0.5s var(--ease),
			color 0.5s var(--ease);
	}
	.ax[data-theme='light'] {
		--bg: #efeee9;
		--bg-2: #e6e5df;
		--fg: #121212;
		--fg-2: #3a3a38;
		--mute: #6d6c67;
		--faint: #a9a8a2;
		--line: rgba(18, 18, 18, 0.12);
		--line-2: rgba(18, 18, 18, 0.26);
		--sel-bg: #121212;
		--sel-fg: #efeee9;
	}
	.ax :global(::selection) {
		background: var(--sel-bg);
		color: var(--sel-fg);
	}
	.ax :global(a) {
		color: inherit;
		text-decoration: none;
	}
	.ax :global(:focus-visible) {
		outline: 1px solid var(--fg);
		outline-offset: 4px;
	}

	.grain {
		position: fixed;
		inset: -50%;
		z-index: 50;
		pointer-events: none;
		opacity: 0.045;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
		animation: grain 1.2s steps(6) infinite;
	}
	.ax[data-theme='light'] .grain {
		opacity: 0.06;
	}
	@keyframes grain {
		0% {
			transform: translate(0, 0);
		}
		20% {
			transform: translate(-3%, 2%);
		}
		40% {
			transform: translate(2%, -3%);
		}
		60% {
			transform: translate(-2%, -1%);
		}
		80% {
			transform: translate(3%, 3%);
		}
		100% {
			transform: translate(0, 0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.grain {
			animation: none;
		}
	}
</style>
