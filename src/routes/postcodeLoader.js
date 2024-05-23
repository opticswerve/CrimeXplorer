import { extractPostcodes } from '../helpers/postcode.js';

// Postcode loader
//-----------------

// Extract postcodes and search query from URL

export function postcodeLoader({ request }) {
	const url = new URL(request.url);

	const query = url.searchParams.get('q');

	const postcodes = extractPostcodes(query);

	return { postcodes, query };
}