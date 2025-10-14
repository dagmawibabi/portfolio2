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
		OpenAI:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/OpenAI_logo_2025_%28symbol%29.svg/640px-OpenAI_logo_2025_%28symbol%29.svg.png',
		'JS-TikToken':
			'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/640px-Npm-logo.svg.png',
		ReactJS: 'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png',
		Godot: 'https://godotengine.org/assets/press/icon_color.png',
		Telegram:
			'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJsb2dvc1RlbGVncmFtMCIgeDE9IjUwJSIgeDI9IjUwJSIgeTE9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzJhYWJlZSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzIyOWVkOSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGZpbGw9InVybCgjbG9nb3NUZWxlZ3JhbTApIiBkPSJNMTI4IDBDOTQuMDYgMCA2MS40OCAxMy40OTQgMzcuNSAzNy40OUExMjguMDQgMTI4LjA0IDAgMCAwIDAgMTI4YzAgMzMuOTM0IDEzLjUgNjYuNTE0IDM3LjUgOTAuNTFDNjEuNDggMjQyLjUwNiA5NC4wNiAyNTYgMTI4IDI1NnM2Ni41Mi0xMy40OTQgOTAuNS0zNy40OWMyNC0yMy45OTYgMzcuNS01Ni41NzYgMzcuNS05MC41MXMtMTMuNS02Ni41MTQtMzcuNS05MC41MUMxOTQuNTIgMTMuNDk0IDE2MS45NCAwIDEyOCAwIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTU3Ljk0IDEyNi42NDhxNTUuOTgtMjQuMzg0IDc0LjY0LTMyLjE1MmMzNS41Ni0xNC43ODYgNDIuOTQtMTcuMzU0IDQ3Ljc2LTE3LjQ0MWMxLjA2LS4wMTcgMy40Mi4yNDUgNC45NiAxLjQ5YzEuMjggMS4wNSAxLjY0IDIuNDcgMS44MiAzLjQ2N2MuMTYuOTk2LjM4IDMuMjY2LjIgNS4wMzhjLTEuOTIgMjAuMjQtMTAuMjYgNjkuMzU2LTE0LjUgOTIuMDI2Yy0xLjc4IDkuNTkyLTUuMzIgMTIuODA4LTguNzQgMTMuMTIyYy03LjQ0LjY4NC0xMy4wOC00LjkxMi0yMC4yOC05LjYzYy0xMS4yNi03LjM4Ni0xNy42Mi0xMS45ODItMjguNTYtMTkuMTg4Yy0xMi42NC04LjMyOC00LjQ0LTEyLjkwNiAyLjc2LTIwLjM4NmMxLjg4LTEuOTU4IDM0LjY0LTMxLjc0OCAzNS4yNi0zNC40NWMuMDgtLjMzOC4xNi0xLjU5OC0uNi0yLjI2MmMtLjc0LS42NjYtMS44NC0uNDM4LTIuNjQtLjI1OGMtMS4xNC4yNTYtMTkuMTIgMTIuMTUyLTU0IDM1LjY4NmMtNS4xIDMuNTA4LTkuNzIgNS4yMTgtMTMuODggNS4xMjhjLTQuNTYtLjA5OC0xMy4zNi0yLjU4NC0xOS45LTQuNzA4Yy04LTIuNjA2LTE0LjM4LTMuOTg0LTEzLjgyLTguNDFjLjI4LTIuMzA0IDMuNDYtNC42NjIgOS41Mi03LjA3MiIvPjwvc3ZnPg==',
		Cloudinary:
			'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMTY4IiB2aWV3Qm94PSIwIDAgMjU2IDE2OCI+PHBhdGggZmlsbD0iIzM0NDhjNSIgZD0iTTc1LjA2IDc1LjIwMmEuNy43IDAgMCAxIC40OTguMjA4bDIzLjU2IDIzLjU4MWEuNy43IDAgMCAxLS40ODggMS4xODhoLTYuMDIyYS43Mi43MiAwIDAgMC0uNzIxLjd2NTMuMDE1YTEyLjcyIDEyLjcyIDAgMCAwIDMuNzEgOC45NDlsMy41MiAzLjUyYS43LjcgMCAwIDEtLjQ4NyAxLjE4N0g3MC44NWMtNy4wMjcgMC0xMi43MjMtNS42OTYtMTIuNzIzLTEyLjcyM3YtNTMuOTQ4YS43LjcgMCAwIDAtLjctLjdoLTUuOTM4YS43LjcgMCAwIDEtLjUwOS0xLjE4OGwyMy41ODEtMjMuNThhLjcuNyAwIDAgMSAuNDk5LS4yMW01Mi4xMDMgMTMuNjU2YS43LjcgMCAwIDEgLjQ5OC4yMDlsMjMuNTgxIDIzLjQ5NmEuNy43IDAgMCAxLS41MDkgMS4xODhoLTYuMDIyYS43Mi43MiAwIDAgMC0uNy43MnYzOS40MjNhMTIuNzIgMTIuNzIgMCAwIDAgMy42OSA4Ljk0OWwzLjU0MSAzLjUyYS43LjcgMCAwIDEtLjUwOSAxLjE4N2gtMjcuNzE2Yy03LjAyNyAwLTEyLjcyNC01LjY5Ni0xMi43MjQtMTIuNzIzdi00MC4zMTNhLjcyLjcyIDAgMCAwLS43LS43MjFoLTZhLjcuNyAwIDAgMS0uNDg4LTEuMTg4bDIzLjU2LTIzLjUzOGEuNy43IDAgMCAxIC40OTgtLjIwOW01Mi4xMTQgMTMuNTFjLjE4MyAwIC4zNi4wNzUuNDg3LjIwN2wyMy41ODEgMjMuNTZhLjcuNyAwIDAgMS0uNDg3IDEuMjA5aC02LjA0NGEuNy43IDAgMCAwLS43Ljd2MjUuODVhMTIuNzIgMTIuNzIgMCAwIDAgMy43MTEgOC45NDlsMy41MiAzLjUyYS43LjcgMCAwIDEtLjQ4NyAxLjE4N2gtMjcuODAxYy03LjAyNyAwLTEyLjcyNC01LjY5Ni0xMi43MjQtMTIuNzIzdi0yNi43ODRhLjcuNyAwIDAgMC0uNy0uN2gtNS45MzdhLjcuNyAwIDAgMS0uNDg4LTEuMjA4bDIzLjU4LTIzLjU2YS42OC42OCAwIDAgMSAuNDg5LS4yMDdNMTI2LjY4Ni0uMDAyYzM3LjA0LjI3IDY5LjcxIDI0LjMyMyA4MC45NjQgNTkuNjE0YzI3LjUxIDMuNTkgNDguMTUgMjYuOTI4IDQ4LjM1IDU0LjY2OGMwIDIyLjg5NS0xNC4zMTkgNDEuOTIxLTM3LjQzOCA0OS44NDJsLS44Ni4yODlsLTEuMDYuMzM5di0xNy4wOTJjMTQuNjk1LTYuMTkyIDIzLjMyNi0xOC40MjggMjMuMzI2LTMzLjM3OGMtLjA3NS0yMS4wOTctMTYuNzgyLTM4LjMyMy0zNy43OC0zOS4xMjZsLS43MDktLjAyaC02LjM2MWwtMS41MjctNi4wNjZjLTcuNDk0LTMwLjkzLTM1LjA4LTUyLjc5LTY2LjkwNS01My4wMTVhNjguMTggNjguMTggMCAwIDAtNjEuNTc2IDM4LjIzbC0yLjM2IDQuODYxbC00LjQ1NC40NjdjLTIwLjExMiAyLjE1MS0zNi42MjcgMTYuODYyLTQxLjA4IDM2LjU5M2MtNC4zOSAxOS40NDkgMy44OTggMzkuNTI3IDIwLjY0NiA1MC4yMzFsLjczNC40NnYxOC4wMjVoLS4xMDZsLTEuNTktLjcyMUMxMS43NDQgMTUyLjYzNi0yLjk5IDEyNi4wOC41MSA5OC42MTZjMy41MDItMjcuNDYzIDI0LjQyOC00OS40NzQgNTEuNjgtNTQuMzU4QzY2LjkxMiAxNi44NTEgOTUuNTc1LS4xNzcgMTI2LjY4Ni0uMDAyIi8+PC9zdmc+'
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
				class="h-full w-full object-cover transition-all group-hover:scale-110"
			/>
			<!-- class="h-full w-full object-cover transition-all group-hover:scale-110 group-hover:grayscale-0 lg:grayscale xl:grayscale 2xl:grayscale" -->
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
