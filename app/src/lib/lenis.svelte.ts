import Lenis from 'lenis';

let instance = $state<Lenis | undefined>();

export const lenis = {
	get instance() {
		return instance;
	},

	init() {
		instance = new Lenis({ autoRaf: true });

		return () => {
			instance?.destroy();
			instance = undefined;
		};
	}
};
