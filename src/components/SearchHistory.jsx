import { adoptCSS } from '../helpers/CSS.js';

import { extractPostcodes } from '../helpers/postcode.js';

import { useEffect, useState } from 'react';

import { Link, useLocation } from 'react-router-dom';

function SearchHistory({ postcodes }) {

	const { pathname, search } = useLocation();

	// Load history
	//--------------

	// Get postcode history from storage, if available.
	const [historicPostcodes, setHistoricPostcodes] = useState(() => {
		let storedHistory = localStorage.getItem('postcodeHistory');

		if (storedHistory === null) {
			return new Set();
		}

		try {
			return new Set(JSON.parse(storedHistory));
		}

		catch (e) {
			return new Set();
		}
	});

	// Postcode change
	//-----------------

	useEffect(() => {
		// Update postcode search history
		const updatedHistory = new Set(historicPostcodes);

		postcodes.forEach(
			postcode => updatedHistory.add(postcode)
		);

		setHistoricPostcodes(updatedHistory);

		// Save to local storage
		localStorage.setItem(
			'postcodeHistory',
			JSON.stringify([...updatedHistory])
		);

	}, [postcodes]);

	// Remove postcode from history
	//------------------------------

	function removePostcode(postcode) {
		// Remove postcode from historic postcodes
		const updatedHistory = new Set(historicPostcodes);

		updatedHistory.delete(postcode);

		setHistoricPostcodes(updatedHistory);

		// Save updated history to local storage
		localStorage.setItem(
			'postcodeHistory',
			JSON.stringify([...updatedHistory])
		);

		// Ensure postcode is removed from URL query
		let params = new URLSearchParams(search);
		let query = params.get('q');

		const postcodes = extractPostcodes(query);
		postcodes.delete(postcode);
		params.set('q', Array.from(postcodes));

		// Apply search param changes
		window.history.replaceState({}, '',
			`${ pathname }?${ params }`
		);
	}

	// Postcode list items
	//---------------------

	const postcodeListItems = [];

	historicPostcodes.forEach(postcode => {
		postcodeListItems.push(
			<li key={ postcode }>
				<Link to={ `${ pathname }?q=` + encodeURIComponent(postcode) }>
					{ postcode }
				</Link>

				<button onClick={ () => removePostcode(postcode) }>
					Remove
				</button>
			</li>
		);
	});

	return (
		<search-history>
			<h2>Search history</h2>

			<ul>{ postcodeListItems }</ul>

		</search-history>
	);
}

const css = `
@scope (search-history) {
	:scope {
		container: search-history / inline-size;
		display: block;
		max-inline-size: 360px;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		align-items: center;
		display: flex;
		justify-content: space-between;
		padding: 0.5em 1em;

		&:nth-child(odd) {
			background: light-dark(#00000008, #fff1);
		}
	}

	a {
		color: currentColor;
		min-inline-size: fit-content;
	}
}`;

adoptCSS(css, 'search-history');

export default SearchHistory;