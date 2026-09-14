import { json } from '@sveltejs/kit';
import { SCOPUS_API_KEY } from '$env/static/private';

export async function GET({ url }) {
	const query = url.searchParams.get('q') ?? '';
	const count = url.searchParams.get('count') ?? '1';
	const start = url.searchParams.get('start') ?? '0';

	const apiUrl =
		'https://api.elsevier.com/content/search/scopus?httpAccept=application/json' +
		`&query=${encodeURIComponent(query)}` +
		`&apiKey=${SCOPUS_API_KEY}` +
		`&count=${encodeURIComponent(count)}` +
		`&start=${encodeURIComponent(start)}`;

	try {
		const response = await fetch(apiUrl);
		const body = await response.json();
		return json(body);
	} catch (error) {
		console.error('Error while fetching content from Scopus:', error);
		return json({});
	}
}
