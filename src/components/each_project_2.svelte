<script lang="ts">
	import { Code2, ExternalLink, Key, KeyIcon, Layers, Lock } from 'lucide-svelte';

	let { project } = $props();

	var techTools: any = {
		Flutter: 'https://iconape.com/wp-content/png_logo_vector/flutter-logo.png',
		NextJS: 'https://static-00.iconduck.com/assets.00/nextjs-icon-512x512-y563b8iq.png',
		SvelteKit:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Svelte_logo_by_gengns.svg/640px-Svelte_logo_by_gengns.svg.png',
		TailwindCSS:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1280px-Tailwind_CSS_Logo.svg.png',
		HonoJS: 'https://avatars.githubusercontent.com/u/98495527?s=280&v=4',
		NodeJS: 'https://cdn-icons-png.flaticon.com/512/5968/5968322.png',
		MongoDB: 'https://cdn.iconscout.com/icon/free/png-256/free-mongodb-2-1175137.png?f=webp',
		Docker:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Docker-svgrepo-com.svg/900px-Docker-svgrepo-com.svg.png?20230427111848',
		Kubernetes: 'https://static-00.iconduck.com/assets.00/kubernetes-icon-2048x1995-r1q3f8n7.png',
		Python: 'https://cdn.freebiesupply.com/logos/large/2x/python-5-logo-png-transparent.png',
		Rust: 'https://static-00.iconduck.com/assets.00/rust-icon-2048x2047-5s6wkmk1.png',
		'C#': 'https://www.netgen.co.za/wp-content/uploads/2022/03/C-image-for-Netgen-1024x1024.png',
		'C++':
			'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/C%2B%2B_logo.png/800px-C%2B%2B_logo.png?20210422185554',
		ChromiaDB:
			'https://imagedelivery.net/hbJAA5-ie3CnRrtzIJuUXA/5ee06278-16a7-4812-a260-9c1758a84800/public',
		Unity:
			'https://w7.pngwing.com/pngs/426/535/png-transparent-unity-new-logo-tech-companies-thumbnail.png',
		Arduino:
			'https://e7.pngegg.com/pngimages/758/841/png-clipart-arduino-max-electronic-circuit-pure-data-oscilloscope-raspberry-pi-icons-logo-microcontroller-thumbnail.png',
		Gemini:
			'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png',
		ReactJS: 'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png',
		Godot: 'https://godotengine.org/assets/press/icon_color.png'
	};
</script>

<div class="group grid items-center">
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900"></div>
	</div>
	<div
		class="flex w-full cursor-pointer flex-col transition-all md:flex-row lg:flex-row xl:flex-row 2xl:flex-row"
	>
		<!-- PROJECT IMAGE -->
		<div
			class="flex h-56 w-full overflow-clip rounded border border-zinc-300 duration-300 group-hover:border-black group-hover:shadow-lg lg:w-[40%] xl:w-[40%] 2xl:w-[40%]"
		>
			<img
				src={project.image}
				alt=""
				class="h-full w-full object-cover transition-all group-hover:scale-110 group-hover:grayscale-0 lg:grayscale xl:grayscale 2xl:grayscale"
			/>
		</div>

		<div
			class="my-auto h-1 w-3 border-t border-transparent group-hover:border-black lg:block xl:block 2xl:block"
		></div>

		<!-- PROJECT DETAILS -->
		<div class="relative flex w-full">
			<!-- TECH STACK -->
			<div
				class="absolute right-4 -mt-3 flex items-center justify-center overflow-clip rounded-full border border-black bg-white group-hover:flex lg:hidden xl:hidden 2xl:hidden"
			>
				{#each project.tools as eachTool}
					<div class="border-l border-dotted border-black px-2 py-1">
						<img src={techTools[eachTool]} alt="" class="h-4 w-5 object-contain transition-all" />
					</div>
				{/each}
			</div>
			<div
				class="flex w-full flex-col justify-between rounded border border-zinc-300 px-3 py-2 group-hover:border-black group-hover:shadow-md"
			>
				<!-- TITLE -->
				<div class="font-semibold">{project.title}</div>

				<!-- DESCRIPTION -->
				<div>
					<p class="pt-1 text-sm md:pt-1 lg:pt-0 xl:pt-0 2xl:pt-0">
						{project.description}
					</p>
				</div>

				<!-- CTA -->
				<div class="flex gap-x-2 pt-2 md:pt-2 lg:pt-0 xl:pt-0 2xl:pt-0">
					{#if project.link != ''}
						<a href={project.link} target="_blank" rel="noopener noreferrer">
							<div
								class="duration-120 flex items-center justify-center gap-x-2 rounded-full border border-zinc-300 px-3 py-1 text-sm transition-all hover:border-black"
							>
								<ExternalLink size={16} class="text-zinc-700 hover:text-black" />
								<span class="text-sm text-zinc-700 hover:text-black"> View Live </span>
							</div>
						</a>
					{/if}
					{#if project.code != ''}
						<a href={project.code} target="_blank" rel="noopener noreferrer">
							<div
								class="duration-120 flex items-center justify-center gap-x-2 rounded-full border border-zinc-300 px-3 py-1 transition-all hover:border-black"
							>
								<Code2 size={16} class="text-zinc-700 hover:text-black" />
								<span class="text-sm text-zinc-700 hover:text-black"> Source Code </span>
							</div>
						</a>
					{/if}
					{#if project.link == '' && project.code == ''}
						<div
							class="duration-120 flex items-center justify-center gap-x-2 border border-zinc-300 px-3 py-1 transition-all hover:border-black group-hover:rounded-full"
						>
							<Lock size={16} class="text-zinc-700 hover:text-black" />
							<span class="text-sm text-zinc-700 hover:text-black"> NDA Protected </span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
