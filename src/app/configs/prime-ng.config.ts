import Aura from '@primeuix/themes/aura';
import type { IPrimeNGConfig } from '@shared/types';
import { resolveOverlayOptions } from '@shared/utilities';

/**
 * Defines PrimeNG configuration by setting component defaults and theming values for the scalable interface architecture.
 * Processes event handling and layer contexts to ensure consistent UI behavior and stacking order within the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const primeNgConfig: IPrimeNGConfig = {
	ripple: false,
	unstyled: true,
	overlayOptions: resolveOverlayOptions(),
	zIndex: {
		menu: 1000,
		modal: 1100,
		tooltip: 1100,
		overlay: 1000
	},
	theme: {
		preset: Aura,
		options: {
			prefix: 'p',
			darkModeSelector: ''
		}
	}
} as const;
