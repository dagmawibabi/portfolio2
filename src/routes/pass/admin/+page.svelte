<script lang="ts">
	import { enhance } from '$app/forms';
	import { statusLabel, type PassStatus } from '$lib/pass/event';

	let { data, form } = $props();

	let query = $state('');
	let filter = $state<'all' | PassStatus>('all');
	let unlocking = $state(false);

	const error = $derived(form && 'error' in form && form.error ? String(form.error) : '');
	const flash = $derived(form && 'flash' in form && form.flash ? String(form.flash) : '');

	const counts = $derived({
		all: data.applicants.length,
		pending: data.applicants.filter((row) => row.status === 'pending').length,
		approved: data.applicants.filter((row) => row.status === 'approved').length,
		declined: data.applicants.filter((row) => row.status === 'declined').length
	});

	const shown = $derived(
		data.applicants.filter((row) => {
			if (filter !== 'all' && row.status !== filter) return false;
			const haystack = `${row.fullname} ${row.email} ${row.ticket} ${row.occupation}`.toLowerCase();
			return haystack.includes(query.trim().toLowerCase());
		})
	);

	function when(iso: string) {
		if (!iso) return '';
		return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(iso));
	}
</script>

<svelte:head>
	<title>Meetup applicants</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main
	class="font-lexend min-h-screen bg-linear-to-bl from-neutral-900 to-neutral-800 px-4 py-10 text-white md:px-14"
