import { withLogger } from './logger';
import { withStorage } from './storage';
import { computed } from '@angular/core';
import { applicationConfig } from '@configs';
import { withResetState } from './reset-state';
import {
	withHooks,
	withState,
	patchState,
	signalStore,
	withMethods,
	withComputed
} from '@ngrx/signals';

type TAccessLayoutMode = 'compact' | 'extended';

type TPlatformLayoutMode = 'compact' | 'extended' | 'collapsed';

interface IAccessLayoutContext {
	compact: boolean;
	extended: boolean;
}

interface IPlatformLayoutContext {
	compact: boolean;
	extended: boolean;
	collapsed: boolean;
}

interface ILayoutState {
	isNavigationDrawerVisible: boolean;
	accessLayoutMode: TAccessLayoutMode;
	platformLayoutMode: TPlatformLayoutMode;
}

/**
 * Defines an initial state object to setup store values and ensure normalized default across store features and contexts.
 * Processes fundamental state requirements to establish a reliable structure which enables consistent reactive operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState: ILayoutState = {
	accessLayoutMode: 'extended',
	platformLayoutMode: 'extended',
	isNavigationDrawerVisible: false
};

/**
 * Defines declarative state container which centralizes reactive store management to maintain seamless state integration.
 * Provides composite interface of store properties, lifecycle hooks and executing methods to support predictable updates.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const LayoutStore = signalStore(
	// Provides root scoped store instance to manage state for dependency tree
	{ providedIn: 'root' },

	// Provides initial store schema with baseline value for state composition
	withState(initialState),

	// Provides state restore capability referencing captured initial snapshot
	withResetState<ILayoutState>(),

	// Provides state change tracking with snapshots printed in console groups
	withLogger<ILayoutState>({ storeName: 'Layout' }),

	// Provides storage capability saving properties and restoring upon reload
	withStorage<ILayoutState>(applicationConfig.layoutStateKey, {
		include: ['platformLayoutMode'],
		broadcast: { key: applicationConfig.layoutChannelKey },
		shouldStore: (store) => store.platformLayoutMode !== 'collapsed'
	}),

	// Provides derived signals projecting current values from reactive source
	withComputed((store) => {
		/**
		 * Computes organized access layout context by evaluating the stored property to establish adaptive workspace composition.
		 * Returns a consolidated object containing layout status and display attributes and modes derived from source properties.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const accessLayoutContext = computed<IAccessLayoutContext>(() => {
			// Retrieves active layout variant definitions from the store signal state
			const accessLayoutMode = store.accessLayoutMode();

			// Returns the layout context object with configured options for viewports
			return {
				compact: accessLayoutMode === 'compact',
				extended: accessLayoutMode === 'extended'
			};
		});

		/**
		 * Computes organized platform layout context by evaluating the stored option to establish adaptive workspace composition.
		 * Returns a consolidated object containing layout status and display attributes and modes derived from source properties.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const platformLayoutContext = computed<IPlatformLayoutContext>(() => {
			// Retrieves active layout variant definitions from the store signal state
			const platformLayoutMode = store.platformLayoutMode();

			// Returns the layout context object with configured options for viewports
			return {
				compact: platformLayoutMode === 'compact',
				extended: platformLayoutMode === 'extended',
				collapsed: platformLayoutMode === 'collapsed'
			};
		});

		// Returns signals collection exposing calculated values for public access
		return {
			accessLayoutContext,
			platformLayoutContext
		};
	}),

	// Provides store methods enabling state updates and reactive interactions
	withMethods((store) => {
		/**
		 * Updates the access layout mode storing the selected visual option to fluidly organize the viewport interface structure.
		 * Processes the provided input to update the layout configuration and preserves state consistency across adaptive panels.
		 *
		 * @param mode - The supplied layout argument specifying the intended rendering format for adaptive workspace composition.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const setAccessLayoutMode = (mode: TAccessLayoutMode): void => {
			patchState(store, { accessLayoutMode: mode });
		};

		/**
		 * Updates the platform layout mode using the selected visual option to fluidly organize the viewport interface structure.
		 * Processes the provided input to update the layout configuration while explicitly resetting the drawer panel visibility.
		 *
		 * @param mode - The supplied layout argument specifying the intended rendering format for adaptive workspace composition.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const setPlatformLayoutMode = (mode: TPlatformLayoutMode): void => {
			patchState(store, {
				platformLayoutMode: mode,
				isNavigationDrawerVisible: false
			});
		};

		/**
		 * Updates the navigation drawer visibility property to seamlessly manage the collapsible sidebar menu panel presentation.
		 * Processes the provided input to modify the specific display state specifying the intended navigation drawer appearance.
		 *
		 * @param visible - The boolean value defining whether the target navigation drawer should be displayed within the layout.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const setNavigationDrawerVisibility = (visible: boolean): void => {
			patchState(store, { isNavigationDrawerVisible: visible });
		};

		/**
		 * Toggles the navigation drawer visibility property to seamlessly manage the collapsible sidebar menu panel presentation.
		 * Processes the current configuration to determine the alternate state value required for updating the layout definition.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const toggleNavigationDrawerVisibility = (): void => {
			patchState(store, (state) => {
				// Retrieves the navigation drawer visible property from the store context
				const { isNavigationDrawerVisible } = state;

				// Computes the inverse visibility state to determine the alternate output
				const alternateDrawerVisibility = !isNavigationDrawerVisible;

				// Returns the updated visibility state to modify the layout configuration
				return { isNavigationDrawerVisible: alternateDrawerVisibility };
			});
		};

		/**
		 * Toggles the platform layout mode between available visual options to fluidly optimize the viewport interface structure.
		 * Processes the current configuration to determine the alternate state value required for updating the layout definition.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const togglePlatformLayoutMode = (): void => {
			patchState(store, (state) => {
				// Retrieves the currently active layout definition from the store context
				const { platformLayoutMode } = state;

				// Computes the active layout definition to determine the alternate output
				const alternateLayoutMode: TPlatformLayoutMode =
					platformLayoutMode === 'extended' ? 'compact' : 'extended';

				// Returns the resolved layout variant to modify the current configuration
				return { platformLayoutMode: alternateLayoutMode };
			});
		};

		// Returns methods collection exposing callable features for public access
		return {
			setAccessLayoutMode,
			setPlatformLayoutMode,
			togglePlatformLayoutMode,
			setNavigationDrawerVisibility,
			toggleNavigationDrawerVisibility
		};
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
