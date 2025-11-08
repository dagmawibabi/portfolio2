<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu/index';
	import logo from '$lib/assets/logo/DagmawiBabiLogo.png';
	import config from '$lib/blog-config.json';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { toast } from 'svelte-sonner';
	import { mode } from 'mode-watcher';
	import { Copy, Download, Image, Type, TypeOutline } from 'lucide-svelte';

	// PNG
	import logo_white_png from '$lib/assets/logo/logo_white.png';
	import logo_black_png from '$lib/assets/logo/logo_black.png';
	import wordmark_light_png from '$lib/assets/logo/wordmark_light.png';
	import wordmark_dark_png from '$lib/assets/logo/wordmark_dark.png';

	// SVG
	import logo_white_svg from '$lib/assets/logo/logo_white.svg?raw';
	import logo_black_svg from '$lib/assets/logo/logo_black.svg?raw';
	import wordmark_light_svg from '$lib/assets/logo/wordmark_light.svg?raw';
	import wordmark_dark_svg from '$lib/assets/logo/wordmark_dark.svg?raw';

	function copySVG(data: string) {
		navigator.clipboard.writeText(data);
		toast.success(`Copied Successfully! `, {
			class:
				'bg-white dark:bg-neutral-800 text-black dark:text-white dark:border-none dark:outline-neutral-700 dark:outline dark:outline-2'
		});
	}
	const handleCopyLogo = () => copySVG(mode.current === 'dark' ? logo_white_svg : logo_black_svg);
	const handleCopyWordmark = () =>
		copySVG(mode.current === 'dark' ? wordmark_dark_svg : wordmark_light_svg);

	const downloadFile = (data: string | Blob, filename: string) => {
		toast.info(`Downloading... `, {
			class:
				'bg-white dark:bg-neutral-800 text-black dark:text-white dark:border-none dark:outline-neutral-700 dark:outline dark:outline-2'
		});
		const url = typeof data === 'string' ? data : URL.createObjectURL(data);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		if (data instanceof Blob) URL.revokeObjectURL(url);
		toast.success(`Downloaded Successfully! `, {
			class:
				'bg-white dark:bg-neutral-800 text-black dark:text-white dark:border-none dark:outline-neutral-700 dark:outline dark:outline-2'
		});
	};
	const handleDownloadLogo = async () => {
		const blob = await fetch(mode.current === 'dark' ? logo_white_png : logo_black_png).then((r) =>
			r.blob()
		);
		downloadFile(blob, 'dagmawibabi-logo.png');
	};
	const handleDownloadWordmark = async () => {
		const blob = await fetch(mode.current === 'dark' ? wordmark_dark_png : wordmark_light_png).then(
			(r) => r.blob()
		);
		downloadFile(blob, 'dagmawibabi-wordmark.png');
	};
	const handleDownloadBrandAssets = async () => {
		downloadFile('/DagmawiBabi-Brand-Assets.rar', 'DagmawiBabi-Brand-Assets.rar');
	};
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<div class="flex gap-x-2">
			<img src={logo} alt="logo" class="flex w-12 invert-0 dark:invert" />
			<div class="flex flex-col justify-center">
				<div class="text-xl font-semibold">{config.name}</div>
				<span class="-mt-1">{config.subtitle}</span>
			</div>
		</div>
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item onclick={handleCopyLogo}>
			<div class="flex items-center gap-x-2">
				<Copy size="16" />
				Copy Logo as SVG
			</div>
		</ContextMenu.Item>
		<ContextMenu.Item onclick={handleCopyWordmark}>
			<div class="flex items-center gap-x-2">
				<Type size="16" />
				Copy Wordmark as SVG
			</div>
		</ContextMenu.Item>
		<ContextMenu.Item onclick={handleDownloadWordmark}>
			<div class="flex items-center gap-x-2">
				<TypeOutline size="16" />
				Download Wordmark as PNG
			</div></ContextMenu.Item
		>
		<ContextMenu.Item onclick={handleDownloadLogo}>
			<div class="flex items-center gap-x-2">
				<Image size="16" />
				Download Logo as PNG
			</div></ContextMenu.Item
		>
		<Separator />
		<ContextMenu.Item onclick={handleDownloadBrandAssets}>
			<div class="flex items-center gap-x-2">
				<Download size="16" />
				Download Brand Assets
			</div>
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
