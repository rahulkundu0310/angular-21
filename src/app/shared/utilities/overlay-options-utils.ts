import type { Overlay } from 'primeng/overlay';
import type { Nullable } from 'primeng/ts-helpers';
import type { TCallback, TOverlayOptions, IOverlayListenerEvent } from '../types';
import type {
	OverlayOptions,
	OverlayOnHideEvent,
	OverlayOnShowEvent,
	OverlayListenerOptions
} from 'primeng/api';

/**
 * Defines a mapped reference storing specific resize event listeners against internal overlay targets capturing handlers.
 * Processes registered element relationships allowing seamless extraction during teardown phases preventing memory leaks.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const overlayResizeListeners = new WeakMap<HTMLElement, TCallback>();

/**
 * Determines whether a click event occurred outside the overlay by reviewing the target node against measured boundaries.
 * Processes node validation and containment checks against origin and content to prove the click is outside both extents.
 *
 * @param event - The captured mouse event containing the source node and input details used for accurate boundary checks.
 * @param overlayPanel - The overlay panel instance containing origin and content sections used for proving outside click.
 * @returns A boolean indicating whether the trigger occurred outside the panel content for a reliable visibility control.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function isClickedOutsideOverlay(event: Event, overlayPanel: Overlay): boolean {
	// Retrieves the event target validating native node object for processing
	const targetIsNode = event.target instanceof Node;

	// Retrieves current overlay target element ensuring native node structure
	const targetElementIsNode = overlayPanel.targetEl instanceof Node;

	// Retrieves current overlay content element ensuring native node instance
	const contentElementIsNode = overlayPanel.contentEl instanceof Node;

	// Checks if any required element lacks an expected native node definition
	if (!targetIsNode || !targetElementIsNode || !contentElementIsNode) return false;

	// Determines if the click occurred outside of the target element boundary
	const clickOutsideTarget = !overlayPanel.targetEl.contains(event.target as Node);

	// Determines if the click occurred outside of the content object boundary
	const clickOutsideContent = !overlayPanel.contentEl.contains(event.target as Node);

	// Returns true confirming pointer occurs outside target and content nodes
	return clickOutsideTarget && clickOutsideContent;
}

/**
 * Handles overlay listener triggers by mapping input types to the proper panel action for consistent interaction control.
 * Processes structural checks running popup alignment for scroll or resize and hiding targets on outside click detection.
 *
 * @param event - The overlay event object containing input actions and target details required for subsequent operations.
 * @param options - The overlay listener options containing specific rules and core behaviors used to operate the element.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function handleOverlayListener(
	this: Nullable<Overlay>,
	event: IOverlayListenerEvent,
	options?: OverlayListenerOptions
): void {
	// Checks if overlay lacks reference or incomplete options prevent actions
	if (!options || !options.type || !this) return;

	// Evaluates overlay behavior according to the current listener event type
	switch (options.type) {
		// Permits scroll or resize events to realign overlay position dynamically
		case 'scroll':
		case 'resize':
			this.alignOverlay();
			break;

		// Permits outside click events to hide the overlay visibility immediately
		case 'outside':
			if (isClickedOutsideOverlay(event, this)) this.hide();
			break;

		// No operations are performed for unsupported or unrecognized input types
		default:
			break;
	}
}

/**
 * Handles overlay show event by setting up initial bounds and minimum constraints to match the target element dimensions.
 * Processes window resize listener to dynamically recalculate layout boundaries and scaling limits when viewport changes.
 *
 * @param event - The overlay event object containing target and panel instances required for dynamic metrics calculation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function handleOverlayShow(event?: OverlayOnShowEvent): void {
	// Retrieves overlay target element ensuring verified native node instance
	const overlayTarget = event?.target as HTMLElement;

	// Retrieves overlay layout element ensuring verified native node instance
	const overlayElement = event?.overlay as HTMLElement;

	// Checks if necessary elements lack required references and returns early
	if (!overlayElement || !overlayTarget) return;

	// Defines layout alignment operations computing exact physical dimensions
	const updateOverlayWidths = () => {
		// Retrieves initial overlay element width preserving exact style property
		const initialOverlayWidth = overlayElement.style.width;

		// Retrieves initial overlay minimum width preserving exact style property
		const initialOverlayMinWidth = overlayElement.style.minWidth;

		// Updates overlay minimum width temporarily measuring exact natural sizes
		overlayElement.style.minWidth = '0px';

		// Updates overlay element width temporarily measuring unconstrained sizes
		overlayElement.style.width = 'max-content';

		// Retrieves overlay computed content width evaluating internal dimensions
		const overlayContentWidth = overlayElement.scrollWidth;

		// Restores captured overlay width preventing permanent structural updates
		overlayElement.style.width = initialOverlayWidth || 'max-content';

		// Retrieves exact overlay anchor pixel width maintaining rendering bounds
		const overlayTargetWidth = overlayTarget.getBoundingClientRect().width;

		// Checks if specific custom minimum width property exists returning early
		if (!!initialOverlayMinWidth && initialOverlayMinWidth !== '0px') return;

		// Retrieves computed visual rendering behavior discovering element layout
		const overlayTargetDisplay = window.getComputedStyle(overlayTarget).display;

		// Add inline comment start with - Determines or somehting better relevant
		const hasBlockLevelLayout = ['block', 'flex', 'grid'].includes(overlayTargetDisplay);

		// Determines maximum content sizing requirement analyzing measured bounds
		const requiresMaxContent = overlayTargetWidth < overlayContentWidth || hasBlockLevelLayout;

		// Checks if overlay requires maximum bounds assigning exact layout widths
		if (requiresMaxContent) overlayElement.style.minWidth = 'max-content';
		else overlayElement.style.minWidth = `${overlayTargetWidth}px`;
	};

	// Defers layout alignment rendering updates to prevent content flickering
	requestAnimationFrame(() => updateOverlayWidths());

	// Defines window resize observer intercepting outside structure mutations
	const resizeObserver = new ResizeObserver(() => {
		requestAnimationFrame(() => updateOverlayWidths());
	});

	// Observes tracked sizing target element triggering structural alignments
	resizeObserver.observe(overlayTarget);

	// Stores event tracking references preserving correct teardown procedures
	overlayResizeListeners.set(overlayElement, () => resizeObserver.disconnect());
}

/**
 * Handles overlay hide event by removing the registered resize listener and cleaning up references to avoid memory leaks.
 * Processes cleanup phases to remove cached sizing handler and delete the managed targets from the internal tracking map.
 *
 * @param event - The overlay event object containing the managed target references required for proper memory management.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function handleOverlayHide(event?: OverlayOnHideEvent): void {
	// Retrieves the overlay element from the overlay hide events if available
	const overlayElement = event?.overlay as HTMLElement;

	// Checks if the overlay element is missing or untracked and returns early
	if (!overlayElement || !overlayResizeListeners.has(overlayElement)) return;

	// Retrieves associated disconnect callback targeting this overlay element
	const disconnectObserver = overlayResizeListeners.get(overlayElement);

	// Checks if the disconnect callback exists preventing hidden memory leaks
	if (disconnectObserver) disconnectObserver();

	// Removes the overlay element from the registered resize listener mapping
	overlayResizeListeners.delete(overlayElement);
}

/**
 * Resolves overlay options by merging defaults with custom settings into one consistent configuration object for layouts.
 * Processes default and custom values and attaches element visibility and event listeners to keep interface state stable.
 *
 * @param overlayOptions - The overlay options object containing values to combine with defaults and bound event handlers.
 * @returns A merged overlay options object integrating default properties with custom overrides for predictable behavior.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolveOverlayOptions(overlayOptions: OverlayOptions = {}): OverlayOptions {
	// Defines default overlay configuration options for the layout structures
	const defaultOptions: TOverlayOptions = {
		mode: 'overlay',
		autoZIndex: true,
		target: '@parent',
		hideOnEscape: true,
		motionOptions: {
			type: 'animation',
			enterClass: { active: 'slide-in-up' },
			leaveClass: { active: 'slide-out-down' }
		}
	};

	// Returns merged defaults and custom options appending required listeners
	return {
		...defaultOptions,
		...overlayOptions,
		onHide: handleOverlayHide,
		onShow: handleOverlayShow,
		listener: handleOverlayListener
	};
}
