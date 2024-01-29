import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './bootstrap';
import '../css/app.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { RouteContext } from '@/Hooks/useRoute';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { MantineProvider, createTheme, Input } from '@mantine/core';
import inputClasses from '../css/Input.module.css';
import { AuthProvider } from './Contexts/AuthContext';

const myTheme = createTheme({
	primaryColor: 'blue',
	defaultRadius: 'md',
	components: {
		Input: Input.extend({
			classNames: {
				input: inputClasses.input,
			},
		}),
	},
});

const appName =
	window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
	title: title => `${title} - ${appName}`,
	progress: {
		color: '#4B5563',
	},
	resolve: name =>
		resolvePageComponent(
			`./Pages/${name}.tsx`,
			import.meta.glob('./Pages/**/*.tsx'),
		),
	setup({ el, App, props }) {
		// const { auth } = props.initialPage.props;
		// const root = createRoot(el);
		const { auth } = props.initialPage.props;
		const root = createRoot(el);
		console.log('Auth props en app.tsx', auth);
		return root.render(
			<MantineProvider defaultColorScheme="dark" theme={myTheme}>
				<AuthProvider auth={auth}>
					<RouteContext.Provider value={(window as any).route}>
						<App {...props} />
					</RouteContext.Provider>
				</AuthProvider>
				,
			</MantineProvider>,
		);
	},
});
