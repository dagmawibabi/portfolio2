<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import logo from '$lib/assets/logo/DagmawiBabiLogo4.png';
	import PassCard from '../../../components/pass/PassCard.svelte';
	import PassFields from '../../../components/pass/PassFields.svelte';
	import PassFrame from '../../../components/pass/PassFrame.svelte';
	import ProgramEditor from '../../../components/pass/ProgramEditor.svelte';
	import { meetupEvent, ownerStatusCopy, publicStatusCopy } from '$lib/pass/event';
	import { DEFAULT_SOURCE } from '$lib/pass/program';
	import { ArrowRight } from 'lucide-svelte';

	let { data, form } = $props();

	let fullname = $state(data.pass.fullname);
	let email = $state(String(('email' in data.pass && data.pass.email) || ''));
	let phone = $state(String(('phone' in data.pass && data.pass.phone) || ''));
	let occupation = $state(data.pass.occupation);
	let attendanceType = $state(data.pass.attendanceType);
	let link = $state(data.pass.link);
	let note = $state(String(('note' in data.pass && data.pass.note) || ''));
	let program = $state(data.pass.program || DEFAULT_SOURCE);
	let saving = $state(false);
	let origin = $state('');

	const saveError = $derived(form && 'error' in form && form.error ? String(form.error) : '');
	const saved = $derived(Boolean(form && 'ok' in form && form.ok));
	const shareUrl = $derived(origin ? `${origin}/pass/${data.pass.id}` : '');
	const statusLine = $derived(
		data.isOwner
			? ownerStatusCopy[data.pass.status]
			: publicStatusCopy(data.pass.fullname, data.pass.status)
	);

	function host(value: string) {
		try {
			return new URL(value).host.replace(/^www\./, '');
		} catch {
			return value;
		}
	}

	onMount(() => {
		origin = location.origin;
		if (data.isOwner) localStorage.setItem('meetup-pass-href', location.pathname + location.search);
	});

	const pill =
		'mt-6 flex w-fit cursor-pointer items-center gap-x-1 rounded-full bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3 disabled:opacity-70';
</script>

<svelte:head>
	<title>{data.pass.fullname} · Meetup pass</title>
	<meta name="description" content="A digital pass for Dagmawi Babi's Meetup." />
	{#if data.isOwner}
		<meta name="robots" content="noindex" />
	{:else}
		<meta property="og:title" content="{data.pass.fullname} · Meetup pass" />
		<meta property="og:description" content="An interactive pass for Dagmawi Babi's Meetup." />
	{/if}
</svelte:head>

<PassFrame>
	{#snippet card()}
		<PassCard
			name={data.isOwner ? fullname : data.pass.fullname}
			occupation={data.isOwner ? occupation : data.pass.occupation}
			attendance={data.isOwner ? attendanceType : data.pass.attendanceType}
			ticket={data.pass.ticket}
			status={data.pass.status}
			program={data.isOwner ? program : data.pass.program || DEFAULT_SOURCE}
			{shareUrl}
		/>
	{/snippet}

	<div class="flex min-h-svh flex-col justify-center gap-y-4 px-4 py-16 md:px-14">
		<img src={logo} alt="" width="160" />
		<div class="font-lexend text-3xl md:text-5xl">
			{data.isOwner ? 'Your pass' : data.pass.fullname}
		</div>
		<p class="font-medium">{statusLine}</p>
		<p class="text-sm text-neutral-300">
			{meetupEvent.place} · {meetupEvent.when} · {data.pass.ticket}
		</p>
		{#if data.pass.link}
			<a class="w-fit uppercase hover:text-emerald-500" href={data.pass.link} target="_blank" rel="noreferrer">
				{host(data.pass.link)}
			</a>
		{/if}
		{#if data.isOwner}
			<p class="max-w-xl text-sm text-neutral-300">
				Flip the card for the door code. Share sends the picture, without your email or phone.
			</p>
		{:else}
			<p class="text-sm text-neutral-300">Shared pass. Email and phone stay off this page.</p>
			<a class={pill} href="/pass">
				Get your own pass
				<ArrowRight size={20} />
			</a>
		{/if}
	</div>

	{#if data.isOwner}
		<form
			class="flex flex-col justify-center gap-y-2 px-4 py-16 md:min-h-svh md:px-14"
			method="POST"
			action="?/save"
			use:enhance={() => {
				saving = true;
				return async ({ update }) => {
					saving = false;
					await update({ reset: false });
				};
			}}
		>
			<div class="font-lexend text-2xl font-semibold">Your details</div>
			<input type="hidden" name="key" value={data.key} />
			<PassFields
				bind:fullname
				bind:email
				bind:phone
				bind:occupation
				bind:attendanceType
				bind:link
				bind:note
			/>
			<ProgramEditor bind:value={program} />
			{#if saveError}
				<p class="mt-4 text-sm text-red-300" role="alert">{saveError}</p>
			{:else if saved}
				<p class="mt-4 text-sm text-emerald-400" role="status">Saved</p>
			{/if}
			<button class={pill} disabled={saving}>
				{saving ? 'Saving' : 'Save changes'}
				<ArrowRight size={20} />
			</button>
		</form>
	{/if}
</PassFrame>
