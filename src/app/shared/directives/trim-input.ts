import { isEmptyString } from '@shared/utilities';
import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({ selector: '[trimInput]' })
export class TrimInput {
	// Dependency injections providing direct access to services and injectors
	private readonly elementRef = inject(ElementRef<HTMLInputElement>);

	// Public and private class member variables reflecting state and behavior
	private capturedInputType = '';
	private capturedInputValue = '';
	private capturedSelectionEnd = 0;
	private capturedSelectionStart = 0;
	private readonly inputInstance: HTMLInputElement = this.elementRef.nativeElement;

	/**
	 * Intercepts blur on the input field to strip leading and trailing spaces while preserving the internal value formatting.
	 * Processes current field text, skips blank values, trims extra spaces, and emits an input event to synchronize bindings.
	 *
	 * @param event - The focus event object containing control context for value trimming through the field blur transitions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostListener('blur', ['$event'])
	public handleFieldBlur(event: FocusEvent): void {
		// Retrieves the latest value from the native input element for processing
		const inputValue = this.inputInstance.value;

		// Returns early if the input text is not an empty string for optimization
		if (isEmptyString(inputValue)) return;

		// Trims extra whitespace from the current input value before further uses
		const trimmedInputValue = inputValue.trim();

		// Synchronizes the trimmed value to both input element and internal state
		this.synchronizeInputAndFieldState(trimmedInputValue);
	}

	/**
	 * Intercepts paste on the input field to insert trimmed clipboard text at the caret preserving whitespace within content.
	 * Processes clipboard text, captures value and selection, stops paste, inserts trimmed text and restores cursor position.
	 *
	 * @param event - The paste event object containing control context for new text insertion through clipboard interactions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostListener('paste', ['$event'])
	public handleFieldPaste(event: ClipboardEvent): void {
		// Retrieves the plain text string from clipboard safely for insertion use
		const clipboardContent = event.clipboardData?.getData('text') ?? '';

		// Returns early if no text was actually copied or stored in the clipboard
		if (isEmptyString(clipboardContent)) return;

		// Retrieves the current type property of the active input element for use
		this.capturedInputType = this.inputInstance.type;

		// Retrieves the current value from the target input element for reference
		this.capturedInputValue = this.inputInstance.value;

		// Retrieves the selection end index from input element cursor positioning
		this.capturedSelectionEnd = this.inputInstance.selectionEnd ?? 0;

		// Retrieves the selection start index from input field cursor positioning
		this.capturedSelectionStart = this.inputInstance.selectionStart ?? 0;

		// Prevents default paste event to handle insertion manually with trimming
		event.preventDefault();

		// Stops the paste event from propagating to avoid unexpected side effects
		event.stopPropagation();

		// Inserts the trimmed clipboard text at the current cursor point in input
		this.handleTrimmedTextInsertion(clipboardContent);
	}

	/**
	 * Handles trimmed content insertion at the caret position by rebuilding the full value while preserving existing content.
	 * Processes clipboard item by trimming margins, merging with data around the selection, and restoring the caret position.
	 *
	 * @param content - The trimmed string inserted at the cursor to construct the content while preserving selection anchors.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private handleTrimmedTextInsertion(content: string): void {
		// Trims any surrounding spaces from the given insertion text string value
		const trimmedContent = content.trim();

		// Checks whether the current input type lacks text selection capabilities
		if (!this.hasTextSelectionCapability) {
			// Resets the selection start index to beginning for full text replacement
			this.capturedSelectionStart = 0;

			// Resets the selection end index to text length for full text replacement
			this.capturedSelectionEnd = this.capturedInputValue.length;
		}

		// Retrieves the portion of text present after the current cursor position
		const contentAfterCursor = this.capturedInputValue.slice(this.capturedSelectionEnd);

		// Retrieves the portion of text present before the current caret position
		const contentBeforeCursor = this.capturedInputValue.slice(0, this.capturedSelectionStart);

		// Builds the final string after inserting trimmed text at cursor position
		const newInputValueAfterInsertion =
			contentBeforeCursor + trimmedContent + contentAfterCursor;

		// Determines the new cursor offset after text has been inserted correctly
		const newCursorPosition = this.capturedSelectionStart + trimmedContent.length;

		// Updates the input element value and resets cursor to the final position
		this.updateValueAndCursorPosition(newInputValueAfterInsertion, newCursorPosition);
	}

	/**
	 * Updates the input element with the trimmed value and restores the cursor position while preserving the editing context.
	 * Synchronizes the native element and bound control state, by assigning the trimmed string and resetting selection range.
	 *
	 * @param value - The trimmed string used to update the element value, and dispatch a safe input event for bound controls.
	 * @param offset - The cursor offset used to restore the caret location after the trimmed value is applied to the element.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private updateValueAndCursorPosition(value: string, offset: number): void {
		// Synchronizes the new value to both input element and field state layers
		this.synchronizeInputAndFieldState(value);

		// Checks whether input type supports text selection to restore the cursor
		if (this.hasTextSelectionCapability) {
			this.inputInstance.setSelectionRange(offset, offset);
		}
	}

	/**
	 * Synchronizes trimmed text value to the native input and validates the internal model to ensure a consistent form state.
	 * Processes the propagation by setting the input property and emitting a bubbling input event to reconcile form bindings.
	 *
	 * @param value - The trimmed string to set on the input element and dispatch through a standard input event to observers.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private synchronizeInputAndFieldState(value: string): void {
		// Updates the input elements value to synchronized string for consistency
		this.inputInstance.value = value;

		// Dispatches event to notify attached form bindings of the modified value
		this.inputInstance.dispatchEvent(new Event('input', { bubbles: true }));
	}

	/**
	 * Provides validation to determine whether the current element supports text selection and cursor positioning attributes.
	 * Processes the input type validation against supported inputs to ensure text selection methods can be applied correctly.
	 *
	 * @returns A boolean indicating whether the target supports text selection appropriate for cursor positioning operations.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private get hasTextSelectionCapability(): boolean {
		// Defines list of allowed input element types for applying cursor updates
		const supportedInputTypes = ['text', 'password', 'search', 'tel', 'url'];

		// Returns true if captured input type is included in supported operations
		return supportedInputTypes.includes(this.capturedInputType);
	}
}
