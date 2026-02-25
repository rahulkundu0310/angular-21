import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import {
	size,
	split,
	replace,
	isEmpty,
	toNumber,
	isRegExp,
	includes,
	defaultTo,
	startsWith,
	isFunction,
	isUndefined,
	escapeRegExp
} from 'lodash-es';

@Directive({ selector: '[digitOnly]' })
export class DigitOnly {
	// Dependency injections providing direct access to services and injectors
	private readonly elementRef = inject(ElementRef<HTMLInputElement>);

	// Input and output properties reflecting shared state and emitting events
	public readonly decimal = input<boolean>(true);
	public readonly allowKeys = input<string[]>([]);
	public readonly allowPaste = input<boolean>(true);
	public readonly isCurrency = input<boolean>(false);
	public readonly negativeSign = input<string>('-');
	public readonly allowNegatives = input<boolean>(false);
	public readonly decimalSeparator = input<string>('.');
	public readonly allowMultipleDecimals = input<boolean>(false);
	public readonly min = input<number, number>(-Infinity, {
		transform: (value) => defaultTo(toNumber(value), -Infinity)
	});
	public readonly max = input<number, number>(Infinity, {
		transform: (value) => defaultTo(toNumber(value), -Infinity)
	});
	public readonly pattern = input<RegExp | null, string | RegExp>(null, {
		transform: (value) => (!value ? null : isRegExp(value) ? value : new RegExp(value))
	});

	// Public and private class member variables reflecting state and behavior
	private hasDecimalPointInInput = false;
	private hasNegativeSignInInput = false;
	private readonly currencyRegex: RegExp = /[$₹., ]/;
	private readonly keyboardShortcuts: string[] = ['a', 'c', 'v', 'x'];
	private readonly inputInstance: HTMLInputElement = this.elementRef.nativeElement;
	private readonly navigationKeys: string[] = [
		'Tab',
		'End',
		'Home',
		'Copy',
		'Enter',
		'Clear',
		'Paste',
		'Escape',
		'Delete',
		'Backspace',
		'ArrowLeft',
		'ArrowRight'
	];

