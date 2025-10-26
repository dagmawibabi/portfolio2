<script lang="ts">
	let { creativeOutlet }: { creativeOutlet?: any } = $props();
</script>

<!-- PROJECT IMAGE -->
<div
	class="group h-64 w-full overflow-clip rounded border border-zinc-400 transition-all hover:border-black hover:shadow-lg dark:border-zinc-700 lg:w-[40%] xl:w-[40%] 2xl:w-[40%]"
>
	<div class="flex h-full w-full flex-col justify-center">
		<div class="group/picture relative h-full w-full">
			<a
				href={creativeOutlet.link}
				target={creativeOutlet.name == 'Blog' ? '_self' : '_blank'}
				rel="noopener noreferrer"
			>
				<div class="absolute hidden h-full w-full transition-all group-hover/picture:flex">
					<img
						src={creativeOutlet.image}
						alt="podcast"
						class="h-full w-full object-cover blur grayscale transition-all duration-300 hover:grayscale-0 group-hover:blur-none"
					/>
				</div>
				<div
					class="absolute z-50 flex h-full w-full flex-col items-center justify-center transition-all group-hover/picture:hidden"
				>
					<div class="w-fit rounded-full border-black bg-white dark:bg-zinc-950 dark:text-white">
						<!-- svelte-ignore svelte_component_deprecated -->
						<svelte:component
							this={creativeOutlet.icon}
							class="text-black transition-all dark:text-white"
						/>
					</div>
					<div class="rounded-full bg-white px-4 text-black dark:bg-zinc-950 dark:text-white">
						{creativeOutlet.name}
					</div>
					<div
						class="rounded-full bg-white px-4 pt-4 text-center text-sm text-black dark:bg-zinc-950 dark:text-white"
					>
						{creativeOutlet.description}
					</div>
					<div></div>
				</div>
			</a>
		</div>
	</div>
</div>
