import { DateTime } from 'luxon';
import { Session } from '../auth';
import { Logger } from '../services';
import { Exception } from '../errors';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { transportConfig } from '@configs';
import { environment } from '@env/environment';
import { get, isString, omit } from 'lodash-es';
import { StatusCodes } from 'http-status-codes';
import type { INormalizedError } from '@shared/types';
import type { HttpInterceptorFn } from '@angular/common/http';
import { isClientException, isServerException } from '../http';
import { catchError, throwError, timeout, TimeoutError } from 'rxjs';
import { HttpErrorResponse as ErrorResponse } from '@angular/common/http';

interface IInterceptorProviders {
	router: Router;
	logger: Logger;
	session: Session;
}

/**
 * Intercepts request exceptions to standardize the error handling ensuring consistent output for the client interactions.
 * Processes events to enforce timeouts and normalize responses ensuring unified status resolution in validation contexts.
 *
 * @param request - The outgoing object containing headers and payload information required for executing the transaction.
 * @param next - The delegate handler responsible for passing control to subsequent logic defined within a pipeline chain.
 * @returns An observable stream containing the processed network events for unified tracking by the subscribed observers.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const requestExceptionInterceptor: HttpInterceptorFn = (request, next) => {
	// Dependency injections providing direct access to services and injectors
	const router = inject(Router);
	const logger = inject(Logger);
	const session = inject(Session);

	// Retrieves timeout from specific request or defaults to transport config
	const requestTimeout = request.timeout ?? transportConfig.timeout;

	// Returns the next handler to proceed with the request handling execution
	return next(request).pipe(
		timeout(requestTimeout),
		catchError((error: unknown) => {
			// Retrieves the message and status code from the normalized error context
			const { message, statusCode } = normalizeError(error);

			// Constructs an exception instance using the extracted status and context
			const exceptionInstance = new Exception(message, {
				context: {
					requestUrl: request.url,
					requestMethod: request.method,
					timestamp: DateTime.now().toISO()
				}
			});

			// Checks if the error was a client side event or connection failure issue
			if (isClientException(error)) {
				// Checks if the current environment is development for logging the errors
				if (!environment.production) logger.log('Client-side error occurred', error);
			}

			// Checks if the error was a server side event or processing failure issue
			if (isServerException(error)) {
				// Dispatches the appropriate actions based on the specific error category
				dispatchExceptionActions(message, statusCode, {
					router,
					logger,
					session
				});
			}

			// Returns an error observable to propagate the exact exception downstream
			return throwError(() => omit(exceptionInstance, ['type', 'stack']));
		})
	);
};

/**
 * Dispatches targeted commands based on status codes to manage environment state for the consistent exception resolution.
 * Processes specific conditions to remove session and redirect routes ensuring optimal resolution in validation contexts.
 *
 * @param message - The explicit text string clarifying the nature of the exception for the standard logging and feedback.
 * @param statusCode - The numeric value identifier representing the status code used to evaluate the correct side effect.
 * @param providers - The dependency object containing instances required to execute the side effects during error events.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function dispatchExceptionActions(
	message: string,
	statusCode: number,
	providers: IInterceptorProviders
): void {
	// Destructures the provided source object to extract necessary properties
	const { router, logger, session } = providers;

	// Evaluates the status code to orchestrate the appropriate error protocol
	switch (statusCode) {
		// Permits logout and redirect to handle the unauthorized access exception
		case StatusCodes.UNAUTHORIZED:
			session.clearAuthSession();
			router.navigate(['/sign-in'], {
				queryParams: { redirectUrl: router.url }
			});
			break;

		// Permits warning and redirect to handle the restricted request exception
		case StatusCodes.FORBIDDEN:
			logger.warn('Access to this resource is forbidden contact your admin');
			router.navigate(['/access-denied']);
			break;

		// Permits error and redirect to handle the fatal server failure exception
		case StatusCodes.INTERNAL_SERVER_ERROR:
			logger.error('An internal error occurred while processing the request');
			router.navigate(['/internal-server-error']);
			break;

		// Ensures the unexpected error gets logged with the given failure message
		default:
			logger.error(`An unexpected exception occurred with reason ${message}`);
			break;
	}
}

/**
 * Normalizes the exception instance to construct a standardized structure with the message and numeric status identifier.
 * Processes various error sources to extract available details for creating a consistent failure response unified format.
 *
 * @param error - The unknown error object received from the catch block to be parsed for the specific failure definition.
 * @returns A normalized error structure containing the status code and message for the standardized integration feedback.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function normalizeError(error: unknown): INormalizedError {
	// Checks if the error was a standard response or processing failure issue
	if (error instanceof ErrorResponse) {
		return {
			statusCode: error.status,
			message: get(error, 'error.message') || get(error, 'message')
		};
	}

	// Checks if the error was a client side event or connection failure issue
	if (error instanceof ErrorEvent) {
		return {
			statusCode: 0,
			message: 'A connection error occurred check your network settings'
		};
	}

	// Checks if the error was a request rejection or connection failure issue
	if (error instanceof TimeoutError) {
		return {
			statusCode: StatusCodes.REQUEST_TIMEOUT,
			message: 'A network delay caused a timeout error please try again'
		};
	}

	// Returns a generic fallback context or the default server error response
	return {
		statusCode: get(error, 'status') || 0,
		message:
			(isString(error) ? error : get(error, 'message')) ||
			'Something went wrong within the server please try again'
	};
}
