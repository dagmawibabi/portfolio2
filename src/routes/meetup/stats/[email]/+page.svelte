<script lang="ts">
	import { Cpu, MailCheck, User, Users } from '@jis3r/icons';
	import { Link, Phone } from 'lucide-svelte';

	export let data;
	interface RsvpInfo {
		_id: string;
		fullname: string;
		email: string;
		phone: string;
		occupation: string;
		attendanceType: string;
		link: string;
		teammates: string[];
		createdAt: string;
		updatedAt: string;
		__v: number;
		isAccepted: boolean;
		hasConfirmed: boolean;
	}

	interface RsvpResponse {
		rsvpCount: number;
		rsvpInfo: RsvpInfo;
	}

	const response = data as RsvpResponse;
</script>

<div
	class="no-scrollbar font-lexend relative mx-auto flex h-screen w-full flex-col items-start justify-center px-2 pt-4 md:w-[96%] lg:w-1/2 xl:w-1/2 2xl:w-1/2"
	class:bg-emerald-500={response.rsvpInfo.isAccepted && response.rsvpInfo.hasConfirmed}
>
	<div class="w-fit bg-black px-3 text-white">
		{response.rsvpInfo.attendanceType}
	</div>
	<div class="ml-6 border-l border-black py-2 pb-10 pl-3">
		<div class="flex items-center gap-x-2 text-lg">
			<User size={20} />
			{response.rsvpInfo.fullname}
		</div>
		<div class="flex items-center gap-x-2 text-lg">
			<MailCheck size={20} />
			{response.rsvpInfo.email}
		</div>
		<div class="flex items-center gap-x-2 text-lg">
			<Phone size={20} />
			{response.rsvpInfo.phone}
		</div>
		<div class="flex items-center gap-x-2 text-lg">
			<Cpu size={20} />
			{response.rsvpInfo.occupation}
		</div>
		{#if response.rsvpInfo.attendanceType == 'Showcasing'}
			<div class="flex items-center gap-x-2 text-lg">
				<Link size={18} />
				{response.rsvpInfo.link}
			</div>
			<div class="flex items-center gap-x-2 text-lg">
				<Users size={20} />
				{response.rsvpInfo.teammates.join(', ')}
			</div>
		{/if}
	</div>

	{#if response.rsvpInfo.isAccepted}
		{#if response.rsvpInfo.hasConfirmed}
			<div class="border border-black bg-emerald-400 px-3 py-2">Can't wait to see you :)</div>
		{:else}
			<a href="/meetup/confirm/{response.rsvpInfo._id}">
				<div class=" cursor-pointer bg-emerald-400 px-3 py-2">Click, to Confirm!</div>
			</a>
		{/if}
	{:else}
		<div class=" bg-black px-3 py-2 text-sm text-white">Sorry, we've reached maximum capacity.</div>
	{/if}
</div>
