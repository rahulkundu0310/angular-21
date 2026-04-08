import { version } from '@/package.json';
import type { IApplicationConfig } from '@shared/types';

/**
 * Defines system configuration by setting primary application properties and session management options for the platform.
 * Processes theme properties and storage keys to ensure the consistent user preference management within the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const applicationConfig: IApplicationConfig = {
	version: version,
	preloadDelay: 500,
	name: 'Angular 21',
	defaultTheme: 'light',
	rememberMeKey: 'ng-remember-me',
	layoutStateKey: 'ng-layout-state',
	authSessionKey: 'ng-auth-session',
	layoutChannelKey: 'ng-layout-channel'
} as const;
