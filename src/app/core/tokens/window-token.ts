import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { InjectionToken, inject, PLATFORM_ID } from '@angular/core';

/**
 * Defines an explicitly typed injection token providing safe access to the global browser window object across execution.
 * Processes runtime environment checking to ensure the native interface resolution preventing backend rendering failures.
 *
 * @returns A client entity instance resolved when handling operations within supported browser boundaries otherwise null.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const WINDOW = new InjectionToken<Window | null>('Browser Window', {
	providedIn: 'root',
	factory: (): Window | null => {
		// Dependency injections providing direct access to services and injectors
		const document = inject(DOCUMENT);
		const platformId = inject(PLATFORM_ID);

		// Retreives the current runtime environment identifying browser execution
		const isBrowserPlatform = isPlatformBrowser(platformId);

		// Returns the current browser document default view object otherwise null
		return isBrowserPlatform ? document.defaultView : null;
	}
});
