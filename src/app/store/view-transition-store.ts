import { Router } from '@angular/router';
import { withResetState } from './reset-state';
import { computed, inject } from '@angular/core';
import type { TRouteLayout } from '@shared/types';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap, tap, timer } from 'rxjs';
import { matchesActivePath, resolveSnapshotData } from '@shared/utilities';
import type { ViewTransitionInfo, ActivatedRouteSnapshot } from '@angular/router';
import {
	withState,
	withHooks,
	patchState,
	withMethods,
	signalStore,
	withComputed
} from '@ngrx/signals';

type TViewTransitionMode = 'cross-layout' | 'intra-layout' | 'none';

type TViewTransitionName = 'none' | 'access-outlet' | 'platform-outlet';

interface ITransitionNames {
	accessOutlet: TViewTransitionName;
	platformOutlet: TViewTransitionName;
}

interface ITransitionContext {
	mode: TViewTransitionMode;
	target: TRouteLayout | null;
}

interface IViewTransitionState {
	_transitionMode: TViewTransitionMode;
	_transitionTarget: TRouteLayout | null;
}

/**
 * Defines an initial state object to setup store values and ensure normalized default across store features and contexts.
 * Processes fundamental state requirements to establish a reliable structure which enables consistent reactive operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState: IViewTransitionState = {
	_transitionMode: 'none',
	_transitionTarget: null
};

/**
 * Defines declarative state container which centralizes reactive store management to maintain seamless state integration.
 * Provides composite interface of store properties, lifecycle hooks and executing methods to support predictable updates.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const ViewTransitionStore = signalStore(
	// Provides root scoped store instance to manage state for dependency tree
	{ providedIn: 'root' },

	// Provides initial store schema with baseline value for state composition
	withState(initialState),

	// Provides state restore capability referencing captured initial snapshot
	withResetState<IViewTransitionState>(),

	// Provides derived signals projecting current values from reactive source
	withComputed((store) => {
		/**
		 * Computes view transition names by evaluating route transition behavior for navigation operations across matched routes.
		 * Returns a consolidated object containing specific transition names for every layout context to control visual behavior.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const transitionNames = computed<ITransitionNames>(() => {
			// Retrieves the current route transition mode from the store signal state
			const transitionMode = store._transitionMode();

			// Retrieves the active view transition target from our store signal state
			const transitionTarget = store._transitionTarget();

			// Retrieves boolean indicating whether transition mode is an intra layout
			const isIntraLayout = transitionMode === 'intra-layout';

			// Retrieves boolean verifying whether visitor target matches intra layout
			const accessTransition = isIntraLayout && transitionTarget === 'access';

			// Retrieves boolean verifying whether private target matches intra layout
			const platformTransition = isIntraLayout && transitionTarget === 'platform';

			// Returns the transition names object with calculated options for layouts
			return {
				accessOutlet: accessTransition ? 'access-outlet' : 'none',
				platformOutlet: platformTransition ? 'platform-outlet' : 'none'
			};
		});

		// Returns signals collection exposing calculated values for public access
		return { transitionNames };
	}),

	// Provides store methods enabling state updates and reactive interactions
	withMethods((store) => {
		// Dependency injections providing direct access to services and injectors
		const router = inject(Router);

		/**
		 * Provides confirmation whether the current navigation target path matches the actual active route using strict matching.
		 * Processes current navigation target against active route to stop unnecessary transitions when navigating to same route.
		 *
		 * @returns A boolean indicating whether the navigation target is identical to the application route configuration object.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const _isNavigatingToSameRoute = (): boolean => {
			// Retrieves destination path from current navigation for route comparison
			const targetUrl = router.currentNavigation()?.finalUrl;

			// Returns target URL matches current active route using specified options
			return matchesActivePath(router, targetUrl, 'exact');
		};

		/**
		 * Updates route transition mode by changing route transition states to configure view transition behavior for navigation.
		 * Processes transition state to enable appropriate view transition logic based on route layout compatibility and context.
		 *
		 * @param mode - The transition mode setting defining the layout relationship between the current and the intended routes.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const setTransitionMode = (mode: TViewTransitionMode): void => {
			patchState(store, { _transitionMode: mode });
		};

		/**
		 * Resets transition state properties after a timeout to clear stale view transition remnant and restore default behavior.
		 * Processes timer streams to schedule state reset or skip delay ensuring synchronized cleanup after transition completes.
		 *
		 * @param timeout - The delay duration in milliseconds or a negative value to cancel pending restoration operation safely.
		 * @returns A reactive method executing the timer stream to update state properties based upon the provided timeout value.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const resetTransitionMode = rxMethod<number>(
			pipe(
				switchMap((timeout) => {
					return timeout < 0 ? EMPTY : timer(timeout);
				}),
				tap(() => {
					patchState(store, initialState);
				})
			)
		);

		/**
		 * Handles view transition creation by validating route paths and confirming if transitions should proceed for navigation.
		 * Processes route change by comparing layout types and skipping transitions when routes have mismatched or invalid state.
		 *
		 * @param transitionInfo - The view transition properties containing view transition state and current navigation context.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const handleTransition = (transitionInfo: ViewTransitionInfo): void => {
			// Resets pending transition timers to prevent view update race conditions
			resetTransitionMode(-1);

			// Retrieves navigation target to check if it matches current active route
			const isNavigatingToSameRoute = _isNavigatingToSameRoute();

			// Destructures the provided source object to extract necessary properties
			const { transition, from: sourceRoute, to: targetRoute } = transitionInfo;

			// Checks if transition is invalid and resets store state to initial value
			if (!sourceRoute || !targetRoute || isNavigatingToSameRoute) {
				patchState(store, initialState);
				return;
			}

			// Retrieves the view transition object constructed from matched snapshots
			const transitioncontext = resolveTransitionContext(sourceRoute, targetRoute);

			// Updates transition mode and target to organize view transition behavior
			patchState(store, {
				_transitionMode: transitioncontext.mode,
				_transitionTarget: transitioncontext.target
			});

			// Registers cleanup handler to reset transition state when animation ends
			transition.finished.finally(() => {
				requestAnimationFrame(() => resetTransitionMode(350));
			});
		};

		// Returns methods collection exposing callable features for public access
		return { handleTransition, setTransitionMode, resetTransitionMode };
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

/**
 * Determines the navigation context by comparing the source and target routes to resolve appropriate visual interactions.
 * Processes applied configuration types to derive the transition mode based on layout alignment between specified routes.
 *
 * @param target - The activated route snapshot object containing route configuration and parameters for state comparison.
 * @param source - The activated route snapshot object containing route configuration and parameters for state comparison.
 * @returns An object containing the identified view transition behavior and the resolved layout target for the procedure.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function resolveTransitionContext(
	source: ActivatedRouteSnapshot,
	target: ActivatedRouteSnapshot
): ITransitionContext {
	// Retrieves the layout type for the destination path being navigated into
	const targetLayout = resolveSnapshotData(target, 'layout');

	// Retrieves the layout type for the source path being navigated away from
	const sourceLayout = resolveSnapshotData(source, 'layout');

	// Checks if source and target layouts are available to execute transition
	const hasResolvedLayouts = !!sourceLayout && !!targetLayout;

	// Retrieves view transition mode based on the resolved layout differences
	const transitionMode = hasResolvedLayouts
		? sourceLayout !== targetLayout
			? 'cross-layout'
			: 'intra-layout'
		: 'none';

	// Returns the transition state and layout target for the current sequence
	return { mode: transitionMode, target: targetLayout };
}
