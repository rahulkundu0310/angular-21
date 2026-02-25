import { isFunction } from 'lodash-es';
import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({ selector: '[titlecase]' })
export class Titlecase {
	// Dependency injections providing direct access to services and injectors
	private readonly elementRef = inject(ElementRef<HTMLInputElement>);

	// Public and private class member variables reflecting state and behavior
	private readonly inputInstance: HTMLInputElement = this.elementRef.nativeElement;

	/**
	 * Intercepts field input to enforce title case formatting, whilst maintaining the cursor position for continuous editing.
	 * Processes the string characters to title case and updates the caret index to account for the output length discrepancy.
	 *
	 * @param event - The input event object containing control context for string normalization through text transformations.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostListener('input', ['$event'])
	public handleFieldInput(event: Event): void {
		// Checks if event is trusted to prevent infinite loops from internal flow
		if (!event.isTrusted) return;

		// Retrieves the latest value from the native input element for processing
		const inputValue = this.inputInstance.value;

		// Transforms the input value into title case for consistent UI formatting
		const titleCaseInputValue = inputValue
			.toLowerCase()
			.replace(/\b\w/g, (match) => match.toUpperCase());

		// Retrieves the selection end index from input element cursor positioning
		const capturedSelectionEnd = this.inputInstance.selectionEnd ?? 0;

		// Retrieves the selection start index from input field cursor positioning
		const capturedSelectionStart = this.inputInstance.selectionStart ?? 0;

		// Calculates length difference caused by formatting for cursor adjustment
		const valueLengthDelta = titleCaseInputValue.length - inputValue.length;

		// Determines new selection end after accounting for format length changes
		const updatedSelectionEnd = capturedSelectionEnd + valueLengthDelta;

		// Determines new cursor state after accounting for transform length delta
		const updatedSelectionStart = capturedSelectionStart + valueLengthDelta;

		// Synchronizes the title-cased text to both input element and field state
		this.synchronizeInputAndFieldState(titleCaseInputValue);

		// Restores cursor index after value transformation for natural input flow
		this.restoreSelectionPosition(updatedSelectionStart, updatedSelectionEnd);
	}

	/**
	 * Restores the shifted caret position by applying the intended selection range on the focused input element after update.
	 * Processes focus and selection state, applying range setter when supported and using selection properties as a fallback.
	 *
	 * @param startPosition - The selection start index defining the cursor beginning point for consistent input highlighting.
	 * @param endPosition - The selection end index defining the endpoint of the text range to complete the current selection.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private restoreSelectionPosition(startPosition: number, endPosition: number): void {
		// Ensures input element has focus vital for cursor positioning operations
		this.inputInstance.focus();

		// Checks if modern setSelectionRange method is available on input element
		if (isFunction(this.inputInstance.setSelectionRange)) {
			// Applies precise selection range using the standard modern browser calls
			this.inputInstance.setSelectionRange(startPosition, endPosition);

			// Returns immediately after the successful compatible API range operation
			return;
		}

		// Checks for legacy browser support using the direct selection properties
		if (this.inputInstance.selectionStart !== null) {
			// Updates the selection final position completing legacy browser fallback
			this.inputInstance.selectionEnd = endPosition;

			// Updates the selection start position completing legacy browser fallback
			this.inputInstance.selectionStart = startPosition;
		}
	}

	/**
	 * Synchronizes formatted text value to the native input and updates the internal model to ensure a consistent form state.
	 * Processes the propagation by setting the input property and emitting a bubbling input event to reconcile form bindings.
	 *
	 * @param value - The title cased string to set on the input element and dispatch via a standard input event to observers.
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
}
