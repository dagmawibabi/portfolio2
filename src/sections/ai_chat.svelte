<script lang="ts">
	import { PersonStanding, Sparkle } from 'lucide-svelte';
	import { BarLoader } from 'svelte-loading-spinners';
	import moment from 'moment';
	import Markdown from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	const plugins = [gfmPlugin()];

	let conversation: any = [
		// {
		// 	role: 'user',
		// 	content: 'Hey!'
		// },
		// {
		// 	role: 'ai',
		// 	content: 'Hey there nice to meet you!'
		// },
		// {
		// 	role: 'system',
		// 	content: 'Hey there nice to meet you!'
		// }
	];

	async function readStream(response: any) {
		const reader = response.body.getReader();
		const decoder = new TextDecoder();

		let result = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			result += decoder.decode(value, { stream: true });
		}
		return result;
	}

	async function aiChat(message: string) {
		let result = await fetch('/api/ai', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ message })
		});
		let responseStream = await readStream(result);
		console.log(result);
		let aiResponse = {
			role: 'ai',
			content: responseStream
				.replaceAll('\\n', '')
				.toString()
				.trim()
				.substring(1, responseStream.length - 3)
		};
		conversation.pop();
		conversation = [...conversation, aiResponse];
	}

	async function sendMessage() {
		const inputBox = document.getElementById('inputBox') as HTMLInputElement;
		if (inputBox.value.length > 0) {
			let userInput = {
				role: 'user',
				content: inputBox.value
			};
			inputBox.value = '';
			let loading = {
				role: 'system'
			};
			conversation = [...conversation, userInput, loading];

			await aiChat(conversation[conversation.length - 2]);
		}
	}

	// using moment get the current human readable date
	let formattedDate = moment().format('MMMM DD, YYYY');
</script>

<div class="pb-16 pt-16">
	<!-- <SectionTitles title={'Quick AI Chat'} /> -->
	<div class="flex items-center gap-x-2 pl-[31px]">
		<Sparkle size={18} />
		<p class="pb-1">Gemini</p>
	</div>
	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900"></div>
	</div>

	<!-- Conversation -->
	<div>
		{#each conversation as message}
			<div>
				{#if message.role === 'user'}
					<div class="pl-5">
						<div class="w-fit cursor-pointer rounded-lg border px-3 py-1 hover:border-black">
							{message.content}
						</div>
					</div>
				{:else if message.role === 'system'}
					<div class="pl-10">
						<div class="border-l border-dashed border-zinc-900 py-3 pl-3">
							<div class="w-fit rounded-full border px-3 py-3">
								<BarLoader size="30" color="#000" unit="px" duration="1s" />
								<BarLoader size="30" color="#000" unit="px" duration="1s" />
							</div>
						</div>
					</div>
				{:else}
					<!-- <Sparkle class="h-4 w-4" /> -->
					<div class="pl-10">
						<div class="border-l border-dashed border-zinc-900 py-3 pl-3">
							<div class="w-fit cursor-pointer rounded-lg border px-3 py-1 hover:border-black">
								<!-- {message.content} -->
								<Markdown md={message.content} {plugins} />
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Input Box -->
	<div class="overflow-clip rounded border hover:rounded-xl hover:border-black">
		<div class="flex">
			<!-- Send message on enter -->
			<input
				id="inputBox"
				type="text"
				placeholder="Ask about me or anything else..."
				class="w-full px-4 py-2 outline-none"
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						sendMessage();
					}
				}}
			/>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex cursor-pointer items-center justify-center border-l px-6 hover:border-black hover:bg-black hover:text-white"
				onclick={() => {
					sendMessage();
				}}
			>
				Send
			</div>
		</div>
	</div>

	<div class="pl-10">
		<div class="h-7 border-l border-dashed border-zinc-900"></div>
	</div>
	<div class="flex items-center gap-x-2 pl-6 text-sm text-zinc-500">
		<p class="pb-1">{formattedDate}</p>
	</div>
</div>
