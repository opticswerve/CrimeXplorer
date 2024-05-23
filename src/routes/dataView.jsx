import { adoptCSS } from '../helpers/CSS.js';

import { queryPostcode, queryPolice } from '../api/query.js';

import { useEffect, useState } from 'react';

import { useLoaderData } from 'react-router-dom';

function DataView() {
	const { postcodes } = useLoaderData();

	const [chosenCategory, setChosenCategory] = useState('');

	// Locations.
	// 'S1 1DJ': { latitude: 123, longitude: 456 }
	const [locations, setLocations] = useState(new Map());

	// Crime data for current locations
	const [crimeData, setCrimeData] = useState([]);

	// Location change
	//-----------------

	useEffect(() => {

		const abortController = new AbortController();

		// Process crime data for each location
		async function updateCrimeData() {
			try {
				const freshCrimeData = new Map();

				for (let [postcode, location] of locations) {

					const result = await queryPolice(
						location,
						abortController.signal
					);

					if (Array.isArray(result)) {
						freshCrimeData.set(postcode, result);
					}
				}

				setCrimeData(freshCrimeData);
			}

			catch (error) {
				if (error.name !== 'AbortError') {
					console.log(error);
				}
			}
		}

		updateCrimeData();

		return () => {
			abortController.abort();
		}
	}, [locations]);

	// Postcode change
	//-----------------

	useEffect(() => {

		const abortController = new AbortController();

		// Update location for each postcode
		async function updateLocations() {
			try {
				for (let postcode of postcodes) {

					// Coordinates already available.
					// Avoid hitting the API.
					if (locations.has(postcode)) {
						continue;
					}

					const result = await queryPostcode(
						postcode,
						abortController.signal
					);

					if (result.status === 'match') {
						setLocations(
							new Map(
								locations.set(postcode, {
									latitude: result.data.latitude,
									longitude: result.data.longitude
								})
							)
						);
					}

					else {
						console.log('Postcode not found');
					}
				}
			}

			catch (error) {
				if (error.name !== 'AbortError') {
					console.log(error);
				}
			}
		}

		updateLocations();

		return () => {
			abortController.abort();
		}
	}, [locations, postcodes]);

	// Crimes by category
	//--------------------

	// Transform crime data to more convenient format

	const crimesByCategory = new Map();

	for (let [postcode, crimes] of crimeData) {

		crimes.forEach(crime => {
			crime.postcode = postcode;

			if (crimesByCategory.has(crime.category)) {
				crimesByCategory.get(crime.category).push(crime);
			}

			else {
				crimesByCategory.set(
					crime.category,	
					[ crime ]
				);
			}
		});
	}

	// Crime nav and table
	//---------------------

	const categoryItems = [];

	let crimeTable;

	// Default to first category
	if (chosenCategory === '') {
		let category = crimesByCategory.keys().next().value;

		if (category !== undefined) {
			setChosenCategory(crimesByCategory.keys().next().value);
		}
	}

	for (let [category, crimes] of crimesByCategory) {
		const crimeRows = [];

		// Build menu
		categoryItems.push(
			<li key={ category }>
				<a href='#' onClick={ e => {
					e.preventDefault();
					setChosenCategory(category)
				}}>{ category.replaceAll('-', ' ') }</a>
			</li>
		);

		// Only render table for chosen category
		if (category !== chosenCategory) {
			continue;
		}

		crimes.forEach(crime => {
			let outcome = 'On going';

			if (crime.outcome_status !== null
			&& crime.outcome_status.category !== null) {
				outcome = crime.outcome_status.category;
			}

			crimeRows.push(
				<tr key={ crime.postcode + category + crime.id }>
					<td>{ crime.postcode }</td>
					<td>{ crime.month }</td>
					<td>{ crime.location.street.name }</td>
					<td>{ outcome }</td>
				</tr>
			);
		});

		crimeTable = <section key={ category }>
			<h2>{ category.replaceAll('-', ' ') }</h2>

			<table>
				<thead>
					<tr>
						<th>Postcode</th>
						<th>Date</th>
						<th>Street</th>
						<th>Outcome</th>
					</tr>
				</thead>

				<tbody>
					{ crimeRows }
				</tbody>
			</table>

		</section>;
	}

	return (
		<data-view>
			<h2>Crime data</h2>

			{ postcodes.size === 0 &&
				<p>Enter a postcode!</p>
			}

			{ postcodes.size > 0 && !crimeTable &&
				<p>Loading crime data&hellip;</p>
			}

			<menu>
				{ categoryItems }
			</menu>

			{ crimeTable }

		</data-view>
	);
}

const css = `
@scope (data-view) {
	:scope {
		display: block;
		width: 100%;
	}

	/* Crime category capitalisation */
	h2::first-letter {
		text-transform: capitalize;
	}

	menu {
		a {
			white-space: nowrap;
		}

		a::first-letter {
			text-transform: capitalize;
		}
	}
}`;

adoptCSS(css, 'data-view');

export default DataView;