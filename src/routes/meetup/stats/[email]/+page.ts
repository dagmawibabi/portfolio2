export async function load({ fetch, params }) {
	const { email } = params;
	const res = await fetch(`/api/accept?email=${email}`);
	const data = await res.json();
	return data;
}
