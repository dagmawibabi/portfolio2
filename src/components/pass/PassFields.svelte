<script lang="ts">
	import { ATTENDANCE } from '$lib/pass/event';

	let {
		fullname = $bindable(''),
		email = $bindable(''),
		phone = $bindable(''),
		occupation = $bindable(''),
		attendanceType = $bindable('Attending'),
		link = $bindable(''),
		note = $bindable('')
	} = $props();

	const field =
		'w-full border-b border-dashed bg-transparent px-2 py-3 outline-none placeholder:text-neutral-500 hover:border-solid focus-visible:border-solid';
</script>

<input
	name="fullname"
	bind:value={fullname}
	autocomplete="name"
	required
	maxlength="80"
	placeholder="Full name"
	class={field}
/>
<input
	name="email"
	type="email"
	bind:value={email}
	autocomplete="email"
	required
	maxlength="160"
	placeholder="Email"
	class={field}
/>
<input
	name="phone"
	type="tel"
	bind:value={phone}
	autocomplete="tel"
	required
	maxlength="30"
	placeholder="Phone number"
	class={field}
/>
<input
	name="occupation"
	bind:value={occupation}
	autocomplete="organization-title"
	required
	maxlength="80"
	placeholder="What you do"
	class={field}
/>

<fieldset class="mt-4 border-0 p-0">
	<legend class="mb-2 text-sm font-semibold italic">How you are coming</legend>
	<div class="grid grid-cols-2 gap-1">
		{#each ATTENDANCE as option}
			<label
				class="cursor-pointer border border-dashed py-2 text-center text-sm transition-all hover:border-solid hover:bg-neutral-700 {attendanceType ===
				option
					? 'border-solid bg-neutral-700 font-semibold'
					: ''}"
			>
				<input class="sr-only" type="radio" name="attendanceType" value={option} bind:group={attendanceType} />
				{option}
			</label>
		{/each}
	</div>
</fieldset>

<input
	name="link"
	type="url"
	bind:value={link}
	maxlength="300"
	placeholder="A link, optional (https://)"
	class="{field} mt-4"
/>
<textarea
	name="note"
	bind:value={note}
	rows="3"
	maxlength="400"
	placeholder="Note for the organizers, optional"
	class="{field} mt-2 resize-y"
></textarea>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	label:focus-within {
		outline: 2px solid #34d399;
		outline-offset: 2px;
	}
</style>
