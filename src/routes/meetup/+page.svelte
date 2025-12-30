<script lang="ts">
	import header from '$lib/assets/meetups/2026/header.png';
	import dither from '$lib/assets/meetups/2026/background.png';

	import Introduction from '../../components/meetup_components/introduction.svelte';
	import EventDetails from '../../components/meetup_components/event_details.svelte';
	import Registration from '../../components/meetup_components/registration.svelte';
	import Schedule from '../../components/meetup_components/schedule.svelte';
	import SupportAndTeam from '../../components/meetup_components/support_and_team.svelte';
	import ThankYou from '../../components/meetup_components/thank_you.svelte';

	let title = '';
	let description = '';
	let photoUrl = '';
	let error = '';

	function handleSubmit() {
		if (!title || !description || !photoUrl) {
			error = 'All fields are required';
		} else {
			error = '';
			// TODO: Submit data to server
		}
	}
</script>

<!-- <div
	class="no-scrollbar relative mx-auto w-[96%] pb-56 pt-4 md:w-[96%] lg:w-1/2 xl:w-1/2 2xl:w-1/2"
> -->
<div class="no-scrollbar flex h-screen w-screen overflow-hidden">
	<!-- PHOTO -->
	<div class="hidden h-screen w-full md:flex md:w-1/2">
		<img src={header} alt="header" class=" h-full w-full object-cover" />
	</div>

	<!-- Sidebar -->
	<div
		class="no-scrollbar h-screen w-full snap-y snap-mandatory overflow-y-scroll bg-linear-to-bl from-neutral-900 to-neutral-800 backdrop-blur-md md:w-1/2"
	>
		<!-- PAGE 1 -->
		<Introduction />

		<!-- PAGE 2 -->
		<EventDetails />

		<!-- PAGE 3 -->
		<SupportAndTeam />

		<!-- PAGE 4 -->
		<Schedule />

		<!-- PAGE 5 -->
		<Registration />

		<!-- PAGE 6 -->
		<ThankYou />
	</div>
</div>

<!-- FORM -->
<!-- <form on:submit|preventDefault={handleSubmit}>
        <input type="text" bind:value={title} placeholder="Title" />
        <textarea bind:value={description} placeholder="Description"></textarea>
        <button type="submit">Submit</button>
    </form> -->
