import { Theme } from '@core/services';
import { withStorage } from './storage';
import { applicationConfig } from '@config';
import { withResetState } from './reset-state';
import { MediaMatcher } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import type { TTheme, TSystemTheme } from '@shared/types';
import { inject, PLATFORM_ID, effect, computed } from '@angular/core';
import {
	withProps,
	withState,
	withHooks,
	patchState,
	signalStore,
	withMethods,
	withComputed
} from '@ngrx/signals';

interface IThemeState {
	theme: TTheme;
	systemTheme: TSystemTheme;
}

/**
 * Defines an initial state object to setup store values and ensure normalized default across store features and contexts.
 * Processes fundamental state requirements to establish a reliable structure which enables consistent reactive operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState: IThemeState = {
	systemTheme: 'light',
	theme: applicationConfig.defaultTheme
};

/**
 * Defines declarative state container which centralizes reactive store management to maintain seamless state integration.
 * Provides composite interface of store properties lifecycle hooks and executable methods to support predictable updates.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const ThemeStore = signalStore(
	// Provides root scoped store instance to manage state for dependency tree
	{ providedIn: 'root' },

	// Provides initial store schema with baseline value for state composition
	withState(initialState),

	// Provides state restore capability referencing captured initial snapshot
	withResetState<IThemeState>(),

	// Provides storage capability saving properties and restoring upon reload
	withStorage<IThemeState>(applicationConfig.themeKey, {
		include: ['theme'],
		broadcast: { key: applicationConfig.themeChannelKey }
	}),

	// Provides custom properties extending store instance with static members
	withProps((store) => {
		// Dependency injections providing direct access to services and injectors
		const platformId = inject(PLATFORM_ID);
		const mediaMatcher = inject(MediaMatcher);

		/**
		 * Declares a color scheme matcher evaluating the preferred visual appearance across supported browser execution contexts.
		 * Processes runtime environment checking to return the native media query resolving dark themes or a null reference type.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const _colorSchemeQuery = isPlatformBrowser(platformId)
			? mediaMatcher.matchMedia('(prefers-color-scheme: dark)')
			: null;

		// Returns properties collection exposing shared members for public access
		return { _colorSchemeQuery };
	}),

	// Provides derived signals projecting current values from reactive source
	withComputed((store) => {
		/**
		 * Computes the definitive visual styling option by evaluating the stored selection to determine the specified appearance.
		 * Returns a string representing the explicit design choice or the applicable system palette based on the current context.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const resolvedTheme = computed<TTheme>(() => {
			// Retreives current selected theme directly from the reactive store state
			const theme = store.theme();

			// Retreives current system styling directly from the reactive store state
			const systemTheme = store.systemTheme();

			// Returns matched system styling if specified otherwise the current theme
			return theme === 'system' ? systemTheme : theme;
		});

		// Returns signals collection exposing calculated values for public access
		return { resolvedTheme };
	}),

	// Provides store methods enabling state updates and reactive interactions
	withMethods((store) => {
		/**
		 * Derives the base system styling preference by evaluating the provided media query match result against the store state.
		 * Processes boolean matching validation to assign dark or light designs updating the managed store configuration options.
		 *
		 * @param event - The media query object containing the runtime details required to determine the correct browser styling.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const _deriveSystemTheme = (event: MediaQueryListEvent | MediaQueryList): void => {
			patchState(store, { systemTheme: event.matches ? 'dark' : 'light' });
		};

		/**
		 * Updates the requested visual styling preference by assigning the supplied design pattern to the managed layout mapping.
		 * Processes declarative patches to integrate the indicated color scheme and adjust the specific configuration selections.
		 *
		 * @param theme - The theme variant enclosing the correct render option required to change the runtime display properties.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const updateTheme = (theme: TTheme): void => {
			patchState(store, { theme });
		};

		// Returns methods collection exposing callable features for public access
		return { _deriveSystemTheme, updateTheme };
	}),

	// Provides lifecycle hooks executing side effects during store operations
	withHooks((store) => {
		// Dependency injections providing direct access to services and injectors
		const theme = inject(Theme);

		/**
		 * Handles store initialization by configuring reactive contexts and organizing state signals for consistent interactions.
		 * Executes startup tasks such as triggering initial data loads, registering effects, or configuring reactive derivations.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const onInit = (): void => {
			// Checks if the valid color scheme media query exists before initializing
			if (!store._colorSchemeQuery) return;

			// Derives the initial system styling preference using current media query
			store._deriveSystemTheme(store._colorSchemeQuery);

			// Registers an event listener updating system styling upon runtime change
			store._colorSchemeQuery.addEventListener('change', (event) => {
				store._deriveSystemTheme(event);
			});

			// Registers reactive side effect which executes when signal value updates
			effect(() => {
				// Retreives current calculated styling preference from active store state
				const resolvedTheme = store.resolvedTheme();

				// Suppresses global transitions to prevent layout flashing during updates
				theme.suppressTransitions();

				// Applies the resolved styling by precisely updating the document classes
				theme.applyTheme(resolvedTheme, 'class');
			});
		};

		/**
		 * Handles store destruction by releasing retained resources and dismantling reactive connections to prevent memory leaks.
		 * Executes cleanup procedures such as cancelling inflight requests, resetting store signals, or clearing computed caches.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const onDestroy = (): void => {
			store._colorSchemeQuery?.removeEventListener('change', (event) => {
				store._deriveSystemTheme(event);
			});
		};

		// Returns callbacks collection executed during initialization and cleanup
		return { onInit, onDestroy };
	})
);
