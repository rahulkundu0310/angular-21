import { NgModel } from '@angular/forms';
import type { OnInit } from '@angular/core';
import { isEmptyString } from '@shared/utilities';
import { distinctUntilChanged, skip, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, Directive, HostListener, inject, input, output } from '@angular/core';

@Directive({ selector: '[debounceInput]' })
export class DebounceInput implements OnInit {
	// Dependency injections providing direct access to services and injectors
	private readonly ngModel = inject(NgModel);
	private readonly destroyRef = inject(DestroyRef);

	// Input and output properties reflecting shared state and emitting events
	public readonly debounced = output<string>();
	public readonly trimValue = input<boolean>(true);
	public readonly debounceTime = input<number>(600);

	// Public and private class member variables reflecting state and behavior
	private lastProcessedValue: string | null = null;

	/**
	 * Handles initialization cycle by organizing necessary state structures and applying foundational configuration defaults.
	 * Executes startup actions such as data retrieval, stream subscription, or state configuration for operational readiness.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public ngOnInit(): void {
		this.setupDebouncedValueChanges();
	}

	/**
	 * Establishes a debounced subscription to the form control value changes to manage buffered and distinct input emissions.
	 * Processes the stream by applying skip filters and timing delays to optimize performance before emitting refined values.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private setupDebouncedValueChanges(): void {
		this.ngModel.control.valueChanges
			.pipe(
				skip(1),
				distinctUntilChanged(),
				debounceTime(this.debounceTime()),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe({
				next: (value: string) => {
					// Emits the untrimmed value during typing to preserve user-entered spaces
					this.debounced.emit(value);

					// Stores normalization to get the canonical form of the last posted value
					this.lastProcessedValue = this.normalizeInputValue(value);
				}
			});
	}

	/**
	 * Intercepts blur on the input field to strip leading and trailing spaces while preserving the internal value formatting.
	 * Processes current field text, skips blank values, trims extra spaces, and emits an input event to synchronize bindings.
	 *
	 * @param event - The leave event object containing control context for value trimming through the field blur transitions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostListener('blur', ['$event'])
	public handleFieldBlur(event: FocusEvent): void {
		// Retrieves the latest value from the native input element for processing
		const inputValue = this.ngModel.control.value ?? '';

		// Returns early if the input text is not an empty string for optimization
		if (isEmptyString(inputValue)) return;

		// Processes and emits the pasted value with necessary whitespace trimming
		this.dispatchProcessedValue(inputValue);
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
		// Prevents default paste behavior to perform complex clipboard processing
		event.preventDefault();

		// Retrieves plain text value from clipboard or uses empty string fallback
		const clipboardContent = event.clipboardData?.getData('text/plain') || '';

		// Returns early if the input text is not an empty string for optimization
		if (isEmptyString(clipboardContent)) return;

		// Processes and emits the pasted value with necessary whitespace trimming
		this.dispatchProcessedValue(clipboardContent);
	}

	/**
	 * Dispatches the refined value with optional whitespace trimming and then updates the input control if the value changes.
	 * Processes value to avoid duplicates, sends the final output via the debounced event, and saves it for state validation.
	 *
	 * @param value - The input value string to normalize with selective trimming before updating the control value to output.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private dispatchProcessedValue(value: string): void {
		// Applies normalization to get the canonical form of the user input value
		const processedValue = this.normalizeInputValue(value);

		// Returns early if the processed value matches the previous emitted value
		if (processedValue === this.lastProcessedValue) return;

		// Update the control value only if processing has changed the input value
		if (value !== processedValue) {
			this.ngModel.control.setValue(processedValue, {
				onlySelf: true,
				emitEvent: false
			});
		}

		// Emits the processed value to all the registered output events listeners
		this.debounced.emit(processedValue);

		// Stores the processed value after emission to track duplicate prevention
		this.lastProcessedValue = processedValue;
	}

	/**
	 * Normalizes the input value by applying conditional trimming based upon configurations to ensure consistent value state.
	 * Processes canonical form of the input value for duplicate emission prevention and standardized form control management.
	 *
	 * @param value - The input value string requiring normalization for predictable value handling and form history tracking.
	 * @returns A normalized string value with optional whitespace trimming active based on the directive input configuration.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private normalizeInputValue(value: string): string {
		return this.trimValue() ? value.trim() : value;
	}
}
