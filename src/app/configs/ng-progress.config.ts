import type { INgProgressConfig } from '@shared/types';

/**
 * Defines NGX progress bar configuration by setting display rules and behavior options for integrated loading indicators.
 * Processes progress configuration with visual styling options to ensure consistent user feedback within the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const ngProgressConfig: INgProgressConfig = {
	min: 8,
	max: 100,
	speed: 350,
	flat: false,
	spinner: true,
	fadeOutSpeed: 50,
	debounceTime: 100,
	trickleSpeed: 230,
	direction: 'ltr+',
	spinnerPosition: 'right',
	trickleFunc: (progress: number): number => {
		if (progress >= 0 && progress < 20) return 10;
		if (progress >= 20 && progress < 50) return 4;
		if (progress >= 50 && progress < 80) return 2;
		if (progress >= 80 && progress < 99) return 0.5;
		return 0;
	}
} as const;
