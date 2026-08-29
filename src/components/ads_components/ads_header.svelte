<script lang="ts">
	import logo from '$lib/assets/logo/DagmawiBabiLogo.png';
	import {
		Instagram,
		Linkedin,
		Mail,
		Send,
		Youtube,
		SunIcon,
		MoonIcon
	} from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import config from '$lib/blog-config.json';
	import BrandAndAssets from '../brand_and_assets.svelte';
</script>

<header class="w-full pb-6">
	<!-- Single Top Navbar -->
	<div class="flex items-center justify-between gap-x-2 border-b border-zinc-200 py-3 dark:border-zinc-800">
		<!-- Left: Dagmawi Babi branding (links to portfolio root /) -->
		<div>
			<!-- Mobile View -->
			<a href="/" class="flex items-center gap-x-2 md:hidden">
				<img src={logo} alt="logo" class="flex w-10 invert-0 dark:invert" />
				<div class="flex flex-col justify-center">
					<div class="text-base font-semibold leading-tight">{config.name}</div>
					<span class="text-xs text-zinc-500 dark:text-zinc-400">{config.subtitle}</span>
				</div>
			</a>

			<!-- Desktop View with Context Menu -->
			<a href="/" class="hidden items-center gap-x-2 transition-opacity hover:opacity-85 md:flex">
				<BrandAndAssets />
			</a>
		</div>

		<!-- Right: Reach socials pill + Book an Ad + Theme toggle on the exact same line -->
		<div class="flex items-center gap-x-2 sm:gap-x-3">
			<!-- Reach Socials Pill -->
			<div
				class="hidden items-center gap-x-2.5 rounded-full border border-zinc-200 bg-neutral-50/70 px-3 py-1.5 text-xs sm:flex dark:border-zinc-800 dark:bg-zinc-900/60"
			>
				<span class="font-medium text-zinc-500 dark:text-zinc-400">Reach:</span>
				<a
					href="https://t.me/dagmawi_babi"
					target="_blank"
					rel="noopener noreferrer"
					title="Telegram"
					class="text-zinc-600 transition-colors hover:text-cyan-500 dark:text-zinc-300 dark:hover:text-cyan-400"
				>
					<Send size={15} />
				</a>
				<a
					href="https://www.instagram.com/dagmawibabi"
					target="_blank"
					rel="noopener noreferrer"
					title="Instagram"
					class="text-zinc-600 transition-colors hover:text-pink-500 dark:text-zinc-300 dark:hover:text-pink-400"
				>
					<Instagram size={15} />
				</a>
				<a
					href="https://www.linkedin.com/in/dagmawibabi"
					target="_blank"
					rel="noopener noreferrer"
					title="LinkedIn"
					class="text-zinc-600 transition-colors hover:text-blue-500 dark:text-zinc-300 dark:hover:text-blue-400"
				>
					<Linkedin size={15} />
				</a>
				<a
					href="https://www.youtube.com/@dagmawi_babi"
					target="_blank"
					rel="noopener noreferrer"
					title="YouTube"
					class="text-zinc-600 transition-colors hover:text-red-500 dark:text-zinc-300 dark:hover:text-red-400"
				>
					<Youtube size={15} />
				</a>
				<a
					href="mailto:{config.email}"
					target="_blank"
					rel="noopener noreferrer"
					title="Email"
					class="text-zinc-600 transition-colors hover:text-emerald-500 dark:text-zinc-300 dark:hover:text-emerald-400"
				>
					<Mail size={15} />
				</a>
			</div>

			<!-- Book an Ad Button -->
			<a
				href="https://t.me/dagmawi_babi?direct"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-x-1.5 rounded-full bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-white transition-all hover:bg-neutral-800 hover:shadow-sm dark:bg-white dark:text-neutral-900 dark:hover:bg-zinc-200"
			>
				<Send size={13} />
				<span>Book an Ad</span>
			</a>

			<!-- Theme Switcher -->
			<Button onclick={toggleMode} variant="ghost" size="icon" class="h-8 w-8 rounded-full">
				<SunIcon
					class="h-[1.1rem] w-[1.1rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.1rem] w-[1.1rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</div>
</header>
