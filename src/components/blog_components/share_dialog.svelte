<script lang="ts">
	import {
		Check,
		ClipboardCopy,
		Copy,
		Download,
		Facebook,
		Instagram,
		Link2,
		Linkedin,
		LoaderCircle,
		MessageCircle,
		Send,
		Share2,
		Twitter
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import config from '$lib/blog-config.json';
	import { blogUrl, siteHost, substackUrl } from '$lib/blog-links';
	import {
		drawShareCard,
		loadShareAssets,
		SHARE_RATIOS,
		SHARE_TEMPLATES,
		type ShareAssets,
		type ShareLink,
		type ShareOptions,
		type SharePost,
		type ShareRatio
	} from '$lib/share-card';
	import SubstackIcon from './substack_icon.svelte';

	let { open = $bindable(false), post }: { open?: boolean; post: SharePost | null } = $props();

	let options = $state<ShareOptions>({
		template: 'cover',
		ratio: 'story',
		theme: 'light',
		link: 'site',
		showImage: true,
		showDescription: true,
		showDate: true,
		showCategory: false,
		showAuthor: true
	});

	let assets = $state.raw<ShareAssets | null>(null);
	let canvas = $state<HTMLCanvasElement>();
	let thumbs = $state<Record<string, HTMLCanvasElement>>({});
	let copied = $state('');
	let canCopyImage = $state(false);

	let loadedSlug = '';
	let blob: Blob | null = null;
	let renderVersion = 0;

	const siteLink = $derived(post ? blogUrl(post.slug) : '');
	const substackLink = $derived(post ? substackUrl(post.slug) : '');
	const hasImage = $derived(!!assets?.image);
	const themed = $derived(SHARE_TEMPLATES.find((t) => t.id === options.template)?.themed ?? false);
	const ratio = $derived(SHARE_RATIOS[options.ratio]);

	const includeToggles = [
		{ key: 'showImage', label: 'Header image' },
		{ key: 'showDescription', label: 'Description' },
		{ key: 'showDate', label: 'Date' },
		{ key: 'showAuthor', label: 'Author' },
		{ key: 'showCategory', label: 'Category' }
	] as const;

	const linkChoices: { id: ShareLink; label: string }[] = [
		{ id: 'site', label: siteHost },
		{ id: 'substack', label: 'Substack' },
		{ id: 'both', label: 'Both' },
		{ id: 'none', label: 'None' }
	];

	$effect(() => {
		canCopyImage = typeof ClipboardItem !== 'undefined' && !!navigator.clipboard?.write;
	});

	// Fonts, header image and its colours are loaded once per post
	$effect(() => {
		if (!open || !post || loadedSlug === post.slug) return;
		const slug = (loadedSlug = post.slug);
		assets = null;
		loadShareAssets(post)
			.then((loaded) => {
				if (loadedSlug === slug) assets = loaded;
			})
			.catch(() => toast.error("Couldn't prepare the share card"));
	});

	// Redraw the preview and the style thumbnails whenever anything changes
	$effect(() => {
		if (!canvas || !assets || !post) return;
		const opts = { ...options };
		const target = canvas;
		const loaded = assets;
		const current = post;
		const thumbTargets = SHARE_TEMPLATES.map((t) => [t.id, thumbs[t.id]] as const);

		const frame = requestAnimationFrame(() => {
			drawShareCard(target, current, opts, loaded);
			const version = ++renderVersion;
			blob = null;
			target.toBlob((result) => {
				if (version === renderVersion) blob = result;
			}, 'image/png');

			const { width, height } = SHARE_RATIOS[opts.ratio];
			const thumbScale = 240 / Math.max(width, height);
			for (const [template, thumb] of thumbTargets) {
				if (thumb) drawShareCard(thumb, current, { ...opts, template }, loaded, thumbScale);
			}
		});
		return () => cancelAnimationFrame(frame);
	});

	const getBlob = () =>
		new Promise<Blob>((resolve, reject) => {
			if (blob) return resolve(blob);
			if (!canvas) return reject(new Error('Nothing to export'));
			canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('Export failed'))), 'image/png');
		});

	const fileName = () => `${post?.slug ?? 'blog'}-${options.template}-${options.ratio}.png`;

	async function download() {
		try {
			const url = URL.createObjectURL(await getBlob());
			const a = document.createElement('a');
			a.href = url;
			a.download = fileName();
			a.click();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
		} catch {
			toast.error("Couldn't save the image");
		}
	}

	async function share() {
		if (!post) return;
		const text = `${post.title} by ${config.name}`;
		try {
			const file = new File([await getBlob()], fileName(), { type: 'image/png' });
			if (navigator.canShare?.({ files: [file] })) {
				// Some share targets drop `url` when files are attached, so the link rides in the text
				await navigator.share({ files: [file], title: post.title, text: `${text}\n${siteLink}` });
			} else if (navigator.share) {
				await navigator.share({ title: post.title, text, url: siteLink });
			} else {
				await copyText(siteLink, 'site');
			}
		} catch (error) {
			if ((error as Error).name !== 'AbortError') toast.error("Couldn't open the share sheet");
		}
	}

	// Instagram has no web share link, so hand a story-sized image to the share sheet
	// (pick Instagram → Story there), or save it to post from the app on desktop
	async function shareToInstagramStory() {
		if (!post || !assets) return;
		options.ratio = 'story';
		const storyCanvas = document.createElement('canvas');
		drawShareCard(storyCanvas, post, { ...options, ratio: 'story' }, assets);
		const storyBlob = await new Promise<Blob | null>((resolve) => storyCanvas.toBlob(resolve, 'image/png'));
		if (!storyBlob) return toast.error("Couldn't create the story image");
		const file = new File([storyBlob], `${post.slug}-${options.template}-story.png`, { type: 'image/png' });
		try {
			if (navigator.canShare?.({ files: [file] })) {
				await navigator.share({ files: [file] });
				return;
			}
		} catch (error) {
			if ((error as Error).name === 'AbortError') return;
		}
		const url = URL.createObjectURL(file);
		const a = document.createElement('a');
		a.href = url;
		a.download = file.name;
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
		toast.success('Story image saved', {
			description: `Add it to your Instagram story, with a link sticker to ${siteLink.replace(/^https?:\/\//, '')}`
		});
	}

	async function copyImage() {
		try {
			await navigator.clipboard.write([new ClipboardItem({ 'image/png': getBlob() })]);
			flash('image');
			toast.success('Image copied');
		} catch {
			toast.error("Couldn't copy the image, try downloading it instead");
		}
	}

	async function copyText(value: string, key: string) {
		try {
			await navigator.clipboard.writeText(value);
			flash(key);
			toast.success('Link copied');
		} catch {
			toast.error("Couldn't copy the link");
		}
	}

	function flash(key: string) {
		copied = key;
		setTimeout(() => {
			if (copied === key) copied = '';
		}, 1600);
	}

	const socials = $derived.by(() => {
		const url = encodeURIComponent(siteLink);
		const title = encodeURIComponent(post?.title ?? '');
		return [
			{ label: 'X', icon: Twitter, href: `https://x.com/intent/post?text=${title}&url=${url}` },
			{ label: 'Telegram', icon: Send, href: `https://t.me/share/url?url=${url}&text=${title}` },
			{ label: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
			{ label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${title}%20${url}` },
			{ label: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${url}` }
		];
	});

	const chip = (active: boolean) =>
		active
			? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black'
			: 'border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-black dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white';
</script>

<Dialog.Root bind:open>
	<Dialog.Content
		class="w-[calc(100%-1rem)] max-w-5xl gap-0 overflow-hidden rounded-lg p-0 dark:border-zinc-800 dark:bg-zinc-950"
	>
		<div class="flex max-h-[92dvh] flex-col overflow-y-auto md:h-[min(88dvh,820px)] md:flex-row md:overflow-hidden">
			<!-- Preview -->
			<div
				class="relative flex h-[46dvh] shrink-0 items-center justify-center bg-neutral-100 p-4 md:h-auto md:flex-1 md:p-8 dark:bg-zinc-900"
			>
				<canvas
					bind:this={canvas}
					class="max-h-full max-w-full rounded-md shadow-xl shadow-black/15 transition-opacity"
					class:opacity-0={!assets}
					aria-label="Share card preview"
				></canvas>
				{#if !assets}
					<LoaderCircle class="absolute size-6 animate-spin text-zinc-400" />
				{/if}
				<div
					class="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] text-zinc-500 backdrop-blur dark:bg-zinc-950/70 dark:text-zinc-400"
				>
					{ratio.width} × {ratio.height}
				</div>
			</div>

			<!-- Controls -->
			<div
				class="flex flex-col gap-5 border-t p-5 md:w-[23rem] md:overflow-y-auto md:border-t-0 md:border-l dark:border-zinc-800"
			>
				<Dialog.Header class="pr-6 text-left">
					<Dialog.Title>Share post</Dialog.Title>
					<Dialog.Description class="line-clamp-1">{post?.title}</Dialog.Description>
				</Dialog.Header>

				<section>
					<h3 class="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">Style</h3>
					<div class="grid grid-cols-4 gap-2">
						{#each SHARE_TEMPLATES as template}
							<button
								type="button"
								class="group flex flex-col items-center gap-1"
								onclick={() => (options.template = template.id)}
								aria-pressed={options.template === template.id}
							>
								<div
									class="flex h-20 w-full items-center justify-center rounded-md border bg-neutral-100 p-1 transition-all dark:bg-zinc-900 {options.template ===
									template.id
										? 'border-zinc-900 ring-1 ring-zinc-900 dark:border-white dark:ring-white'
										: 'border-transparent group-hover:border-zinc-300 dark:group-hover:border-zinc-700'}"
								>
									<canvas bind:this={thumbs[template.id]} class="max-h-full max-w-full rounded-[3px] shadow-sm"
									></canvas>
								</div>
								<span
									class="text-[11px] {options.template === template.id
										? 'font-medium text-black dark:text-white'
										: 'text-zinc-500'}">{template.label}</span
								>
							</button>
						{/each}
					</div>
				</section>

				<section>
					<h3 class="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">Size</h3>
					<div class="flex flex-wrap gap-1.5">
						{#each Object.entries(SHARE_RATIOS) as [id, size]}
							<button
								type="button"
								class="rounded-full border px-3 py-1 text-xs transition-colors {chip(options.ratio === id)}"
								onclick={() => (options.ratio = id as ShareRatio)}
							>
								{size.label} <span class="opacity-60">{size.hint}</span>
							</button>
						{/each}
					</div>
				</section>

				<section>
					<h3 class="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">Include</h3>
					<div class="flex flex-wrap gap-1.5">
						{#each includeToggles as toggle}
							{@const disabled = toggle.key === 'showImage' && !!assets && !hasImage}
							<button
								type="button"
								class="flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 {chip(
									options[toggle.key] && !disabled
								)}"
								{disabled}
								title={disabled ? 'This post has no header image' : undefined}
								aria-pressed={options[toggle.key]}
								onclick={() => (options[toggle.key] = !options[toggle.key])}
							>
								{#if options[toggle.key] && !disabled}<Check class="size-3" />{/if}
								{toggle.label}
							</button>
						{/each}
					</div>
				</section>

				<section>
					<h3 class="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">
						Link on card
					</h3>
					<div class="flex flex-wrap gap-1.5">
						{#each linkChoices as choice}
							<button
								type="button"
								class="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors {chip(
									options.link === choice.id
								)}"
								onclick={() => (options.link = choice.id)}
							>
								{#if choice.id === 'substack'}<SubstackIcon size={11} />{/if}
								{choice.label}
							</button>
						{/each}
					</div>
				</section>

				{#if themed}
					<section>
						<h3 class="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">Theme</h3>
						<div class="flex gap-1.5">
							{#each ['light', 'dark'] as const as theme}
								<button
									type="button"
									class="rounded-full border px-3 py-1 text-xs capitalize transition-colors {chip(
										options.theme === theme
									)}"
									onclick={() => (options.theme = theme)}
								>
									{theme}
								</button>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Image actions -->
				<section class="flex gap-2">
					<button
						type="button"
						class="flex flex-1 items-center justify-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
						disabled={!assets}
						onclick={download}
					>
						<Download class="size-4" /> Download
					</button>
					<button
						type="button"
						class="flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
						disabled={!assets}
						onclick={share}
					>
						<Share2 class="size-4" /> Share
					</button>
					{#if canCopyImage}
						<button
							type="button"
							class="flex items-center justify-center rounded-md border px-3 py-2 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
							disabled={!assets}
							onclick={copyImage}
							title="Copy image"
							aria-label="Copy image"
						>
							{#if copied === 'image'}<Check class="size-4 text-emerald-500" />{:else}<ClipboardCopy
									class="size-4"
								/>{/if}
						</button>
					{/if}
				</section>

				<!-- Links -->
				<section class="flex flex-col gap-1.5">
					<h3 class="mb-0.5 text-xs font-medium tracking-wide text-zinc-500 uppercase">Links</h3>
					{#each [{ key: 'site', url: siteLink }, { key: 'substack', url: substackLink }] as link}
						<div
							class="flex items-center gap-2 rounded-md border bg-neutral-50 py-1 pr-1 pl-2.5 dark:border-zinc-800 dark:bg-zinc-900"
						>
							{#if link.key === 'substack'}
								<SubstackIcon size={13} class="shrink-0 text-[#FF6719]" />
							{:else}
								<Link2 class="size-3.5 shrink-0 text-zinc-500" />
							{/if}
							<span class="min-w-0 flex-1 truncate text-xs text-zinc-600 dark:text-zinc-400">
								{link.url.replace(/^https?:\/\/(www\.)?/, '')}
							</span>
							<button
								type="button"
								class="rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white"
								onclick={() => copyText(link.url, link.key)}
								aria-label="Copy link"
							>
								{#if copied === link.key}<Check class="size-3.5 text-emerald-500" />{:else}<Copy
										class="size-3.5"
									/>{/if}
							</button>
						</div>
					{/each}
					<div class="flex items-center gap-1 pt-1">
						<button
							type="button"
							class="flex items-center gap-1.5 rounded-full border border-pink-200 bg-gradient-to-r from-amber-50 via-pink-50 to-violet-50 py-1.5 pr-3 pl-2 text-xs text-pink-700 transition-all hover:border-pink-400 hover:shadow-sm disabled:opacity-50 dark:border-pink-900 dark:from-amber-950/30 dark:via-pink-950/30 dark:to-violet-950/30 dark:text-pink-300"
							disabled={!assets}
							onclick={shareToInstagramStory}
							title="Share to Instagram stories"
						>
							<Instagram class="size-4" /> Story
						</button>
						{#each socials as social}
							<a
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								class="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white"
								title={`Share on ${social.label}`}
								aria-label={`Share on ${social.label}`}
							>
								<social.icon class="size-4" />
							</a>
						{/each}
					</div>
				</section>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

