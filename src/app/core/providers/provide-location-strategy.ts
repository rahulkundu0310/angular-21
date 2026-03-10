import type { Provider } from '@angular/core';
import { LocationStrategy, TrailingSlashPathLocationStrategy } from '@angular/common';

/**
 * Provides the location strategy configuration for environment setup defining providers for enforced trailing slash URLs.
 * Enables the URL writing layer to guarantee a trailing slash on every resolved path and maintain structural consistency.
 *
 * @returns A provider object containing the location strategy setup for uniform trailing slash path resolution behaviors.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function provideLocationStrategy(): Provider {
	return {
		provide: LocationStrategy,
		useClass: TrailingSlashPathLocationStrategy
	};
}
