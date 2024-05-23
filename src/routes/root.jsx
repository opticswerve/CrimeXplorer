import {
	NavLink,
	Outlet,
	useLoaderData,
	useLocation

} from 'react-router-dom';

import SearchBar from '../components/SearchBar.jsx';
import SearchHistory from '../components/SearchHistory.jsx';

// Root component
//----------------

export default function Root() {
	const { postcodes, query } = useLoaderData();

	const { search } = useLocation();

	return (
		<>
			<nav>
				<menu>
					<li>
						<NavLink to={ `data/${ search }` }>Crime data</NavLink>
					</li>

					<li>
						<NavLink to={ `map/${ search }` }>Map</NavLink>
					</li>
				</menu>
			</nav>

			<SearchBar query={ query } />

			<SearchHistory postcodes={ postcodes } />

			<main>
				<Outlet />
			</main>
		</>
	);
}