export async function load({ fetch }) {
	const res = await fetch(`/api/register?id=6956275b802d32de8c9ca206`);
	const data = await res.json();
	return data; 
}
