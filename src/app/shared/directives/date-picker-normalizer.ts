import type { OnInit } from '@angular/core';
import { isArray, isDate } from 'lodash-es';
import { DatePicker } from 'primeng/datepicker';
import { isTouchDevice } from '@primeuix/utils';
import type { TCallback, TNoop } from '../types';
import { isPlatformBrowser } from '@angular/common';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';
import { Directive, inject, input, PLATFORM_ID } from '@angular/core';

@Directive({ selector: 'p-datepicker' })
export class DatePickerNormalizer implements OnInit {
	// Dependency injections providing direct access to services and injectors
	private readonly platformId = inject(PLATFORM_ID);
	private readonly datePicker = inject(DatePicker, { optional: true, self: true });

	// Input and output properties reflecting shared state and emitting events
	public readonly yearRange = input<number, number>(12, {
		transform: (value: number) => Math.min(value, 12)
	});

	/**
	 * Handles initialization cycle by organizing necessary state structures and applying foundational configuration defaults.
	 * Executes startup actions processing data retrieval and stream subscriptions or state configuration to ensure readiness.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public ngOnInit(): void {
		this.overrideFocusBehavior();
		this.overrideDateSelection();
		this.overrideYearSelection();
		this.overrideYearPickerRange();
		this.overrideOverlayListeners();
		this.overrideOverlayAlignment();
	}

	/**
	 * Overrides the injected date picker behavioral properties avoiding native input entrapment ensuring dynamic engagements.
	 * Processes trusted interaction events controlling overlay visibility timing and notifying external subscribers on focus.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private overrideFocusBehavior(): void {
		// Retrieves injected source instance applying custom behavioral overrides
		const datePicker = this.datePicker;

		// Checks if retrieved source instance lacks valid reference returns early
		if (!datePicker) return;

		// Updates injected instance property restricting default focus entrapment
		datePicker.focusTrap = false;

		// Updates optional autofocus property enforcing strict boolean resolution
		datePicker.autofocus = datePicker.autofocus ?? false;

		// Overrides input focus callback intercepting standard interaction events
		datePicker.onInputFocus = (event: Event): void => {
			// Retrieves boolean property verifying trusted hardware interaction event
			const physicalUserInteraction = event.isTrusted;

			// Updates boolean property evaluating precise keyboard element engagement
			datePicker.focus = true;

			// Checks if instance requires visibility triggered by trusted input event
			if (datePicker.showOnFocus && physicalUserInteraction) {
				requestAnimationFrame(() => {
					datePicker.showOverlay();
				});
			}

			// Emits the focus event during interaction to notify external subscribers
			datePicker.onFocus.emit(event);
		};
	}

	/**
	 * Overrides the injected date picker behavioral evaluations protecting an active reference against unexpected rejections.
	 * Processes structural equality comparisons verifying exact temporal parameters against the currently captured selection.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private overrideDateSelection(): void {
		// Retrieves injected source instance applying custom behavioral overrides
		const datePicker = this.datePicker;

		// Checks if retrieved source instance lacks valid reference returns early
		if (!datePicker) return;

		// Overrides internal method evaluating precise calendar selection matches
		const evaluateSelectionMatch = (day: number, month: number, year: number): boolean => {
			// Retrieves injected property preserving exposed calendar selection value
			const selectionState = datePicker.value;

			// Retrieves boolean outcome confirming individual date selection strategy
			const singleSelection = datePicker.isSingleSelection();

			// Checks if retrieved state fails structural validation returning boolean
			if (!(selectionState && isDate(selectionState) && singleSelection)) return false;

			// Returns an evaluated boolean establishing complete target date equality
			return (
				selectionState.getDate() === day &&
				selectionState.getMonth() === month &&
				selectionState.getFullYear() === year
			);
		};

		// Binds native validation callback maintaining targeted execution context
		const nativeIsValidDateForTimeConstraints =
			datePicker.isValidDateForTimeConstraints.bind(datePicker);

		// Overrides original instance temporal validation adjusting date boundary
		datePicker.isValidDateForTimeConstraints = (date: Date): boolean => {
			// Evaluates exact argument equality against previously captured selection
			const matchesSelectionState = evaluateSelectionMatch(
				date.getDate(),
				date.getMonth(),
				date.getFullYear()
			);

			// Checks if precise equality evaluates correctly validating returns early
			if (matchesSelectionState) return true;

			// Returns an execution result derived from native bounded time constraint
			return nativeIsValidDateForTimeConstraints(date);
		};

		// Binds default selectable callback keeping accurate contextual alignment
		const nativeIsSelectable = datePicker.isSelectable.bind(datePicker);

		// Binds default selectable callback keeping accurate contextual alignment
		datePicker.isSelectable = (
			day: number,
			month: number,
			year: number,
			otherMonth: boolean
		): boolean => {
			// Evaluates precise temporal boundary against currently active coordinate
			const matchesSelectionState = evaluateSelectionMatch(day, month, year);

			// Checks if precise equality evaluates correctly validating returns early
			if (matchesSelectionState) return true;

			// Returns a validated boolean derived from standard selectable properties
			return nativeIsSelectable(day, month, year, otherMonth);
		};
	}

	/**
	 * Overrides the injected date picker behavioral methods determining whether a calendar year matches the exact parameters.
	 * Processes singular targets alongside boundary arrays and concurrent elements confirming absolute inclusion evaluations.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private overrideYearSelection(): void {
		// Retrieves injected source instance applying custom behavioral overrides
		const datePicker = this.datePicker;

		// Checks if retrieved source instance lacks valid reference returns early
		if (!datePicker) return;

		// Overrides internal method evaluating precise calendar year arrangements
		datePicker.isYearSelected = (targetYear: number): boolean => {
			// Checks if configured instance lacks comparable properties returns early
			if (!datePicker.isComparable() || !datePicker.value) {
				return false;
			}

			// Retrieves injected property preserving exposed calendar selection value
			const selectionState = datePicker.value;

			// Checks if configured instance utilizes range boundaries matching arrays
			if (datePicker.isRangeSelection() && isArray(selectionState)) {
				// Retrieves destructured array values establishing exact boundary targets
				const [rangeStartDate, rangeEndDate] = selectionState;

				// Evaluates extracted trailing boundary verifying required date structure
				const hasEndBoundary = isDate(rangeEndDate);

				// Evaluates extracted starting boundary confirming proper date validation
				const hasStartBoundary = isDate(rangeStartDate);

				// Checks if both positional boundaries evaluate correctly granting access
				if (hasStartBoundary && hasEndBoundary) {
					// Retrieves absolute year numeric value obtained from valid trailing date
					const rangeEndYear = rangeEndDate.getFullYear();

					// Retrieves specific year numeric value obtained from valid starting date
					const rangeStartYear = rangeStartDate.getFullYear();

					// Returns an evaluated boolean asserting target falls within parsed range
					return targetYear >= rangeStartYear && targetYear <= rangeEndYear;
				}

				// Returns an evaluated boolean assessing accurate initial range alignment
				return hasStartBoundary ? rangeStartDate.getFullYear() === targetYear : false;
			}

			// Checks if configured instance implements multiple concurrent selections
			if (datePicker.isMultipleSelection() && isArray(selectionState)) {
				return selectionState.some(
					(date) => isDate(date) && date.getFullYear() === targetYear
				);
			}

			// Checks if structural date validates determining precise target equality
			return isDate(selectionState) ? selectionState.getFullYear() === targetYear : false;
		};
	}

	/**
	 * Overrides the injected date picker behavioral operations establishing exact year pagination limits preventing repaints.
	 * Calculates the mathematical range boundaries updating the target year sequential lists to preserve rendering stability.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private overrideYearPickerRange(): void {
		// Retrieves injected source instance applying custom behavioral overrides
		const datePicker = this.datePicker;

		// Checks if retrieved source instance lacks valid reference returns early
		if (!datePicker) return;

		// Retrieves configured year range limit from bound instance inputs signal
		const yearRange = this.yearRange();

		// Initializes a variable to hold cached year range array avoiding repaint
		let cachedYearRange: number[] = [];

		// Initializes a variable to hold active calendar year preventing repaints
		let cachedYear: number | null = null;

		// Overrides native year picking property supplying a strict numeric array
		datePicker.yearPickerValues = (): number[] => {
			// Retrieves extracted current year boundary from injected instance target
			const { currentYear } = datePicker;

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
		datePicker.decrementDecade = () => {
			datePicker.currentYear -= yearRange;
		};

		// Overrides existing increment handler modifying custom pagination limits
		datePicker.incrementDecade = () => {
			datePicker.currentYear += yearRange;
		};
	}

	/**
	 * Overrides the injected date picker behavioral events maintaining strict spatial alignment on window scroll and resizes.
	 * Processes the viewport placement assessment updating floating element boundary protecting consistent layout visibility.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private overrideOverlayListeners(): void {
		// Retrieves injected source instance applying custom behavioral overrides
		const datePicker = this.datePicker;

		// Checks if retrieved source instance lacks valid reference returns early
		if (!datePicker) return;

		// Overrides existing scroll listener preventing default layout disruption
		datePicker.bindScrollListener = () => {
			// Retrieves the current runtime environment identifying browser execution
			const isBrowserContext = isPlatformBrowser(this.platformId);

			// Checks if specific scroll handler requires fresh browser initialization
			if (!datePicker.scrollHandler && isBrowserContext) {
				// Defines realign behavior updating precise layout coordinate positioning
				const realignOverlayPosition: TCallback = () => {
					// Checks if view remains visible preventing layout shifts while arranging
					if (datePicker.overlayVisible) {
						datePicker.alignOverlay();
					}
				};

				// Retrieves trigger input node establishing strict scroll layout boundary
				const triggerInputNode = datePicker.inputfieldViewChild?.nativeElement;

				// Initializes connected scroll handler maintaining precise target binding
				datePicker.scrollHandler = new ConnectedOverlayScrollHandler(
					triggerInputNode,
					realignOverlayPosition
				);
			}

			// Binds designated scroll handler execution triggering event subscription
			datePicker.scrollHandler?.bindScrollListener();
		};

		// Overrides existing resize listener preventing default layout disruption
		datePicker.onWindowResize = () => {
			// Checks if view remains visible preventing layout shifts on touch screen
			if (datePicker.overlayVisible && !isTouchDevice()) {
				datePicker.alignOverlay();
			}
		};
	}

	/**
	 * Overrides the injected date picker behavioral methods adjusting precise floating element placements securing alignment.
	 * Processes delayed spatial assessments extracting dynamic midpoint coordinates and updating horizontal offset distances.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private overrideOverlayAlignment(): void {
		// Retrieves injected source instance applying custom behavioral overrides
		const datePicker = this.datePicker;

		// Checks if retrieved source instance lacks valid reference returns early
		if (!datePicker) return;

		// Binds standard alignment callback preserving accurate execution context
		const nativeAlignOverlay = datePicker.alignOverlay.bind(datePicker);

		// Overrides primary alignment method adjusting relative overlay placement
		datePicker.alignOverlay = (): void => {
			// Executes preserved native alignment configuring standard overlay layout
			nativeAlignOverlay();

			// Schedules asynchronous execution resolving accurate layout arrangements
			const scheduleQueueMicrotask: TNoop = () => {
				// Retrieves injected instance reference targeting primary overlay element
				const overlayElement = datePicker.overlay;

				// Retrieves injected instance reference capturing exact positional target
				const overlayTarget = datePicker.el?.nativeElement;

				// Checks if extracted layout elements lack valid references returns early
				if (!overlayElement || !overlayTarget) return;

				// Retrieves extracted style property managing dynamic layout arrangements
				const overlayStyle = overlayElement.style;

				// Updates extracted style constraint assigning explicit layout boundaries
				overlayStyle.minWidth = 'max-content';

				// Destructures required layout object isolating precise coordinate values
				const { left: overlayTargetLeft, width: overlayTargetWidth } =
					overlayTarget.getBoundingClientRect();

				// Destructures rendered overlay node isolating accurate layout dimensions
				const { left: overlayLeft, width: overlayRenderedWidth } =
					overlayElement.getBoundingClientRect();

				// Computes evaluated numerical property assessing exact floating midpoint
				const overlayCenter = overlayLeft + overlayRenderedWidth / 2;

				// Computes calculated coordinate value assessing specific target midpoint
				const overlayTargetCenter = overlayTargetLeft + overlayTargetWidth / 2;

				// Computes exact relational difference generating final positional offset
				const overlayAlignmentOffset = overlayTargetCenter - overlayCenter;

				// Computes inherited style property evaluating accurate layout distancing
				const overlayParsedInset =
					Number.parseFloat(getComputedStyle(overlayElement).insetInlineStart) || 0;

				// Updates extracted style alignment applying corrected layout positioning
				overlayStyle.insetInlineStart = `${overlayParsedInset + overlayAlignmentOffset}px`;
			};

			// Dispatches specified deferred operation preventing sudden layout shifts
			queueMicrotask(scheduleQueueMicrotask);
		};
	}
}
