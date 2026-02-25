import type { Provider } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

/**
 * Provides the confirmation service configuration for environment setup defining providers for unified dialog management.
 * Enables the programmatic control of confirmation dialog with adaptable messaging and defined actions callback handling.
 *
 * @returns A provider object containing the confirmation service instance for centralized dialog interaction and control.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function provideConfirmationService(): Provider {
	return {
		provide: ConfirmationService,
		useClass: ConfirmationService
	};
}
