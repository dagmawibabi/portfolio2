export async function load({ fetch, params }) {
	const { number } = params;
	const res = await fetch(`/api/getqr?number=${number}`);
	const data = await res.json();
	// console.log(data);
	return data;
}
