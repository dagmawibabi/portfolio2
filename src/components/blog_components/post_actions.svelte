<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { ChevronDown, Download, FileDown, FileText, Share2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { blogMarkdownPath } from '$lib/blog-links';
	import type { SharePost } from '$lib/share-card';
	import ShareDialog from './share_dialog.svelte';

	let { post }: { post: SharePost } = $props();

	let shareOpen = $state(false);

	async function downloadMarkdown() {
		try {
			const response = await fetch(blogMarkdownPath(post.slug));
			if (!response.ok) throw new Error(response.statusText);
			const url = URL.createObjectURL(await response.blob());
			const a = document.createElement('a');
			a.href = url;
			a.download = `${post.slug}.md`;
			a.click();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
		} catch {
			toast.error("Couldn't download the markdown");
		}
	}

	// The browser's print dialog saves a clean PDF (site chrome is hidden with print:hidden)
	function downloadPdf() {
		window.print();
	}

	const button =
		'flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-1.5 text-sm text-zinc-700 transition-all hover:border-zinc-500 hover:text-black hover:shadow-sm dark:border-zinc-800 dark:text-neutral-300 dark:hover:border-zinc-600 dark:hover:text-white';
	const item =
		'flex cursor-pointer items-center gap-2.5 rounded px-2.5 py-2 text-sm text-zinc-700 outline-none select-none data-highlighted:bg-zinc-100 data-highlighted:text-black dark:text-neutral-300 dark:data-highlighted:bg-zinc-800 dark:data-highlighted:text-white';
</script>

<div class="flex flex-wrap items-center gap-2 print:hidden">
	<button type="button" class={button} onclick={() => (shareOpen = true)}>
		<Share2 class="size-4" />
		Share
	</button>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger class={button}>
			<Download class="size-4" />
			Download
			<ChevronDown class="-mr-1 size-3.5 opacity-60" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownMenu.Content
				align="start"
				sideOffset={6}
				class="z-50 min-w-48 rounded-md border border-zinc-200 bg-white p-1 shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:border-zinc-800 dark:bg-zinc-950"
			>
				<DropdownMenu.Item class={item} onSelect={downloadPdf}>
					<FileDown class="size-4 text-red-500" />
					<div class="flex flex-col">
						<span>PDF</span>
						<span class="text-xs text-zinc-500">Print or save as PDF</span>
					</div>
				</DropdownMenu.Item>
				<DropdownMenu.Item class={item} onSelect={downloadMarkdown}>
					<FileText class="size-4 text-sky-500" />
					<div class="flex flex-col">
						<span>Markdown</span>
						<span class="text-xs text-zinc-500">The original .md file</span>
					</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</div>

<ShareDialog bind:open={shareOpen} {post} />
