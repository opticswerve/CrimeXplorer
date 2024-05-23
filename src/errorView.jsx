import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);

	return (
		<div id='error-page'>
			<h2>Oopsy daisy!</h2>

			<p>Sorry, an unexpected error has occurred.</p>
			<pre><code>{ error.statusText || error.message }</code></pre>
		</div>
	);
}