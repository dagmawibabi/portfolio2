<script lang="ts">
	import logo from '$lib/assets/logo//DagmawiBabiLogo.png';
	import {
		Instagram,
		Github,
		Linkedin,
		Plane,
		Mail,
		Twitter,
		PlaneIcon,
		LucidePlane,
		Send,
		Phone,
		Smile
	} from 'lucide-svelte';

	let { showDescription = true, link = '/' } = $props();
</script>

<div class="w-full pb-5">
	<div class="flex flex-col rounded py-2 lg:flex-row xl:flex-row 2xl:flex-row">
		<!-- Mobile -->
		<a href={link}>
			<div class="flex items-center gap-x-2 md:flex lg:hidden xl:hidden 2xl:hidden">
				<img src={logo} alt="logo" class="w-12" />
				<div class="flex flex-col justify-center">
					<div class="text-xl font-semibold">Dagmawi Babi</div>
					<span class="-mt-1">Believer | Creative Developer</span>
				</div>
			</div>
		</a>

		<!-- PC -->
		<div
			class="flex w-full flex-col justify-center gap-y-1 pt-3 md:gap-y-4 lg:pt-0 xl:pt-0 2xl:pt-0"
		>
			<div class="flex w-full items-center justify-between">
				<!-- Title -->
				<a href={link}>
					<div class="hidden items-center gap-x-2 md:hidden lg:flex xl:flex 2xl:flex">
						<img src={logo} alt="logo" class="w-12" />
						<div class="flex flex-col justify-center">
							<div class="text-xl font-semibold">Dagmawi Babi</div>
							<span class="-mt-1">Believer | Creative Developer</span>
						</div>
					</div>
				</a>

				<!-- Socials -->
				<div class="hidden gap-x-2 md:flex">
					<div
						class="flex items-center justify-center gap-x-3 rounded-full border-zinc-300 py-1 text-sm transition-all hover:border-black"
					>
						<a href="https://www.t.me/dagmawi_babi" target="_blank" rel="noopener noreferrer">
							<Send
								class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-cyan-500"
								size={20}
							/>
						</a>
						<a
							href="https://www.linkedin.com/in/dagmawibabi"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Linkedin
								class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-blue-500"
								size={20}
							/>
						</a>
						<a
							href="https://www.instagram.com/dagmawibabi"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Instagram
								class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-pink-600"
								size={20}
							/>
						</a>
						<a href="https://www.x.com/dagmawibabi" target="_blank" rel="noopener noreferrer">
							<Twitter
								class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-blue-500"
								size={20}
							/>
						</a>
						<a href="https://www.github.com/dagmawibabi" target="_blank" rel="noopener noreferrer">
							<Github
								class="hover:text-black-500 cursor-pointer  text-sm text-zinc-700 hover:scale-125"
								size={20}
							/>
						</a>
						<a href="mailto:1babidagi@gmail.com" target="_blank" rel="noopener noreferrer">
							<Mail
								class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-green-500"
								size={20}
							/>
						</a>
						<div class="group/phone cursor-pointer">
							<Phone
								class="text-sm text-zinc-700 hover:scale-125 group-hover/phone:hidden"
								size={20}
							/>
							<span
								class="hidden text-sm font-semibold text-pink-600 hover:scale-125 group-hover/phone:block"
							>
								LOL
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Description -->
			{#if showDescription}
				<div class="flex flex-col md:gap-y-2">
					<p class="text-sm">
						In this part of my journey I am learning to read and write as per the advice of
						Dr.Jordan Peterson, So this is an attempt in doing just that. I've been journalling all
						my life I know how helpful it is to organize and put thoughts into words. So this's a
						place to host all my writings and I hope it inspires, motivates and helps you grow as it
						does to me. Enjoy!
					</p>
					<!-- <p class="text-sm">
							Fast-forward to today, and I've had the privilege of working at multiple start ups, an
							event organizing company, a huge corporation, campus clubs and handled government
							projects. My main focus these days is building modern, minimal and powerful products
							and digital experiences at Dream Intelligence for the world to explore.
						</p> -->
				</div>
			{/if}
		</div>
	</div>
</div>
