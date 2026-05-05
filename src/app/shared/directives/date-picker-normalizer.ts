import type { TCallback } from '../types';
import type { OnInit } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import { isTouchDevice } from '@primeuix/utils';
import { isPlatformBrowser } from '@angular/common';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';
import { Directive, inject, input, PLATFORM_ID } from '@angular/core';

@Directive({ selector: 'p-datepicker' })
export class DatePickerNormalizer implements OnInit {
	// Dependency injections providing direct access to services and injectors
	private readonly platformId = inject(PLATFORM_ID);
	private readonly datePickerInstance = inject(DatePicker, { optional: true, self: true });

	// Input and output properties reflecting shared state and emitting events
	public readonly yearRange = input<number, number>(12, {
		transform: (value: number) => (value > 12 ? 12 : value)
	});

	/**
	 * Handles initialization cycle by organizing necessary state structures and applying foundational configuration defaults.
	 * Executes startup actions such as data retrieval, stream subscription, or state configuration for operational readiness.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public ngOnInit(): void {
		this.overrideYearPickerRange();
		this.overrideOverlayListeners();
	}

	/**
	 * Overrides the injected component behavior preserving strict spatial alignment during native window scroll and resizing.
	 * Processes the viewport placement assessment updating floating element boundary protecting consistent layout visibility.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private overrideOverlayListeners(): void {
		// Retrieves injected source instance applying custom behavioral overrides
		const datePickerInstance = this.datePickerInstance;

		// Checks if retrieved source instance lacks valid reference returns early
		if (!datePickerInstance) return;

		// Overrides existing scroll listener preventing default layout disruption
		datePickerInstance.bindScrollListener = () => {
			// Retreives the current runtime environment identifying browser execution
			const isBrowserContext = isPlatformBrowser(this.platformId);

			// Checks if specific scroll handler requires fresh browser initialization
			if (!datePickerInstance.scrollHandler && isBrowserContext) {
				// Defines realign behavior updating precise layout coordinate positioning
				const realignOverlayPosition: TCallback = () => {
					// Checks if view remains visible preventing layout shifts while arranging
					if (datePickerInstance.overlayVisible) {
						datePickerInstance.alignOverlay();
					}
				};

				// Retrieves trigger input node establishing strict scroll layout boundary
				const triggerInputNode = datePickerInstance.inputfieldViewChild?.nativeElement;

				// Initializes connected scroll handler maintaining precise target binding
				datePickerInstance.scrollHandler = new ConnectedOverlayScrollHandler(
					triggerInputNode,
					realignOverlayPosition
				);
			}

			// Binds designated scroll handler execution triggering event subscription
			datePickerInstance.scrollHandler?.bindScrollListener();
		};

		// Overrides existing resize listener preventing default layout disruption
		datePickerInstance.onWindowResize = () => {
			// Checks if view remains visible preventing layout shifts on touch screen
			if (datePickerInstance.overlayVisible && !isTouchDevice()) {
				datePickerInstance.alignOverlay();
			}
		};
	}

	/**
	 * Overrides the injected component calculations to establish the custom year pagination limits preventing state repaints.
	 * Calculates the mathematical range boundaries updating the target year sequential lists to preserve rendering stability.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private overrideYearPickerRange(): void {
		// Retrieves injected source instance applying custom behavioral overrides
		const datePickerInstance = this.datePickerInstance;

		// Checks if retrieved source instance lacks valid reference returns early
		if (!datePickerInstance) return;

		// Retrieves configured year range limit from bound instance inputs signal
		const yearRange = this.yearRange();

		// Initializes a variable to hold cached year range array avoiding repaint
		let cachedYearRange: number[] = [];

		// Initializes a variable to hold active calendar year preventing repaints
		let cachedYear: number | null = null;

		// Overrides native year picking property supplying a strict numeric array
		datePickerInstance.yearPickerValues = (): number[] => {
			// Retrieves extracted current year boundary from injected instance target
			const { currentYear } = datePickerInstance;

			// Checks if current year remains unchanged returning cached numeric array
			if (cachedYear === currentYear) return cachedYearRange;

			// Initializes a variable to hold an empty numeric array for mapped ranges
			const resolvedYearRange: number[] = [];

			// Retrieves mathematical start boundary applying exact numeric arithmetic
			const rangeStartYear = currentYear - (currentYear % yearRange);

			// Iterates through expected calendar limits pushing valid numeric entries
			for (let index = 0; index < yearRange; index++) {
				resolvedYearRange.push(rangeStartYear + index);
			}

			// Updates external reference caching resolved year array preventing loops
			cachedYearRange = resolvedYearRange;

			// Updates external reference caching active current year preventing loops
			cachedYear = currentYear;

			// Returns a calculated numeric array containing accurate sequential years
			return cachedYearRange;
		};

		// Overrides existing decrement handler modifying custom pagination limits
		datePickerInstance.decrementDecade = () => {
			datePickerInstance.currentYear -= yearRange;
		};

		// Overrides existing increment handler modifying custom pagination limits
		datePickerInstance.incrementDecade = () => {
			datePickerInstance.currentYear += yearRange;
		};
	}
}
