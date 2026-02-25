import { isEqual } from 'lodash-es';
import { withLogger } from './logger';
import { computed } from '@angular/core';
import { withResetState } from './reset-state';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import type { TBreakpoints, TDeviceType, TViewportContext, TViewportType } from '@shared/types';
import {
	withHooks,
	withProps,
	withState,
	patchState,
	signalStore,
	withMethods,
	withComputed
} from '@ngrx/signals';
import {
	of,
	map,
	tap,
	pipe,
	merge,
	fromEvent,
	switchMap,
	debounceTime,
	distinctUntilChanged
} from 'rxjs';

interface IViewportResizePayload {
	width: number;
	height: number;
}

interface IViewportState {
	viewportWidth: number;
	viewportHeight: number;
}

/**
 * Defines an initial state object to setup store values and ensure normalized default across store features and contexts.
 * Processes fundamental state requirements to establish a reliable structure which enables consistent reactive operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState: IViewportState = {
	viewportWidth: 0,
	viewportHeight: 0
};

/**
 * Defines declarative state container which centralizes reactive store management to maintain seamless state integration.
 * Provides composite interface of store properties, lifecycle hooks and executing methods to support predictable updates.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const ViewportStore = signalStore(
	// Provides root scoped store instance to manage state for dependency tree
	{ providedIn: 'root' },

	// Provides initial store schema with baseline value for state composition
	withState(initialState),

	// Provides state restore capability referencing captured initial snapshot
	withResetState<IViewportState>(),

	// Provides state change tracking with snapshots printed in console groups
	withLogger<IViewportState>({ storeName: 'Viewport' }),

	// Provides custom properties extending store instance with static members
	withProps((store) => {
		/**
		 * Declares a breakpoint threshold scale for common screen sizes to classify viewport categories across supported devices.
		 * Processes size limits from small to double extra large to enable standardized adaptable behavior for viewport handling.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const breakPoints: TBreakpoints = {
			sm: 640,
			md: 768,
			lg: 1024,
			xl: 1280,
			xxl: 1536
		} as const;

		// Returns properties collection exposing shared members for public access
		return { breakPoints };
	}),

	// Provides derived signals projecting current values from reactive source
	withComputed((store) => {
		/**
		 * Computes specific pixel density factor by referencing the window interface to determine screen resolution capabilities.
		 * Returns a numeric density scalar or defaults to standard definition when the high resolution property is not available.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const pixelRatio = computed<number>(() => {
			return window.devicePixelRatio || 1;
		});

		/**
		 * Computes specific device category identifier by extracting the classified value property from the viewport definitions.
		 * Returns a strict typed string value indicating whether the current environment operates as mobile or desktop or tablet.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const deviceType = computed<TDeviceType>(() => {
			return viewportContext().deviceType;
		});

		/**
		 * Computes specific aspect ratio factor by calculating the proportional relationship between width and height properties.
		 * Returns a numeric value representing the calculated ratio rounded to two decimal places for precise viewport rendering.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const aspectRatio = computed<number>(() => {
			// Retreives current viewport width directly from the reactive store state
			const viewportWidth = store.viewportWidth();

			// Retreives current viewport depth directly from the reactive store state
			const viewportHeight = store.viewportHeight();

			// Returns calculated aspect ratio rounded precisely to two decimal places
			return Number((viewportWidth / viewportHeight).toFixed(2));
		});

		/**
		 * Computes specific viewport type category by evaluating the detected width against the specified breakpoint constraints.
		 * Returns a string identifier corresponding to the specific breakpoint range matched by the detected viewport dimensions.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const viewportType = computed<TViewportType>(() => {
			// Retreives current viewport width directly from the reactive store state
			const viewportWidth = store.viewportWidth();

			// Destructures the provided source object to extract necessary properties
			const { sm, md, lg, xl, xxl } = store.breakPoints;

			// Checks if width matches defined limits returning extra small breakpoint
			if (viewportWidth < sm) return 'xs';

			// Checks if width matches defined limits returning small sized breakpoint
			if (viewportWidth < md) return 'sm';

			// Checks if width matches defined limits returning medium size breakpoint
			if (viewportWidth < lg) return 'md';

			// Checks if width matches defined limits returning large sized breakpoint
			if (viewportWidth < xl) return 'lg';

			// Checks if width matches defined limits returning extra large breakpoint
			if (viewportWidth < xxl) return 'xl';

			// Returns default double extra large type as the maximum sized breakpoint
			return 'xxl';
		});

		/**
		 * Computes organized viewport context by evaluating screen dimensions and media capabilities to support adaptive layouts.
		 * Returns a consolidated object containing device type and orientation and media features derived from source properties.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const viewportContext = computed<TViewportContext>(() => {
			// Retreives default desktop category expecting standard screen dimensions
			let deviceType: TDeviceType = 'desktop';

			// Retreives current viewport width directly from the reactive store state
			const viewportWidth = store.viewportWidth();

			// Retreives current viewport depth directly from the reactive store state
			const viewportHeight = store.viewportHeight();

			// Destructures the provided source object to extract necessary properties
			const { sm, md, lg, xl } = store.breakPoints;

			// Checks if width matches defined breakpoints to identify the device type
			if (viewportWidth < sm) deviceType = 'mobile';
			else if (viewportWidth < lg) deviceType = 'tablet';
			else if (viewportWidth < xl) deviceType = 'laptop';

			// Retreives media detection indicating mouse pointer supports hover state
			const hoverCapable = window.matchMedia('(hover: hover)').matches;

			// Retreives media detection indicating the pointer supports precise state
			const pointerDevice = window.matchMedia('(pointer: fine)').matches;

			// Retreives feature detection indicating touch points on current viewport
			const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

			// Returns unified context utilizing derived layout and capability results
			return {
				touchDevice,
				hoverCapable,
				pointerDevice,
				deviceType: deviceType,
				stacked: viewportWidth < md,
				relaxed: viewportWidth >= xl,
				freezeColumns: viewportWidth >= xl,
				portrait: viewportHeight > viewportWidth,
				hybridDevice: touchDevice && pointerDevice,
				landscape: viewportWidth >= viewportHeight,
				compact: viewportWidth >= md && viewportWidth < xl
			};
		});

		// Returns signals collection exposing calculated values for public access
		return { pixelRatio, aspectRatio, viewportType, deviceType, viewportContext };
	}),

	// Provides store methods enabling state updates and reactive interactions
	withMethods((store) => {
		/**
		 * Monitors the browser viewport dimensions to trigger state updates whenever the visible area changes size upon resizing.
		 * Processes native resize events using debounce techniques to optimize performance and prevent rapid state modifications.
		 *
		 * @param payload - The payload object containing dimensions needed to refresh the internal store properties requirements.
		 * @returns A reactive method that handles resize events to maintain state synchronization across the system architecture.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const _monitorViewportResize = rxMethod<IViewportResizePayload>(
			pipe(
				switchMap((payload) => {
					return merge(
						of(payload),
						fromEvent(window, 'resize').pipe(
							debounceTime(300),
							map(() => ({
								width: window.innerWidth,
								height: window.innerHeight
							}))
						)
					);
				}),
				distinctUntilChanged(isEqual),
				tap(({ width, height }: IViewportResizePayload) => {
					patchState(store, {
						viewportWidth: width,
						viewportHeight: height
					});
				})
			)
		);

		// Returns methods collection exposing callable features for public access
		return { _monitorViewportResize };
	}),

	// Provides lifecycle hooks executing side effects during store operations
	withHooks((store) => {
		/**
		 * Handles store initialization by configuring reactive contexts and organizing state signals for consistent interactions.
		 * Executes startup tasks such as triggering initial data loads, registering effects, or configuring reactive derivations.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const onInit = (): void => {
			store._monitorViewportResize({
				width: window.innerWidth,
				height: window.innerHeight
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
			store.resetState(initialState);
		};

		// Returns callbacks collection executed during initialization and cleanup
		return { onInit, onDestroy };
	})
);
