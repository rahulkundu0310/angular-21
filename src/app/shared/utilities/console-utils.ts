import { includes, isError, isString } from 'lodash-es';

/**
 * Suppresses view transition abort error logs by overriding the log handler to filter out specific skipped fault outputs.
 * Maintains standard logging behavior while restricting specific skipped view errors from cluttering the browser console.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function suppressViewTransitionAbortError(): void {
	// Stores a reference to original console.error method prior overriding it
	const originalConsoleError = console.error.bind(console);

	// Overrides console.error to filter specific view transition abort errors
	console.error = (...errorArguments: unknown[]): void => {
		// Extracts the first argument from error arguments for error type casting
		const [firstArgument] = errorArguments;

		// Checks if the error is related to skipped view transitions and suppress
		if (shouldSkipViewTransitionError(firstArgument)) return;

		// Calls the original console.error method using all given error arguments
		originalConsoleError(...errorArguments);
	};
}

/**
 * Determines if the error object reflects a skipped view transition abort exception by evaluating failure content traits.
 * Processes exception analysis against standardized abort indicators to facilitate selective view transition suppression.
 *
 * @param error - The unknown error object requiring view transition abort indicator check to suppress the console output.
 * @returns A boolean indicating whether the error represents a skipped view transition abort error for console filtering.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function shouldSkipViewTransitionError(error: unknown): boolean {
	// Handles an Error object type by checking message content and error name
	if (isError(error)) {
		// Determines if an error message contains skipped transition text content
		const hasSkipMessage = includes(error.message, 'Transition was skipped');

		// Determines if the active error name accurately matches abort indicators
		const isAbortErrorName = error.name === 'AbortError';

		// Returns a boolean confirming matching abort and skipped message details
		return isAbortErrorName && hasSkipMessage;
	}

	// Handles string type by checking for specific abort and transition words
	if (isString(error)) {
		// Determines if the string value contains skipped transition text content
		const containsSkipText = includes(error, 'Transition was skipped');

		// Determines if the evaluated string incorporates abort error identifiers
		const containsAbortText = includes(error, 'AbortError');

		// Returns a boolean confirming matching abort and skipped text inclusions
		return containsAbortText && containsSkipText;
	}

	// Returns false as default when value is neither Error objects nor string
	return false;
}
