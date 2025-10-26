<script lang="ts">
	import {
		Instagram,
		Github,
		Linkedin,
		Plane,
		Mail,
		Twitter,
		PlaneIcon,
		LucidePlane,
		Send,
		Phone,
		Smile
	} from 'lucide-svelte';
	import logo from '$lib/assets/logo//DagmawiBabiLogo.png';
	import me from '$lib/assets/me/Me.png';
	import me2 from '$lib/assets/me/Me2.png';
	import SectionTitle from '../../components/section_title.svelte';
	import BlogHeader from '../../components/blog_header.svelte';

	type Blog = {
		slug: string;
		title: string;
		date: string;
		description: string;
		category: string;
	};

	type Data = {
		grouped: Record<string, Blog[]>;
	};

	export let data: Data;

	function isNew(dateString: string) {
		if (!dateString) return false;
		const date = new Date(dateString);
		const now = new Date();
		const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
		return diffDays <= 100; // mark as new if ≤ 7 days old
	}
</script>

<div
	class="no-scrollbar relative mx-auto w-[96%] pb-56 pt-4 md:w-[96%] lg:w-1/2 xl:w-1/2 2xl:w-1/2"
>
	<!-- Header -->
	<BlogHeader />

	<!-- Nav -->
	<div class="flex flex-wrap justify-start gap-2 pb-5 pt-3">
		{#each Object.entries(data.grouped) as [category, blogs]}
			<a href={'#' + category}>
				<div
					class="cursor-pointer rounded-full bg-neutral-100 px-3 py-1 text-sm italic text-zinc-600 hover:bg-neutral-200 hover:text-black"
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
							class="group h-full w-full overflow-clip rounded border p-2 shadow-sm transition-all hover:border-zinc-400 hover:shadow-lg"
							class:border-emerald-500={isNew(blog.date)}
							class:border-zinc-300={!isNew(blog.date)}
							class:bg-emerald-50={isNew(blog.date)}
							class:bg-neutral-50={!isNew(blog.date)}
						>
							<div class="flex items-center justify-between pb-1 text-xs">
								<div class="italic text-neutral-500">
									{new Date(blog.date).toDateString()}
								</div>
								{#if isNew(blog.date)}
									<div class="rounded-full px-2 py-[0.8px] text-emerald-500">New</div>
								{/if}
							</div>
							<div class="flex items-center gap-2 pb-2">
								<div class="flex w-full items-center justify-between">
									<div class="text-md font-semibold">
										{blog.title}
									</div>
								</div>
							</div>
							<div class="text-sm text-neutral-500 group-hover:text-neutral-800">
								{blog.description}
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/each}
</div>
