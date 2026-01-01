export async function load({ fetch, params }) {
	const { id } = params;
	const res = await fetch(`/api/register?id=${id}`);
	const data = await res.json();
	console.log(data);
	return data;
}
