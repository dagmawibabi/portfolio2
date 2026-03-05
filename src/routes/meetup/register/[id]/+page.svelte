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
	}

	interface RsvpResponse {
		rsvpCount: number;
		rsvpInfo: RsvpInfo;
	}

	const response = data as RsvpResponse;
</script>

<div
	class="no-scrollbar font-lexend relative mx-auto flex h-screen w-[96%] flex-col items-start justify-center pt-4 md:w-[96%] lg:w-1/2 xl:w-1/2 2xl:w-1/2"
>
	<div class="w-fit bg-black px-3 text-white">
		{response.rsvpInfo.attendanceType}
	</div>
	<div class="ml-6 border-l border-black py-2 pl-3">
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
	</div>

	{#if response.rsvpInfo.attendanceType == 'Showcasing'}
		<div class="pl-3">
			<div class="flex items-center gap-x-2 text-lg">
				<Link size={18} />
				{response.rsvpInfo.link}
			</div>
			<div class="flex items-center gap-x-2 text-lg">
				<Users size={20} />
				{response.rsvpInfo.teammates.join(', ')}
			</div>
		</div>
	{/if}
</div>
