import type { IRoute } from '@shared/types';
import { accessControlGuard } from '@core/guards';
import { AccessLayout } from './core/layouts/access';
import { Platform, PlatformStore, PlatformLayout, platformResolver } from '@core/layouts/platform';

/**
 * Defines application routes by configuring global layout routing paths and wrappers for module access and route controls.
 * Handles route configurations using lazy load patterns to maintain consistent flow and navigation across the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const appRoutes: IRoute[] = [
	{
		path: '',
		component: AccessLayout,
		canActivate: [accessControlGuard],
		data: { scope: 'visitor', layout: 'access' },
		loadChildren: () =>
			import('./pages/access/access.routes').then((module) => module.accessRoutes)
	},
	{
		path: '',
		component: PlatformLayout,
		canActivate: [accessControlGuard],
		providers: [Platform, PlatformStore],
		resolve: { platfromResult: platformResolver },
		data: { scope: 'private', layout: 'platform' },
		children: [
			{
				path: 'dashboard',
				data: { preload: true, breadcrumb: { home: true, icon: 'house' } },
				loadChildren: () =>
					import('./pages/dashboard/dashboard.routes').then((m) => m.dashboardRoutes)
			},
			{
				path: 'users',
				data: { preload: true },
				loadChildren: () => import('./pages/users/users.routes').then((m) => m.usersRoutes)
			},
			{
				path: 'analytics',
				data: { preload: true },
				loadChildren: () =>
					import('./pages/analytics/analytics.routes').then((m) => m.analyticsRoutes)
			},
			{
				path: 'integrations',
				data: { preload: true },
				loadChildren: () =>
					import('./pages/integrations/integrations.routes').then(
						(m) => m.integrationsRoutes
					)
			}
		]
	},
	{
		path: '',
		data: { preload: true, topbar: false },
		loadChildren: () =>
			import('./pages/exceptions/exceptions.routes').then((m) => m.exceptionsRoutes)
	},
	{
		path: '**',
		redirectTo: '/page-not-found'
	}
];
