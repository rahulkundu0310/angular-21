import { iconConfig } from '@configs';
import type { Provider } from '@angular/core';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';

/**
 * Provides the Lucide icons configuration for environment setup defining providers for integrated visual icon management.
 * Enables the integration of predefined glyph resources through multi binding ensures uniform static asset accessibility.
 *
 * @returns A provider object containing the named symbol definitions for centralized vector graphics interface rendering.
 *
 * @since 16 February 2026
 * @author Rahul Kundu
 */
export function provideLucideIcons(): Provider {
	return {
		multi: true,
		provide: LUCIDE_ICONS,
		useValue: new LucideIconProvider(iconConfig)
	};
}
