<script lang="ts">
	let { onclose }: { onclose: () => void } = $props();

	const SECTIONS: { heading: string; rows: [string, string][] }[] = [
		{
			heading: 'Playback',
			rows: [
				['Toggle play/pause', 'k or SPACE'],
				['Rewind 10 seconds', 'j'],
				['Fast forward 10 seconds', 'l'],
				['Rewind 5 seconds', '←'],
				['Fast forward 5 seconds', '→'],
				['Previous video', 'P (SHIFT+p)'],
				['Next video', 'N (SHIFT+n)'],
				['Previous frame (while paused)', ','],
				['Next frame (while paused)', '.'],
				['Decrease playback rate', '< (SHIFT+,)'],
				['Increase playback rate', '> (SHIFT+.)'],
				['Seek to specific point in the video (7 advances to 70% of duration)', '0..9'],
				['Seek to previous chapter', 'CONTROL + ←'],
				['Seek to next chapter', 'CONTROL + →']
			]
		},
		{
			heading: 'General',
			rows: [
				['Toggle full screen', 'f'],
				['Toggle theater mode', 't'],
				['Toggle miniplayer', 'i'],
				['Close miniplayer or current dialog', 'ESCAPE'],
				['Toggle mute', 'm'],
				['Increase volume', '↑'],
				['Decrease volume', '↓'],
				['Focus search', '/'],
				['Show keyboard shortcuts', '? (SHIFT+/)']
			]
		},
		{
			heading: 'Subtitles and closed captions',
			rows: [
				['If the video supports captions, toggle captions ON/OFF', 'c']
			]
		}
	];

	let dismiss = $state<HTMLButtonElement>();

	$effect(() => {
		dismiss?.focus();
	});
</script>

<button class="scrim" aria-label="Close keyboard shortcuts" onclick={onclose}></button>
<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="babitube-shortcuts-title">
	<h2 id="babitube-shortcuts-title">Keyboard shortcuts</h2>
	<div class="columns">
		{#each SECTIONS as section}
			<section>
				<h3>{section.heading}</h3>
				<dl>
					{#each section.rows as [label, keys]}
						<div>
							<dt>{label}</dt>
							<dd><kbd>{keys}</kbd></dd>
						</div>
					{/each}
				</dl>
			</section>
		{/each}
	</div>
	<footer>
		<button class="dismiss" bind:this={dismiss} onclick={onclose}>Dismiss</button>
	</footer>
</div>

<style>
	.scrim {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 60;
	}
	.dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		width: min(1280px, calc(100vw - 32px));
		max-height: calc(100vh - 32px);
		padding: 24px 16px 8px 24px;
		background: var(--bg-raised);
		color: var(--text);
		border-radius: 12px;
		box-shadow: var(--menu-shadow);
		z-index: 61;
	}
	h2 {
		font-size: 24px;
		line-height: 32px;
		font-weight: 700;
		margin-bottom: 16px;
	}
	.columns {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		columns: 2;
		column-gap: 32px;
		padding-right: 8px;
		scrollbar-width: thin;
	}
	section {
		break-inside: avoid;
		padding: 16px 0 24px;
	}
	h3 {
		padding: 0 8px 12px;
		font-size: 12px;
		line-height: 18px;
		font-weight: 500;
		text-transform: uppercase;
		color: var(--text-2);
	}
	dl > div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 24px;
		min-height: 37px;
		padding: 6px 8px;
		border-top: 1px solid var(--line);
	}
	dt {
		color: var(--text);
	}
	dd {
		flex: 0 0 120px;
	}
	kbd {
		font-family: 'Roboto Mono', Consolas, Menlo, monospace;
		font-size: 13px;
		white-space: nowrap;
	}
	footer {
		display: flex;
		justify-content: flex-end;
		padding-top: 8px;
	}
	.dismiss {
		height: 36px;
		padding: 0 16px;
		border-radius: 18px;
		background: rgba(6, 95, 212, 0.2);
		color: var(--link);
		font-weight: 500;
		cursor: pointer;
	}
	.dismiss:hover {
		background: rgba(6, 95, 212, 0.35);
	}
	@media (max-width: 900px) {
		.columns {
			columns: 1;
		}
		.dialog {
			padding: 16px 8px 8px 16px;
		}
	}
</style>
