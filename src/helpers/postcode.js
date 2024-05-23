// Verbose as <input> pattern is always case sensitive
export const postcodeRegex = `^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$`;

// Extract postcodes
//-------------------

// 'query' can be a single postcode or
// a comma-separated string of postcodes

export function extractPostcodes(query) {
	// Query undefined? Return empty postcode Set.
	if (query === null || query === undefined) {
		return new Set();
	}

	// Split postcode query by ','
	const postcodes = query.split(',');

	// Valid postcodes. Set removes duplicates.
	const validPostcodes = new Set();

	for (let postcode of postcodes) {
		// Consistent uppercase
		postcode = postcode.trim().toUpperCase();

		// Record valid postcodes
		if (isValidPostcode(postcode)) {
			validPostcodes.add(postcode);
		}
	}

	return validPostcodes;
}

// Postcode validity
//-------------------

// Return true for a valid postcode, false otherwise.

export function isValidPostcode(postcode) {
	return postcode.match(postcodeRegex); 
}