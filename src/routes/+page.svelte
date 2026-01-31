<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Instagram,
		Github,
		Linkedin,
		Mail,
		Twitter,
		Send,
		ExternalLink,
		ArrowUpRight,
		ChevronDown
	} from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import { SunIcon, MoonIcon } from 'lucide-svelte';
	import { Toaster } from 'svelte-sonner';

	// Images
	import me from '$lib/assets/me/Me.png';
	import me2 from '$lib/assets/me/Me2.png';
	import logo from '$lib/assets/logo/DagmawiBabiLogo.png';

	// Project Images
	import ScholarXIV from '$lib/assets/projects/ScholarXIVWhite.jpg';
	import ScholarXIVWeb from '$lib/assets/projects/ScholarXIVWeb.png';
	import NativeChat from '$lib/assets/projects/NativeChat2.png';
	import TokenCounter from '$lib/assets/projects/TokenCounter.png';
	import APIHub from '$lib/assets/projects/APIHub.png';
	import MyBible from '$lib/assets/projects/MyBible.png';

	// Experience Images
	import afriwork from '$lib/assets/experience/Afriwork.png';
	import betterAuth from '$lib/assets/experience/BetterAuthBlack.png';
	import scholarXIVLogo from '$lib/assets/experience/ScholarXIV.png';

	// Awards
	import FlutterOfTheYear from '$lib/assets/awards/FlutterOfTheYear.jpg';
	import GDSCImpactAward from '$lib/assets/awards/GDSCImpactAward.jpg';

	let activeSection = $state('about');
	let scrollY = $state(0);
	let isVisible = $state(false);

	const sections = ['about', 'experience', 'projects', 'education', 'awards'];

	const featuredProjects = [
		{
			title: 'ScholarXIV Web',
			description:
				'AI-powered research platform for exploring and analyzing academic papers from arXiv with advanced features like commenting and conversation.',
			link: 'https://www.scholarxiv.com',
			tools: ['SvelteKit', 'TailwindCSS', 'MongoDB', 'Gemini'],
			image: ScholarXIVWeb
		},
		{
			title: 'ScholarXIV Mobile',
			description:
				'Flutter app of the year 2024. An aesthetic, minimal and AI powered app for academic paper exploration.',
			link: 'https://github.com/dagmawibabi/Scholarxiv/releases/latest',
			tools: ['Flutter', 'Gemini'],
			image: ScholarXIV
		},
		{
			title: 'NativeChat',
			description:
				'Context-aware mobile assistant using Gemini for system specs, call logs analysis, and personalized responses.',
			link: 'https://github.com/dagmawibabi/NativeChat/releases/latest',
			tools: ['Flutter', 'Gemini'],
			image: NativeChat
		},
		{
			title: 'Token Counter',
			description:
				'Offline tool to analyze your ChatGPT history - tokens used, models, costs, and chat insights.',
			link: 'https://Token-Counter-nu.vercel.app',
			tools: ['SvelteKit', 'TailwindCSS'],
			image: TokenCounter
		},
		{
			title: 'API Hub',
			description:
				'All-in-one API destination. A unified wrapper around major APIs with calculations, filters, and more.',
			link: 'https://apihub-seven.vercel.app',
			tools: ['HonoJS'],
			image: APIHub
		},
		{
			title: 'My Bible',
			description:
				'Aesthetic Bible app with 9 translations designed for parallel scripture study with minimal distractions.',
			link: 'https://t.me/Dagmawi_Babi/13687',
			tools: ['Flutter'],
			image: MyBible
		}
	];

	const experiences = [
		{
			company: 'ScholarXIV',
			role: 'Founder, CEO',
			date: '2025 - Present',
			description:
				'Leading an AI-powered research platform that enables curious learners and researchers explore and analyze research papers.',
			logo: scholarXIVLogo,
			link: 'https://scholarxiv.com'
		},
		{
			company: 'Better Auth',
			role: 'Full Stack Developer',
			date: '2025',
			description:
				'Y-Combinator backed, open-source authentication framework. One of the fastest growing projects worldwide.',
			logo: betterAuth,
			link: 'https://better-auth.com'
		},
		{
			company: 'Afriwork',
			role: 'Web & Mobile Fullstack',
			date: '2024 - 2025',
			description:
				"Ethiopia's top freelancing platform trusted by 15k+ companies and 300k+ freelancers.",
			logo: afriwork,
			link: 'https://www.afriworket.com'
		}
	];

	const education = [
		{
			school: 'Addis Ababa Science and Tech University',
			degree: 'Software Engineering',
			date: '2019 - 2024'
		},
		{
			school: 'Unity University',
			degree: 'Management',
			date: '2020 - 2024'
		}
	];

	const awards = [
		{
			name: 'Flutter App of the Year',
			image: FlutterOfTheYear,
			link: 'https://flutteroftheyear.com'
		},
		{
			name: 'GDSC Impact Award',
			image: GDSCImpactAward,
			link: 'https://t.me/Dagmawi_Babi/19815'
		}
	];

	onMount(() => {
		isVisible = true;

		const handleScroll = () => {
			scrollY = window.scrollY;

			// Update active section based on scroll position
			for (const section of sections) {
				const el = document.getElementById(section);
				if (el) {
					const rect = el.getBoundingClientRect();
					if (rect.top <= 200 && rect.bottom >= 200) {
						activeSection = section;
						break;
					}
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function scrollToSection(section: string) {
		const el = document.getElementById(section);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>Dagmawi Babi</title>
</svelte:head>

<div class="relative min-h-screen bg-background">
	<!-- Main Container -->
	<div class="mx-auto max-w-7xl px-6 py-12 lg:flex lg:gap-16 lg:px-12 lg:py-0">
		<!-- Left Sidebar - Sticky -->
		<header
			class="lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-1/2 lg:max-w-md lg:flex-col lg:justify-between lg:py-24"
		>
			<div>
				<!-- Profile Image with hover effect -->
				<div
					class="group/me mb-8 h-32 w-32 overflow-hidden rounded-full border-2 border-border transition-all duration-500 hover:border-foreground hover:shadow-2xl"
					class:opacity-0={!isVisible}
					class:translate-y-4={!isVisible}
					style="transition-delay: 100ms;"
				>
					<img
						src={me2}
						alt="Dagmawi Babi"
						class="h-full w-full object-cover transition-all duration-500 group-hover/me:hidden group-hover/me:scale-110"
					/>
					<img
						src={me}
						alt="Dagmawi Babi"
						class="hidden h-full w-full object-cover transition-all duration-500 group-hover/me:block"
					/>
				</div>

				<!-- Name & Title -->
				<div
					class:opacity-0={!isVisible}
					class:translate-y-4={!isVisible}
					style="transition: opacity 0.6s, transform 0.6s; transition-delay: 200ms;"
				>
					<h1 class="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
						Dagmawi Babi
					</h1>
					<h2 class="mt-3 text-lg font-medium text-muted-foreground lg:text-xl">
						Believer & Creative Developer
					</h2>
					<p class="mt-4 max-w-xs text-muted-foreground">
						I build modern, minimal and powerful digital experiences that solve real problems.
					</p>
				</div>

				<!-- Navigation -->
				<nav
					class="mt-16 hidden lg:block"
					class:opacity-0={!isVisible}
					class:translate-y-4={!isVisible}
					style="transition: opacity 0.6s, transform 0.6s; transition-delay: 300ms;"
				>
					<ul class="flex flex-col gap-4">
						{#each sections as section}
							<li>
								<button
									onclick={() => scrollToSection(section)}
									class="group flex items-center gap-4 text-sm font-medium uppercase tracking-widest transition-all duration-300"
									class:text-foreground={activeSection === section}
									class:text-muted-foreground={activeSection !== section}
								>
									<span
										class="h-px w-8 bg-current transition-all duration-300 group-hover:w-16"
										class:w-16={activeSection === section}
									></span>
									{section}
								</button>
							</li>
						{/each}
					</ul>
				</nav>
			</div>

			<!-- Social Links & Theme Toggle -->
			<div
				class="mt-8 flex items-center gap-5"
				class:opacity-0={!isVisible}
				class:translate-y-4={!isVisible}
				style="transition: opacity 0.6s, transform 0.6s; transition-delay: 400ms;"
			>
				<a
					href="https://github.com/dagmawibabi"
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-foreground"
				>
					<Github size={22} />
				</a>
				<a
					href="https://linkedin.com/in/dagmawibabi"
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-foreground"
				>
					<Linkedin size={22} />
				</a>
				<a
					href="https://instagram.com/dagmawibabi"
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-foreground"
				>
					<Instagram size={22} />
				</a>
				<a
					href="https://x.com/dagmawibabi"
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-foreground"
				>
					<Twitter size={22} />
				</a>
				<a
					href="https://t.me/dagmawi_babi"
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-foreground"
				>
					<Send size={22} />
				</a>
				<a
					href="mailto:1babidagi@gmail.com"
					class="text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:text-foreground"
				>
					<Mail size={22} />
				</a>

				<div class="ml-auto">
					<Button onclick={toggleMode} variant="ghost" size="icon">
						<SunIcon
							class="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
						/>
						<MoonIcon
							class="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>
				</div>
			</div>
		</header>

		<!-- Right Content - Scrollable -->
		<main class="lg:w-1/2 lg:py-24">
			<!-- About Section -->
			<section id="about" class="mb-24 scroll-mt-24">
				<h3
					class="mb-8 text-sm font-bold uppercase tracking-widest text-foreground lg:hidden"
				>
					About
				</h3>
				<div class="space-y-4 text-muted-foreground">
					<p class="leading-relaxed">
						Hello! My name is <span class="font-medium text-foreground">Dagmawi</span> and I enjoy
						creating tech solutions to my daily problems. My interest in software development
						started back in <span class="font-medium text-foreground">2013</span> when I accidentally
						stumbled upon a batch programming ebook in one of my harddrives — turns out there's so much
						you could do on a black & white terminal!
					</p>
					<p class="leading-relaxed">
						Fast-forward to today, and I've had the privilege of working at
						<span class="font-medium text-foreground">multiple start-ups</span>,
						<span class="font-medium text-foreground">a huge corporation</span>, campus clubs and
						handled
						<span class="font-medium text-foreground">government projects</span>. My main focus
						these days is building modern, minimal and powerful products at
						<span class="font-medium text-foreground">Dream Intelligence</span> for the world to
						explore.
					</p>
					<p class="leading-relaxed">
						I also like to write about tech, philosophical and spiritual topics on my
						<a href="/blog" class="font-medium text-foreground underline-offset-4 hover:underline"
							>blog</a
						>, host deep conversations on my
						<a
							href="https://www.youtube.com/@dagmawi_babi"
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-foreground underline-offset-4 hover:underline">podcast</a
						>, and build a community of supportive, driven, caring and brilliant people around me.
					</p>
				</div>
			</section>

			<!-- Experience Section -->
			<section id="experience" class="mb-24 scroll-mt-24">
				<h3
					class="mb-8 text-sm font-bold uppercase tracking-widest text-foreground lg:hidden"
				>
					Experience
				</h3>
				<div class="space-y-2">
					{#each experiences as exp, i}
						<a
							href={exp.link}
							target="_blank"
							rel="noopener noreferrer"
							class="group relative flex gap-4 rounded-lg p-4 transition-all duration-300 hover:bg-muted/50 hover:shadow-lg"
							style="animation: fadeInUp 0.6s ease-out forwards; animation-delay: {i * 100}ms;"
						>
							<!-- Timeline indicator -->
							<div class="flex flex-col items-center">
								<div
									class="h-3 w-3 rounded-full border-2 border-muted-foreground transition-all duration-300 group-hover:border-foreground group-hover:bg-foreground"
								></div>
								{#if i < experiences.length - 1}
									<div class="mt-2 h-full w-px bg-border"></div>
								{/if}
							</div>

							<div class="flex-1 pb-8">
								<div class="flex items-start justify-between">
									<div>
										<h4
											class="font-medium text-foreground transition-colors group-hover:text-primary"
										>
											{exp.role}
											<span class="mx-2 text-muted-foreground">·</span>
											{exp.company}
											<ArrowUpRight
												class="ml-1 inline-block h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
											/>
										</h4>
										<p class="mt-1 text-sm text-muted-foreground">{exp.date}</p>
									</div>
								</div>
								<p class="mt-3 text-sm leading-relaxed text-muted-foreground">
									{exp.description}
								</p>
							</div>
						</a>
					{/each}
				</div>

				<a
					href="/resume"
					class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-all hover:gap-3"
				>
					View Full Resume
					<ArrowUpRight class="h-4 w-4" />
				</a>
			</section>

			<!-- Projects Section -->
			<section id="projects" class="mb-24 scroll-mt-24">
				<h3
					class="mb-8 text-sm font-bold uppercase tracking-widest text-foreground lg:hidden"
				>
					Projects
				</h3>
				<div class="space-y-6">
					{#each featuredProjects as project, i}
						<a
							href={project.link}
							target="_blank"
							rel="noopener noreferrer"
							class="group flex flex-col gap-4 rounded-lg p-4 transition-all duration-300 hover:bg-muted/50 hover:shadow-lg sm:flex-row"
							style="animation: fadeInUp 0.6s ease-out forwards; animation-delay: {i * 100}ms;"
						>
							<!-- Project Image -->
							<div
								class="h-24 w-full shrink-0 overflow-hidden rounded border border-border transition-all duration-300 group-hover:border-foreground/30 sm:w-32"
							>
								<img
									src={project.image}
									alt={project.title}
									class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
								/>
							</div>

							<div class="flex-1">
								<h4
									class="font-medium text-foreground transition-colors group-hover:text-primary"
								>
									{project.title}
									<ArrowUpRight
										class="ml-1 inline-block h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
									/>
								</h4>
								<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
									{project.description}
								</p>
								<div class="mt-3 flex flex-wrap gap-2">
									{#each project.tools as tool}
										<span
											class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
										>
											{tool}
										</span>
									{/each}
								</div>
							</div>
						</a>
					{/each}
				</div>

				<a
					href="https://github.com/dagmawibabi"
					target="_blank"
					rel="noopener noreferrer"
					class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-all hover:gap-3"
				>
					View All Projects
					<ArrowUpRight class="h-4 w-4" />
				</a>
			</section>

			<!-- Education Section -->
			<section id="education" class="mb-24 scroll-mt-24">
				<h3
					class="mb-8 text-sm font-bold uppercase tracking-widest text-foreground lg:hidden"
				>
					Education
				</h3>
				<div class="space-y-6">
					{#each education as edu, i}
						<div
							class="group rounded-lg p-4 transition-all duration-300 hover:bg-muted/50"
							style="animation: fadeInUp 0.6s ease-out forwards; animation-delay: {i * 100}ms;"
						>
							<div class="flex items-start justify-between">
								<div>
									<h4 class="font-medium text-foreground">{edu.degree}</h4>
									<p class="mt-1 text-sm text-muted-foreground">{edu.school}</p>
								</div>
								<span class="text-sm text-muted-foreground">{edu.date}</span>
							</div>
						</div>
					{/each}
				</div>
			</section>

			<!-- Awards Section -->
			<section id="awards" class="mb-24 scroll-mt-24">
				<h3
					class="mb-8 text-sm font-bold uppercase tracking-widest text-foreground lg:hidden"
				>
					Awards
				</h3>
				<div class="grid gap-4 sm:grid-cols-2">
					{#each awards as award, i}
						<a
							href={award.link}
							target="_blank"
							rel="noopener noreferrer"
							class="group relative overflow-hidden rounded-lg border border-border transition-all duration-500 hover:border-foreground/30 hover:shadow-xl"
							style="animation: fadeInUp 0.6s ease-out forwards; animation-delay: {i * 100}ms;"
						>
							<div class="aspect-square overflow-hidden">
								<img
									src={award.image}
									alt={award.name}
									class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
								/>
							</div>
							<div
								class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4"
							>
								<h4 class="font-medium text-foreground">
									{award.name}
									<ArrowUpRight
										class="ml-1 inline-block h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
									/>
								</h4>
							</div>
						</a>
					{/each}
				</div>
			</section>

			<!-- Footer -->
			<footer class="text-sm text-muted-foreground">
				<p class="leading-relaxed">
					Built with <a href="https://svelte.dev" target="_blank" rel="noopener noreferrer" class="font-medium text-foreground hover:underline">SvelteKit</a> and <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" class="font-medium text-foreground hover:underline">Tailwind CSS</a>.
				</p>
			</footer>
		</main>
	</div>
</div>

<Toaster expand={true} />

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
