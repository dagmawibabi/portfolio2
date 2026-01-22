export async function load({ fetch, params }) {
	const res = await fetch(`/api/stats`);
	const data = await res.json();
	return data;
}
