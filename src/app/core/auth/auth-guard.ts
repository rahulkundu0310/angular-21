import { Logger } from '../services';
import { inject } from '@angular/core';
import { AuthStore } from './auth-store';
import { Router } from '@angular/router';
import type { CanActivateFn } from '@angular/router';

/**
 * Protects restricted routes by evaluating the current session status against the mandatory authentication prerequisites.
 * Processes navigation to grant entry or divert the unverified session to an alternative location to maintain compliance.
 *
 * @param route - The activated route snapshot object containing configuration associated with the matched entry location.
 * @param state - The router state snapshot object containing the entire tree of the matched routes during the transition.
 * @returns A boolean result or navigation tree indicating whether the request is allowed or routed to other destinations.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const authGuard: CanActivateFn = (route, state) => {
	// Dependency injections providing direct access to services and injectors
	const router = inject(Router);
	const logger = inject(Logger);
	const authStore = inject(AuthStore);

	// Retrieves session validity status from the authentication store context
	const isAuthenticated = authStore.isAuthenticated();

	// Checks if session is unverified and validates visitor navigation access
	if (isAuthenticated) return true;

	// Captures the error message if an unauthenticated session is encountered
	logger.error('Unauthenticated access detected redirecting to sign in');

	// Returns url tree redirecting to sign in page to validate session access
	return router.createUrlTree(['/sign-in'], {
		queryParams: { redirectUrl: state.url }
	});
};
