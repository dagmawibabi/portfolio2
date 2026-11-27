<script lang="ts">
	// The landing page's header row (brand, socials, theme toggle) as a standalone bar.
	import { Instagram, Github, Linkedin, Mail, Twitter, Send, SunIcon, MoonIcon } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import BrandAndAssets from '../brand_and_assets.svelte';

	let { class: klass = '' }: { class?: string } = $props();

	const socials = [
		{ href: 'https://www.t.me/dagmawi_babi', icon: Send, hover: 'hover:text-cyan-500', label: 'Telegram' },
		{ href: 'https://www.linkedin.com/in/dagmawibabi', icon: Linkedin, hover: 'hover:text-blue-500', label: 'LinkedIn' },
		{ href: 'https://www.instagram.com/dagmawibabi', icon: Instagram, hover: 'hover:text-pink-600', label: 'Instagram' },
		{ href: 'https://www.x.com/dagmawibabi', icon: Twitter, hover: 'hover:text-blue-500', label: 'X' },
		{ href: 'https://www.github.com/dagmawibabi', icon: Github, hover: '', label: 'GitHub' },
		{ href: 'mailto:1babidagi@gmail.com', icon: Mail, hover: 'hover:text-green-500', label: 'Email' }
	];
</script>

<nav class="flex items-center justify-between gap-4 py-3 {klass}">
	<a href="/" class="shrink-0" aria-label="Home">
		<BrandAndAssets />
	</a>

	<div class="flex items-center gap-x-3">
		<div class="hidden items-center gap-x-3 sm:flex">
			{#each socials as s (s.label)}
				<a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
					<s.icon
						class="text-zinc-700 transition-transform hover:scale-125 dark:text-white {s.hover}"
						size={20}
					/>
				</a>
			{/each}
			<a
				href="/partnerships"
				class="ml-1 inline-flex items-center gap-x-1.5 rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-zinc-200"
			>
				<Send size={12} />
				<span>Book an Ad</span>
			</a>
		</div>
		<Button onclick={toggleMode} variant="ghost" size="icon">
			<SunIcon class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90" />
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</nav>
