<script lang="ts">
	import BlogHeader from '../../components/blog_components/blog_header.svelte';
	// import SectionTitle from '../../components/blog_components/section_title.svelte';
	// import BlogHeader from '../../components/blog_header.svelte';
	import SectionTitle from '../../components/section_title.svelte';
	import config from '../../lib/blog-config.json';
	import { Toaster } from 'svelte-sonner';
	import { blogDateToUtc, formatBlogDate } from '$lib/blog-date';
	import { Check, Copy, Rss, Share2 } from 'lucide-svelte';
	import { Popover } from 'bits-ui';
	import { toast } from 'svelte-sonner';
	import { rssUrl } from '$lib/blog-links';
	import ShareDialog from '../../components/blog_components/share_dialog.svelte';
	import SubstackIcon from '../../components/blog_components/substack_icon.svelte';

	type Blog = {
		slug: string;
		title: string;
		date: string | null;
		description: string;
		category: string;
		headerImage: string | null;
	};

	type Data = {
		grouped: Record<string, Blog[]>;
	};

	export let data: Data;

	let shareOpen = false;
	let sharePost: Blog | null = null;

	let rssCopied = false;

	async function copyRss() {
		try {
			await navigator.clipboard.writeText(rssUrl);
			rssCopied = true;
			toast.success('RSS link copied');
			setTimeout(() => (rssCopied = false), 1600);
		} catch {
			toast.error("Couldn't copy the link");
		}
	}

	function openShare(blog: Blog) {
		sharePost = blog;
		shareOpen = true;
	}

	function isNew(dateString: string | null) {
		const date = blogDateToUtc(dateString);
		if (!date) return false;
		const now = new Date();
		const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
		return diffDays <= config.newBlogThreshold; // mark as new if ≤ {config.newBlogThreshold} days old
	}
</script>

<svelte:head>
	<title>Blogs | {config.name}</title>
	<meta name="description" content={config.description} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={config.name} />
	<meta property="og:title" content={`Blogs | ${config.name}`} />
	<meta property="og:description" content={config.description} />
	<meta property="og:url" content={`${config.siteUrl}/blog`} />
	<meta property="og:image" content={`${config.siteUrl}/blog/og.png`} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@dagmawibabi" />
	<meta name="twitter:image" content={`${config.siteUrl}/blog/og.png`} />
	<link rel="canonical" href={`${config.siteUrl}/blog`} />
	<link
		rel="alternate"
		type="application/rss+xml"
		title={`${config.name}'s Blog`}
		href="/blog/rss.xml"
	/>
</svelte:head>

<div
	class="no-scrollbar relative mx-auto w-[96%] pt-4 pb-56 md:w-[96%] lg:w-1/2 xl:w-1/2 2xl:w-1/2"
