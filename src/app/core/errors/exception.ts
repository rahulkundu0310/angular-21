import type { TRecord } from '@shared/types';

interface IExceptionOptions {
	stack?: string;
	context?: TRecord;
	captureInSentry?: boolean;
}

export class Exception extends Error {
	// Public and private class variables reflecting state and settings
	public readonly captureInSentry!: boolean;
	public readonly type: string = 'Exception';
	public readonly context: TRecord | undefined;

	/**
	 * Initializes the custom error class with a message and an optional options object for collecting diagnostic information.
	 * Processes the stack trace capture and ensures a normalized structure for downstream integration in validation contexts.
	 *
	 * @param message - The readable string message describing the error cause to be displayed in centralized error reporting.
	 * @param options - The optional object containing metadata such as stack, context details, or external tracking controls.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	constructor(message: string, options: IExceptionOptions = {}) {
		// Invokes the parent class Error constructor with the given error message
		super(message);

		// Updates the error name to match the class name for stack trace accuracy
		this.name = 'Exception';

		// Updates the additional specialized metadata excluding stack information
		this.context = options.context;

		// Restores the prototype hierarchy and ensure proper instance of checking
		this.captureInSentry = options.captureInSentry ?? false;

		// Add inline comment
		Object.setPrototypeOf(this, Exception.prototype);

		// Checks if a provided stack exists or captures one for precise debugging
		if (options.stack) this.stack = options.stack;
		else Error.captureStackTrace?.(this, this.constructor);
	}
}
