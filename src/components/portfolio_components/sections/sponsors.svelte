<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="absolute bottom-0 flex w-full items-center justify-center gap-2 pb-5 text-center text-xs text-zinc-500">
	{#if page.url.origin.toString().trim().toLowerCase() == 'https://www.dagmawibabi.com'}
		<span>
			Server Sponsored by
			<a
				href="https://yegara.com"
				class="text-blue-600 hover:underline"
				target="_blank"
				rel="noopener noreferrer">YegaraHost</a
			>
		</span>
		<span>•</span>
	{/if}
	<a href="/partnerships" class="transition-colors hover:text-black hover:underline dark:hover:text-white">
		Ads & Partnerships
	</a>
</div>
