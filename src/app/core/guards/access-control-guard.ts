import { AuthStore } from '../auth';
import { Logger } from '../services';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { IRouteData } from '@shared/types';
import type { CanActivateFn } from '@angular/router';

/**
 * Protects restricted routes by verifying user session state against specific requirements for the requested destination.
 * Processes navigation attempts to permit or redirect requests based on validated session policy for security compliance.
 *
 * @param route - The activated route snapshot object containing configuration associated with the matched entry location.
 * @param state - The router state snapshot object containing the entire tree of the matched routes during the transition.
 * @returns A boolean result or navigation tree indicating whether the request is allowed or routed to other destinations.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const accessControlGuard: CanActivateFn = (route, state) => {
	// Dependency injections providing direct access to services and injectors
	const router = inject(Router);
	const logger = inject(Logger);
	const authStore = inject(AuthStore);

	// Retrieves session validity status from the authentication store context
	const isAuthenticated = authStore.isAuthenticated();

	// Retrieves access constraint from route snapshot and defaults to general
	const accessConstraint = (route.data as IRouteData)?.['scope'] ?? 'general';

	// Checks if access constraint is general and validates navigation context
	if (accessConstraint === 'general') return true;

	// Checks if access constraint is visitor and validates navigation context
	if (accessConstraint === 'visitor') {
		// Checks if session is unverified and validates visitor navigation access
		if (!isAuthenticated) return true;

		// Returns url tree redirecting to dashboard for the authenticated session
		return router.createUrlTree(['/dashboard']);
	}

	// Checks if access constraint is private and validates navigation context
	if (accessConstraint === 'private') {
		// Checks if session is authorized and validates private navigation access
		if (isAuthenticated) return true;

		// Returns url tree redirecting to sign in page to validate session access
		return router.createUrlTree(['/sign-in'], {
			queryParams: { redirectUrl: state.url }
		});
	}

	// Captures the error message when any invalid access scope is identified
	logger.error(`Access blocked due to invalid ${accessConstraint} scope`);

	// Returns a redirect url tree to the access denied page for unknown users
	return router.createUrlTree(['/access-denied']);
};
