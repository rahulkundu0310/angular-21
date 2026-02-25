import type { Provider } from '@angular/core';
import { CachedRouteStrategy } from '../strategies';
import { RouteReuseStrategy } from '@angular/router';

/**
 * Provides cached route reuse strategy configuration for environment setup defining providers for route caching behavior.
 * Enables the routing system to preserve specific component state and DOM elements throughout extended navigation cycles.
 *
 * @returns A provider object containing the abstract route reuse strategy configuration for the specified cache behavior.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function provideCachedRouteStrategy(): Provider {
	return {
		provide: RouteReuseStrategy,
		useClass: CachedRouteStrategy
	};
}
