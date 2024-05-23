// Query postcode API
//--------------------

export async function queryPostcode(postcode, abortSignal) {
	const response = await fetch(
		'https://api.getthedata.com/postcode/' + encodeURIComponent(postcode),
		{ signal: abortSignal }
	);

	return await response.json();
}

// Query police API
//------------------

// latLng: { latitude: 123, longitude: 123 }
export async function queryPolice(latLng, abortSignal) {
	const policeResponse = await fetch(
		`https://data.police.uk/api/crimes-street/all-crime?lat=${ latLng.latitude }&lng=${ latLng.longitude }`,
		{ signal: abortSignal }
	);

	const policeData = await policeResponse.json();

	return policeData;
}