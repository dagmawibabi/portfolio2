// import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
const aiSystemPrompt = '';

export async function POST({ request }) {
	const { message } = await request.json();
	console.log('message', message);
	// Setup
	const openAI = new OpenAI({
		apiKey: 'AIzaSyAkfJpF6ZdjEapZYuf6La2LBf_KNdYM5rA',
		baseURL: 'https://generativelanguage.googleapis.com/v1beta'
	});

	// Result
	const result = await openAI.chat.completions.create({
		model: 'gemini-1.5-flash',
		messages: [
			{ role: 'system', content: aiSystemPrompt },
			{
				role: 'user',
				content: message.content
			}
		]
	});
	console.log('result', result.choices[0].message.content);
	return Response.json(result.choices[0].message.content);
}
