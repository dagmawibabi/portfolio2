<script lang="ts">
	import header from '$lib/assets/meetups/2026/announcement2.png';
	import Introduction from '../../components/meetup_components/introduction.svelte';
	import ThankYou from '../../components/meetup_components/thank_you.svelte';
</script>

<div class="no-scrollbar flex h-screen w-screen overflow-hidden">
	<!-- PHOTO -->
	<div class="hidden h-screen w-full md:flex md:w-1/2">
		<img src={header} alt="header" class=" h-full w-full object-cover" />
	</div>

	<!-- Sidebar -->
	<div
		class="no-scrollbar h-screen w-full snap-y snap-mandatory overflow-y-scroll bg-linear-to-bl from-neutral-900 to-neutral-800 backdrop-blur-md md:w-1/2"
	>
		<div class="h-screen w-full snap-start md:hidden">
			<img src={header} alt="header" class=" h-full w-full object-cover" />
		</div>

		<!-- PAGE 1 -->
		<Introduction />

		<!-- PAGE 6 -->
		<ThankYou />
	</div>
</div>