	/**
	 * Intercepts beforeinput on the input field to validate pending values and blocks invalid inputs using precise filtering.
	 * Validates prospective characters against digit constraints and allowed lists to prevent unauthorized content insertion.
	 *
	 * @param event - The beforeinput event object containing control context for character validation through input checking.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostListener('beforeinput', ['$event'])
	public handleBeforeInput(event: InputEvent): void {
		// Extracts character being inserted from the input event or as nil string
		const inputCharacter = event.data ?? '';

		// Determines if the character being inserted qualifies as a numeric digit
		const isValidDigit = !isNaN(Number(inputCharacter)) && inputCharacter !== '';

		// Permits the input to continue only if the inserted character is a digit
		if (isValidDigit) return;

		// Verifies whether the inserted character exists in the allowed keys list
		const isCustomAllowedKey = includes(this.allowKeys(), inputCharacter);

		// Determines if the inserted is a negative sign and negatives are allowed
		const isNegativeSign = inputCharacter === this.negativeSign() && this.allowNegatives();

		// Determines if the character is a decimal separator and decimals allowed
		const isDecimalSeparator = inputCharacter === this.decimalSeparator() && this.decimal();

		// Checks the input character is allowed based on custom and special rules
		const isAllowedSpecialChar = isCustomAllowedKey || isDecimalSeparator || isNegativeSign;

		// Allows input to continue if character passes all permitted checks above
		if (isAllowedSpecialChar) return;

		// Prevents the input and stop event propagation for disallowed characters
		event.preventDefault();
		event.stopPropagation();
	}

	/**
	 * Intercepts keydown on the input field to validate character entry and blocks invalid keys using configured constraints.
	 * Evaluates keystrokes against numeric patterns, enforcing min/max limits and defined format rules to ensure valid input.
	 *
	 * @param event - The keydown event object containing control context for character validation through direct key actions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostListener('keydown', ['$event'])
	public handleFieldKeyDown(event: KeyboardEvent): void {
		// Checks if a control or command key is press keyboard shortcut detection
		const isModifierPressed = event.ctrlKey || event.metaKey;

		// Combines navigation keys plus user-defined keys for validation purposes
		const combinedAllowedKeys = [...this.navigationKeys, ...this.allowKeys()];

		// Determines if the current key press matches a defined keyboard shortcut
		const isKeyboardShortcut =
			isModifierPressed && includes(this.keyboardShortcuts, event.key.toLowerCase());

		// Checks if the key is allowed or a valid shortcut within the input field
		if (includes(combinedAllowedKeys, event.key) || isKeyboardShortcut) return;

		// Initializes a variable to hold the forecast value after a key insertion
		let predictedValue = '';

		// Checks for decimal key press when decimals are permitted for this input
		if (this.decimal() && event.key === this.decimalSeparator()) {
			// Checks if multiple decimals are allowed marks presence and allows input
			if (this.allowMultipleDecimals()) {
				this.hasDecimalPointInInput = true;
				return;
			}

			// Predict the new value after inserting the decimal at the current cursor
			predictedValue = this.calculatePredictedValue(event.key);

			// Counts the number of decimal separators present in that predicted value
			const decimalCount = size(split(predictedValue, this.decimalSeparator())) - 1;

			// Prevents input if more than one decimal is found in the predicted value
			if (decimalCount > 1) {
				event.preventDefault();
				return;
			}

			// Updates decimal presence tracking based upon the calculated input value
			this.hasDecimalPointInInput = includes(predictedValue, this.decimalSeparator());

			// Returns early to permit the valid decimal key press skipping any checks
			return;
		}

		// Checks minus sign key presses when negatives are allowed for this input
		if (event.key === this.negativeSign() && this.allowNegatives()) {
			// Predicts the new value after inserting the minus sign at current cursor
			predictedValue = this.calculatePredictedValue(event.key);

			// Determines if the updated value starts correctly with the negative sign
			const isNegativeAtStart = startsWith(predictedValue, this.negativeSign());

			// Calculates the number of negative signs present in the predicted result
			const negativeSignCount = size(split(predictedValue, this.negativeSign())) - 1;

			// Prevents input if negative sign is not at start or multiple are present
			if (!isNegativeAtStart || negativeSignCount > 1) {
				event.preventDefault();
				return;
			}

			// Updates minus sign presence tracking based on the predicted input value
			this.hasNegativeSignInInput = includes(predictedValue, this.negativeSign());

			// Returns early to allow valid negative sign skipping subsequent checking
			return;
		}

		// Checks if the inputted key is a single character for further validation
		const isSingleCharacter = event.key.length === 1;

		// Determines if a single character key is non-numeric for input restraint
		const isNonNumericSingleChar = isNaN(Number(event.key)) && isSingleCharacter;

		// Checks for input of spaces or non-numeric characters in the input field
		if (event.key === ' ' || isNonNumericSingleChar) {
			event.preventDefault();
			return;
		}

		// Predicts input value if not already set by decimal or negative handling
		predictedValue = predictedValue || this.calculatePredictedValue(event.key);

		// Checks if the predicted value violates the compiled input pattern rules
		if (this.pattern() && !this.pattern()?.test(predictedValue)) {
			event.preventDefault();
			return;
		}

		// Converts the predicted string to a numeric value for min/max validation
		const numericValue = this.parseNumericValue(predictedValue);

		// Checks if numeric value exceeds defined min or max limit for this field
		if (numericValue > this.max() || numericValue < this.min()) event.preventDefault();
	}

	/**
	 * Intercepts paste on the input field to capture clipboard data and blocks native defaults for controlled text insertion.
	 * Processes clipboard strings, sanitizes the pasted content, and prevents invalid insertions to maintain field integrity.
	 *
	 * @param event - The paste event object containing control context for payload extraction through clipboard transactions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostListener('paste', ['$event'])
	public handleFieldPaste(event: ClipboardEvent): void {
		// Determines if pasting is currently disabled for the input element field
		const isPastingDisabled = !this.allowPaste();

		// Checks if paste is disabled for the input and stops action and bubbling
		if (isPastingDisabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		// Initializes a variable to hold the content retrieved from the clipboard
		let clipboardContent: string = '';

		// Retrieves the browser supports modern clipboardData for pasting content
		const isModernBrowser = event.clipboardData?.getData;

		// Verifies the browser supports modern clipboardData API for pasting text
		const isLegacyBrowser = window.clipboardData?.getData;

		// Checks legacy and modern APIs to retrieve plain text from the clipboard
		if (isLegacyBrowser) clipboardContent = window.clipboardData?.getData('text') ?? '';
		else if (isModernBrowser) clipboardContent = event.clipboardData.getData('text/plain');

		// Prevents default paste behavior and handles sanitized clipboard content
		event.preventDefault();

		// Processes and inserts the sanitized clipboard text into the input field
		this.processClipboardContent(clipboardContent.trim());
	}

	/**
	 * Intercepts drop on the input field to extract transferred text string while suppressing native browser default actions.
	 * Processes external strings, sanitizes the transferred content, and resets the focus ensuring seamless user interaction.
	 *
	 * @param event - The drop event object containing control context for string extraction through standard drag operations.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostListener('drop', ['$event'])
	public handleFieldDrop(event: DragEvent): void {
		// Retrieves the text value from the drag event for proper input insertion
		const droppedContent = event.dataTransfer?.getData('text') ?? '';

		// Processes and inserts the sanitized dropped string into the input field
		this.processClipboardContent(droppedContent.trim());

		// Restores focus to the input element to maintain proper user interaction
		this.inputInstance.focus();

		// Prevents the browser default behavior for drop to handle safe insertion
		event.preventDefault();
	}

	/**
	 * Processes clipboard entries by sanitizing content and executing injections using native tools with a standard fallback.
	 * Handles negative sign verification and validates the insertion flow to ensure correct value placement into the element.
	 *
	 * @param content - The pasted characters to normalize and inject into the target node for synchronous value modification.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private processClipboardContent(textContent: string): void {
		// Retrieves the currently chosen text from the input field for processing
		const currentSelection = this.currentSelection;

		// Sanitizes the pasted input data to remove invalid characters or symbols
		const cleanedContent = this.sanitizeTextInput(textContent);

		// Determines if the input area already contains a negative sign currently
		const hasExistingNegativeSign = this.hasNegativeSignInInput;

		// Determines if the cleaned input data includes a negative sign character
		const contentHasNegativeSign = includes(cleanedContent, this.negativeSign());

		// Determines if the existing selection includes a negative sign character
		const selectionContainsNegativeSign = includes(currentSelection, this.negativeSign());

		// Checks if negative sign already exists and not selected for replacement
		if (hasExistingNegativeSign && contentHasNegativeSign && !selectionContainsNegativeSign)
			return;

		// Attempts to insert the sanitized data using the browser execCommand API
		const wasInsertedSuccessfully =
			document.execCommand && document.execCommand('insertText', false, cleanedContent);

		// Checks if execCommand failed to insert the value into the input element
		if (!wasInsertedSuccessfully) {
			// Determines if the input supports the setRangeText method for injections
			const supportsSetRangeText = isFunction(this.inputInstance.setRangeText);

			// Prevents the browser default behavior for drop to handle safe insertion
			// Check support for setRangeText to insert content into the input element
			if (supportsSetRangeText) {
				// Retrieves the current selection start and end points of the input field
				const { selectionStart: start, selectionEnd: end } = this.inputInstance;

				// Replaces the selection with the cleaned content and moves cursor to end
				this.inputInstance.setRangeText(cleanedContent, start ?? 0, end ?? 0, 'end');

				// Checks for Firefox to dispatch event ensuring Angular detects the value
				if (!isUndefined(window.InstallTrigger))
					this.inputInstance.dispatchEvent(new Event('input', { cancelable: true }));
			} else {
				// Falls back to manual cursor insertion when modern text APIs are missing
				this.insertTextAtCursorPosition(this.inputInstance, cleanedContent);
			}
		}

		// Checks for decimal separator existence to update hasDecimalPointInInput
		if (this.decimal()) {
			// Aligns internal decimal tracking with the last pasted text in the input
			this.hasDecimalPointInInput = includes(
				this.inputInstance.value,
				this.decimalSeparator()
			);
		}
	}

	/**
	 * Inserts the provided text content at the current cursor position by splitting and reconstructing the input field value.
	 * Handles value concatenation and restores the cursor placement to ensure seamless text addition maintaining input focus.
	 *
	 * @param element - The HTML input element reference receiving the value injection for synchronous DOM node modifications.
	 * @param content - The textual content to be inserted at the current cursor coordinate for the value injection operation.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private insertTextAtCursorPosition(element: HTMLInputElement, content: string): void {
		// Retrieves the current value from the input field for handling insertion
		const currentValue = element.value;

		// Determines the end index of the cursor within the current input element
		const cursorEndPosition = element.selectionEnd ?? 0;

		// Determines the start index of the cursor within the current input field
		const cursorStartPosition = element.selectionStart ?? 0;

		// Extracts the part of text that exists after the current cursor position
		const textAfterCursor = currentValue.substring(cursorEndPosition);

		// Extracts the portion of text that is before the current cursor position
		const textBeforeCursor = currentValue.substring(0, cursorStartPosition);

		// Concatenates the text before the new text and the text after the cursor
		element.value = textBeforeCursor + content + textAfterCursor;

		// Calculates the new cursor index after inserting the new text into input
		const newCursorPosition = cursorStartPosition + content.length;

		// Sets focus on the input field to ensure cursor is active for user input
		element.focus();

		// Triggers input event to notify Angular or other listeners of the change
		this.dispatchInputEvent(element);

		// Updates the cursor position to instantly follow the newly inserted text
		element.setSelectionRange(newCursorPosition, newCursorPosition);
	}

	/**
	 * Sanitizes the provided raw text by stripping disallowed characters and truncating to fit within the full length bounds.
	 * Processes pattern construction based on decimal settings and applies character validation logic to the current content.
	 *
	 * @param source - The input content to be sanitized by filtering invalid characters and validating against length limits.
	 * @returns A processed string with invalid characters removed and trimmed to satisfy the defined data length constraints.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private sanitizeTextInput(source: string): string {
		// Constructs a regex pattern string containing currently valid input keys
		const allowedKeysPattern = this.allowedKeysPattern;

		// Constructs a regex to manage negative sign insertion in the input field
		const negativeSignPattern = this.negativeSignPattern;

		// Initialzes a variable to hold the regex that filters invalid characters
		let filterRegex: RegExp | undefined;

		// Determines if the current input value is valid as decimal number format
		const isValidDecimalInput = this.validateDecimalInput(source);

		// Checks to build regex for cleaning characters when decimals are invalid
		if (!this.decimal() || !isValidDecimalInput) {
			filterRegex = new RegExp(`${negativeSignPattern}[^0-9${allowedKeysPattern}]`, 'g');
		} else {
			// Escapes the decimal separator so it can securely be used inside a regex
			const escapedDecimalSeparator = escapeRegExp(this.decimalSeparator());

			// Builds regex to allow digits, decimal, negative signs, and allowed keys
			filterRegex = new RegExp(
				`${negativeSignPattern}[^0-9${escapedDecimalSeparator}${allowedKeysPattern}]`,
				'g'
			);
		}

		// Initializes the value by cleaning content not matching the regex safely
		const sanitizedResult = replace(source, filterRegex, '');

		// Retrieves the maximum length of characters allowed for this input field
		const maxInputLength = this.inputInstance.maxLength;

		// Checks if max length is specified before truncating the sanitized value
		if (maxInputLength <= 0) return sanitizedResult;

		// Retrieves the current length of the value input element for calculation
		const currentInputLength = this.inputInstance.value.length;

		// Adjusts the available size if a minus sign exists in the sanitized text
		const negativeSignAdjustment = includes(sanitizedResult, this.negativeSign()) ? 1 : 0;

		// Calculates the number of characters that can be added to an input field
		const availableLength = maxInputLength - currentInputLength + negativeSignAdjustment;

		// Returns the sanitized value to the limit or return empty string if zero
		return availableLength > 0 ? sanitizedResult.substring(0, availableLength) : '';
	}

	/**
	 * Validates decimal entry by checking separator count and allowing replacement when selection range includes a separator.
	 * Processes multi-decimal setting, counts separators in target value, and uses selection state to accept or reject input.
	 *
	 * @param value - The string value to assess for decimal rules including separator use and selection replacement behavior.
	 * @returns A boolean indicating whether the value follows decimal rules based on separator count and the selection state.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private validateDecimalInput(value: string): boolean {
		// Determines if multiple decimal points are allowed for this form element
		const allowsMultipleDecimals = this.allowMultipleDecimals();

		// Returns early if multiple decimals are allowed as any input is consider
		if (allowsMultipleDecimals) return true;

		// Retrieves the portion of text currently chosen inside the input element
		const selectedText = this.currentSelection;

		// Retrieves the configured decimal separator for this current input value
		const decimalSeparator = this.decimalSeparator();

		// Splits the input value using the decimal separator for counting purpose
		const splitInputValue = split(value, decimalSeparator);

		// Calculates the total number of decimal points found in the input string
		const numberOfDecimalOccurrences = size(splitInputValue) - 1;

		// Checks if the input does not yet contain a decimal point for validation
		if (!this.hasDecimalPointInInput) return numberOfDecimalOccurrences <= 1;

		// Checks if the selected text already contains a decimal separator symbol
		const selectionContainsDecimal = includes(selectedText, decimalSeparator);

		// Checks if range has decimal to allow input or ensures no decimal exists
		if (selectionContainsDecimal) return numberOfDecimalOccurrences <= 1;
		else return !includes(value, decimalSeparator);
	}

	/**
	 * Parses a text string into a number by stripping currency symbols and commas, returning a zero on invalid text sequence.
	 * Processes currency formatting by removing the starting symbol and commas, and converts the resulting value to a number.
	 *
	 * @param value - Text value to convert; might include currency signs or commas that should be removed for currency field.
	 * @returns A number containing the computed value, with currency symbols and commas removed when currency mode is active.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private parseNumericValue(value: string): number {
		// Checks if not a currency field parses input directly to a number safely
		if (!this.isCurrency()) return Number(value) || 0;

		// Checks whether the input string contains currency formatting characters
		const hasCurrencyFormat = this.currencyRegex.test(value);

		// Returns a direct number conversion if no currency formatting is present
		if (!hasCurrencyFormat) return Number(value) || 0;

		// Removes the leading currency symbol from the input string before checks
		const withoutCurrencySymbol = value.substring(1);

		// Removes all comma characters from the numeric string for proper parsing
		const withoutCommas = replace(withoutCurrencySymbol, /,/g, '');

		// Returns the scrubbed string cast to a number defaulting to 0 if invalid
		return Number(withoutCommas) || 0;
	}

	/**
	 * Provides the currently highlighted text segment from the focused input element to support accurate selection retrieval.
	 * Processes cursor boundaries and extracts the core substring to ensure the returned value reflects the user interaction.
	 *
	 * @returns A string containing the text portion currently highlighted within the input element bounds of the target node.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private get currentSelection(): string {
		// Retrieves the current cursor positions from the input element correctly
		const { selectionStart, selectionEnd } = this.inputInstance;

		// Returns the substring currently selected by the user in the input field
		return this.inputInstance.value.substring(selectionStart ?? 0, selectionEnd ?? 0);
	}

	/**
	 * Estimates the pending input value by predicting the outcome of inserting the new string at the current cursor position.
	 * Determines text replacement for active selections or performs cursor insertion to generate the forecasted text content.
	 *
	 * @param insertion - The incoming characters to be inserted at the current cursor position for estimation recalculations.
	 * @returns A calculated string containing the anticipated input value produced after the text insertion action completes.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private calculatePredictedValue(insertion: string): string {
		// Retrieves the current value in the input tag for prediction calculation
		const inputValue = this.inputInstance.value;

		// Retrieves the start and end points of the cursor within the input field
		const { selectionStart, selectionEnd } = this.inputInstance;

		// Retrieves the text currently highlighted or selected inside input field
		const selectedText = inputValue.substring(selectionStart ?? 0, selectionEnd ?? 0);

		// Checks if the currently selected text is replaced and return the result
		if (!isEmpty(selectedText)) return replace(inputValue, selectedText, insertion);

		// Extracts the substring of the input found after current cursor position
		const textBeforeCursor = inputValue.substring(selectionStart ?? 0);

		// Extracts the substring of the input before the current pointer position
		const textAfterCursor = inputValue.substring(0, selectionStart ?? 0);

		// Returns the text merged before the cursor with the key and the end text
		return textAfterCursor + insertion + textBeforeCursor;
	}

	/**
	 * Provides a regex-safe string pattern from the permitted keys configuration to enable precise input character filtering.
	 * Processes special characters within every single key and combines them to form a reliable verification string fragment.
	 *
	 * @returns A concatenated regex pattern string of escaped keys suited for insertion into the final validation expression.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private get allowedKeysPattern(): string {
		return this.allowKeys()
			.map((key) => escapeRegExp(key))
			.join('');
	}

	/**
	 * Dispatches a custom input event to the specified DOM element to ensure the listeners detect programmatic value changes.
	 * Configures a non-bubbling cancelable event instance and initializes the dispatch operation on the target input element.
	 *
	 * @param element - The HTML input element receiving the custom event notification to activate the listener value updates.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private dispatchInputEvent(element: HTMLInputElement): void {
		// Creates a new input event that can be dispatched to this target element
		const inputEvent = new Event('input', {
			bubbles: false,
			cancelable: true
		});

		// Dispatchs the newly made input event on the specified DOM input element
		element.dispatchEvent(inputEvent);
	}

	/**
	 * Builds a regex pattern to identify and prevent duplicate negative symbol during text sanitization and input processing.
	 * Evaluates validation rules and selection state checks to provide the appropriate negative sign pattern or empty result.
	 *
	 * @returns A regex pattern string preventing the duplicate negative signs or empty string when negatives are not allowed.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private get negativeSignPattern(): string {
		// Retrieves the text highlighted or selected by the user within the input
		const currentSelection = this.currentSelection;

		// Determines if negative numbers are currently allowed for input elements
		const areNegativesAllowed = this.allowNegatives();

		// Determines if highlighted input text already includes the negative sign
		const selectionHasNegativeSign = includes(currentSelection, this.negativeSign());

		// Determines if a negative sign can be added based on input and selection
		const canAddNegativeSign = !this.hasNegativeSignInInput || selectionHasNegativeSign;

		// Checks if a negative sign is allowed, creating regex to stop duplicates
		if (!areNegativesAllowed || !canAddNegativeSign) return '';
		else return `(?!^${escapeRegExp(this.negativeSign())})`;
	}
}
