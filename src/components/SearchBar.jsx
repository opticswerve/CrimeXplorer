import { adoptCSS } from '../helpers/CSS.js';

import { Form } from 'react-router-dom';

function SearchBar({ query }) {

	function onSubmit(e) {
		// Consistent uppercase postcodes
		let input = e.target.querySelector('input');
		input.value = input.value.toUpperCase();
	}

	return (
		<search-bar>
			<h2>Search</h2>

			<Form onSubmit={ e => onSubmit(e) }>
				<input
					autoCapitalize='none'
					autoComplete='off'
					defaultValue={ query }
					minLength='5'
					name='q'
					required
					spellCheck='false'
					title='UK postcode, for example: S1 1DJ'
					type='text'
				/>

				<button type='submit'>Search</button>
			</Form>

		</search-bar>
	)
}

const css = `
@scope (search-bar) {
	:scope {
		container: search-bar / inline-size;
		display: block;
	}

	form {
		display: flex;
		gap: 0.5em;
	}
}`;

adoptCSS(css, 'search-bar');

export default SearchBar;