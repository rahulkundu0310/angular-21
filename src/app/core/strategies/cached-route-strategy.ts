import { Injectable } from '@angular/core';
import type { RouteReuseStrategy } from '@angular/router';
import type { DetachedRouteHandle, ActivatedRouteSnapshot, Route } from '@angular/router';

@Injectable()
export class CachedRouteStrategy implements RouteReuseStrategy {
	// Public and private class member variables reflecting state and behavior
	private readonly routeHandlers = new Map<Route, DetachedRouteHandle>();

	/**
	 * Determines whether the route should be detached for caching by inspecting configuration option for current reuse state.
	 * Processes snapshot metadata to identify boolean value controlling route detach strategy for optimizing storage context.
	 *
	 * @param route - The activated route snapshot object containing the defined route configuration and valid cache property.
	 * @returns A boolean indicating whether the route should be detached with cache property for preserved storage retention.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public shouldDetach(route: ActivatedRouteSnapshot): boolean {
		return route.routeConfig?.data?.['cache'] ?? false;
	}

	/**
	 * Stores detached route handles in cache using identifier and configuration property for efficient route state retention.
	 * Processes the provided route handle to either persist the component state or clear the entry from the internal storage.
	 *
	 * @param route - The activated route snapshot object containing the defined route configuration and valid cache property.
	 * @param handle - The detached route handle to be retained in cache or null to remove handle from caching inside storage.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
		// Checks if configuration is missing from route snapshot and return early
		if (!route.routeConfig) return;

		// Checks if handle is missing and removes entry else updates cache record
		if (!handle) this.routeHandlers.delete(route.routeConfig);
		else this.routeHandlers.set(route.routeConfig, handle);
	}

	/**
	 * Determines whether cached route handle should be attached by verifying stored entry availability for state restoration.
	 * Processes the cache identifier presence and handler availability in storage to validate route reuse for mapped context.
	 *
	 * @param route - The activated route snapshot object containing the defined route configuration and valid cache property.
	 * @returns A boolean indicating whether the route should be attached based on verified cache presence to restore context.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public shouldAttach(route: ActivatedRouteSnapshot): boolean {
		return !!route.routeConfig && this.routeHandlers.has(route.routeConfig);
	}

	/**
	 * Retrieves saved route handle from storage using unique identifier deriving detached route handle for route restoration.
	 * Processes unique identifier from route configuration and retrieves instance to optimize navigation and storage context.
	 *
	 * @param route - The activated route snapshot object containing the defined route configuration and valid cache property.
	 * @returns A detached route handle from cache or null if no stored entry found for caching operation and state retention.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
		if (!route.routeConfig) return null;
		return this.routeHandlers.get(route.routeConfig) || null;
	}

	/**
	 * Determines whether to utilize existing route instance by comparing route configurations for correct navigation context.
	 * Processes target and source route settings using reference equality to streamline navigation and preserve active state.
	 *
	 * @param target - The activated route snapshot object containing route configuration and parameters for state comparison.
	 * @param source - The activated route snapshot object containing route configuration and parameters for state comparison.
	 * @returns A boolean indicating whether the route should be reused with matching configuration for consistent navigation.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public shouldReuseRoute(
		target: ActivatedRouteSnapshot,
		source: ActivatedRouteSnapshot
	): boolean {
		return target.routeConfig === source.routeConfig;
	}

	/**
	 * Retrieves detached route handles currently retained in the cache returning an array of instances for memory management.
	 * Processes map of route handlers to generate sequence of preserved contexts for validating current dependency integrity.
	 *
	 * @returns An array of detached route handles containing preserved route context for halting active injector destruction.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public retrieveStoredRouteHandles(): DetachedRouteHandle[] {
		return Array.from(this.routeHandlers.values());
	}

	/**
	 * Determines whether injector should be destroyed by checking if route configuration is missing from the strategy source.
	 * Processes route identifier presence to confirm injector destruction preventing memory issues by releasing dependencies.
	 *
	 * @param route - The route configuration object utilized to identify the particular route entry within the cache strategy.
	 * @returns A boolean indicating whether injector should be destroyed ensuring resources are eliminated for detached cache.
	 */
	public shouldDestroyInjector(route: Route): boolean {
		return !this.routeHandlers.has(route);
	}
}
