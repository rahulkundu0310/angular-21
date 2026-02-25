import { Logger } from '../services';
import { applicationConfig } from '@configs';
import { inject, Injectable } from '@angular/core';
import type { IAuthSession, TRecord } from '@shared/types';
import { CookieService as Cookie } from 'ngx-cookie-service';
import { isObject, isString, isEmpty, result } from 'lodash-es';
import { encryption, decryption, isNumeric } from '@shared/utilities';

@Injectable({ providedIn: 'root' })
export class Session {
	// Dependency injections providing direct access to services and injectors
	private readonly _logger = inject(Logger);
	private readonly _cookie = inject(Cookie);

	// Public and private class member variables reflecting state and behavior
	private readonly authSessionPath: string = '/';
	private readonly authSessionKey: string = applicationConfig.authSessionKey;

	/**
	 * Persists the user authentication session into strict cookies to preserve current sign-in state across page navigations.
	 * Processes session serialization and encryption to write protected cookie data for reliable uses in validation contexts.
	 *
	 * @param session - The auth session object to be serialized and encrypted and stored in client cookie for safe retrieval.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public persistAuthSession(session: IAuthSession): void {
		try {
			// Removes the existing authentication session from cookies at root access
			this.clearAuthSession();

			// Converts the session object into a JSON string for secure cookie saving
			const serializedSession = JSON.stringify(session);

			// Encrypts the serialized session data using the encryption utility tools
			const encryptedSession = encryption(serializedSession);

			// Stores the encrypted session data in a secure cookie with strict policy
			this._cookie.set(this.authSessionKey, encryptedSession, {
				secure: true,
				sameSite: 'Strict',
				path: this.authSessionPath
			});
		} catch (error) {
			// Logs an error message if the session persistence process attempt failed
			this._logger.error('Failed to persist authentication session', error);
		}
	}

	/**
	 * Retrieves the authentication session from secure cookies to restore the user identity status for approved interactions.
	 * Processes encrypted cookie data and decrypts the session record to return an authentic identity in validation contexts.
	 *
	 * @returns A resolved session object if validation succeeds or null if the retrieval process fails due to corrupt inputs.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public resolveAuthSession(): IAuthSession | null {
		try {
			// Retrieves the encrypted session string from the cookies using given key
			const encryptedSession = this._cookie.get(this.authSessionKey);

			// Checks if the retrieved session string is empty then returns null value
			if (!encryptedSession) return null;

			// Decrypts the encrypted session string back to its original valid format
			const decryptedSession = decryption(encryptedSession);

			// Parses the decrypted JSON string to reconstruct the session object data
			const processedSession = JSON.parse(decryptedSession);

			// Checks if the parsed session object contains valid authentication state
			if (!this.hasValidAuthSession(processedSession)) return null;

			// Returns the fully processed and validated session object to the callers
			return processedSession;
		} catch (error) {
			// Logs the exception details if an error occurs during session resolution
			this._logger.error('Error resolving authentication session', error);

			// Returns null indicating that no valid session could be retrieved safely
			return null;
		}
	}

	/**
	 * Removes the authentication session from secure browser cookies to logout the user from the active application instance.
	 * Processes browser cookie deletion commands to safely clear the saved token and access reference in validation contexts.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public clearAuthSession(): void {
		// Removes the existing authentication session from cookies at root access
		this._cookie.delete(this.authSessionKey, this.authSessionPath);
	}

	/**
	 * Determines if the stored session input contains valid authentication data and structural state for access verification.
	 * Processes object type, validates the access token string and checks the user identifier records in validation contexts.
	 *
	 * @param session - The unknown session object to validate against the defined authentication schema and data constraints.
	 * @returns A boolean indicating whether the session structure is valid and contains all required security record details.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public hasValidAuthSession(session: unknown): session is IAuthSession {
		// Checks if the provided session input is a valid non empty object entity
		if (!isObject(session) || isEmpty(session)) return false;

		// Casts the session input to typed record to enable safer property access
		const typedSession = session as TRecord<string | TRecord>;

		// Checks if the access token property is present and is valid string type
		if (!isString(typedSession['access_token'])) return false;

		// Checks if the user details property is present and is valid object type
		if (!isObject(typedSession['user_details'])) return false;

		// Returns true if the user identifier within details is a numeric integer
		return isNumeric(result(typedSession, 'user_details.id'));
	}
}
