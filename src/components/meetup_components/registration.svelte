<script lang="ts">
	import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Circle } from 'svelte-loading-spinners';
	// import QR from '@svelte-put/qr/img/QR.svelte';
	import { qr } from '@svelte-put/qr/img';
	import { createQrSvgString, createQrSvgDataUrl } from '@svelte-put/qr';
	import { Download } from '@jis3r/icons';

	function scrollToPageTwo(e: any) {
		e.preventDefault();
		document.querySelector('#thank_you')?.scrollIntoView({ behavior: 'smooth' });
	}

	let iconHovered1 = $state(false);

	let fullname = $state('');
	let email = $state('');
	let phone = $state('');
	let occupation = $state('');
	let link = $state('');
	let teammates = $state('');
	let attendanceType = $state('');
	let isRegistering = $state(false);
	let qrCode = $state('');

	function validateForm() {
		if (
			!fullname.trim() ||
			!email.trim() ||
			!phone.trim() ||
			!occupation.trim() ||
			!attendanceType.trim()
		) {
			alert('Please fill all required fields.');
			return false;
		}

		if (attendanceType === 'Showcasing') {
			if (!link.trim() || !teammates.trim()) {
				alert('Please provide your project link and teammates.');
				return false;
			}
		}

		return true;
	}

	async function rsvp() {
		if (!validateForm()) return;

		isRegistering = true;
		let teammateArray: any[] = [];
		if (attendanceType != 'Showcasing') {
			link = '';
			teammateArray = [];
		} else {
			teammateArray = teammates.split(',').map((name) => name.trim());
		}

		const rsvp = {
			fullname: fullname,
			email: email,
			phone: phone,
			occupation: occupation,
			attendanceType: attendanceType,
			link: link,
			teammates: teammateArray
		};

		const response = await fetch('/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ rsvp: rsvp })
		});

		const data = await response.json();
		qrCode = 'https://dagmawi.dev/meetup/' + data._id;

		isRegistering = false;
	}

	let qrImg: HTMLImageElement;

	function downloadRenderedQr() {
		const a = document.createElement('a');
		a.href = qrImg.src;
		a.download = 'dagmawibabimeetup.png';
		a.click();
	}
</script>

<div id="registration" class="relative h-screen snap-start">
	<!-- <img src={dither} alt="header" class="h-full w-full object-cover" /> -->

	<div
		class="absolute inset-0 z-10 flex flex-col justify-center gap-y-5 px-4 text-left text-white md:px-14"
	>
		{#if qrCode != ''}
			<div class="flex w-fit flex-col items-center">
				<div class="font-lexend mb-3 text-5xl">You're In!</div>

				<div class="overflow-clip rounded-lg">
					<img
						bind:this={qrImg}
						use:qr={{
							data: qrCode,
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
					class="mt-2 flex w-fit cursor-pointer items-center justify-between gap-x-2 rounded-full border border-none py-2 pr-4 pl-5 font-semibold text-white uppercase transition-all hover:text-emerald-500"
					onmouseenter={() => (iconHovered1 = true)}
					onmouseleave={() => (iconHovered1 = false)}
					onclick={downloadRenderedQr}
				>
					Download Ticket
					<Download size={20} isHovered={iconHovered1} />
				</div>

				<a href="#thank_you" onclick={scrollToPageTwo}>
					<div
						class="mt-10 flex w-fit cursor-pointer items-center justify-between gap-x-1 rounded-full border border-none bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3"
					>
						Continue
						<ArrowRight size={20} />
					</div>
				</a>
			</div>
		{:else}
			<div class="font-lexend text-2xl font-semibold">Register</div>
			<input
				bind:value={fullname}
				placeholder="Fullname (eg. Dagmawi Babi)"
				class="w-full border-b border-dashed px-2 py-3 outline-none hover:border-solid md:w-3/4"
			/>
			<input
				type="email"
				bind:value={email}
				placeholder="Email (eg. Babi@gmail.com)"
				class="w-full border-b border-dashed px-2 py-3 outline-none hover:border-solid md:w-3/4"
			/>
			<input
				type="tel"
				bind:value={phone}
				placeholder="Phone Number (eg. 0912345678)"
				class="w-full border-b border-dashed px-2 py-3 outline-none hover:border-solid md:w-3/4"
			/>
			<input
				bind:value={occupation}
				placeholder="Occupation (eg. Software Engineer, Google)"
				class="w-full border-b border-dashed px-2 py-3 outline-none hover:border-solid md:w-3/4"
			/>

			<div class="mt-4 flex w-full gap-x-1 md:w-3/4">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="md:text-md w-full cursor-pointer border border-dashed py-2 text-center text-sm transition-all hover:border-solid hover:bg-neutral-700"
					class:border-solid={attendanceType == 'Attending'}
					class:bg-neutral-700={attendanceType == 'Attending'}
					class:font-semibold={attendanceType == 'Attending'}
					onclick={() => (attendanceType = 'Attending')}
				>
					Attending
				</div>

				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="md:text-md w-full cursor-pointer border border-dashed py-2 text-center text-sm transition-all hover:border-solid hover:bg-neutral-700"
					class:border-solid={attendanceType == 'Showcasing'}
					class:bg-neutral-700={attendanceType == 'Showcasing'}
					class:font-semibold={attendanceType == 'Showcasing'}
					onclick={() => (attendanceType = 'Showcasing')}
				>
					Showcasing
				</div>

				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="md:text-md w-full cursor-pointer border border-dashed py-2 text-center text-sm transition-all hover:border-solid hover:bg-neutral-700"
					class:border-solid={attendanceType == 'Hackathon'}
					class:bg-neutral-700={attendanceType == 'Hackathon'}
					class:font-semibold={attendanceType == 'Hackathon'}
					onclick={() => (attendanceType = 'Hackathon')}
				>
					Hackathon
				</div>

				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="md:text-md w-full cursor-pointer border border-dashed py-2 text-center text-sm transition-all hover:border-solid hover:bg-neutral-700"
					class:border-solid={attendanceType == 'Guest'}
					class:bg-neutral-700={attendanceType == 'Guest'}
					class:font-semibold={attendanceType == 'Guest'}
					onclick={() => (attendanceType = 'Guest')}
				>
					Guest
				</div>
			</div>

			{#if attendanceType == 'Showcasing'}
				<input
					bind:value={link}
					placeholder="Project Link (eg. Website, GitHub, Appstore Link)"
					class="w-full border-b border-dashed px-2 py-3 outline-none hover:border-solid md:w-3/4"
				/>
				<input
					bind:value={teammates}
					placeholder="Attending Teammates (eg. John Doe, Jane Doe, Tom Bob...)"
					class="w-full border-b border-dashed px-2 py-3 outline-none hover:border-solid md:w-3/4"
				/>
			{/if}

			<!-- <a href="#thank_you" onclick={scrollToPageTwo}> -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			{#if isRegistering}
				<div
					class="mt-5 flex w-fit cursor-pointer items-center justify-between gap-x-1 rounded-full border border-none bg-white p-2 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3"
				>
					<Circle size={20} color="black" />
				</div>
			{:else}
				<div
					class="mt-5 flex w-fit cursor-pointer items-center justify-between gap-x-1 rounded-full border border-none bg-white py-2 pr-4 pl-6 font-semibold text-black uppercase transition-all hover:gap-x-2 hover:bg-emerald-500 hover:pr-3"
					onclick={() => rsvp()}
				>
					Register
					<ArrowRight size={20} />
				</div>
			{/if}
		{/if}
		<!-- </a> -->
	</div>
</div>
