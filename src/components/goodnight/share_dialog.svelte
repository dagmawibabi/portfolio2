<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ClipboardCopy from '@lucide/svelte/icons/clipboard-copy';
	import Download from '@lucide/svelte/icons/download';
	import Facebook from '@lucide/svelte/icons/facebook';
	import Instagram from '@lucide/svelte/icons/instagram';
	import Link2 from '@lucide/svelte/icons/link-2';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Send from '@lucide/svelte/icons/send';
	import Share2 from '@lucide/svelte/icons/share-2';
	import Twitter from '@lucide/svelte/icons/twitter';
	import X from '@lucide/svelte/icons/x';
	import AlignLeft from '@lucide/svelte/icons/align-left';
	import AlignCenter from '@lucide/svelte/icons/align-center';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import {
		CARD_RATIOS,
		CARD_TEMPLATES,
		DEFAULT_OPTIONS,
		PALETTES,
		SITE_HOST,
		SITE_PATH,
		TELEGRAM_HOST,
		drawCard,
		loadCardFonts,
		type CardLink,
		type CardOptions,
		type CardRatio,
		type CardVerse
	} from '$lib/goodnight/share-card';

	let { open = $bindable(false), verse }: { open?: boolean; verse: CardVerse | null } = $props();

	const STORE = 'goodnight-share-card';
	let options = $state<CardOptions>({ ...DEFAULT_OPTIONS });
	let restored = false;

	let dialog = $state<HTMLDialogElement>();
	let canvas = $state<HTMLCanvasElement>();
	let thumbs = $state<Record<string, HTMLCanvasElement>>({});
	let ready = $state(false);
	let canCopyImage = $state(false);
	let copied = $state('');
	let notice = $state<{ text: string; error: boolean } | null>(null);
	let bump = $state(0); // retriggers the preview's settle animation

	let blob: Blob | null = null;
	let renderVersion = 0;
	let loadedFor = -1;
	let noticeTimer: ReturnType<typeof setTimeout>;

	const ratio = $derived(CARD_RATIOS[options.ratio]);
	const verseUrl = $derived(verse ? `https://${SITE_HOST}${SITE_PATH}#v${verse.id}` : '');
	const shareText = $derived(
		verse ? [verse.text, verse.ref && `— ${verse.ref}`].filter(Boolean).join('\n') : ''
	);

	const toggles = [
		{ key: 'showRef', label: 'Reference' },
		{ key: 'showGreeting', label: 'Good night' },
		{ key: 'showDate', label: 'Date' },
		{ key: 'showNumber', label: 'Number' },
		{ key: 'showSignature', label: 'Signature' },
		{ key: 'showStars', label: 'Stars' }
	] as const;

	const links: { id: CardLink; label: string }[] = [
		{ id: 'site', label: SITE_HOST },
		{ id: 'telegram', label: 'Telegram' },
		{ id: 'both', label: 'Both' },
		{ id: 'none', label: 'None' }
	];

	const fonts = [
		{ id: 'serif', label: 'Serif', cls: 'f-serif' },
		{ id: 'italic', label: 'Italic', cls: 'f-italic' },
		{ id: 'sans', label: 'Sans', cls: 'f-sans' }
	] as const;

	// remember the last style between visits
	$effect(() => {
		if (restored) return;
		restored = true;
		try {
			const saved = JSON.parse(localStorage.getItem(STORE) ?? 'null');
			if (saved && typeof saved === 'object') options = { ...DEFAULT_OPTIONS, ...saved };
		} catch {
			/* private mode or bad data: keep defaults */
		}
		canCopyImage = typeof ClipboardItem !== 'undefined' && !!navigator.clipboard?.write;
	});
	$effect(() => {
		const snapshot = JSON.stringify(options);
		try {
			localStorage.setItem(STORE, snapshot);
		} catch {
			/* ignore */
		}
	});

	// keep the native <dialog> in step with `open`
	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	});

	// fonts for this verse's glyphs
	$effect(() => {
		if (!open || !verse || loadedFor === verse.id) return;
		const id = (loadedFor = verse.id);
		ready = false;
		const sample = `${verse.text} ${verse.ref ?? ''} ${verse.date}`;
		loadCardFonts(sample).finally(() => {
			if (loadedFor === id) ready = true;
		});
	});

	// redraw the preview and the template thumbnails whenever anything changes
	$effect(() => {
		if (!canvas || !verse || !ready) return;
		const opts = { ...options };
		const target = canvas;
		const v = verse;
		const thumbTargets = CARD_TEMPLATES.map((t) => [t.id, thumbs[t.id]] as const);
		const frame = requestAnimationFrame(() => {
			drawCard(target, v, opts);
			const version = ++renderVersion;
			blob = null;
			target.toBlob((b) => version === renderVersion && (blob = b), 'image/png');
			const { width, height } = CARD_RATIOS[opts.ratio];
			const s = 220 / Math.max(width, height);
			for (const [template, el] of thumbTargets) if (el) drawCard(el, v, { ...opts, template }, s);
		});
		return () => cancelAnimationFrame(frame);
	});

	function set<K extends keyof CardOptions>(key: K, value: CardOptions[K]) {
		if (options[key] === value) return;
		options[key] = value;
		if (key === 'template' || key === 'ratio') bump++;
	}

	function reset() {
		options = { ...DEFAULT_OPTIONS };
		bump++;
	}

	function notify(text: string, error = false) {
		clearTimeout(noticeTimer);
		notice = { text, error };
		noticeTimer = setTimeout(() => (notice = null), 3000);
	}

	function flash(key: string) {
		copied = key;
		setTimeout(() => copied === key && (copied = ''), 1600);
	}

	const getBlob = () =>
		new Promise<Blob>((resolve, reject) => {
			if (blob) return resolve(blob);
			if (!canvas) return reject(new Error('Nothing to export'));
			canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed'))), 'image/png');
		});

	const fileName = (r = options.ratio) => `goodnight-${verse?.id ?? 'verse'}-${options.template}-${r}.png`;

	function save(file: Blob, name: string) {
		const href = URL.createObjectURL(file);
		const a = document.createElement('a');
		a.href = href;
		a.download = name;
		a.click();
		setTimeout(() => URL.revokeObjectURL(href), 1000);
	}

	async function download() {
		try {
			save(await getBlob(), fileName());
			flash('download');
		} catch {
			notify('That didn’t work, please try again', true);
		}
	}

	async function share() {
		if (!verse) return;
		try {
			const file = new File([await getBlob()], fileName(), { type: 'image/png' });
			if (navigator.canShare?.({ files: [file] })) {
				await navigator.share({ files: [file], text: `${shareText}\n${verseUrl}` });
			} else if (navigator.share) {
				await navigator.share({ text: shareText, url: verseUrl });
			} else {
				await copyText(verseUrl, 'link', 'Link copied');
			}
		} catch (e) {
			if ((e as Error).name !== 'AbortError') notify('That didn’t work, please try again', true);
		}
	}

	async function copyImage() {
		try {
			await navigator.clipboard.write([new ClipboardItem({ 'image/png': getBlob() })]);
			flash('image');
			notify('Image copied');
		} catch {
			notify('Your browser wouldn’t copy the image', true);
		}
	}

	async function copyText(value: string, key: string, msg: string) {
		try {
			await navigator.clipboard.writeText(value);
			flash(key);
			notify(msg);
		} catch {
			notify('Couldn’t copy', true);
		}
	}

	// Instagram has no web share link: hand a story-sized image to the share sheet, or save it
	async function story() {
		if (!verse) return;
		const c = document.createElement('canvas');
		drawCard(c, verse, { ...options, ratio: 'story' });
		const b = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/png'));
		if (!b) return notify('That didn’t work, please try again', true);
		const file = new File([b], fileName('story'), { type: 'image/png' });
		try {
			if (navigator.canShare?.({ files: [file] })) return void (await navigator.share({ files: [file] }));
		} catch (e) {
			if ((e as Error).name === 'AbortError') return;
		}
		save(file, file.name);
		notify('Story image saved — add it to your Instagram story');
	}

	const socials = $derived.by(() => {
		const link = encodeURIComponent(verseUrl);
		const text = encodeURIComponent(shareText);
		return [
			{ label: 'X', icon: Twitter, href: `https://x.com/intent/post?text=${text}&url=${link}` },
			{ label: 'Telegram', icon: Send, href: `https://t.me/share/url?url=${link}&text=${text}` },
			{ label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${text}%0A${link}` },
			{ label: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${link}` }
		];
	});
