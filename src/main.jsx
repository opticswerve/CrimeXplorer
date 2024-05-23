import React from 'react';
import ReactDOM from 'react-dom/client';

import {
	createBrowserRouter,
	RouterProvider

} from 'react-router-dom';

import Root from './routes/root';

import { postcodeLoader } from './routes/postcodeLoader.js';

import ErrorView from './errorView';
import DataView from './routes/dataView';
import MapView from './routes/mapView';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		errorElement: <ErrorView />,
		loader: postcodeLoader,

		children: [
			{
				errorElement: <ErrorView />,

				children: [
					{
						path: 'data/',
						element: <DataView />,
						loader: postcodeLoader
					},

					{
						path: 'map/',
						element: <MapView />,
					}
				]
			}
		]
	}
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={ router } />
	</React.StrictMode>
);