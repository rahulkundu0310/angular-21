import type { Provider } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { DocumentTitleStrategy } from '../strategies';

/**
 * Provides the document title strategy configuration for automatic browser window title updates across navigation cycles.
 * Enables the concatenation of brand name and active route title to ensure consistent metadata formatting during routing.
 *
 * @returns A provider object containing the abstract title strategy configuration for centralized document title control.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function provideDocumentTitleStrategy(): Provider {
	return {
		provide: TitleStrategy,
		useClass: DocumentTitleStrategy
	};
}
