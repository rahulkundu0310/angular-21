import type { IRoute } from '@shared/types';
import { Sample } from './pages/sample/sample';
import { AccessLayout } from './core/layouts/access';
import { Platform, PlatformStore, PlatformLayout } from '@core/layouts/platform';
import { platformResolver } from './core/layouts/platform/platform-layout/platform-resolver';

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
		data: { scope: 'visitor', layout: 'access' },
		loadChildren: () =>
			import('./pages/access/access.routes').then((module) => module.accessRoutes)
	},
	{
		path: '',
		component: PlatformLayout,
		providers: [Platform, PlatformStore],
		resolve: { platfromResult: platformResolver },
		data: { scope: 'private', layout: 'platform' },
		children: [
			{
				path: 'dashboard',
				component: Sample,
				title: 'Dashboard',
				data: {
					breadcrumb: {
						home: true,
						label: 'Home'
					}
				}
			},
			{
				path: 'users',
				title: 'All Users',
				data: { breadcrumb: 'Users' },
				children: [
					{
						path: '',
						component: Sample,
						data: { breadcrumb: { skip: true } }
					},
					{
						path: 'create',
						component: Sample,
						title: 'Create User',
						data: { breadcrumb: 'Create User' }
					},
					{
						path: 'update',
						component: Sample,
						title: 'Update User',
						data: { breadcrumb: 'Update User' }
					}
				]
			},
			{
				path: 'analytics',
				component: Sample,
				title: 'Analytics',
				data: { breadcrumb: 'Analytics' }
			},
			{
				path: 'settings',
				component: Sample,
				title: 'Settings',
				data: { breadcrumb: 'Settings' }
			}
		]
	}
];
