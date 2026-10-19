<script lang="ts">
	import BlogHeader from '../../components/blog_components/blog_header.svelte';
	// import SectionTitle from '../../components/blog_components/section_title.svelte';
	// import BlogHeader from '../../components/blog_header.svelte';
	import SectionTitle from '../../components/section_title.svelte';
	import config from '../../lib/blog-config.json';
	import { Toaster } from 'svelte-sonner';
	import { blogDateToUtc, formatBlogDate } from '$lib/blog-date';

	type Blog = {
		slug: string;
		title: string;
		date: string | null;
		description: string;
		category: string;
	};

	type Data = {
		grouped: Record<string, Blog[]>;
	};

	export let data: Data;

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
					<a href={`/blog/${blog.slug}`}>
						<div
							class="group h-full w-full overflow-clip rounded border p-2 px-3 shadow-xs transition-all hover:shadow-lg dark:bg-zinc-900"
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
								{#if isNew(blog.date)}
									<div class="rounded-full px-2 py-[0.8px] text-emerald-500">New</div>
								{/if}
							</div>
							<div class="flex items-center gap-2 pb-2">
								<div class="flex w-full items-center justify-between">
									<div
										class="text-md font-semibold dark:text-neutral-300 dark:group-hover:text-white"
									>
										{blog.title}
									</div>
								</div>
							</div>
							<div
								class="text-sm text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-400"
							>
								{blog.description}
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/each}
</div>

<Toaster expand={true} />
