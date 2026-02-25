import { Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { isEmpty, isFunction, isNil, isObject, isString } from 'lodash-es';
import { matchesActivePath, resolvePrimaryRoute } from '@shared/utilities';
import type {
	Params,
	RouterStateSnapshot,
	QueryParamsHandling,
	ActivatedRouteSnapshot
} from '@angular/router';
import type {
	IMenuItem,
	IRouteData,
	IBreadcrumb,
	IRouteBreadcrumb,
	IBreadcrumbContext
} from '@shared/types';

@Injectable({ providedIn: 'root' })
export class Navigation {
	// Dependency injections providing direct access to services and injectors
	private readonly router = inject(Router);

	/**
	 * Evaluates navigation menu items resolving active route status expansion requirements and child hierarchy tree contexts.
	 * Processes menu items iteration recursively mapping attributes to configure selected state and query persistence source.
	 *
	 * @param menuItems - The array of navigation menu items containing route definitions used for context resolution feature.
	 * @returns An array of menu items representing resolved active state and expansion scope with query persistence strategy.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public evaluateMenuItems(menuItems: IMenuItem[]): IMenuItem[] {
		// Iterates over menu items collection mapping each item to resolved state
		return menuItems.map((menuItem) => {
			// Initializes a variable to hold evaluated child menu items configuration
			let evaluatedMenuItems: IMenuItem[] = [];

			// Destructures the provided source object to extract necessary properties
			const { items, routerLink, queryParams, queryParamsHandling } = menuItem;

			// Checks if child items exist to recursively evaluate nested menu entries
			if (items) evaluatedMenuItems = this.evaluateMenuItems(items);

			// Checks if any descendant item is expanded or matches active route paths
			const hasActiveDescendant = evaluatedMenuItems.some((item) => {
				return item.expanded || matchesActivePath(this.router, item.routerLink);
			});

			// Resolves query parameters handling configuration for active route state
			const resolvedParamsHandling = this.resolveQueryPersistence(
				routerLink,
				queryParams,
				queryParamsHandling
			);

			// Retrieves boolean status checking if current route matches path pattern
			const isActivatedRoute = matchesActivePath(this.router, routerLink);

			// Checks if item has active state using descendant or route path matching
			const hasActiveState = hasActiveDescendant || isActivatedRoute;

			// Retrieves expansion state requirement based on children and active path
			const requiresExpansion = !isEmpty(evaluatedMenuItems) && hasActiveState;

			// Returns evaluated menu item structure with active navigation attributes
			return {
				...menuItem,
				items: evaluatedMenuItems,
				expanded: requiresExpansion,
				queryParams: queryParams ?? {},
				queryParamsHandling: resolvedParamsHandling
			};
		});
	}

	/**
	 * Evaluates breadcrumb chain from router state extracting configuration metadata to construct ordered navigation entries.
	 * Processes snapshot traversal accumulating path segments and mapping properties to produce standardized output sequence.
	 *
	 * @param state - The complete router state snapshot containing active route chain used for breadcrumb context generation.
	 * @returns An array of breadcrumb items representing resolved navigation hierarchy using aggregated paths and structures.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public resolveBreadcrumbs(state: RouterStateSnapshot): IBreadcrumb[] {
		// Initializes a variable to hold collected path segments during iteration
		let pathAccumulator: string[] = [];

		// Initializes a variable to hold evaluated breadcrumb list during process
		const breadcrumbs: IBreadcrumb[] = [];

		// Initializes a variable to manage route traversal from the root snapshot
		let routeSnapshot: ActivatedRouteSnapshot | null = state.root;

		// Iterates over route snapshot hierarchy resolving each child route level
		while (routeSnapshot) {
			// Retrieves url segments from current snapshot mapped to path string item
			const segments = routeSnapshot.url.map(({ path }) => path);

			// Combines current segments with accumulated history making complete path
			const compositeSegments = [...pathAccumulator, ...segments];

			// Normalizes calculated segments into absolute path string representation
			const normalizedSegment = '/' + compositeSegments.join('/');

			// Resolves breadcrumb metadata and path values from current route context
			const { breadcrumbMeta, breadcrumbPath } = this.resolveBreadcrumbContext(
				normalizedSegment,
				routeSnapshot
			);

			// Checks if breadcrumb metadata is provided and skip behavior is disabled
			if (!!breadcrumbMeta && !breadcrumbMeta.skip) {
				// Checks if breadcrumb path exists in collection avoiding duplicate items
				const hasExistingBreadcrumb = breadcrumbs.some(
					({ routerLink }) => routerLink === breadcrumbPath
				);

				// Checks if breadcrumb is unique and label property provided for addition
				if (!hasExistingBreadcrumb && !!breadcrumbMeta.label) {
					// Initializes a variable to hold processed query params handling strategy
					let resolvedParamsHandling: QueryParamsHandling = '';

					// Destructures the current route snapshot to extract necessary properties
					const { data: payload, params, queryParams = {} } = routeSnapshot;

					// Retrieves boolean status checking if current route matches path pattern
					const isActivatedRoute = matchesActivePath(this.router, normalizedSegment);

					// Destructures the provided source object to extract necessary properties
					const { label, icon, iconSize, disabled, context, home } = breadcrumbMeta;

					// Retrieves resolved breadcrumb label by invoking function or using label
					const breadcrumbLabel = isFunction(label) ? label(payload, params) : label;

					// Checks if active route matches paths before resolving query persistence
					if (isActivatedRoute) {
						resolvedParamsHandling = this.resolveQueryPersistence(
							breadcrumbPath,
							queryParams
						);
					}

					// Constructs complete breadcrumb item with resolved properties and status
					const breadcrumb: IBreadcrumb = {
						icon: icon ?? null,
						home: home ?? false,
						label: breadcrumbLabel,
						context: context ?? null,
						routerLink: breadcrumbPath,
						iconSize: iconSize ?? null,
						disabled: disabled ?? false,
						queryParamsHandling: resolvedParamsHandling,
						queryParams: isActivatedRoute ? queryParams : {}
					};

					// Appends constructed breadcrumb item to accumulated collection reference
					breadcrumbs.push(breadcrumb);
				}
			}

			// Updates path accumulator with composite segments for upcoming iteration
			pathAccumulator = compositeSegments;

			// Resolves primary child route definition to continue traversal hierarchy
			routeSnapshot = resolvePrimaryRoute(routeSnapshot);
		}

		// Returns complete breadcrumb structure representing navigation hierarchy
		return breadcrumbs;
	}

	/**
	 * Resolves navigation context extracting properties and path string from explicit specification or home entry definition.
	 * Processes active snapshot to determine breadcrumb configuration handling direct declarations or nested node structures.
	 *
	 * @param path - The base path string used for breadcrumb url building and resolution of subsequent child route placement.
	 * @param route - The active state snapshot used to resolve navigation context from data specification and child contexts.
	 * @returns A context object containing resolved breadcrumb metadata and accumulated path segment for hierarchy formation.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private resolveBreadcrumbContext(
		path: string,
		route: ActivatedRouteSnapshot
	): IBreadcrumbContext {
		// Initializes a variable to hold resolved breadcrumb url path accumulator
		let breadcrumbPath = path;

		// Retrieves route data object containing specific breadcrumb declarations
		const routeData = route.data as IRouteData;

		// Retrieves child route configuration array associated with current route
		const routeChildren = route.routeConfig?.children;

		// Initializes a variable to hold breadcrumb metadata configuration object
		let breadcrumbMeta: IRouteBreadcrumb | null = null;

		// Checks if breadcrumb configuration context exists in current route data
		if (routeData.breadcrumb) {
			// Retrieves breadcrumb configuration option declared in route definitions
			const routeBreadcrumb = routeData.breadcrumb;

			// Checks if configuration is object or string to assign metadata property
			if (isObject(routeBreadcrumb)) breadcrumbMeta = routeBreadcrumb;
			else if (isString(routeBreadcrumb)) breadcrumbMeta = { label: routeBreadcrumb };
		}

		// Checks if metadata is missing and child routes available for resolution
		if (!breadcrumbMeta && !!routeChildren) {
			// Retrieves home route definition searching route list for home attribute
			const homeRoute = routeChildren.find(({ data }) => {
				return data?.['breadcrumb']?.home === true;
			});

			// Checks if matched home route contains necessary breadcrumb declarations
			if (homeRoute?.data) {
				// Retrieves relative path string property from resolved home route object
				const { path: homeRoutePath } = homeRoute;

				// Retrieves breadcrumb metadata configuration from home route definitions
				breadcrumbMeta = homeRoute.data['breadcrumb'];

				// Checks if home route path is valid string before constructing final url
				if (!isNil(homeRoutePath)) {
					// Checks if base path is root to ensure correct path string concatenation
					if (path === '/') breadcrumbPath = `/${homeRoutePath}`;
					else breadcrumbPath = `${path}/${homeRoutePath}`;
				}
			}
		}

		// Normalizes breadcrumb path by removing trailing slashes for consistency
		// breadcrumbPath = breadcrumbPath.replace(/\/$/, '') || '/';

		// Returns resolved context structure containing metadata and path segment
		return { breadcrumbMeta, breadcrumbPath };
	}

	/**
	 * Resolves query parameter persistence strategy determining preservation behavior based on base route context and inputs.
	 * Processes target path and query params evaluating inclusion policies returning configured handling strategy resolution.
	 *
	 * @param path - The target route path string used to determine active route match outcome for retention cycle processing.
	 * @param queryParams - The current route query parameters object checked for existence to define default handling option.
	 * @param queryParamsHandling - The explicit handling strategy string provided to override default preservation operation.
	 * @returns A string representing the resolved query parameters handling strategy built on provided inputs and precedence.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private resolveQueryPersistence(
		path: string | undefined,
		queryParams: Params | undefined,
		queryParamsHandling?: QueryParamsHandling
	): QueryParamsHandling {
		// Checks if query params handling is provided returning explicit strategy
		if (!isNil(queryParamsHandling)) return queryParamsHandling;

		// Checks if query params exist and are not empty returning merge strategy
		if (!isNil(queryParams) && !isEmpty(queryParams)) return 'merge';

		// Retrieves boolean status checking if current route matches path segment
		const isExtendedRoute = matchesActivePath(this.router, path, 'subset');

		// Retrieves boolean status checking if current route matches path pattern
		const isActivatedRoute = matchesActivePath(this.router, path, 'exact');

		// Checks if navigation target not active determining persistence strategy
		if (!isActivatedRoute) {
			// Checks if provided path is empty or default returning empty persistence
			if (path === '' || path === '/') return '';

			// Returns persistence strategy if active url contains query params string
			return isExtendedRoute ? 'preserve' : '';
		}

		// Returns persistence strategy if active url contains query params string
		return this.router.url.includes('?') ? 'preserve' : '';
	}
}
