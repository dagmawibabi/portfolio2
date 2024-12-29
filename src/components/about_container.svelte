<script lang="ts">
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
	import logo from '$lib/assets/logo//DagmawiBabiLogo.png';

	import me from '$lib/assets/me/Me.png';
	import me2 from '$lib/assets/me/Me2.png';
</script>

<div class="border-dashed border-black pb-5">
	<div class="group flex items-center">
		<div class="flex gap-x-3 rounded border-zinc-300 px-2 py-2 pr-4">
			<!-- PROJECT IMAGE -->
			<div class="group/me h-72 w-[50%] cursor-pointer rounded">
				<img src={me} alt="project" class="h-full w-full object-contain group-hover/me:hidden" />
				<img
					src={me2}
					alt="project"
					class="hidden h-full w-full object-contain group-hover/me:block"
				/>
			</div>

			<!-- PROJECT DETAILS -->
			<div class="flex w-full flex-col justify-center gap-y-4">
				<!-- TITLE -->
				<div class="flex items-center gap-x-2">
					<img src={logo} alt="logo" class="w-12" />
					<div class="flex flex-col justify-center">
						<div class="text-xl font-semibold">Dagmawi Babi</div>
						<span class="-mt-1">Believer | Creative Developer</span>
					</div>
				</div>

				<!-- DESCRIPTION -->
				<div class="flex flex-col gap-y-2">
					<p class="text-sm">
						The Unity Project Mural is a diverse and collaborative art initiative, inviting people
						to contribute their artistic expressions in a way that interlinks with surrounding
						artworks. This interconnectedness narrates the story of human.
					</p>
					<p class="text-sm">
						Illustrating how we are all intertwined and connected through various facets of life.
						The artwork featured in this project stems from a vibrant and diverse global creative
						community, showcasing rich and complex art.
					</p>
				</div>

				<!-- CTA -->
				<div class="flex gap-x-2">
					<div
						class="flex items-center justify-center gap-x-3 rounded-full border-zinc-300 py-1 text-sm transition-all hover:border-black"
					>
						<Send
							class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-cyan-500"
							size={20}
						/>
						<Linkedin
							class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-blue-500"
							size={20}
						/>
						<Instagram
							class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-pink-600"
							size={20}
						/>
						<Twitter
							class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-blue-500"
							size={20}
						/>
						<Github
							class="hover:text-black-500 cursor-pointer  text-sm text-zinc-700 hover:scale-125"
							size={20}
						/>
						<Mail
							class="cursor-pointer text-sm  text-zinc-700 hover:scale-125 hover:text-green-500"
							size={20}
						/>
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
		</div>
	</div>
</div>
