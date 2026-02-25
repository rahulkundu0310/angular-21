import { Platform } from './platform';
import { inject } from '@angular/core';
import type { IMenuItem } from '@shared/types';
import { withNavigation } from '@store/navigation';
import { withResetState } from '@store/reset-state';
import { withState, withHooks, patchState, signalStore, withMethods } from '@ngrx/signals';

interface IPlatformState {
	_menuItems: IMenuItem[];
}

/**
 * Defines an initial state object to setup store values and ensure normalized default across store features and contexts.
 * Processes fundamental state requirements to establish a reliable structure which enables consistent reactive operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState: IPlatformState = {
	_menuItems: []
};

/**
 * Defines declarative state container which centralizes reactive store management to maintain seamless state integration.
 * Provides composite interface of store properties, lifecycle hooks and executing methods to support predictable updates.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const PlatformStore = signalStore(
	// Provides initial store schema with baseline value for state composition
	withState(initialState),

	// Provides navigation behavior managing routing events and state snapshot
	withNavigation(),

	// Provides state restore capability referencing captured initial snapshot
	withResetState<IPlatformState>(),

	// Provides store methods enabling state updates and reactive interactions
	withMethods((store) => {
		// Dependency injections providing direct access to services and injectors
		const platform = inject(Platform);

		/**
		 * Updates the menu items collection storing the supplied hierarchical foundation to manage internal recursive operations.
		 * Processes the provided input to populate the base configuration and maintain predictable behavior for reactive updates.
		 *
		 * @param menuItems - The array of source definitions containing the intended layout structure for interface architecture.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const setMenuItems = (menuItems: IMenuItem[]): void => {
			patchState(store, { _menuItems: menuItems });
		};

		// Returns methods collection exposing callable features for public access
		return { setMenuItems };
	}),

	// Provides lifecycle hooks executing side effects during store operations
	withHooks((store) => {
		/**
		 * Handles store destruction by releasing retained resources and dismantling reactive connections to prevent memory leaks.
		 * Executes cleanup procedures such as cancelling inflight requests, resetting store signals, or clearing computed caches.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const onDestroy = (): void => {
			store.resetState(initialState);
		};

		// Returns callbacks collection executed during initialization and cleanup
		return { onDestroy };
	})
);
