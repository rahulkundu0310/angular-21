import { filter } from 'rxjs';
import { signal } from '@angular/core';
import type { Signal } from '@angular/core';
import type { OperatorFunction } from 'rxjs';
import { isActive, PRIMARY_OUTLET } from '@angular/router';
import { isNil, values, isEmpty, isArray, isString, isObject } from 'lodash-es';
import type { IMatchRouteOptions, IRouteData, TConstructor, TKeys } from '../types';
import type {
	Event,
	Router,
	UrlTree,
	RouterStateSnapshot,
	IsActiveMatchOptions,
	ActivatedRouteSnapshot
} from '@angular/router';

/**
 * Identifies incoming router events matching the provided constructors ensuring precise type narrowing during processing.
 * Processes the stream by filtering events matching the defined instances allowing secure access to the class attributes.
 *
 * @param target - The array of constructors applied to validate the input object against the defined signature condition.
 * @returns An operator function which strictly restricts the source router event sequence into an expected target output.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolveEvent<TEvents extends TConstructor<Event>[]>(
	target: [...TEvents]
): OperatorFunction<Event, InstanceType<TEvents[number]>>;

/**
 * Identifies incoming router events matching the provided constructor ensuring accurate type narrowing during processing.
 * Processes the stream by filtering events matching the specific instance allowing secure access to the class attributes.
 *
 * @param target - The constructor of the event class applied to validate the source object against the defined signature.
 * @returns An operator function which strictly restricts the source router event sequence into an expected target output.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolveEvent<TEvent extends Event>(
	target: TConstructor<TEvent>
): OperatorFunction<Event, TEvent>;

/**
 * Identifies incoming router events matching the provided constructors ensuring precise type narrowing during validation.
 * Processes the supplied source by evaluating instance match against the target array enabling precise input correctness.
 *
 * @param target - The array of constructors applied to validate the input object against the defined signature condition.
 * @param source - The router event instance or nullable value received from navigation context requiring type inspection.
 * @returns A validated event object satisfying the specific class criteria otherwise null when the value is incompatible.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolveEvent<TEvents extends TConstructor<Event>[]>(
	target: [...TEvents],
	source: Event | null | undefined
): InstanceType<TEvents[number]> | null;

/**
 * Identifies incoming router events matching the provided constructor ensuring accurate type narrowing during validation.
 * Processes the supplied source by evaluating instance match against the target class enabling precise input correctness.
 *
 * @param target - The constructor of the event class applied to validate the source object against the defined signature.
 * @param source - The router event instance or nullable value received from navigation context requiring type inspection.
 * @returns A validated event object satisfying the specific class criteria otherwise null when the value is incompatible.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolveEvent<TEvent extends Event>(
	target: TConstructor<TEvent>,
	source: Event | null | undefined
): TEvent | null;

/**
 * Identifies incoming router events matching the provided constructor ensuring accurate type narrowing during evaluation.
 * Processes optional source and verifies instance state or creates filtering operator based on the argument availability.
 *
 * @param target - The constructor or array of classes applied to validate the input object against the defined signature.
 * @param source - The router event instance or nullable value received from navigation context requiring type inspection.
 * @returns An operator function for stream filtering or validated event object otherwise null when the input is provided.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolveEvent<TEvent extends Event>(
	target: TConstructor<TEvent> | TConstructor<Event>[],
	source?: Event | null | undefined
): OperatorFunction<Event, TEvent> | (TEvent | null) {
	// Retrieves constructors ensuring each class becomes unified for checking
	const constructors = isArray(target) ? target : [target];

	// Builds predicate verifying every event matches at least one constructor
	const predicate = (event: Event): event is TEvent =>
		constructors.some((shape) => event instanceof shape);

	// Returns filter for missing source else offers narrowed event when match
	if (isNil(source)) return filter(predicate);
	return predicate(source) ? (source as TEvent) : null;
}

/**
 * Identifies the primary child route by evaluating the current snapshot hierarchy to isolate the specific matched outlet.
 * Processes the children enumeration by traversing matching outlet identifiers ensuring the correct active route segment.
 *
 * @param route - The activated route instance containing relevant state information and structure for matched extraction.
 * @returns A route snapshot corresponding to the primary outlet otherwise null when no matching child route is available.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolvePrimaryRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot | null {
	return route.children.find(({ outlet }) => outlet === PRIMARY_OUTLET) ?? null;
}

/**
 * Recognizes the deepest activated route by traversing the sequence to resolve nested child segment within the structure.
 * Processes the target hierarchy iteratively identifying the primary outlet to extract the closing active child snapshot.
 *
 * @param route - The activated route instance containing relevant state information and structure for matched extraction.
 * @returns A deepest route snapshot extracted from the primary outlet hierarchy representing the targeted route metadata.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolveActiveSnapshot(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
	// Initializes a variable to manage current child count for deep traversal
	let childIndex = 0;

	// Initializes a variable to manage route traversal from the root snapshot
	let routeSnapshot: ActivatedRouteSnapshot = route;

	// Iterates through route tree to resolve the deepest child route snapshot
	while (childIndex < routeSnapshot.children.length) {
		// Retrieves current child object from available list using tracking index
		const childSnapshot = routeSnapshot.children[childIndex];

		// Checks if the outlet matches primary target allowing deep route finding
		if (childSnapshot.outlet === PRIMARY_OUTLET) {
			// Updates the route snapshot value using target object for next iteration
			routeSnapshot = childSnapshot;

			// Updates child count restoring value to initial state for target context
			childIndex = 0;

			// Continues loop execution skipping remaining checks to reset the process
			continue;
		}

		// Updates child count increasing value for processing next sibling object
		childIndex++;
	}

	// Returns resolved route snapshot object represents deepest route segment
	return routeSnapshot;
}

/**
 * Determines configuration source by analyzing active hierarchy to extract parent metadata from the resolved child route.
 * Processes navigation context locating the deepest active child and inspects immediate ancestor for associated contents.
 *
 * @param route - The activated route snapshot containing hierarchical state parsed to locate parent metadata definitions.
 * @returns A route data object retrieved from the parent snapshot otherwise null when associated record is not available.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolveSnapshotData(route: ActivatedRouteSnapshot): IRouteData | null;

/**
 * Determines configuration source by analyzing active hierarchy to extract parent metadata from the resolved child route.
 * Processes navigation context locating the deepest active child and inspects immediate ancestor for specific attributes.
 *
 * @param route - The activated route snapshot containing hierarchical state parsed to locate parent metadata definitions.
 * @param property - The specific field identifier required to extract configuration value using the parent route context.
 * @returns A typed property value retrieved from the parent snapshot otherwise null when specific field is not available.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolveSnapshotData<TProperty extends TKeys<IRouteData>>(
	route: ActivatedRouteSnapshot,
	property: TProperty
): Required<IRouteData>[TProperty] | null;

/**
 * Determines configuration source by analyzing active hierarchy to extract parent metadata from the resolved child route.
 * Processes navigation context locating the deepest active child and inspects immediate ancestor for content or property.
 *
 * @param route - The activated route snapshot containing hierarchical state parsed to locate parent metadata definitions.
 * @param property - The specific field identifier required to extract configuration value using the parent route context.
 * @returns A route data object or property value retrieved from snapshot or null when associated record is not available.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolveSnapshotData<TProperty extends TKeys<IRouteData>>(
	route: ActivatedRouteSnapshot,
	property?: TProperty
): IRouteData | IRouteData[TProperty] | null {
	// Retrieves nested child route snapshot using the active root tree source
	const resolvedSnapshot = resolveActiveSnapshot(route.root);

	// Retreives parent route entry from resolved snapshot for property lookup
	const routeData = resolvedSnapshot?.parent?.data as IRouteData;

	// Returns property value when provided and parent route data is available
	return !isNil(property) && !isEmpty(routeData) ? routeData[property] : null;
}

/**
 * Determines precise path segments using provided router state by excluding dynamic parameters from the nested hierarchy.
 * Processes route snapshot by traversing the resolved tree to filter dynamic identifiers producing a static path entries.
 *
 * @param state - The router state snapshot preserving active tree structure leveraged for static path segment extraction.
 * @returns An array of string entries containing normalized static path segments derived from the matched route snapshot.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolvedPathSegments(state: RouterStateSnapshot): string[] {
	// Initializes a variable to store aggregated resolved static path entries
	const pathSegments: string[] = [];

	// Initializes a variable to manage route traversal from the root snapshot
	let routeSnapshot: ActivatedRouteSnapshot | null = state.root;

	// Iterates through route hierarchy to identify valid static path segments
	while (routeSnapshot) {
		// Retrieves parameter values required to identify captured route fragment
		const params = values(routeSnapshot.params);

		// Iterates through individual route segments for static source validation
		for (const segment of routeSnapshot.url) {
			// Retrieves boolean status showing whether matched segment is a parameter
			const isParameter = params.includes(segment.path);

			// Checks if parameter type is false to include static fragment into array
			if (!isParameter) pathSegments.push(segment.path);
		}

		// Updates traversal reference using nested deep child route for iteration
		routeSnapshot = resolvePrimaryRoute(routeSnapshot);
	}

	// Returns a collection of static path strings extracted from active state
	return pathSegments;
}

/**
 * Normalizes unformatted path segments to facilitate a standardized and consistent structure for accurate route matching.
 * Processes the incoming route sequence by stripping query parameters and filtering empty fragments for valid navigation.
 *
 * @param path - The provided string representing a location to be transformed into distinct segments for strict matching.
 * @returns An array of strings containing valid segments extracted from input or an empty list when the value is missing.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function normalizePathSegments(path: string | undefined): string[] {
	// Checks if the input path string is provided else returns an empty array
	if (!path) return [];

	// Retrieves the base path string by separating connected query parameters
	const [pathWithoutQuery] = path.split('?');

	// Updates the variable to store the path string aligned for normalization
	let normalizedPath: string = pathWithoutQuery;

	// Retrieves a boolean status indicating whether segment starts with slash
	const hasLeadingSlash = normalizedPath.startsWith('/');

	// Checks if path starts with slash and removes it to ensure clean segment
	if (hasLeadingSlash) normalizedPath = normalizedPath.slice(1);

	// Returns an array of checked route segments by filtering empty fragments
	return normalizedPath.split('/').filter((segment) => !!segment);
}

/**
 * Determines whether the specified path corresponds to the currently active route utilizing configurable matching schema.
 * Processes target route and handling options validating against router state producing comprehensive validation outcome.
 *
 * @param router - The router service instance providing navigation context and configuration for current path validation.
 * @param path - The route path string to check against active router state or null when no path is provided for analysis.
 * @param options - The matching strategy string defining strictness of the path comparison during route state evaluation.
 * @returns A boolean indicating whether the specified path matches the currently active route based on provided criteria.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function matchesActivePath(
	router: Router,
	path: string | UrlTree | undefined,
	options?: IMatchRouteOptions['paths']
): boolean;

/**
 * Determines whether the specified path corresponds to the currently active route utilizing configurable matching schema.
 * Processes target route and handling options validating against router state producing comprehensive validation outcome.
 *
 * @param router - The router service instance providing navigation context and configuration for current path validation.
 * @param path - The route path string to check against active router state or null when no path is provided for analysis.
 * @param options - The partial match options object containing path fragment matrix and query params handling evaluation.
 * @returns A boolean or signal indicating whether the specified path matches the active route based on provided criteria.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function matchesActivePath(
	router: Router,
	path: string | UrlTree | undefined,
	options?: Partial<IMatchRouteOptions>
): boolean | Signal<boolean>;

/**
 * Determines whether the specified path corresponds to the currently active route utilizing configurable matching schema.
 * Processes target route and handling options validating against router state producing comprehensive validation outcome.
 *
 * @param router - The router service instance providing navigation context and configuration for current path validation.
 * @param path - The route path string to check against active router state or null when no path is provided for analysis.
 * @param options - The matching strategy string or options object defining strictness and mechanism for route evaluation.
 * @returns A boolean or signal indicating whether the specified path matches the active route based on provided criteria.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function matchesActivePath(
	router: Router,
	path: string | UrlTree | undefined,
	options?: IMatchRouteOptions['paths'] | Partial<IMatchRouteOptions>
): boolean | Signal<boolean> {
	// Retrieves options object from input or assigns an empty object fallback
	const partialOptions = isObject(options) ? options : {};

	// Determines reactive mode status from options defaulting to static state
	const reactiveMode = partialOptions?.reactive ?? false;

	// Checks if supplied path argument is missing returning false immediately
	if (isNil(path)) return reactiveMode ? signal(false) : false;

	// Retrieves path match mode from input or resolves it from options object
	const paths = isString(options) ? options : partialOptions?.paths;

	// Defines active match options configuration using defaults where missing
	const matchOptions: IsActiveMatchOptions = {
		paths: paths ?? 'exact',
		fragment: partialOptions?.fragment ?? 'ignored',
		matrixParams: partialOptions?.matrixParams ?? 'exact',
		queryParams: partialOptions?.queryParams ?? 'ignored'
	};

	// Retrieves route validation signal determining active state from context
	const matchedRoute = isActive(path, router, matchOptions);

	// Returns boolean status or signal indicating matching active route state
	return reactiveMode ? matchedRoute : matchedRoute();
}
