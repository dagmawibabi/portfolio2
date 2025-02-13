<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="absolute bottom-0 w-full pb-5 text-center text-sm">
	{page.url.origin}
	{#if page.url.pathname.toString().trim().toLowerCase() == 'https://www.dagmawibabi.com'}
		Server Sponsored by
		<a
			href="https://yegara.com"
			class="text-blue-600 hover:underline"
			target="_blank"
			rel="noopener noreferrer">YegaraHost</a
		>
	{/if}
</div>
