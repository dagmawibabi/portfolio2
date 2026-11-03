<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { LENGTH_FILTERS, SORT_OPTIONS } from '$lib/babitube/utils';

	let {
		count,
		defaultSort
	}: {
		count: number;
		defaultSort: string;
	} = $props();

	const length = $derived(page.url.searchParams.get('len') ?? '');
	const sort = $derived(page.url.searchParams.get('sort') ?? '');

	function update(param: string, value: string) {
		const url = new URL(page.url);
		if (value) url.searchParams.set(param, value);
		else url.searchParams.delete(param);
		goto(url, { keepFocus: true, noScroll: true, replaceState: true });
	}
</script>

<div class="filters">
	<span class="count">{count.toLocaleString('en-US')} {count === 1 ? 'video' : 'videos'}</span>
	<select
		aria-label="Sort videos"
		value={sort}
		onchange={(e) => update('sort', e.currentTarget.value)}
	>
		<option value="">{defaultSort}</option>
		{#each SORT_OPTIONS as option}
			<option value={option.key}>{option.label}</option>
		{/each}
	</select>
	<select
		aria-label="Filter by length"
		value={length}
		onchange={(e) => update('len', e.currentTarget.value)}
	>
		<option value="">Any length</option>
		{#each LENGTH_FILTERS as option}
			<option value={option.key}>{option.label}</option>
		{/each}
	</select>
</div>

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
		margin-bottom: 16px;
	}
	.count {
		margin-right: auto;
		color: var(--text-2);
	}
	select {
		height: 32px;
		max-width: 100%;
		padding: 0 8px;
		border-radius: 8px;
		background: var(--chip);
		color: var(--text);
		font-weight: 500;
		cursor: pointer;
	}
	select:hover {
		background: var(--hover-strong);
	}
	option {
		background: var(--bg-raised);
		color: var(--text);
	}
	@media (max-width: 640px) {
		.filters {
			padding: 0 12px;
		}
	}
</style>
