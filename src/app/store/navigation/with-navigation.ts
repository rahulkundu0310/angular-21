import { isEmpty } from 'lodash-es';
import { withRouterState } from '../router-state';
import { Navigation, RouterState } from '@core/services';
import { computed, inject, linkedSignal, untracked } from '@angular/core';
import type { IBreadcrumb, IMenuItem, INavigationEnd } from '@shared/types';
import { type, withProps, withMethods, signalStoreFeature } from '@ngrx/signals';

/**
 * Initializes a modular signal store feature to extend state management capabilities with specialized reactive behaviors.
 * Establishes router context integration to evaluate dynamic hierarchical structures and determine interface composition.
 *
 * @returns A signal store feature that equips the store with automated navigation mapping and interactive state tracking.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function withNavigation() {
	return signalStoreFeature(
		// Provides type constraint defining required structure for state instance
		{ state: type<{ _menuItems: IMenuItem[] }>() },

		// Provides router integration exposing navigation events and state stream
		withRouterState(),

		// Provides custom properties extending store instance with static members
		withProps((store) => {
			// Dependency injections providing direct access to services and injectors
			const navigation = inject(Navigation);
			const routerState = inject(RouterState);

			/**
			 * Declares a navigation menu items structure using router events updating item expansion and active status configuration.
			 * Returns an array of menu items representing resolved active state and expansion source with query persistence strategy.
			 */
			const menuItems = linkedSignal<INavigationEnd | null, IMenuItem[]>({
				source: routerState.navigationEnd,
				computation: (navigationEnd) => {
					// Executes provided logic untracked to avoid reactive dependency tracking
					return untracked<IMenuItem[]>(() => {
						// Retrieves the stored navigation menu items directly from store instance
						const menuItems = store._menuItems();

						// Checks if navigation end event is missing returning fallback empty list
						if (isEmpty(navigationEnd)) return [];

						// Returns evaluated menu items collection with updated navigation details
						return navigation.evaluateMenuItems(menuItems);
					});
				}
			});

			/**
			 * Declares a navigation structure using router event pipeline for active route matching and hierarchy context resolution.
			 * Returns an array of menu items representing resolved active state and expansion source with query persistence strategy.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const breadcrumbs = computed<IBreadcrumb[]>(() => {
				// Retrieves the active router snapshot state directly from store instance
				const routerSnapshot = routerState.routerSnapshot();

				// Returns resolved breadcrumbs collection with active navigation sequence
				return navigation.resolveBreadcrumbs(routerSnapshot);
			});

			// Returns properties collection exposing shared members for public access
			return { menuItems, breadcrumbs };
		}),

		// Provides store methods enabling state updates and reactive interactions
		withMethods((store) => {
			/**
			 * Manages the expansion state toggling for specified menu by targeting identifier and modifying the store state property.
			 * Processes the recursive items adjustment to resolve visibility while maintaining the integrity of the nested structure.
			 *
			 * @param menuId - The numeric identifier to inspect the target menu item entry for modifying the current expansion state.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const toggleMenuExpansion = (menuId: number): void => {
				store.menuItems.update((menuItems) => {
					return updateMenuExpansion(menuId, menuItems);
				});
			};

			// Returns methods collection exposing callable features for public access
			return { toggleMenuExpansion };
		})
	);
}

/**
 * Updates menu expansion state recursively traversing hierarchy to toggle items visibility using the matching identifier.
 * Processes definition mapping each entry preserving structure applying change and rebuilding nested objects persistence.
 *
 * @param menuId - The numeric identifier to inspect the target menu item entry for modifying the current expansion state.
 * @param menuItems - The collection of configured menu items containing structure for expanding status update operations.
 * @returns An array of menu items representing modified hierarchy with toggled expansion states and preserved attributes.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function updateMenuExpansion(menuId: number, menuItems: IMenuItem[]): IMenuItem[] {
	return menuItems.map((menuItem) => {
		// Destructures the provided source object to extract necessary properties
		const { id, expanded, items } = menuItem;

		// Initializes a variable to hold modified nested menu items configuration
		let updatedMenuItems: IMenuItem[] | undefined = items;

		// Determines if menu item expansion state changes for matching identifier
		const requiresExpansion = id === menuId ? !expanded : expanded;

		// Checks if child items exist performing recursive update on nested items
		if (items) updatedMenuItems = updateMenuExpansion(menuId, items);

		// Returns updated menu item object with new expansion state and structure
		return {
			...menuItem,
			items: updatedMenuItems,
			expanded: requiresExpansion
		};
	});
}
