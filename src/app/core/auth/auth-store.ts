import { Auth } from './auth';
import { values } from 'lodash-es';
import { Session } from './session';
import { withLogger } from '@store/logger';
import { computed, inject } from '@angular/core';
import { withResetState } from '@store/reset-state';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { withRequestStatus } from '@store/request-status';
import { AuthEvent, type TAuthEvents } from './auth-events';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import {
	withHooks,
	withState,
	patchState,
	signalStore,
	withMethods,
	withComputed
} from '@ngrx/signals';
import type {
	IAuthUser,
	IAuthSession,
	ISignInPayload,
	IResetPasswordPayload,
	IForgotPasswordPayload
} from '@shared/types';

interface IAuthState {
	session: IAuthSession | null;
}

/**
 * Defines an initial state object to setup store values and ensure normalized default across store features and contexts.
 * Processes fundamental state requirements to establish a reliable structure which enables consistent reactive operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState: IAuthState = {
	session: null
};

/**
 * Defines declarative state container which centralizes reactive store management to maintain seamless state integration.
 * Provides composite interface of store properties, lifecycle hooks and executing methods to support predictable updates.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const AuthStore = signalStore(
	// Provides root scoped store instance to manage state for dependency tree
	{ providedIn: 'root' },

	// Provides initial store schema with baseline value for state composition
	withState(initialState),

	// Provides state restore capability referencing captured initial snapshot
	withResetState<IAuthState>(),

	// Provides state change tracking with snapshots printed in console groups
	withLogger<IAuthState>({ storeName: 'Auth' }),

	// Provides tracking of asynchronous request status with automated cleanup
	withRequestStatus<IAuthState, TAuthEvents>({ events: values(AuthEvent) }),

	// Provides derived signals projecting current values from reactive source
	withComputed((store) => {
		// Dependency injections providing direct access to services and injectors
		const session = inject(Session);

		/**
		 * Computes whether the stored session reflects an authenticated user state to support consistent access control checking.
		 * Returns a boolean value indicating whether session is available and passes the validity review for authorization scope.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const isAuthenticated = computed<boolean>(() => {
			return session.hasValidAuthSession(store.session());
		});

		/**
		 * Computes access token by extracting stored session data for header fields to support authenticated request preparation.
		 * Returns a string indicating whether jwt access token is available if valid session details exist, or null when missing.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const accessToken = computed<string | null>(() => {
			return store.session()?.access_token ?? null;
		});

		/**
		 * Computes user details by extracting stored session data for access control rules to support authenticated user context.
		 * Returns an object indicating whether identity record is available if valid session details exist, or null when missing.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const userDetails = computed<IAuthUser | null>(() => {
			return store.session()?.user_details ?? null;
		});

		// Returns signals collection exposing calculated values for public access
		return { isAuthenticated, accessToken, userDetails };
	}),

	// Provides store methods enabling state updates and reactive interactions
	withMethods((store) => {
		// Dependency injections providing direct access to services and injectors
		const auth = inject(Auth);
		const session = inject(Session);

		/**
		 * Restores the authentication session by resolving persisted cookie data and synchronizing the internal state properties.
		 * Processes the session information to rehydrate valid credentials and maintain session availability across page reloads.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const _restoreSessionFromCookie = (): void => {
			patchState(store, { session: session.resolveAuthSession() });
		};

		/**
		 * Dispatches sign-in request by initiating request tracking and synchronizing the stored session state on authentication.
		 * Processes credentials by invoking the auth service, storing results and updating request status in validation contexts.
		 *
		 * @param payload - The payload object containing credentials required to verify the user and grant access to the account.
		 * @returns A reactive method which executes the request stream to update state properties based on the operation results.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const signIn = rxMethod<ISignInPayload>(
			pipe(
				tap(() => {
					store.markPending(AuthEvent.SIGN_IN);
				}),
				switchMap((payload) =>
					auth.signIn(payload).pipe(
						tap((result) => {
							store.markFulfilled(AuthEvent.SIGN_IN, {
								data: result.dataset,
								message: result.message,
								session: result.dataset
							});
						}),
						catchError((error) => {
							store.markRejected(AuthEvent.SIGN_IN, {
								message: error.message
							});
							return EMPTY;
						})
					)
				)
			)
		);

		/**
		 * Dispatches password recovery by initiating request tracking, updating response message, and triggering reset procedure.
		 * Processes account details by invoking auth service, storing results and updating request status in validation contexts.
		 *
		 * @param payload - The payload object containing account email address required to request password recovery instruction.
		 * @returns A reactive method which executes the request stream to update state properties based on the operation results.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const forgotPassword = rxMethod<IForgotPasswordPayload>(
			pipe(
				tap(() => {
					store.markPending(AuthEvent.FORGOT_PASSWORD);
				}),
				switchMap((payload) =>
					auth.forgotPassword(payload).pipe(
						tap((result) => {
							store.markFulfilled(AuthEvent.FORGOT_PASSWORD, {
								message: result.message
							});
						}),
						catchError((error) => {
							store.markRejected(AuthEvent.FORGOT_PASSWORD, {
								message: error.message
							});
							return EMPTY;
						})
					)
				)
			)
		);

		/**
		 * Dispatches password reset by initiating request tracking, updating user credentials and completing account restoration.
		 * Processes credentials by invoking the auth service, storing results and updating request status in validation contexts.
		 *
		 * @param payload - The payload object containing new password and verification token, required to complete reset request.
		 * @returns A reactive method which executes the request stream to update state properties based on the operation results.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const resetPassword = rxMethod<IResetPasswordPayload>(
			pipe(
				tap(() => {
					store.markPending(AuthEvent.RESET_PASSWORD);
				}),
				switchMap((payload) =>
					auth.resetPassword(payload).pipe(
						tap((result) => {
							store.markFulfilled(AuthEvent.RESET_PASSWORD, {
								message: result.message
							});
						}),
						catchError((error) => {
							store.markRejected(AuthEvent.RESET_PASSWORD, {
								message: error.message
							});
							return EMPTY;
						})
					)
				)
			)
		);

		/**
		 * Dispatches sign-out request by initiating request tracking and completing session termination by clearing auth session.
		 * Processes sign-out request by invoking auth service, storing result and updating request status in validation contexts.
		 *
		 * @returns A reactive method which executes the request stream to update state properties based on the operation results.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const signOut = rxMethod<void>(
			pipe(
				tap(() => {
					store.markPending(AuthEvent.SIGN_OUT);
				}),
				switchMap(() =>
					auth.signOut().pipe(
						tap((result) => {
							store.markFulfilled(AuthEvent.SIGN_OUT, {
								message: result.message
							});
						}),
						catchError((error) => {
							store.markRejected(AuthEvent.SIGN_OUT, {
								message: error.message
							});
							return EMPTY;
						})
					)
				)
			)
		);

		// Returns methods collection exposing callable features for public access
		return { signIn, signOut, resetPassword, forgotPassword, _restoreSessionFromCookie };
	}),

	// Provides lifecycle hooks executing side effects during store operations
	withHooks((store) => {
		/**
		 * Handles store initialization by configuring reactive contexts and organizing state signals for consistent interactions.
		 * Executes startup tasks such as triggering initial data loads, registering effects, or configuring reactive derivations.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const onInit = (): void => {
			store._restoreSessionFromCookie();
		};

		/**
		 * Handles store destruction by releasing retained resources and dismantling reactive connections to prevent memory leaks.
		 * Executes cleanup procedures such as cancelling inflight requests, resetting store signals, or clearing computed caches.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const onDestroy = (): void => {
			store.resetState(initialState);
		};

		// Returns callbacks collection executed during initialization and cleanup
		return { onInit, onDestroy };
	})
);
