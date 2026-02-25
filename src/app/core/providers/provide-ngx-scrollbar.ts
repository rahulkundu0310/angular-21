import type { Provider } from '@angular/core';
import { provideScrollbarOptions } from 'ngx-scrollbar';

/**
 * Provides the custom scrollbar options configuration for consistent scrolling interface visualization across containers.
 * Enables the standardization of scrollbar visibility and appearance properties to maintain seamless application styling.
 *
 * @returns A provider object containing the scrollbar definitions settings for the centralized scrolling interface style.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function provideNgxScrollbar(): Provider {
	return provideScrollbarOptions({
		visibility: 'visible',
		appearance: 'compact',
		trackClass: 'scrollbar-track',
		thumbClass: 'scrollabr-thumb',
		buttonClass: 'scrollbar-button'
	});
}
