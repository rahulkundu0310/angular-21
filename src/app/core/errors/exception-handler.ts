import { DateTime } from 'luxon';
import { Exception } from './exception';
import { Logger, Toaster } from '../services';
import type { ErrorHandler } from '@angular/core';
import { inject, Injectable } from '@angular/core';
import { has, isObject, get, isError } from 'lodash-es';
import type { IPromiseRejection, IZoneException } from '@shared/types';

@Injectable()
export class ExceptionHandler implements ErrorHandler {
	// Dependency injections providing direct access to services and injectors
	private readonly logger = inject(Logger);
	private readonly toaster = inject(Toaster);

	// Public and private class variables reflecting state and settings
	private readonly cacheCooldown: number = 3000;
	private readonly errorCache = new Map<string, number>();

	/**
	 * Handles exceptions by normalizing source error and delegating object to specific handlers for detailed issue reporting.
	 * Processes exception structures identifying duplicate events or network failures ensuring resilient tracking operations.
	 *
	 * @param error - The unknown error object captured during execution used for classification and accurate issue diagnosis.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public handleError(error: unknown): void {
		// Retrieves a normalized exception structure from unknown incoming object
		const normalizedException = this.normalizeError(error);

		// Checks if the normalized exception matches chunk load failure condition
		if (this.isChunkLoadException(normalizedException)) {
			this.handleChunkLoadException();
			return;
		}

		// Checks if the normalized exception matches duplicate failure properties
		if (this.isDuplicateException(normalizedException)) {
			return;
		}

		// Processes the normalized exception executing remote diagnostic tracking
		this.processException(normalizedException);
	}

	/**
	 * Normalizes the nested error instance to ensure a compliant object format for the reliable downstream server assessment.
	 * Processes the input by recursively unwrapping all hidden layers to extract critical attributes for a formatted payload.
	 *
	 * @param error - The unknown error object from catch blocks to be normalized by stripping any underlying source elements.
	 * @returns A customized exception instance containing the resolved message text and trace sequence for external tracking.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private normalizeError(error: unknown): Exception {
		// Checks if the incoming error is already a typed custom exception object
		if (error instanceof Exception) return error;

		// Checks if the incoming error is an unhandled promise rejection instance
		if (this.isPromiseRejection(error)) {
			return this.normalizeError(error.rejection);
		}

		// Checks if the incoming error is enclosed within an angular zone wrapper
		if (this.isZoneException(error)) {
			return this.normalizeError(error.ngOriginalError);
		}

		// Retreives a boolean verifying if the unknown error is a structured type
		const isStructuredError = isObject(error) && isError(error);

		// Retreives the specific error name directly from the validated exception
		const errorName = isStructuredError ? get(error, 'name') : undefined;

		// Retreives the associated error stack directly from the validated object
		const errorStack = isStructuredError ? get(error, 'stack') : undefined;

		// Retreives the underlying error message safely from the validated object
		const errorMessage = isStructuredError ? get(error, 'message') : error;

		// Resolves the parsed exception stack applying the undefined base default
		const exceptionStack = errorStack ? String(errorStack) : undefined;

		// Resolves the parsed exception name applying a standard text replacement
		const exceptionName = errorName ? String(errorName) : 'UnknownError';

		// Resolves the parsed exception message applying a standard text fallback
		const exceptionMessage = errorMessage
			? String(errorMessage)
			: 'An unexpected application error occurred during runtime';

		// Constructs an exception instance using resolved error details and stack
		return new Exception(exceptionMessage, {
			stack: exceptionStack,
			context: {
				name: exceptionName,
				runtimeException: true,
				timestamp: DateTime.now().toISO()
			}
		});
	}

	/**
	 * Handles missing network chunk occurrences by logging the failure actively before requesting an immediate manual reload.
	 * Processes deployment version mismatches by dispatching a targeted warning and prompting the recommended refresh action.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private handleChunkLoadException(): void {
		// Dispatches a targeted warning log detailing deployment version mismatch
		this.logger.warn('A deployment version mismatch occurred please try again');

		// Dispatches a warning toaster prompting users to refresh browser session
		this.toaster.warning('An updated software version is available please refresh', {
			duration: Number.POSITIVE_INFINITY,
			action: {
				label: 'Refresh',
				onClick: () => window.location.reload()
			}
		});
	}

	/**
	 * Transmits the critical exception details to the remote monitoring system ensuring centralized observability and audits.
	 * Processes context properties excluding network errors and dispatches notifications before tracking the runtime failure.
	 *
	 * @param exception - The normalized exception instance tracked for external logging within the capture requirement scope.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private processException(exception: Exception): void {
		// Checks if the mapped exception contains http exception context property
		if (exception.context?.['httpException'] === true) return;

		// Dispatches an error toaster notifying the user of an unexpected runtime
		this.toaster.error('An unexpected runtime error occurred please reload page');

		// Dispatches the critical exception to the remote logger tracking failure
		this.logger.error('An unexpected runtime error occurred tracking exception', exception);
	}

	/**
	 * Determines whether the provided error object qualifies as a recent duplicate occurrence preventing repetitive tracking.
	 * Processes the exception attributes to build a distinct signature evaluating timestamps against the configured boundary.
	 *
	 * @param error - The captured exception instance assessed through the method requiring historical frequency verification.
	 * @returns A boolean indicating whether the current error execution happened within the active threshold otherwise false.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private isDuplicateException(error: Error): boolean {
		// Retreives the current system timestamp converted to millisecond metrics
		const currentTime = DateTime.now().toMillis();

		// Constructs a tracking cache string combining the error name and message
		const cacheKey = `${error.name}|${error.message}`;

		// Retreives previously recorded tracking timestamp matching the cache key
		const cachedTimestamp = this.errorCache.get(cacheKey);

		// Computes the cooldown threshold deducting cache limit from current time
		const cooldownThreshold = currentTime - this.cacheCooldown;

		// Checks if the previous error execution happened inside a cooldown limit
		if (cachedTimestamp && cachedTimestamp > cooldownThreshold) return true;

		// Registers the current error timestamp into cache tracking its execution
		this.errorCache.set(cacheKey, currentTime);

		// Returns false confirming the error is unique or past the cooldown limit
		return false;
	}

	/**
	 * Determines whether a provided unknown input conforms to the zone exception definition permitting strict type narrowing.
	 * Processes input attributes to check the presence of the original error property ensuring safety in validation contexts.
	 *
	 * @param error - The unknown error input from the catch blocks to be checked for the necessary zone exception definition.
	 * @returns A boolean indicating whether the error is a verified zone exception instance permitting specific type casting.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private isZoneException(error: unknown): error is IZoneException {
		return isObject(error) && has(error, 'ngOriginalError');
	}

	/**
	 * Determines whether provided unknown input conforms to the promise rejection structure permitting strict type narrowing.
	 * Processes the input attributes to check the existence of the rejection property ensuring safety in validation contexts.
	 *
	 * @param error - The unknown error object from catch blocks to be checked for the necessary promise rejection definition.
	 * @returns A boolean indicating whether the error is a valid promise rejection instance permitting specific type casting.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private isPromiseRejection(error: unknown): error is IPromiseRejection {
		return isObject(error) && has(error, 'rejection');
	}

	/**
	 * Determines whether provided runtime event conforms to the chunk load failure definition permitting targeted resolution.
	 * Processes the input attributes to check the presence of the asset loading patterns ensuring safety in routing contexts.
	 *
	 * @param error - The runtime event object from the catch blocks to be checked for the necessary asset loading conditions.
	 * @returns A boolean indicating whether the input is a valid chunk load problem instance permitting proper issue routing.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private isChunkLoadException(error: Error): boolean {
		return error.name === 'ChunkLoadError' || /Loading chunk [\d]+ failed/i.test(error.message);
	}
}
