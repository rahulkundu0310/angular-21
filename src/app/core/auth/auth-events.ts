import type { IAuthSession, TTypedRecord } from '@shared/types';

/**
 * Defines supported event identifiers to standardize domain actions to provide reliable, shared references for consumers.
 * Processes compile constraints to ensure unsupported identifiers are detected during reviews within validation contexts.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export type TAuthEvent = (typeof AuthEvent)[keyof typeof AuthEvent];

/**
 * Defines runtime event constants as an object providing stable string identifiers for import statements and comparisons.
 * Validates mapping which ensures results reflect declared keys and supports typed references within validation contexts.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export enum AuthEvent {
	SIGN_IN = 'SIGN_IN',
	SIGN_OUT = 'SIGN_OUT',
	RESET_PASSWORD = 'RESET_PASSWORD',
	FORGOT_PASSWORD = 'FORGOT_PASSWORD'
}

/**
 * Defines an event mapping object schema to associate each event identifier with an expected output format for consumers.
 * Validates rules which assign output forms for each identifier and guide correct typed usage within validation contexts.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export type TAuthEvents = TTypedRecord<TAuthEvent> & {
	[AuthEvent.SIGN_OUT]: void;
	[AuthEvent.RESET_PASSWORD]: void;
	[AuthEvent.SIGN_IN]: IAuthSession;
	[AuthEvent.FORGOT_PASSWORD]: void;
};
