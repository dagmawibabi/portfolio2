<script lang="ts">
	let { creativeOutlet }: { creativeOutlet?: any } = $props();
</script>

<!-- PROJECT IMAGE -->
<div
	class="group h-60 w-[40%] overflow-clip rounded border border-zinc-400 transition-all hover:border-black hover:shadow-lg"
>
	<div class="flex h-full w-full flex-col justify-center">
		<div class="group/picture relative h-full w-full">
			<div class="absolute hidden h-full w-full group-hover/picture:flex">
				<img
					src={creativeOutlet.image}
					alt="podcast"
					class="h-full w-full object-cover blur grayscale transition-all duration-300 hover:grayscale-0 group-hover:blur-none"
				/>
			</div>
			<div
				class="absolute z-50 flex h-full w-full flex-col items-center justify-center group-hover/picture:hidden"
			>
				<div class="w-fit rounded-full border-black bg-white">
					<!-- svelte-ignore svelte_component_deprecated -->
					<svelte:component this={creativeOutlet.icon} class="text-black transition-all" />
				</div>
				<div class="rounded-full bg-white px-4 text-black">
					{creativeOutlet.name}
				</div>
				<div class="rounded-full bg-white px-4 pt-4 text-center text-sm text-black">
					{creativeOutlet.description}
				</div>
				<div></div>
			</div>
		</div>

		<!-- <div
			class="z-50 flex h-full w-full flex-col items-center justify-center gap-y-2 rounded-xl group-hover:hidden"
		>
			svelte-ignore svelte_component_deprecated
			<svelte:component
				this={creativeOutlet.icon}
				class="text-zinc-500 transition-all group-hover:text-black"
			/>
			<span class="text-zinc-500 transition-all group-hover:text-black">
				{creativeOutlet.name}
			</span>
		</div> -->

		<!-- <div class=" z-50 -mt-56 hidden flex-col items-center justify-center gap-y-2 group-hover:flex">
			<div class="rounded-full border border-black bg-white p-2">
				svelte-ignore svelte_component_deprecated
				<svelte:component
					this={creativeOutlet.icon}
					class="text-zinc-500 transition-all group-hover:text-black"
				/>
			</div>
		</div> -->

		<!-- <div class="hidden pt-5 group-hover:flex">
			<div
				class="mx-auto w-fit rounded-full border border-zinc-300 px-3 py-1 transition-all group-hover:border-black"
			>
				Read Blog
			</div>
		</div> -->
	</div>
</div>
