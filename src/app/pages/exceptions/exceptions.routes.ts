import type { IRoute } from '@shared/types';
import { AccessDenied } from './access-denied/access-denied';
import { PageNotFound } from './page-not-found/page-not-found';
import { InternalServerError } from './internal-server-error/internal-server-error';

/**
 * Defines module routes by configuring all required navigation paths and components for feature access and route controls.
 * Handles route configurations using components mapping to maintain consistent flow and navigation across the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const exceptionsRoutes: IRoute[] = [
	{
		path: 'access-denied',
		title: 'Access Denied',
		component: AccessDenied
	},
	{
		path: 'page-not-found',
		title: 'Page Not Found',
		component: PageNotFound
	},
	{
		path: 'internal-server-error',
		title: 'Internal Server Error',
		component: InternalServerError
	}
];
