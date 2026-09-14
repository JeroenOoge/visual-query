import { json, error } from '@sveltejs/kit';
import { SCOPUS_API_KEY } from '$env/static/private';

export async function GET({ url }) {
	const doi = url.searchParams.get('doi');
	if (!doi) {
		throw error(400, 'Missing doi parameter');
	}

	const apiUrl = `https://api.elsevier.com/content/abstract/doi/${encodeURIComponent(doi)}?httpAccept=application/json&apiKey=${SCOPUS_API_KEY}`;

	try {
		const response = await fetch(apiUrl);
		const body = await response.json();
		return json(body);
	} catch (err) {
		console.error('Error while fetching abstract from Scopus:', err);
		return json({});
	}
}
