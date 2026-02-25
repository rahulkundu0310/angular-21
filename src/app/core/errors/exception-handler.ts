import { Logger } from '../services';
import { Exception } from './exception';
import { has, isObject } from 'lodash-es';
import type { ErrorHandler } from '@angular/core';
import { inject, Injectable } from '@angular/core';
import type { IPromiseRejection } from '@shared/types';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ExceptionHandler implements ErrorHandler {
	// Dependency injections providing direct access to services and injectors
	private readonly logger = inject(Logger);

	/**
	 * Handles exceptions by normalizing source error and delegating object to specific handlers for detailed issue reporting.
	 * Processes structure checking using inspection and review to ensure resilient logging strategies in validation contexts.
	 *
	 * @param error - The unknown error object captured during execution used for classification and accurate issue diagnosis.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public handleError(error: unknown): void {
		// Retrieves the normalized error structure from an unknown incoming value
		const normalizedError = this.normalizeError(error);

		// Checks if the object represents a valid centralized exception structure
		if (normalizedError instanceof Exception) {
			this.captureException(normalizedError);
			return;
		}

		// Checks if the object represents a valid angular http response structure
		if (normalizedError instanceof HttpErrorResponse) {
			return;
		}

		// Captures the unexpected runtime error details using external monitoring
		this.logger.error('An unexpected error occured:', error);
	}

	/**
	 * Transmits the critical exception details to the remote monitoring system ensuring centralized observability and audits.
	 * Validates the capture eligibility criteria to exclude ignored errors and reports the failure context for the debugging.
	 *
	 * @param exception - The normalized exception instance tracked for external logging within the capture requirement scope.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private captureException(exception: Exception): void {
		// Checks if external capturing context is enabled otherwise returns early
		if (!exception.captureInSentry) return;

		// Captures detailed exception message as payload for remote observability
		this.logger.error(exception.message, exception);
	}

	/**
	 * Normalizes the nested error instance to ensure a compliant object format for the reliable downstream system assessment.
	 * Processes the input to recursively unwrap the rejection layers and retrieves the true exception for the error handling.
	 *
	 * @param error - The unknown error object from catch blocks to be normalized by stripping the promise rejection wrappers.
	 * @returns A value containing the resolved error object or the provided reference suitable for the downstream processing.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private normalizeError(error: unknown): unknown {
		if (!this.isPromiseRejection(error)) return error;
		return this.normalizeError(error.rejection);
	}

	/**
	 * Determines whether provided unknown input conforms to the promise rejection structure permitting strict type narrowing.
	 * Processes the input attributes to check the existence of the exception property ensuring safety in validation contexts.
	 *
	 * @param error - The unknown error object from catch blocks to be checked for the necessary promise rejection definition.
	 * @returns A boolean indicating whether the error is a valid promise rejection instance permitting specific type casting.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private isPromiseRejection(error: unknown): error is IPromiseRejection {
		return isObject(error) && has(error, 'exception');
	}
}