</script>

<dialog
	bind:this={dialog}
	class="share"
	onclose={() => (open = false)}
	onclick={(e) => e.target === dialog && (open = false)}
	aria-label="Share this verse"
>
	<div class="shell">
		<!-- preview -->
		<div class="stage">
			{#key bump}
				<canvas bind:this={canvas} class="preview" class:ready aria-label="Share card preview"></canvas>
			{/key}
			{#if !ready}<span class="spinner" aria-hidden="true"></span>{/if}
			<span class="dims">{ratio.width} × {ratio.height}</span>
		</div>

		<!-- controls -->
		<div class="panel">
			<header class="head">
				<div>
					<h2>Share verse</h2>
					<p>{verse?.ref ?? `№ ${verse?.n ?? ''}`}</p>
				</div>
				<div class="head-acts">
					<button class="ghost" onclick={reset} title="Reset style" aria-label="Reset style">
						<RotateCcw size={15} />
					</button>
					<button class="ghost" onclick={() => (open = false)} aria-label="Close"><X size={16} /></button>
				</div>
			</header>

			<section>
				<h3>Template</h3>
				<div class="templates">
					{#each CARD_TEMPLATES as t (t.id)}
						<button
							class="tpl"
							class:on={options.template === t.id}
							onclick={() => set('template', t.id)}
							aria-pressed={options.template === t.id}
						>
							<span class="tpl-frame"><canvas bind:this={thumbs[t.id]}></canvas></span>
							<span class="tpl-label">{t.label}</span>
						</button>
					{/each}
				</div>
			</section>

			<section>
				<h3>Size</h3>
				<div class="chips">
					{#each Object.entries(CARD_RATIOS) as [id, r] (id)}
						<button class="chip" class:on={options.ratio === id} onclick={() => set('ratio', id as CardRatio)}>
							<span class="ratio-icon" style="--rw:{r.width};--rh:{r.height}"></span>
							{r.label} <span class="hint">{r.hint}</span>
						</button>
					{/each}
				</div>
			</section>

			<section>
				<h3>Colour</h3>
				<div class="swatches">
					{#each PALETTES as p (p.id)}
						<button
							class="sw"
							class:on={options.palette === p.id}
							style="--c:{p.bg}"
							onclick={() => set('palette', p.id)}
							title={p.label}
							aria-label={p.label}
						></button>
					{/each}
					<label
						class="sw custom"
						class:on={options.palette === 'custom'}
						style="--c:{options.custom}"
						title="Pick any colour"
					>
						<input
							type="color"
							value={options.custom}
							oninput={(e) => {
								options.custom = (e.target as HTMLInputElement).value;
								options.palette = 'custom';
							}}
							aria-label="Custom colour"
						/>
					</label>
				</div>
			</section>

			<div class="row2">
				<section>
					<h3>Typeface</h3>
					<div class="seg">
						{#each fonts as f (f.id)}
							<button class={f.cls} class:on={options.font === f.id} onclick={() => set('font', f.id)}>{f.label}</button>
						{/each}
					</div>
				</section>
				<section>
					<h3>Align</h3>
					<div class="seg">
						<button class:on={options.align === 'left'} onclick={() => set('align', 'left')} aria-label="Align left">
							<AlignLeft size={14} />
						</button>
						<button class:on={options.align === 'center'} onclick={() => set('align', 'center')} aria-label="Align center">
							<AlignCenter size={14} />
						</button>
					</div>
				</section>
			</div>

			<section>
				<h3>Text size <span class="val">{Math.round(options.scale * 100)}%</span></h3>
				<input
					class="range"
					type="range"
					min="0.7"
					max="1.3"
					step="0.05"
					bind:value={options.scale}
					style="--pct:{((options.scale - 0.7) / 0.6) * 100}%"
					aria-label="Text size"
				/>
			</section>

			<section>
				<h3>Show</h3>
				<div class="chips">
					{#each toggles as t (t.key)}
						<button class="chip" class:on={options[t.key]} onclick={() => (options[t.key] = !options[t.key])} aria-pressed={options[t.key]}>
							<span class="tick"><Check size={11} strokeWidth={2.5} /></span>
							{t.label}
						</button>
					{/each}
				</div>
			</section>

			<section>
				<h3>Link on card</h3>
				<div class="chips">
					{#each links as l (l.id)}
						<button class="chip" class:on={options.link === l.id} onclick={() => set('link', l.id)}>{l.label}</button>
					{/each}
				</div>
			</section>

			<section class="actions">
				<button class="primary" disabled={!ready} onclick={download}>
					{#if copied === 'download'}<Check size={15} />{:else}<Download size={15} />{/if}
					Download
				</button>
				<button class="secondary" disabled={!ready} onclick={share}><Share2 size={15} /> Share</button>
				{#if canCopyImage}
					<button class="secondary square" disabled={!ready} onclick={copyImage} title="Copy image" aria-label="Copy image">
						{#if copied === 'image'}<Check size={15} />{:else}<ClipboardCopy size={15} />{/if}
					</button>
				{/if}
			</section>

			<section class="links">
				<div class="linkbox">
					<Link2 size={13} />
					<span>{verseUrl.replace(/^https?:\/\//, '')}</span>
					<button onclick={() => copyText(verseUrl, 'link', 'Link copied')} aria-label="Copy link">
						{#if copied === 'link'}<Check size={13} />{:else}Copy{/if}
					</button>
				</div>
				<div class="socials">
					<button class="story" disabled={!ready} onclick={story}><Instagram size={14} /> Story</button>
					{#each socials as s (s.label)}
						<a href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} aria-label="Share on {s.label}">
							<s.icon size={15} />
						</a>
					{/each}
					<button
						class="txt"
						onclick={() => copyText(shareText, 'text', 'Verse copied')}
						title="Copy verse text"
						aria-label="Copy verse text"
					>
						{#if copied === 'text'}<Check size={14} />{:else}Aa{/if}
					</button>
				</div>
				<p class="tg">Posted first on <a href="https://{TELEGRAM_HOST}" target="_blank" rel="noopener noreferrer">{TELEGRAM_HOST}</a></p>
			</section>

			{#if notice}
				<p class="notice" class:error={notice.error} role="status">{notice.text}</p>
			{/if}
		</div>
	</div>
</dialog>

<style>
	.share {
		--bg: #0e0e0e;
		--ink: #f2f2f2;
		--ink-2: #c8c8c8;
		--mute: #7a7a7a;
		--faint: #3a3a3a;
		--line: #1f1f1f;
		--line-2: #2c2c2c;
		--out: cubic-bezier(0.22, 1, 0.36, 1);
		margin: auto;
		width: min(1100px, calc(100% - 1rem));
		max-height: 92dvh;
		padding: 0;
		border: 1px solid var(--line-2);
		border-radius: 18px;
		background: var(--bg);
		color: var(--ink);
		font-family: 'Geist', system-ui, sans-serif;
		font-size: 13px;
		overflow: hidden;
		box-shadow: 0 40px 120px rgba(0, 0, 0, 0.7);
	}
	.share[open] {
		animation: pop-in 0.45s var(--out);
	}
	.share::backdrop {
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(6px);
	}
	.share[open]::backdrop {
		animation: fade 0.35s ease;
	}
	@keyframes pop-in {
		from {
			opacity: 0;
			transform: translateY(14px) scale(0.98);
		}
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
	button {
		cursor: pointer;
	}
	button:disabled {
		cursor: default;
		opacity: 0.45;
	}
	:focus-visible {
		outline: 1px solid var(--ink);
		outline-offset: 2px;
	}

	.shell {
		display: flex;
		max-height: 92dvh;
		height: min(88dvh, 820px);
	}
	@media (max-width: 820px) {
		.shell {
			flex-direction: column;
			height: auto;
			overflow-y: auto;
		}
	}

	/* ---------- stage ---------- */
	.stage {
		position: relative;
		flex: 1;
		min-width: 0;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 36px 36px 48px;
		background:
			radial-gradient(circle at 50% 40%, #1a1a1a, transparent 70%),
			repeating-conic-gradient(#111 0 25%, #0c0c0c 0 50%) 0 0 / 22px 22px;
	}
	@media (max-width: 820px) {
		.stage {
			flex: none;
			height: 52dvh;
			padding: 20px;
		}
	}
	.preview {
		max-width: 100%;
		max-height: 100%;
		min-height: 0;
		border-radius: 10px;
		box-shadow:
			0 30px 80px rgba(0, 0, 0, 0.6),
			0 0 0 1px rgba(255, 255, 255, 0.06);
		opacity: 0;
		transition: opacity 0.3s;
	}
	.preview.ready {
		opacity: 1;
		animation: settle 0.5s var(--out);
	}
	@keyframes settle {
		from {
			transform: scale(0.97);
			opacity: 0.4;
		}
	}
	.spinner {
		position: absolute;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: 1.5px solid var(--faint);
		border-top-color: var(--ink);
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(1turn);
		}
	}
	.dims {
		position: absolute;
		bottom: 12px;
		left: 50%;
		translate: -50% 0;
		padding: 3px 10px;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.55);
		border: 1px solid var(--line-2);
		font-family: 'Geist Mono', monospace;
		font-size: 10.5px;
		color: var(--mute);
		backdrop-filter: blur(6px);
	}

	/* ---------- panel ---------- */
	.panel {
		width: 380px;
		flex: none;
		display: flex;
		flex-direction: column;
		gap: 22px;
		padding: 22px 22px 26px;
		border-left: 1px solid var(--line);
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--faint) transparent;
	}
	@media (max-width: 820px) {
		.panel {
			width: auto;
			border-left: 0;
			border-top: 1px solid var(--line);
			overflow: visible;
		}
	}
	.head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
	}
	.head h2 {
		font-size: 17px;
		font-weight: 500;
		letter-spacing: -0.01em;
	}
	.head p {
		margin-top: 3px;
		color: var(--mute);
		font-family: 'Newsreader', 'Noto Serif Ethiopic', serif;
		font-style: italic;
		font-size: 14px;
	}
	.head-acts {
		display: flex;
		gap: 2px;
	}
	.ghost {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 8px;
		color: var(--mute);
		transition:
			color 0.2s,
			background 0.2s,
			transform 0.4s var(--out);
	}
	.ghost:hover {
		color: var(--ink);
		background: rgba(255, 255, 255, 0.06);
	}
	.ghost:hover :global(.lucide-rotate-ccw) {
		transform: rotate(-120deg);
	}
	.ghost :global(svg) {
		transition: transform 0.5s var(--out);
	}

	h3 {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
		font-family: 'Geist Mono', monospace;
		font-size: 10px;
		font-weight: 400;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mute);
	}
	.val {
		color: var(--ink-2);
		letter-spacing: 0.04em;
	}

	/* templates */
	.templates {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
	}
	.tpl {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.tpl-frame {
		display: grid;
		place-items: center;
		width: 100%;
		height: 84px;
		padding: 5px;
		border-radius: 10px;
		background: #141414;
		border: 1px solid var(--line);
		transition:
			border-color 0.25s,
			transform 0.35s var(--out),
			box-shadow 0.25s;
	}
	.tpl-frame canvas {
		max-width: 100%;
		max-height: 100%;
		border-radius: 3px;
	}
	.tpl:hover .tpl-frame {
		border-color: var(--faint);
		transform: translateY(-2px);
	}
	.tpl.on .tpl-frame {
		border-color: var(--ink);
		box-shadow: 0 0 0 1px var(--ink);
	}
	.tpl-label {
		font-size: 11px;
		color: var(--mute);
		transition: color 0.2s;
	}
	.tpl.on .tpl-label {
		color: var(--ink);
	}

	/* chips */
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 28px;
		padding: 0 11px;
		border-radius: 999px;
		border: 1px solid var(--line-2);
		color: var(--mute);
		font-size: 12px;
		transition:
			color 0.2s,
			border-color 0.2s,
			background 0.2s,
			transform 0.3s var(--out);
	}
	.chip:hover {
		color: var(--ink);
		border-color: var(--faint);
	}
	.chip:active,
	.primary:active,
	.secondary:active,
	.sw:active {
		transform: scale(0.95);
	}
	.chip.on {
		color: var(--bg);
		background: var(--ink);
		border-color: var(--ink);
	}
	.hint {
		opacity: 0.55;
		font-family: 'Geist Mono', monospace;
		font-size: 10.5px;
	}
	.ratio-icon {
		width: calc(var(--rw) / max(var(--rw), var(--rh)) * 12px);
		height: calc(var(--rh) / max(var(--rw), var(--rh)) * 12px);
		border: 1.2px solid currentColor;
		border-radius: 2px;
	}
	.tick {
		display: grid;
		place-items: center;
		width: 0;
		overflow: hidden;
		transition: width 0.25s var(--out);
	}
	.chip.on .tick {
		width: 11px;
	}

	/* swatches */
	.swatches {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.sw {
		position: relative;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--c);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.14),
			0 0 0 0 var(--ink);
		transition:
			box-shadow 0.3s var(--out),
			transform 0.3s var(--out);
	}
	.sw:hover {
		transform: scale(1.1);
	}
	.sw.on {
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.14),
			0 0 0 2px var(--bg),
			0 0 0 3.5px var(--ink);
	}
	.custom {
		cursor: pointer;
		background:
			conic-gradient(from 90deg, #f43f5e, #f59e0b, #84cc16, #06b6d4, #6366f1, #d946ef, #f43f5e);
	}
	.custom.on {
		background: var(--c);
	}
	.custom input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	/* segmented */
	.row2 {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 16px;
	}
	.seg {
		display: flex;
		padding: 3px;
		border: 1px solid var(--line-2);
		border-radius: 999px;
		width: fit-content;
	}
	.seg button {
		display: grid;
		place-items: center;
		height: 26px;
		min-width: 34px;
		padding: 0 11px;
		border-radius: 999px;
		color: var(--mute);
		font-size: 12.5px;
		transition:
			color 0.2s,
			background 0.3s var(--out);
	}
	.seg button:hover {
		color: var(--ink);
	}
	.seg button.on {
		background: var(--ink);
		color: var(--bg);
	}
	.f-serif,
	.f-italic {
		font-family: 'Newsreader', serif;
		font-size: 14px !important;
	}
	.f-italic {
		font-style: italic;
	}

	/* range */
	.range {
		width: 100%;
		height: 18px;
		appearance: none;
		background: transparent;
		cursor: pointer;
	}
	.range::-webkit-slider-runnable-track {
		height: 2px;
		border-radius: 2px;
		background: linear-gradient(to right, var(--ink) var(--pct), var(--line-2) var(--pct));
	}
	.range::-moz-range-track {
		height: 2px;
		background: linear-gradient(to right, var(--ink) var(--pct), var(--line-2) var(--pct));
	}
	.range::-webkit-slider-thumb {
		appearance: none;
		width: 16px;
		height: 16px;
		margin-top: -7px;
		border-radius: 50%;
		background: var(--ink);
		box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08);
		transition: transform 0.2s var(--out);
	}
	.range::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border: 0;
		border-radius: 50%;
		background: var(--ink);
	}
	.range:active::-webkit-slider-thumb {
		transform: scale(1.25);
	}

	/* actions */
	.actions {
		display: flex;
		gap: 8px;
		padding-top: 4px;
	}
	.primary,
	.secondary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		height: 40px;
		padding: 0 16px;
		border-radius: 12px;
		font-size: 13px;
		font-weight: 500;
		transition:
			background 0.2s,
			border-color 0.2s,
			transform 0.3s var(--out);
	}
	.primary {
		flex: 1;
		background: var(--ink);
		color: var(--bg);
	}
	.primary:hover:not(:disabled) {
		background: #fff;
	}
	.secondary {
		flex: 1;
		border: 1px solid var(--line-2);
		color: var(--ink);
	}
	.secondary:hover:not(:disabled) {
		border-color: var(--faint);
		background: rgba(255, 255, 255, 0.04);
	}
	.square {
		flex: none;
		width: 40px;
		padding: 0;
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.linkbox {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 36px;
		padding: 0 4px 0 12px;
		border-radius: 10px;
		border: 1px solid var(--line);
		background: #121212;
		color: var(--mute);
	}
	.linkbox span {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: 'Geist Mono', monospace;
		font-size: 11px;
	}
	.linkbox button {
		display: grid;
		place-items: center;
		height: 28px;
		min-width: 52px;
		padding: 0 10px;
		border-radius: 7px;
		font-size: 12px;
		color: var(--ink);
		background: rgba(255, 255, 255, 0.06);
		transition: background 0.2s;
	}
	.linkbox button:hover {
		background: rgba(255, 255, 255, 0.12);
	}
	.socials {
		display: flex;
		align-items: center;
		gap: 2px;
	}
	.socials a,
	.socials .txt {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border-radius: 10px;
		color: var(--mute);
		font-family: 'Newsreader', serif;
		font-size: 15px;
		transition:
			color 0.2s,
			background 0.2s,
			transform 0.3s var(--out);
	}
	.socials a:hover,
	.socials .txt:hover {
		color: var(--ink);
		background: rgba(255, 255, 255, 0.06);
		transform: translateY(-2px);
	}
	.story {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 32px;
		margin-right: 6px;
		padding: 0 12px;
		border-radius: 999px;
		border: 1px solid var(--line-2);
		color: var(--ink-2);
		font-size: 12px;
		transition:
			border-color 0.2s,
			color 0.2s;
	}
	.story:hover:not(:disabled) {
		color: var(--ink);
		border-color: var(--faint);
	}
	.tg {
		font-size: 11.5px;
		color: var(--faint);
	}
	.tg a {
		color: var(--mute);
		border-bottom: 1px solid var(--line-2);
	}
	.tg a:hover {
		color: var(--ink);
	}
	.notice {
		position: sticky;
		bottom: 0;
		padding: 10px 12px;
		border-radius: 10px;
		background: var(--ink);
		color: var(--bg);
		font-size: 12.5px;
		animation: pop-in 0.35s var(--out);
	}
	.notice.error {
		background: #3a1414;
		color: #ffb4b4;
	}
	@media (prefers-reduced-motion: reduce) {
		.share[open],
		.preview.ready,
		.notice {
			animation: none;
		}
	}
</style>
