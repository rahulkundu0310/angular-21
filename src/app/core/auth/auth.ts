import { Session } from './session';
import type { Observable } from 'rxjs';
import { map, tap, timer } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpAgent, isSuccessResponse } from '@core/http';
import type {
	IResponse,
	IAuthSession,
	ISignInPayload,
	TRequestOptions,
	IResetPasswordPayload,
	IForgotPasswordPayload
} from '@shared/types';

@Injectable({ providedIn: 'root' })
export class Auth {
	// Dependency injections providing direct access to services and injectors
	private readonly http = inject(HttpAgent);
	private readonly session = inject(Session);

	// Public and private class member variables reflecting state and behavior
	private readonly authBaseUrl: string = 'auth';

	/**
	 * Performs the user authentication process by validating input credentials and establishing a secured persistent session.
	 * Processes server response to persist session details when credentials match inputs successfully in validation contexts.
	 *
	 * @param payload - The payload object containing credentials required to verify the user and grant access to the account.
	 * @returns An observable stream which emits the server response containing token and account details for verified access.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public signIn(payload: ISignInPayload): Observable<IResponse<IAuthSession>> {
		// // Constructs the assembled url string for processing the resource request
		// const requestUrl = `${this.authBaseUrl}/sign-in`;

		// // Configures the execution parameters for processing the resource request
		// const requestOptions: TRequestOptions = {
		// 	version: 'v1'
		// };

		// // Executes the resource request and returns an observable response stream
		// return this.http.post<IResponse<IAuthSession>>(requestUrl, payload, requestOptions).pipe(
		// 	tap((response) => {
		// 		// If response is successful store authentication session details
		// 		if (isSuccessResponse(response)) {
		// 			this.session.persistAuthSession(response.dataset!);
		// 		}
		// 	})
		// );

		return timer(5000).pipe(
			map(() => {
				const mockedResponse: IResponse<IAuthSession> = {
					success: true,
					message: 'You are successfully authenticated and signed in',
					status: {
						status_code: 200,
						status_info: 'OK'
					},
					publish: {
						version: 'v1.0.0',
						developer: 'Rahul Kundu'
					},
					dataset: {
						access_token: 'mock_jwt_token_xy782_secure_hash_9921',
						user_details: {
							id: 101,
							role: 'admin',
							is_verified: true,
							last_name: 'Kundu',
							first_name: 'Rahul',
							email: payload.email,
							phone_number: '+919876543210'
						}
					}
				};
				return mockedResponse;
			}),
			tap((response) => {
				// If response is successful store authentication session details
				if (isSuccessResponse(response)) {
					this.session.persistAuthSession(response.dataset!);
				}
			})
		);
	}

	/**
	 * Performs the password recovery process by verifying provided account details and triggering a reliable reset procedure.
	 * Processes the reset request to dispatch a verification link when the account is safely verified in validation contexts.
	 *
	 * @param payload - The payload object containing the email used to identify the intended user account for recovery phase.
	 * @returns An observable stream which emits the server response confirming the password reset instructions were accepted.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public forgotPassword(payload: IForgotPasswordPayload): Observable<IResponse> {
		// Constructs the assembled url string for processing the resource request
		const requestUrl = `${this.authBaseUrl}/forgot-password`;

		// Configures the execution parameters for processing the resource request
		const requestOptions: TRequestOptions = {
			version: 'v1'
		};

		// Executes the resource request and returns an observable response stream
		return this.http.post<IResponse>(requestUrl, payload, requestOptions);
	}

	/**
	 * Performs the password update process by validating the new credentials and completing this secured account restoration.
	 * Processes the reset submission to update user security records when the input token is verified in validation contexts.
	 *
	 * @param payload - The update object containing the new password and verification token needed to finalize the operation.
	 * @returns An observable stream which emits the server response confirming the password update was effectively concluded.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public resetPassword(payload: IResetPasswordPayload): Observable<IResponse> {
		// Constructs the assembled url string for processing the resource request
		const requestUrl = `${this.authBaseUrl}/reset-password`;

		// Configures the execution parameters for processing the resource request
		const requestOptions: TRequestOptions = {
			version: 'v1'
		};

		// Executes the resource request and returns an observable response stream
		return this.http.post<IResponse>(requestUrl, payload, requestOptions);
	}

	/**
	 * Performs the session termination by invalidating the user token and clearing stored cookies and authentication records.
	 * Processes the sign-out request to securely end the current session when the action is triggered in validation contexts.
	 *
	 * @returns An observable stream which emits the server response confirming the active session was effectively terminated.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public signOut(): Observable<IResponse> {
		// Constructs the assembled url string for processing the resource request
		const requestUrl = `${this.authBaseUrl}/sign-out`;

		// Configures the execution parameters for processing the resource request
		const requestOptions: TRequestOptions = {
			version: 'v1'
		};

		// Executes the resource request and returns an observable response stream
		return this.http.post<IResponse>(requestUrl, null, requestOptions).pipe(
			tap(() => {
				this.session.clearAuthSession();
			})
		);
	}
}
