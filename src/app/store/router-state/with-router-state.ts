import { inject } from '@angular/core';
import type { INavigationEnd } from '@shared/types';
import { toSignal } from '@angular/core/rxjs-interop';
import { signalStoreFeature, withProps } from '@ngrx/signals';
import type { Event, RouterStateSnapshot } from '@angular/router';
import { distinctUntilChanged, filter, map, scan, startWith } from 'rxjs';
import {
	Router,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	NavigationCancel
} from '@angular/router';

/**
 * Initializes a modular signal store feature to extend state management capabilities with specialized reactive behaviors.
 * Establishes reactive router binding to monitor navigation updates and expose router state for route dependent contexts.
 *
 * @returns A signal store feature that equips the store with reactive router integration and navigation state properties.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function withRouterState() {
	return signalStoreFeature(
		// Provides custom properties extending store instance with static members
		withProps((store) => {
			// Dependency injections providing direct access to services and injectors
			const router = inject(Router);

			/**
			 * Declares a reactive signal generated from router events stream monitoring navigation lifecycle transitions and updates.
			 * Processes source observable converting stream emissions into reactive state handling initial null and value resolution.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const routerEvent = toSignal<Event | null>(router.events, {
				initialValue: null
			});

			/**
			 * Declares a reactive signal representing navigation completion derived from router events identifying state transitions.
			 * Processes router events stream to output validated instance and state matching transition end precisely otherwise null.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const navigationEnd = toSignal<INavigationEnd | null>(
				router.events.pipe(
					filter((event) => event instanceof NavigationEnd),
					map((event) => ({ event, state: router.routerState }))
				),
				{ initialValue: null }
			);

			/**
			 * Declares a reactive signal tracking the router state snapshot to keep route context aligned after transition completes.
			 * Processes navigation end event and initial emission extracting current router state within the router service snapshot.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const routerSnapshot = toSignal<RouterStateSnapshot>(
				router.events.pipe(
					filter((event) => event instanceof NavigationEnd),
					map((_) => router.routerState.snapshot),
					startWith(router.routerState.snapshot)
				),
				{ requireSync: true }
			);

			/**
			 * Declares a reactive signal monitoring whether the router is currently executing ongoing transition sequence operations.
			 * Processes router events to output boolean indicating whether active event matches specific navigation transition types.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const isNavigating = toSignal<boolean, boolean>(
				router.events.pipe(
					scan((isNavigating, event) => {
						if (event instanceof NavigationStart) return true;
						if (event instanceof NavigationEnd) return false;
						if (event instanceof NavigationError) return false;
						if (event instanceof NavigationCancel) return false;
						return isNavigating;
					}, false),
					distinctUntilChanged()
				),
				{ initialValue: false }
			);

			// Returns properties collection exposing shared members for public access
			return { routerEvent, isNavigating, navigationEnd, routerSnapshot };
		})
	);
}
