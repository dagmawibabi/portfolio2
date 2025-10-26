<script lang="ts">
	import { page } from '$app/state';
	const blogTitle = page.url.pathname.split('/').pop();

	import { Carta, Markdown } from 'carta-md';
	import { math } from '@cartamd/plugin-math';
	import { code } from '@cartamd/plugin-code';
	import DOMPurify from 'isomorphic-dompurify';
	import 'katex/dist/katex.css';
	import BlogHeader from '../../../components/blog_header.svelte';
	const carta = new Carta({
		sanitizer: DOMPurify.sanitize,
		extensions: [
			math(),
			code({
				theme: 'ayu-light'
			})
		]
	});

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
</script>

<!-- <h1>{data.meta.title}</h1>
<p>{data.meta.date}</p>
<p>{data.meta.description}</p> -->

<div
	class="no-scrollbar relative mx-auto w-[96%] pb-56 pt-4 md:w-[96%] lg:w-1/2 xl:w-1/2 2xl:w-1/2"
>
	<!-- Header -->
	<BlogHeader showDescription={false} link="/blog" />

	<!-- Metadata -->
	<div class="flex text-sm italic md:hidden">
		{new Date(data.meta.date).toDateString()}
	</div>
	<div class="flex items-center justify-between">
		<div class="prose prose-h1:text-2xl prose-h1:font-semibold">
			<h1>
				{data.meta.title}
			</h1>
		</div>
		<div class="hidden text-sm italic md:flex">
			{new Date(data.meta.date).toDateString()}
		</div>
	</div>

	<!-- Content -->
	<div
		class="prose prose-h1:text-2xl prose-h1:font-semibold prose-img:my-0 prose-img:py-0 min-w-full"
	>
		<Markdown {carta} value={data.content} />
	</div>
</div>
