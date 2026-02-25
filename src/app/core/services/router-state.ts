import { resolveEvent } from '@shared/utilities';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map, startWith } from 'rxjs';
import type { Event, ParamMap, Params, RouterStateSnapshot } from '@angular/router';
import type { INavigationEnd, INavigationFailed, INavigationStart } from '@shared/types';
import {
	Router,
	NavigationEnd,
	ActivatedRoute,
	NavigationError,
	NavigationStart,
	NavigationCancel
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RouterState {
	// Dependency injections providing direct access to services and injectors
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	/**
	 * Declares a reactive signal representing query parameters derived from active route state attributes across transitions.
	 * Processes activated route params stream extracting properties emissions ensuring constant synchronous value resolution.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public readonly queryParams = toSignal<Params>(this.route.queryParams, {
		requireSync: true
	});

	/**
	 * Declares a reactive signal tracking path fragment parameter from active route hash anchor reference across transitions.
	 * Processes activated router fragment stream resolving current identifier ensuring constant synchronous value extraction.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public readonly fragment = toSignal<string | null>(this.route.fragment, {
		requireSync: true
	});

	/**
	 * Declares a reactive signal retrieving structured parameter map using current route state attributes across transitions.
	 * Processes activated route params map stream extracting entries record ensuring constant synchronous dataset definition.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public readonly queryParamMap = toSignal<ParamMap>(this.route.queryParamMap, {
		requireSync: true
	});

	/**
	 * Declares a reactive signal extracted from current router lifecycle emission to monitor constant navigation transitions.
	 * Processes router events stream converting emissions into synchronous output handling initial resolution otherwise null.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */

	public readonly routerEvent = toSignal<Event | null>(this.router.events, {
		initialValue: null
	});

	/**
	 * Declares a reactive signal representing navigation completion derived from router events identifying state resolutions.
	 * Processes router events stream to output validated instance and state matching end transition precisely otherwise null.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public readonly navigationEnd = toSignal<INavigationEnd | null>(
		this.router.events.pipe(
			resolveEvent(NavigationEnd),
			map((event) => ({ event, state: this.router.routerState }))
		),
		{ initialValue: null }
	);

	/**
	 * Declares a reactive signal representing navigation Initiation derived from router events identifying state definitions.
	 * Processes router events stream to output validated instance and state matching start sequence precisely otherwise null.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public readonly navigationStart = toSignal<INavigationStart | null>(
		this.router.events.pipe(
			resolveEvent(NavigationStart),
			map((event) => ({ event, state: this.router.routerState }))
		),
		{ initialValue: null }
	);

	/**
	 * Declares a reactive signal tracking the router state snapshot to keep route context aligned after transition completes.
	 * Processes router events stream extracting initial emission and current state snapshot from the router service instance.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public readonly routerSnapshot = toSignal<RouterStateSnapshot>(
		this.router.events.pipe(
			resolveEvent(NavigationEnd),
			map(() => this.router.routerState.snapshot),
			startWith(this.router.routerState.snapshot)
		),
		{ requireSync: true }
	);

	/**
	 * Declares a reactive signal monitoring whether the router is currently executing ongoing transition sequence operations.
	 * Processes router events stream to output boolean indicating whether event matches specific navigation transition types.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public readonly isNavigating = toSignal<boolean, boolean>(
		this.router.events.pipe(
			resolveEvent([NavigationStart, NavigationEnd, NavigationError, NavigationCancel]),
			map((event) => !!resolveEvent(NavigationStart, event)),
			distinctUntilChanged()
		),
		{ initialValue: false }
	);

	/**
	 * Declares a reactive signal tracking interrupted navigation capturing exceptions and terminations with precise metadata.
	 * Processes router events stream extracting failure details abort reasons and status codes for granular error management.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public readonly navigationFailed = toSignal<INavigationFailed | null>(
		this.router.events.pipe(
			resolveEvent([NavigationError, NavigationCancel]),
			map((event) => {
				// Retrieves navigation error matched from event across ongoing transition
				const ErrorEvent = resolveEvent(NavigationError, event);

				// Retrieves navigation cancel matched via event across ongoing transition
				const cancelEvent = resolveEvent(NavigationCancel, event);

				// Returns assembled navigation failure with event state code error reason
				return {
					event,
					state: this.router.routerState,
					code: cancelEvent?.code ?? null,
					error: ErrorEvent?.error ?? null,
					reason: cancelEvent?.reason ?? null
				};
			})
		),
		{ initialValue: null }
	);
}
