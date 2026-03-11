import { inject } from '@angular/core';
import { Logger } from '@core/services';
import { menuItemsConfig } from '@configs';
import type { ResolveFn } from '@angular/router';
import { PlatformStore } from './platform-store';
import { catchError, of, switchMap, timer } from 'rxjs';

/**
 * Resolves essential routing prerequisites by executing asynchronous requests before finalizing target transition events.
 * Processes required external sources and provided mappings to establish primary requirements catching unexpected errors.
 *
 * @param route - The evaluated route snapshot containing assigned parameters and relevant properties for the destination.
 * @param state - The router state snapshot containing crucial historical datasets to guide necessary traversal workflows.
 * @returns An observable stream which emits resolved configurations indicating readiness for the desired navigation path.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const platformResolver: ResolveFn<void> = (route, state) => {
	// Dependency injections providing direct access to services and injectors
	const logger = inject(Logger);
	const platformStore = inject(PlatformStore);

	// Returns a reactive stream executing route resolution and error handling
	return timer(1000).pipe(
		switchMap(() => {
			platformStore.setMenuItems(menuItemsConfig);
			return of(void 0);
		}),
		catchError((error) => {
			logger.error('Unexpected error during route resolution', error);
			return of(void 0);
		})
	);
};
