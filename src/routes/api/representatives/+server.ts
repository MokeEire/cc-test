import { json } from '@sveltejs/kit';
import { GOOGLE_CIVIC_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const address = url.searchParams.get('address');

	if (!address || address.trim().length < 5) {
		return json({ error: 'Please provide a valid address.' }, { status: 400 });
	}

	if (!GOOGLE_CIVIC_API_KEY) {
		return json({ error: 'API key not configured. Please set GOOGLE_CIVIC_API_KEY in your .env file.' }, { status: 500 });
	}

	const apiUrl = new URL('https://www.googleapis.com/civicinfo/v2/representatives');
	apiUrl.searchParams.set('address', address.trim());
	apiUrl.searchParams.set('key', GOOGLE_CIVIC_API_KEY);

	try {
		const response = await fetch(apiUrl.toString());
		const data = await response.json();

		if (!response.ok) {
			const message = data?.error?.message ?? 'Failed to fetch representatives.';
			return json({ error: message }, { status: response.status });
		}

		return json(data);
	} catch {
		return json({ error: 'Failed to reach the Google Civic Information API. Check your network connection.' }, { status: 503 });
	}
};
