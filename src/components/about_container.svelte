<script lang="ts">
	import {
		Instagram,
		Github,
		Linkedin,
		Mail,
		Twitter,
		Send,
		Phone,
		SunIcon,
		MoonIcon
	} from 'lucide-svelte';
	import logo from '$lib/assets/logo/DagmawiBabiLogo.png';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	import me from '$lib/assets/me/Me.png';
	import me2 from '$lib/assets/me/Me2.png';
	import BrandAndAssets from './brand_and_assets.svelte';
</script>

<div class="border-dashed border-black pb-5">
	<div class="group flex items-center">
		<div
			class="flex flex-col gap-x-3 rounded border-zinc-300 px-2 py-2 pr-4 lg:flex-row xl:flex-row 2xl:flex-row"
		>
			<!-- TITLE -->
			<div class="flex items-center gap-x-2 md:flex lg:hidden xl:hidden 2xl:hidden">
				<img src={logo} alt="logo" class="flex w-12 invert-0 dark:invert" />
				<div class="flex flex-col justify-center">
					<div class="text-xl font-semibold">Dagmawi Babi</div>
					<span class="-mt-1">Believer | Creative Developer</span>
				</div>
			</div>

			<!-- IMAGE -->
			<div class="group/me h-56 w-[50%] cursor-pointer rounded md:h-56 lg:h-72 xl:h-72 2xl:h-72">
				<img src={me2} alt="project" class="h-full w-full object-contain group-hover/me:hidden" />
				<img
					src={me}
					alt="project"
					class="hidden h-full w-full object-contain group-hover/me:block"
				/>
			</div>

			<!-- DETAILS -->
			<div class="flex w-full flex-col justify-center gap-y-4 pt-3 lg:pt-0 xl:pt-0 2xl:pt-0">
				<!-- TITLE -->
				<div class="hidden items-center justify-between gap-x-2 md:flex">
					<div class="flex items-center justify-between gap-x-2">
						<BrandAndAssets />
					</div>

					<Button onclick={toggleMode} variant="ghost" size="icon">
						<SunIcon
							class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all! dark:-rotate-90 dark:scale-0"
						/>
						<MoonIcon
							class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all! dark:rotate-0 dark:scale-100"
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>
				</div>

				<!-- DESCRIPTION -->
				<div class="flex flex-col gap-y-2">
					<p class="text-sm">
						Hello! My name is Dagmawi and I enjoy creating tech solutions to my daily problems. My
						interest in software development started back in 2013 when I accidentally stumbled upon
						a batch programming ebook in one of my harddrives — turns out there's so much you could
						do on a black & white terminal!
					</p>
					<p class="text-sm">
						Fast-forward to today, and I've had the privilege of working at multiple start ups, an
						event organizing company, a huge corporation, campus clubs and handled government
						projects. My main focus these days is building modern, minimal and powerful products and
						digital experiences at Dream Intelligence for the world to explore.
					</p>
				</div>

				<!-- CTA -->
				<div class="hidden gap-x-2 md:flex">
					<div
						class="flex items-center justify-center gap-x-3 rounded-full border-zinc-300 py-1 text-sm transition-all hover:border-black"
					>
						<a href="https://www.t.me/dagmawi_babi" target="_blank" rel="noopener noreferrer">
							<Send
								class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-cyan-500 dark:text-white dark:hover:text-cyan-500"
								size={20}
							/>
						</a>
						<a
							href="https://www.linkedin.com/in/dagmawibabi"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Linkedin
								class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-blue-500 dark:text-white dark:hover:text-blue-500"
								size={20}
							/>
						</a>
						<a
							href="https://www.instagram.com/dagmawibabi"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Instagram
								class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-pink-600 dark:text-white dark:hover:text-pink-600"
								size={20}
							/>
						</a>
						<a href="https://www.x.com/dagmawibabi" target="_blank" rel="noopener noreferrer">
							<Twitter
								class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-blue-500 dark:text-white dark:hover:text-blue-500"
								size={20}
							/>
						</a>
						<a href="https://www.github.com/dagmawibabi" target="_blank" rel="noopener noreferrer">
							<Github
								class="hover:text-black-500 cursor-pointer  text-sm text-zinc-700 hover:scale-125 dark:text-white"
								size={20}
							/>
						</a>
						<a href="mailto:1babidagi@gmail.com" target="_blank" rel="noopener noreferrer">
							<Mail
								class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-green-500 dark:text-white dark:hover:text-green-500"
								size={20}
							/>
						</a>
						<div class="group/phone cursor-pointer">
							<Phone
								class="text-sm text-zinc-700 hover:scale-125 group-hover/phone:hidden dark:text-white"
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
		</div>
	</div>
</div>
