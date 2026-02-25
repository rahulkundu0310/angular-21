import { AuthStore } from '../auth';
import { inject } from '@angular/core';
import type { TRecord } from '@shared/types';
import type { HttpInterceptorFn } from '@angular/common/http';

/**
 * Intercepts outgoing requests to append the necessary headers ensuring compliant metadata for the external interactions.
 * Processes the request to inject the configuration headers safeguarding the structural integrity in validation contexts.
 *
 * @param request - The outgoing object containing headers and payload information required for executing the transaction.
 * @param next - The delegate handler responsible for passing control to subsequent logic defined within a pipeline chain.
 * @returns An observable stream containing the processed network events for unified tracking by the subscribed observers.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const requestHeaderInterceptor: HttpInterceptorFn = (request, next) => {
	// Dependency injections providing direct access to services and injectors
	const authStore = inject(AuthStore);

	// Retrieves the stored access token from the authentication store context
	const accessToken = authStore.accessToken();

	// Initializes a variable to hold request headers with authorization token
	const requestHeaders: TRecord<string> = {
		...(!!accessToken && { Authorization: `Bearer ${accessToken}` })
	};

	// Returns the modified request instance with merged header configurations
	return next(request.clone<unknown>({ setHeaders: requestHeaders }));
};
