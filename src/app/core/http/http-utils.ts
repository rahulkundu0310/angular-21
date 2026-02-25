import { has } from 'lodash-es';
import type { IResponse } from '@shared/types';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorResponse as ErrorResponse } from '@angular/common/http';

/**
 * Determines whether the provided error qualifies as a server exception by verifying the instance and status definitions.
 * Processes the prototype chain and response code lookup validating the status integrity for downstream error management.
 *
 * @param error - The unknown error object returned by the failed request to be validated for the server error properties.
 * @returns A boolean indicating whether the provided input is a server exception instance with valid status code mapping.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function isServerException(error: unknown): boolean {
	return error instanceof ErrorResponse && !!StatusCodes[error.status];
}

/**
 * Determines whether the incoming response entity contains a valid payload verifying the successful operation completion.
 * Processes the status configuration ensuring the property strictly corresponds to the specified success code identifier.
 *
 * @param response - The structured HTTP response object retrieved directly from the integrated request handling provider.
 * @returns A boolean indicating whether the provided input represents a successful transaction with verified status code.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function isSuccessResponse(response: IResponse<unknown>): boolean {
	return has(response, 'status') && response.status.status_code === StatusCodes.OK;
}

/**
 * Determines whether the provided error qualifies as a client exception by verifying the instance and status definitions.
 * Processes the prototype chain and response code lookup validating the status integrity for downstream error management.
 *
 * @param error - The unknown error object returned by the failed request to be validated for the client error properties.
 * @returns A boolean indicating whether the provided input represents a client side exception or unknown status failures.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function isClientException(error: unknown): boolean {
	if (error instanceof ErrorEvent) return true;
	return error instanceof ErrorResponse && !StatusCodes[error.status];
}
