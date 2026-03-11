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
	}
];

// {
// 	path: 'dashboard',
// 	component: Sample,
// 	title: 'Dashboard',
// 	data: {
// 		breadcrumb: {
// 			home: true,
// 			label: 'Home'
// 		}
// 	}
// },
// {
// 	path: 'users',
// 	title: 'All Users',
// 	data: { breadcrumb: 'Users' },
// 	children: [
// 		{
// 			path: '',
// 			component: Sample,
// 			data: { breadcrumb: { skip: true } }
// 		},
// 		{
// 			path: 'create',
// 			component: Sample,
// 			title: 'Create User',
// 			data: { breadcrumb: 'Create User' }
// 		},
// 		{
// 			path: 'update',
// 			component: Sample,
// 			title: 'Update User',
// 			data: { breadcrumb: 'Update User' }
// 		}
// 	]
// },
// {
// 	path: 'analytics',
// 	component: Sample,
// 	title: 'Analytics',
// 	data: { breadcrumb: 'Analytics' }
// },
// {
// 	path: 'settings',
// 	component: Sample,
// 	title: 'Settings',
// 	data: { breadcrumb: 'Settings' }
// }
