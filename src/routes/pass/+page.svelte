<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import logo from '$lib/assets/logo/DagmawiBabiLogo4.png';
	import PassCard from '../../components/pass/PassCard.svelte';
	import PassFields from '../../components/pass/PassFields.svelte';
	import PassFrame from '../../components/pass/PassFrame.svelte';
	import ProgramEditor from '../../components/pass/ProgramEditor.svelte';
	import { meetupEvent } from '$lib/pass/event';
	import { DEFAULT_SOURCE } from '$lib/pass/program';
	import { ArrowRight } from 'lucide-svelte';

	let { data, form } = $props();

	function field(name: string, fallback = '') {
		if (form && name in form) {
			const value = (form as Record<string, unknown>)[name];
			if (typeof value === 'string' && value) return value;
		}
		return fallback;
	}

	let fullname = $state(field('fullname'));
	let email = $state(field('email'));
	let phone = $state(field('phone'));
	let occupation = $state(field('occupation'));
	let attendanceType = $state(field('attendanceType', 'Attending'));
	let link = $state(field('link'));
	let note = $state(field('note'));
	let program = $state(field('program', DEFAULT_SOURCE));
	let lookupEmail = $state(field('lookupEmail'));
	let signing = $state(false);
	let finding = $state(false);
	let savedHref = $state('');

	const signupError = $derived(form && 'error' in form && form.error ? String(form.error) : '');
	const lookupError = $derived(
		form && 'lookupError' in form && form.lookupError ? String(form.lookupError) : ''
	);

	$effect(() => {
		if (!form) return;
		if ('fullname' in form && typeof form.fullname === 'string') fullname = form.fullname;
		if ('email' in form && typeof form.email === 'string') email = form.email;
		if ('phone' in form && typeof form.phone === 'string') phone = form.phone;
		if ('occupation' in form && typeof form.occupation === 'string') occupation = form.occupation;
		if ('attendanceType' in form && typeof form.attendanceType === 'string') {
			attendanceType = form.attendanceType;
		}
		if ('link' in form && typeof form.link === 'string') link = form.link;
		if ('note' in form && typeof form.note === 'string') note = form.note;
		if ('program' in form && typeof form.program === 'string' && form.program)
			program = form.program;
		if ('lookupEmail' in form && typeof form.lookupEmail === 'string')
			lookupEmail = form.lookupEmail;
	});

	onMount(() => {
		savedHref = localStorage.getItem('meetup-pass-href') ?? '';
	});

	const pill =
		'mt-5 flex w-fit cursor-pointer items-center gap-x-1 rounded-full bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3 disabled:opacity-70';
</script>

<svelte:head>
	<title>Get your Meetup pass</title>
	<meta
		name="description"
		content="Sign up for Dagmawi Babi's Meetup, check your approval, and program your pass."
	/>
</svelte:head>

<PassFrame>
	{#snippet card()}
		<PassCard name={fullname} {occupation} attendance={attendanceType} ticket="MB-····" {program} />
	{/snippet}

	<div class="flex min-h-svh flex-col justify-center gap-y-5 px-4 py-16 md:px-14">
		<img src={logo} alt="Dagmawi Babi" width="180" />
		<div>
			<div class="font-lexend w-fit text-3xl md:text-5xl">Dagmawi Babi's Meetup</div>
			<div class="mt-1 italic">{meetupEvent.edition} · {meetupEvent.place}</div>
		</div>
		<p class="max-w-xl font-medium">
			The card is yours to tilt, flip, and program. Sign up, then come back to see if you are
			approved and to share the pass.
		</p>
		<p class="text-sm text-neutral-300">{meetupEvent.when}</p>
		{#if data.count === 0}
			<p class="text-sm">Be the first to sign up.</p>
		{:else if data.count}
			<p class="text-sm">{data.count} signed up</p>
		{/if}
		{#if savedHref}
			<a class="w-fit uppercase hover:text-emerald-500" href={savedHref}>Open your saved pass</a>
		{/if}
		<div class="flex flex-wrap items-center gap-x-2">
			<a class="uppercase hover:text-emerald-500" href="/meetup">The meetup</a>
			<a class="uppercase hover:text-emerald-500" href="/meetup/2026">2026 archive</a>
		</div>
	</div>

	<form
		class="flex min-h-svh flex-col justify-center gap-y-2 px-4 py-16 md:px-14"
		method="POST"
		action="?/signup"
		use:enhance={() => {
			signing = true;
			return async ({ update }) => {
				signing = false;
				await update({ reset: false });
			};
		}}
	>
		<div class="font-lexend text-2xl font-semibold">Register</div>
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
		{#if signupError}
			<p class="mt-4 text-sm text-red-300" role="alert">{signupError}</p>
		{/if}
		<button class={pill} disabled={signing}>
			{signing ? 'Saving' : 'Get my pass'}
			<ArrowRight size={20} />
		</button>
	</form>

	<form
		class="flex min-h-[70vh] flex-col justify-center gap-y-3 px-4 py-16 md:min-h-svh md:px-14"
		method="POST"
		action="?/lookup"
		use:enhance={() => {
			finding = true;
			return async ({ update }) => {
				finding = false;
				await update({ reset: false });
			};
		}}
	>
		<div class="font-lexend text-2xl font-semibold">Find my pass</div>
		<input
			name="lookupEmail"
			type="email"
			bind:value={lookupEmail}
			autocomplete="email"
			required
			placeholder="Email you signed up with"
			class="w-full border-b border-dashed bg-transparent px-2 py-3 outline-none placeholder:text-neutral-500 hover:border-solid md:w-3/4"
		/>
		{#if lookupError}
			<p class="text-sm text-red-300" role="alert">{lookupError}</p>
		{/if}
		<button
			class="mt-4 w-fit cursor-pointer py-2 font-semibold uppercase hover:text-emerald-500 disabled:opacity-70"
			disabled={finding}
		>
			{finding ? 'Looking' : 'Find my pass'}
		</button>
	</form>
</PassFrame>
