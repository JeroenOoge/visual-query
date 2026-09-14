// Client-side helpers that call this app's own /api/* routes (which proxy Scopus, keeping the API key server-side).

export async function searchScopus(query, count = 1, start = 0) {
	const params = new URLSearchParams({ q: query, count: String(count), start: String(start) });
	const res = await fetch(`/api/search?${params}`);
	return res.json();
}

export async function getAbstract(doi) {
	const params = new URLSearchParams({ doi });
	const res = await fetch(`/api/abstract?${params}`);
	return res.json();
}