>
	<nav class="mb-10 flex justify-between text-sm uppercase">
		<a class="hover:text-emerald-400" href="/">Dagmawi Babi</a>
		<a class="hover:text-emerald-400" href="/pass">Pass</a>
	</nav>

	{#if data.mode !== 'open'}
		<section class="flex min-h-[70vh] max-w-lg flex-col justify-center">
			<div class="font-lexend text-4xl md:text-6xl">Applicants</div>
			{#if data.mode === 'unset'}
				<p class="mt-4 max-w-md font-medium">
					This list is locked until PASS_ADMIN_SECRET is set on the server.
				</p>
			{:else}
				<p class="mt-4 font-medium">Approve, decline, or send someone back to review.</p>
				<form
					class="mt-6"
					method="POST"
					action="?/login"
					use:enhance={() => {
						unlocking = true;
						return async ({ update }) => {
							unlocking = false;
							await update();
						};
					}}
				>
					<input
						name="key"
						type="password"
						autocomplete="current-password"
						required
						placeholder="Admin key"
						class="w-full border-b border-dashed bg-transparent px-2 py-3 outline-none hover:border-solid"
					/>
					{#if error}
						<p class="mt-3 text-sm text-red-300" role="alert">{error}</p>
					{/if}
					<button
						class="mt-6 w-fit cursor-pointer rounded-full bg-white px-6 py-2 font-semibold text-black uppercase hover:bg-emerald-500 disabled:opacity-70"
						disabled={unlocking}
					>
						{unlocking ? 'Checking' : 'Unlock list'}
					</button>
				</form>
			{/if}
		</section>
	{:else}
		<header>
			<div class="font-lexend text-4xl md:text-6xl">Applicants</div>
			<p class="mt-3 max-w-xl text-sm text-neutral-300">
				Approving emails them their pass. Declining updates the pass and does not send an email.
			</p>
		</header>

		{#if data.problem}
			<p class="mt-4 text-sm text-red-300" role="alert">{data.problem}</p>
		{/if}
		{#if flash}
			<p class="mt-4 text-sm text-emerald-400" role="status">{flash}</p>
		{/if}

		<div class="mt-8 flex flex-wrap gap-2" aria-label="Filter applicants">
			{#each [['all', 'All', counts.all], ['pending', 'In review', counts.pending], ['approved', 'Approved', counts.approved], ['declined', 'Declined', counts.declined]] as item}
				<button
					type="button"
					class="cursor-pointer border border-dashed px-3 py-1.5 text-sm hover:border-solid hover:bg-neutral-700 {filter ===
					item[0]
						? 'border-solid bg-white text-black'
						: ''}"
					onclick={() => (filter = item[0] as typeof filter)}
				>
					{item[1]} {item[2]}
				</button>
			{/each}
		</div>

		<form class="mt-6 max-w-md" role="search" onsubmit={(event) => event.preventDefault()}>
			<input
				bind:value={query}
				placeholder="Search name, email, or ticket"
				class="w-full border-b border-dashed bg-transparent px-2 py-3 outline-none placeholder:text-neutral-500 hover:border-solid"
			/>
		</form>

		{#if data.applicants.length === 0}
			<p class="mt-8 text-neutral-300">No one has signed up yet.</p>
		{:else if shown.length === 0}
			<p class="mt-8 text-neutral-300">No applicants match.</p>
		{:else}
			<ul class="mt-4 list-none p-0">
				{#each shown as row (row.id)}
					<li class="grid gap-3 border-t border-dashed border-white/25 py-4 md:grid-cols-[1fr_auto] md:items-center">
						<div>
							<div class="flex flex-wrap items-baseline gap-x-3">
								<h2 class="text-xl font-semibold">{row.fullname}</h2>
								<span
									class="text-xs font-semibold tracking-wide uppercase {row.status === 'approved'
										? 'text-emerald-400'
										: row.status === 'declined'
											? 'text-red-300'
											: 'text-neutral-400'}"
								>
									{statusLabel[row.status]}
								</span>
								<span class="text-xs tracking-widest uppercase">{row.ticket}</span>
							</div>
							<p class="mt-1 text-sm">
								<a class="hover:text-emerald-400" href="mailto:{row.email}">{row.email}</a>
								· {row.attendanceType}
								{#if row.createdAt}· {when(row.createdAt)}{/if}
							</p>
							<details class="mt-2 text-sm text-neutral-300">
								<summary class="cursor-pointer text-white">Details</summary>
								<p class="mt-2">
									<a class="hover:text-emerald-400" href="tel:{row.phone}">{row.phone}</a>
									· {row.occupation}
								</p>
								{#if row.link}
									<p>
										<a class="hover:text-emerald-400" href={row.link} target="_blank" rel="noreferrer"
											>{row.link}</a
										>
									</p>
								{/if}
								{#if row.note}<p>{row.note}</p>{/if}
								<p>
									<a class="hover:text-emerald-400" href="/pass/{row.id}" target="_blank" rel="noreferrer"
										>Open pass</a
									>
								</p>
							</details>
						</div>
						<div class="flex flex-wrap items-center gap-2">
							<form method="POST" action="?/decide" use:enhance>
								<input type="hidden" name="id" value={row.id} />
								<input type="hidden" name="status" value="approved" />
								<button
									class="cursor-pointer rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black uppercase hover:bg-emerald-500 disabled:opacity-40"
									disabled={row.status === 'approved'}
								>
									Approve
								</button>
							</form>
							<form method="POST" action="?/decide" use:enhance>
								<input type="hidden" name="id" value={row.id} />
								<input type="hidden" name="status" value="declined" />
								<button
									class="cursor-pointer px-3 py-1.5 text-sm font-semibold uppercase hover:text-emerald-400 disabled:opacity-40"
									disabled={row.status === 'declined'}
								>
									Decline
								</button>
							</form>
							{#if row.status !== 'pending'}
								<form method="POST" action="?/decide" use:enhance>
									<input type="hidden" name="id" value={row.id} />
									<input type="hidden" name="status" value="pending" />
									<button class="cursor-pointer px-3 py-1.5 text-sm font-semibold uppercase hover:text-emerald-400" type="submit">
										Review again
									</button>
								</form>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		<form method="POST" action="?/logout">
			<button class="mt-10 cursor-pointer font-semibold uppercase hover:text-emerald-400" type="submit">
				Lock list
			</button>
		</form>
	{/if}
</main>
