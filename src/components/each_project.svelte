<script lang="ts">
	// import { Code2, ExternalLink, Layers } from 'lucide-svelte';
	import ALL1 from '$lib/assets/projects/TheUnityProjectMural.png';
</script>

<div class="pl-8">
	<div class="border-l border-dashed border-black py-4">
		<div class="group flex items-center">
			<div
				class="w-10 border-t border-dashed border-black transition-all group-hover:border-solid"
			></div>
			<div
				class=" flex w-full cursor-pointer gap-x-3 rounded border border-zinc-300 px-2 py-2 pr-4 shadow-md transition-all group-hover:rounded-lg group-hover:border-black group-hover:shadow-lg"
			>
				<!-- PROJECT IMAGE -->
				<div
					class="h-52 w-[40%] overflow-clip rounded border border-zinc-300 group-hover:border-black"
				>
					<img
						src={ALL1}
						alt="project"
						class="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0"
					/>
				</div>

				<!-- PROJECT DETAILS -->
				<div class="flex w-full flex-col justify-between">
					<!-- TITLE -->
					<div class="font-semibold">The Unity Project Mural</div>

					<!-- DESCRIPTION -->
					<div>
						<p class="text-sm">
							The Unity Project Mural is a diverse and collaborative art initiative, inviting people
							to contribute their artistic expressions in a way that interlinks with surrounding
							artworks. This interconnectedness narrates the story of human relationships,
							illustrating how we are all intertwined and connected through various facets of life.
							The artwork featured in this project stems from a vibrant and diverse global creative
							community, showcasing rich and complex art styles and concepts.
						</p>
					</div>

					<!-- CTA -->
					<div class="flex gap-x-2">
						<div
							class="flex items-center justify-center gap-x-2 border border-zinc-300 px-3 py-1 text-sm transition-all hover:border-black group-hover:rounded-full"
						>
							<!-- <ExternalLink size={16} /> -->
							<span class="text-sm text-zinc-700"> View Live </span>
						</div>
						<div
							class="flex items-center justify-center gap-x-2 border border-zinc-300 px-3 py-1 transition-all hover:border-black group-hover:rounded-full"
						>
							<!-- <Code2 size={16} /> -->
							<span class="text-sm text-zinc-700"> Source Code </span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
