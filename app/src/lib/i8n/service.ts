import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

export function setupI18n() {
	register('en', () => import('./languages/english.json'));
	register('de', () => import('./languages/german.json'));

	init({
		fallbackLocale: 'en',
		initialLocale: getLocaleFromNavigator()?.split('-')[0]
	});
}
