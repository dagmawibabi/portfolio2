<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronUp } from 'lucide-svelte';
	import { Toaster } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import BlogHeader from '../../../components/blog_components/blog_header.svelte';
	type BlogData = {
		content: string;
		meta: {
			title: string;
			date: string;
			description: string;
			category: string;
		};
	};

	export let data: BlogData;

	// SCROLL TO TOP BUTTON LOGIC
	const LONG_CONTENT_RATIO = 1.5;
	const SCROLL_THRESHOLD = 400;

	let articleContainer: HTMLDivElement | null = null;
	let isLongContent = false;
	let hasScrolledEnough = false;

	$: showScrollToTop = isLongContent && hasScrolledEnough;

	function updateScrollState() {
		hasScrolledEnough = window.scrollY > SCROLL_THRESHOLD;
	}

	function updateContentLengthState() {
		if (!articleContainer) {
			isLongContent = false;
			return;
		}

		isLongContent = articleContainer.scrollHeight > window.innerHeight * LONG_CONTENT_RATIO;
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => {
		const syncState = () => {
			updateContentLengthState();
			updateScrollState();
		};

		syncState();
		window.addEventListener('scroll', updateScrollState, { passive: true });
		window.addEventListener('resize', syncState);

		return () => {
			window.removeEventListener('scroll', updateScrollState);
			window.removeEventListener('resize', syncState);
		};
	});
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>

<div
	bind:this={articleContainer}
	class="no-scrollbar relative mx-auto w-[96%] pt-4 pb-56 md:w-[96%] lg:w-1/2 xl:w-1/2 2xl:w-1/2"
>
	<!-- Header -->
	<div class="sticky top-0 mb-3 bg-white dark:bg-zinc-950">
		<BlogHeader showDescription={false} link="/blog" />
	</div>

	<!-- Metadata -->
	<div class="flex text-sm italic md:hidden">
		{new Date(data.meta.date).toDateString()}
	</div>
	<div class="flex items-center justify-between pb-2">
		<div
			class="prose prose-h1:text-2xl prose-h1:font-semibold dark:prose-headings:text-white dark:text-white"
		>
			<h1>{data.meta.title}</h1>
		</div>
		<div class="hidden text-sm italic md:flex dark:text-neutral-400">
			{new Date(data.meta.date).toDateString()}
		</div>
	</div>

	<!-- Content -->
	<div
		class="prose prose-h1:text-2xl prose-h1:font-semibold prose-h2:text-xl prose-h2:font-semibold prose-h3:text-lg prose-h3:font-semibold prose-code:rounded-l prose-code:bg-neutral-100 prose-code:text-red-500 prose-pre:whitespace-pre-wrap prose-pre:break-all prose-pre:bg-neutral-100 prose-pre:font-mono prose-pre:text-black prose-img:my-0 prose-img:py-0 prose-a:text-blue-600 dark:prose-headings:text-white dark:prose-a:text-blue-500 dark:prose-blockquote:text-neutral-300 dark:prose-strong:text-white dark:prose-code:bg-neutral-900 dark:prose-code:text-orange-500 dark:prose-pre:bg-neutral-900 dark:prose-ol:text-white dark:prose-ul:text-white dark:prose-li:text-white min-w-full dark:text-white"
	>
		{@html data.content}
	</div>
</div>

{#if showScrollToTop}
	<Button
		onclick={scrollToTop}
		size="icon"
		class="fixed right-4 bottom-6 z-40 rounded-full border border-zinc-200/80 bg-white/92 text-black shadow-lg shadow-zinc-950/10 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-50 md:right-8 md:bottom-8 dark:border-zinc-800 dark:bg-zinc-950/92 dark:text-white dark:shadow-black/30"
		aria-label="Scroll to top"
	>
		<ChevronUp class="size-4" />
	</Button>
{/if}

<Toaster expand={true} />
