<script lang="ts">
	import 'highlight.js/styles/github-dark.css';
	import { onMount } from 'svelte';
	import { ChevronUp } from 'lucide-svelte';
	import { Toaster } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import BlogHeader from '../../../components/blog_components/blog_header.svelte';
	import SeriesNav from '../../../components/blog_components/series_nav.svelte';
	import PostActions from '../../../components/blog_components/post_actions.svelte';
	import config from '$lib/blog-config.json';
	import { formatBlogDate } from '$lib/blog-date';
	import type { SeriesInfo } from '$lib/blogs';
	type BlogData = {
		content: string;
		meta: {
			slug: string;
			headerImage: string | null;
			title: string;
			date: string | null;
			description: string;
			category: string;
		};
		series: SeriesInfo | null;
		og: {
			url: string;
			image: string;
			isGenerated: boolean;
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
	<meta name="description" content={data.meta.description} />
	<link rel="canonical" href={data.og.url} />

	<meta property="og:type" content="article" />
	<meta property="og:site_name" content={config.name} />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:url" content={data.og.url} />
	<meta property="og:image" content={data.og.image} />
	<meta property="og:image:alt" content={data.meta.title} />
	{#if data.og.isGenerated}
		<meta property="og:image:type" content="image/png" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
	{#if data.meta.date}
		<meta property="article:published_time" content={data.meta.date} />
	{/if}
	<meta property="article:section" content={data.meta.category} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@dagmawibabi" />
	<meta name="twitter:title" content={data.meta.title} />
	<meta name="twitter:description" content={data.meta.description} />
	<meta name="twitter:image" content={data.og.image} />
	<link
		rel="alternate"
		type="application/rss+xml"
		title={`${config.name}'s Blog`}
		href="/blog/rss.xml"
	/>
</svelte:head>

<div
	bind:this={articleContainer}
	class="no-scrollbar relative mx-auto w-[96%] pt-4 pb-56 md:w-[96%] lg:w-1/2 xl:w-1/2 2xl:w-1/2"
>
	<!-- Header -->
	<div class="sticky top-0 mb-3 bg-white print:hidden dark:bg-zinc-950">
		<BlogHeader showDescription={false} link="/blog" />
	</div>

	<!-- Metadata -->
	<div class="flex text-sm italic md:hidden">
		{formatBlogDate(data.meta.date)}
	</div>
	<div class="flex items-center justify-between pb-2">
		<div
			class="prose prose-h1:text-2xl prose-h1:font-semibold dark:prose-headings:text-white dark:text-white"
		>
			<h1>{data.meta.title}</h1>
		</div>
		<div class="hidden text-sm italic md:flex dark:text-neutral-400">
			{formatBlogDate(data.meta.date)}
		</div>
	</div>

	{#if data.series}
		<div class="-mt-1 pb-3 text-sm text-neutral-500 italic">
			Part {data.series.part} of {data.series.total} · {data.series.name}
		</div>
	{/if}

	<!-- Content -->
	<div
		class="blog-content prose prose-h1:text-2xl prose-h1:font-semibold prose-h2:text-xl prose-h2:font-semibold prose-h3:text-lg prose-h3:font-semibold prose-code:rounded-l prose-code:bg-neutral-100 prose-code:text-red-500 prose-pre:whitespace-pre-wrap prose-pre:break-all prose-pre:bg-neutral-100 prose-pre:font-mono prose-pre:text-black prose-img:my-0 prose-img:py-0 prose-a:text-blue-600 dark:prose-headings:text-white dark:prose-a:text-blue-500 dark:prose-blockquote:text-neutral-300 dark:prose-strong:text-white dark:prose-code:bg-neutral-900 dark:prose-code:text-orange-500 dark:prose-pre:bg-neutral-900 dark:prose-ol:text-white dark:prose-ul:text-white dark:prose-li:text-white min-w-full dark:text-white"
	>
		{@html data.content}
	</div>

	<!-- Share / download -->
	<div class="mt-12 border-t border-dashed border-zinc-300 pt-5 dark:border-zinc-800">
		<PostActions post={data.meta} />
	</div>

	{#if data.series}
		<div class="print:hidden">
				<SeriesNav series={data.series} />
		</div>
	{/if}
</div>

{#if showScrollToTop}
	<Button
		onclick={scrollToTop}
		size="icon"
		class="fixed right-4 bottom-6 z-40 print:hidden rounded-full border border-zinc-200/80 bg-white/92 text-black shadow-lg shadow-zinc-950/10 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-50 md:right-8 md:bottom-8 dark:border-zinc-800 dark:bg-zinc-950/92 dark:text-white dark:shadow-black/30"
		aria-label="Scroll to top"
	>
		<ChevronUp class="size-4" />
	</Button>
{/if}

<Toaster expand={true} />

<style>
	/* Keep linked headings clear of the sticky header */
	.blog-content :global(:is(h1, h2, h3, h4, h5, h6)) {
		scroll-margin-top: 6rem;
	}

	.blog-content :global(.heading-anchor) {
		margin-left: 0.4em;
		color: #a3a3a3;
		font-weight: 400;
		text-decoration: none;
		opacity: 0;
		transition: opacity 150ms;
	}

	.blog-content :global(:is(h1, h2, h3, h4, h5, h6):hover .heading-anchor),
	.blog-content :global(.heading-anchor:focus-visible) {
		opacity: 1;
	}

	/* Touch screens can't hover, so keep the anchor faintly visible there */
	@media (hover: none) {
		.blog-content :global(.heading-anchor) {
			opacity: 0.5;
		}
	}
</style>
