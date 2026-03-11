import { Dashboard } from './dashboard';
import type { IRoute } from '@shared/types';
import { DashboardStore } from './dashboard-store';
import { DashboardOverview } from './dashboard-overview/dashboard-overview';

/**
 * Defines module routes by configuring all required navigation paths and components for feature access and route controls.
 * Handles route configurations using components mapping to maintain consistent flow and navigation across the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const dashboardRoutes: IRoute[] = [
	{
		path: '',
		title: 'Dashboard',
		component: DashboardOverview,
		providers: [Dashboard, DashboardStore]
	}
];
