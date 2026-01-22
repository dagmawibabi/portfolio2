<script lang="ts">
	import { Check, MailCheck, User } from '@jis3r/icons';

	export let data;

	interface RsvpResponse {
		rsvpCount: number;
		isAccepted: number;
		hasConfirmed: number;
	}

	const response = data as RsvpResponse;
</script>

<div
	class="no-scrollbar font-lexend relative mx-auto flex h-screen w-full flex-col items-start justify-center px-2 pt-4 md:w-[96%] lg:w-1/2 xl:w-1/2 2xl:w-1/2"
>
	<div class="w-fit bg-black px-3 text-white">Stats</div>
	<div class="ml-6 border-l border-black py-2 pb-10 pl-3">
		<div class="flex items-center gap-x-2 text-lg">
			<User size={20} />
			{response.rsvpCount} Registered
		</div>
		<div class="flex items-center gap-x-2 text-lg">
			<Check size={20} />
			{response.isAccepted} Accepted
		</div>
		<div class="flex items-center gap-x-2 text-lg">
			<MailCheck size={20} />
			{response.hasConfirmed} Confirmed
		</div>
	</div>
</div>