>
	<!-- Header -->
	<BlogHeader />

	<!-- Substack + RSS -->
	<div class="flex flex-wrap items-center gap-2 pt-3 text-xs">
		<a
			href={config.substack}
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-zinc-600 transition-colors hover:border-[#FF6719] hover:text-[#FF6719] dark:border-zinc-800 dark:text-neutral-400 dark:hover:border-[#FF6719] dark:hover:text-[#FF6719]"
		>
			<SubstackIcon size={11} class="text-[#FF6719]" />
			Substack
		</a>

		<Popover.Root>
			<Popover.Trigger
				class="flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-zinc-600 transition-colors hover:border-orange-400 hover:text-orange-500 data-[state=open]:border-orange-400 data-[state=open]:text-orange-500 dark:border-zinc-800 dark:text-neutral-400"
			>
				<Rss size={11} class="text-orange-500" />
				RSS
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					align="start"
					sideOffset={8}
					class="z-50 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-zinc-200 bg-white p-4 shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:border-zinc-800 dark:bg-zinc-950"
				>
					<div class="flex items-center gap-2 pb-1 text-sm font-semibold dark:text-white">
						<Rss size={14} class="text-orange-500" />
						Follow with RSS
					</div>
					<p class="pb-3 text-xs text-zinc-500">
						Add this link to your RSS reader (Feedly, Inoreader, NetNewsWire…) to get new posts as
						they come out.
					</p>
					<div
						class="flex items-center gap-2 rounded-md border bg-neutral-50 py-1 pr-1 pl-2.5 dark:border-zinc-800 dark:bg-zinc-900"
					>
						<span class="min-w-0 flex-1 truncate text-xs text-zinc-700 select-all dark:text-zinc-300">
							{rssUrl}
						</span>
						<button
							type="button"
							class="rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white"
							aria-label="Copy RSS link"
							on:click={copyRss}
						>
							{#if rssCopied}<Check size={14} class="text-emerald-500" />{:else}<Copy size={14} />{/if}
						</button>
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	</div>

	<!-- Nav -->
	<div class="flex flex-wrap justify-start gap-2 pt-3 pb-5">
		{#each Object.entries(data.grouped) as [category, blogs]}
			<a href={'#' + category}>
				<div
					class="cursor-pointer rounded-full bg-neutral-100 px-3 py-1 text-sm text-zinc-600 italic hover:bg-neutral-200 hover:text-black dark:bg-zinc-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
				>
					{category}
				</div>
			</a>
		{/each}
	</div>

	<!-- Blogs -->
	{#each Object.entries(data.grouped) as [category, blogs]}
		<div class="pb-10">
			<div id={category}>
				<SectionTitle title={category} />
			</div>
			<div class="pb-2 pl-10">
				<!-- <div class="h-7 border-l border-dashed border-zinc-900"></div> -->
			</div>

			<div class="grid grid-cols-1 justify-evenly gap-x-2 gap-y-2 md:grid-cols-2">
				{#each blogs as blog, i}
					<div
						class="group relative h-full w-full overflow-clip rounded border p-2 px-3 shadow-xs transition-all hover:shadow-lg dark:bg-zinc-900"
						class:border-emerald-500={isNew(blog.date)}
						class:dark:border-emerald-700={isNew(blog.date)}
						class:dark:border-zinc-800={!isNew(blog.date)}
						class:dark:hover:border-emerald-600={isNew(blog.date)}
						class:dark:hover:border-zinc-700={!isNew(blog.date)}
						class:hover:border-emerald-600={isNew(blog.date)}
						class:hover:border-zinc-400={!isNew(blog.date)}
						class:border-zinc-300={!isNew(blog.date)}
						class:bg-emerald-50={isNew(blog.date)}
						class:bg-neutral-50={!isNew(blog.date)}
					>
						<div class="flex items-center justify-between pb-1 text-xs">
							<div class="text-neutral-500 italic">
								{formatBlogDate(blog.date)}
							</div>
							<div class="flex items-center gap-1">
								{#if isNew(blog.date)}
									<div class="rounded-full px-2 py-[0.8px] text-emerald-500">New</div>
								{/if}
								<!-- Sits above the card's stretched link so it can be clicked on its own -->
								<button
									type="button"
									class="relative z-10 -my-1 -mr-1.5 rounded-full p-1.5 text-neutral-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-neutral-200 hover:text-black focus-visible:opacity-100 dark:hover:bg-zinc-800 dark:hover:text-white [@media(hover:none)]:opacity-100"
									title="Share"
									aria-label={`Share “${blog.title}”`}
									on:click={() => openShare(blog)}
								>
									<Share2 size={14} />
								</button>
							</div>
						</div>
						<div class="flex items-center gap-2 pb-2">
							<div class="flex w-full items-center justify-between">
								<!-- The link stretches over the whole card -->
								<a
									href={`/blog/${blog.slug}`}
									class="text-md font-semibold after:absolute after:inset-0 dark:text-neutral-300 dark:group-hover:text-white"
								>
									{blog.title}
								</a>
							</div>
						</div>
						<div
							class="text-sm text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-400"
						>
							{blog.description}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<ShareDialog bind:open={shareOpen} post={sharePost} />

<Toaster expand={true} />
