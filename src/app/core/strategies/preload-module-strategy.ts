import type { Observable } from 'rxjs';
import { mergeMap, of, timer } from 'rxjs';
import { Injectable } from '@angular/core';
import { applicationConfig } from '@configs';
import type { PreloadingStrategy } from '@angular/router';
import type { TObservableFactory, IRoute } from '@shared/types';

@Injectable()
export class PreloadModuleStrategy implements PreloadingStrategy {
	/**
	 * Preloads route modules based on configuration and network conditions to manage strategies for controlled module loading.
	 * Processes preload flag and delay settings with network validation to control module loading time within module preloads.
	 *
	 * @param route - The route configuration object containing dynamic preload settings and critical module execution context.
	 * @param loader - The factory function which returns observable to obtain route modules for caching during preload cycles.
	 * @returns An observable containing the loaded module object or null contingent on the current network connectivity state.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public preload(route: IRoute, loader: TObservableFactory): Observable<unknown> {
		// Retrieves preload configuration data from the provided route definition
		const routeData = route.data;

		// Checks if preload state is missing or false returning a null observable
		if (!routeData?.preload) return of(null);

		// Checks if current network connection enables preloading based on status
		if (!this.canPreloadOnNetwork()) return of(null);

		// Checks if delay is disabled then returns the provided loader observable
		if (!routeData.shouldDelay) return loader();

		// Determines the delay duration from route data or defaults to app config
		const loadDelay = routeData.preloadDelay ?? applicationConfig.preloadDelay;

		// Returns observable which waits for the delay before loading the modules
		return timer(loadDelay).pipe(mergeMap(() => loader()));
	}

	/**
	 * Determines whether the active network connection supports preloading by evaluating connection type and data saver state.
	 * Processes current network availability and restricts any preloading on detected slow connections for better performance.
	 *
	 * @returns A boolean indicating whether the current connection permits preloading operations for optimal caching strategy.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private canPreloadOnNetwork(): boolean {
		// Retrieves the network connection instance from the global navigator API
		const connection = navigator.connection;

		// Checks if the connection is null or the user enabled the save data mode
		if (!connection || connection.saveData) return false;

		// Retrieves the current effective network type string from connection API
		const networkType = connection.effectiveType;

		// Initializes a variable containing list of slow network connection types
		const slowConnections: EffectiveType[] = ['slow-2g', '2g'];

		// Returns true if network type is valid and is not inside slow connection
		return !!networkType && !slowConnections.includes(networkType);
	}
}
