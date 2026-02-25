import { ErrorHandler } from '@angular/core';
import type { Provider } from '@angular/core';
import { ExceptionHandler } from '@core/errors/exception-handler';

/**
 * Provides the exception handler configuration for environment setup defining providers for streamlined error management.
 * Enables the environment to capture unexpected execution failures and delegate them for consistent reporting operations.
 *
 * @returns A provider object containing the error handler implementation for centralized exception auditing and tracking.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function provideExceptionHandler(): Provider {
	return {
		provide: ErrorHandler,
		useClass: ExceptionHandler
	};
}
