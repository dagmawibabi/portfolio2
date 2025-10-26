<script lang="ts">
	import { Languages, Quote } from 'lucide-svelte';
	import SectionTitles from '../components/section_title.svelte';
	let isAmharic = $state(false);
</script>

<div class="pb-10">
	<SectionTitles title={'Remarks'} />
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900"></div>
	</div>
	<div class="rounded border p-10 hover:rounded-xl hover:border-black dark:hover:border-zinc-600">
		<div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="group flex w-fit cursor-pointer items-center gap-x-2"
				onclick={() => (isAmharic = !isAmharic)}
			>
				<Quote size={22} class="flex group-hover:hidden" />
				<Languages size={22} class="hidden group-hover:flex" />
				{#if isAmharic}
					<span class="text-lg font-semibold"> 2 ቆሮንቶስ 3:5 </span>
				{:else}
					<span class="text-lg font-semibold"> 2 Corinthians 3:5 </span>
				{/if}
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="group cursor-pointer pt-3 text-lg" onclick={() => (isAmharic = !isAmharic)}>
				{#if isAmharic}
					<div class="flex flex-col">
						<p>ብቃታችን ከእግዚአብሔር ነው እንጂ፣</p>
						<p>በራሳችን ብቃት ከእኛ ነው የምንለው አንዳች ነገር የለንም።</p>
					</div>
				{:else}
					<div class="flex flex-col">
						<p>Not that we are competent in ourselves to claim anything for ourselves,</p>
						<p>but our competence comes from God.</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900"></div>
	</div>
	<div>
		<p>... so much more to come!</p>
	</div>
</div>
