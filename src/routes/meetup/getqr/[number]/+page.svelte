<script lang="ts">
	import { Cpu, MailCheck, User, Users } from '@jis3r/icons';
	import { Link, Phone } from 'lucide-svelte';
	import { Download } from '@jis3r/icons';
	import { qr } from '@svelte-put/qr/img';

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

	// let qrCode = $state('');
	let qrImg: HTMLImageElement;
	let qrCode = 'https://dagmawi.dev/meetup/' + data._id;

	function downloadRenderedQr() {
		const a = document.createElement('a');
		a.href = qrImg.src;
		a.download = 'dagmawibabimeetup.png';
		a.click();
	}
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
	{#if qrCode != ''}
		<div class="flex w-fit flex-col items-center">
			<div class="overflow-clip rounded-lg">
				<img
					bind:this={qrImg}
					use:qr={{
						data: 'https://dagmawi.dev/meetup/' + data._id,
						logo: 'https://www.dagmawi.dev/_app/immutable/assets/logo_black.CLhuNUke.png',
						shape: 'circle',
						anchorInnerFill: 'black',
						anchorOuterFill: 'black',
						moduleFill: 'black',
						backgroundFill: 'white',
						width: 300,
						height: 300
					}}
					alt="qr"
				/>
			</div>

			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="mt-2 flex w-fit cursor-pointer items-center justify-between gap-x-2 rounded-full border border-none bg-black py-2 pr-4 pl-5 font-semibold text-white uppercase transition-all hover:text-emerald-500"
				onclick={downloadRenderedQr}
			>
				Download Ticket
				<Download size={20} />
			</div>
		</div>
	{/if}
</div>
