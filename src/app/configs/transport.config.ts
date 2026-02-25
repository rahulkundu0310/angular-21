import type { ITransportConfig } from '@shared/types';

/**
 * Defines transport configuration by setting request options and timeout limit for the HTTP network communication system.
 * Processes retry policies and caching mechanisms to guarantee reliable data transfer performance within the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const transportConfig: ITransportConfig = {
	retryCount: 3,
	timeout: 30000,
	rowsPerPage: 15,
	retryDelay: 1000,
	cacheTime: 5 * 60 * 1000,
	requestHeaders: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
} as const;
