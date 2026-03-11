import { Analytics } from './analytics';
import type { IRoute } from '@shared/types';
import { AnalyticsStore } from './analytics-store';
import { AnalyticsOverview } from './analytics-overview/analytics-overview';

/**
 * Defines module routes by configuring all required navigation paths and components for feature access and route controls.
 * Handles route configurations using components mapping to maintain consistent flow and navigation across the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const analyticsRoutes: IRoute[] = [
	{
		path: '',
		title: 'Analytics',
		component: AnalyticsOverview,
		data: { breadcrumb: 'Analytics' },
		providers: [Analytics, AnalyticsStore]
	}
];
