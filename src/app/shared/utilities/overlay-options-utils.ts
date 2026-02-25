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
 * A WeakMap storing resize event listeners for overlay elements to track window resize callbacks and prevent memory leak.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const overlayResizeListeners = new WeakMap<HTMLElement, TCallback>();

/**
 * Determines whether a click event occurred outside any overlay by checking the event target against overlay UI elements.
 * Processes node validation and containment checks against target and content to prove the click is outside both regions.
 *
 * @param event - The mouse click event object containing the target node and full event data used for boundary detection.
 * @param overlayPanel - The overlay panel instance containing target and content elements used to evaluate outside click.
 * @returns A boolean indicating whether the click occurred outside the overlay content for consistent visibility control.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function isClickedOutsideOverlay(event: Event, overlayPanel: Overlay): boolean {
	// Retrieves the event target which is a valid DOM Node for processing raw
	const targetIsNode = event.target instanceof Node;

	// Retrieves the overlay's target element ensuring valid DOM Node instance
	const targetElementIsNode = overlayPanel.targetEl instanceof Node;

	// Retrieves the overlay's content element as a verified DOM Node instance
	const contentElementIsNode = overlayPanel.contentEl instanceof Node;

	// Returns early if any required element is not a verified DOM Node object
	if (!targetIsNode || !targetElementIsNode || !contentElementIsNode) return false;

	// Determines if the click occurred outside of the target element boundary
	const clickOutsideTarget = !overlayPanel.targetEl.contains(event.target as Node);

	// Determines if the click occurred outside of the content object boundary
	const clickOutsideContent = !overlayPanel.contentEl.contains(event.target as Node);

	// Returns true only if the click is outside both target and content areas
	return clickOutsideTarget && clickOutsideContent;
}

/**
 * Handles overlay listener events by routing event types to the proper overlay action for consistent interaction control.
 * Processes event type checks running overlay alignment for scroll, resize and hiding overlay on outside-click detection.
 *
 * @param event - The overlay listener event object containing input event and target details required for event handling.
 * @param options - The overlay listener options containing specific event settings and behaviors used to control overlay.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function handleOverlayListener(
	this: Nullable<Overlay>,
	event: IOverlayListenerEvent,
	options?: OverlayListenerOptions
): void {
	// Returns early if options are missing, type not set or no overlay exists
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
 * Handles overlay show event by setting up overlay width and minimum width to match the actual target element dimensions.
 * Processes resize listener set up to dynamically adjust overlay widths and minimum width when the window sizing changes.
 *
 * @param event - The overlay event object containing target and overlay elements required for dynamic widths calculation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function handleOverlayShow(event?: OverlayOnShowEvent): void {
	// Retrieves the target element that triggered the overlay to be displayed
	const overlayTarget = event?.target as HTMLElement;

	// Retrieves the actual overlay element from the event object if it exists
	const overlayElement = event?.overlay as HTMLElement;

	// Returns early if either overlay element or target element was undefined
	if (!overlayElement || !overlayTarget) return;

	// Defines a function to update overlay widths to match the targets widths
	const updateOverlayWidths = () => {
		// Retrieves the overlay element width property to verify if it is defined
		const existingWidth = overlayElement.style.width;

		// Retrieves the overlay minWidth property to validate that it was defined
		const existingMinWidth = overlayElement.style.minWidth;

		// Retrieves the current width of the overlays target element using pixels
		const overlayTargetWidth = overlayTarget.offsetWidth;

		// Sets the overlay width to existing value or max-content if none present
		if (!existingWidth) overlayElement.style.width = 'max-content';

		// Sets minimum width based on existing minWidth or target if none present
		if (!existingMinWidth) overlayElement.style.minWidth = `${overlayTargetWidth}px`;
	};

	// Sets correct overlay width immediately prior to displaying the elements
	updateOverlayWidths();

	// Defines a resize listener that recalculates overlay width when resizing
	const resizeListener = () => updateOverlayWidths();

	// Stores the resize listener in a map for later cleanup during hide event
	overlayResizeListeners.set(overlayElement, resizeListener);

	// Registers a window resize listener to dynamically adjust overlay widths
	window.addEventListener('resize', resizeListener);
}

/**
 * Handles overlay hide event by removing the registered resize listener and cleaning up references to avoid memory leaks.
 * Processes cleanup logic to remove window resize listener and delete the overlay element from the internal tracking map.
 *
 * @param event - The overlay event object containing the overlay element reference required for listener cleanup actions.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function handleOverlayHide(event?: OverlayOnHideEvent): void {
	// Retrieves the overlay element from the overlay hide events if available
	const overlayElement = event?.overlay as HTMLElement;

	// Returns early if element is missing or not recorded in resize listeners
	if (!overlayElement || !overlayResizeListeners.has(overlayElement)) return;

	// Retrieves the associated resize listener for the active overlay element
	const resizeListener = overlayResizeListeners.get(overlayElement);

	// Removes the resize event listener from the window to avoid memory leaks
	window.removeEventListener('resize', resizeListener!);

	// Removes the overlay element from the registered resize listener mapping
	overlayResizeListeners.delete(overlayElement);
}

/**
 * Resolves overlay options by merging defaults with custom settings into one consistent configuration object for overlay.
 * Processes default and custom values and attaches show, hide, and listener handlers to keep overlay behavior consistent.
 *
 * @param overlayOptions - The overlay options object containing values to merge with defaults and overlay event handlers.
 * @returns A merged overlay options object with defaults, client overrides, and handlers applied for consistent behavior.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolveOverlayOptions(overlayOptions: OverlayOptions = {}): OverlayOptions {
	// Defines the default overlay configuration options for all UI components
	const defaultOptions: TOverlayOptions = {
		mode: 'overlay',
		autoZIndex: true,
		target: '@parent',
		hideOnEscape: true
	};

	// Combines defaults and custom options adding all required event handlers
	return {
		...defaultOptions,
		...overlayOptions,
		onHide: handleOverlayHide,
		onShow: handleOverlayShow,
		listener: handleOverlayListener
	};
}
