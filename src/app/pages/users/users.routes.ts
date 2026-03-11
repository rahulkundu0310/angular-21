import { Users } from './users';
import { UsersStore } from './users-store';
import type { IRoute } from '@shared/types';
import { UserList } from './user-list/user-list';
import { UserUpdate } from './user-update/user-update';
import { UserCreate } from './user-create/user-create';

/**
 * Defines module routes by configuring all required navigation paths and components for feature access and route controls.
 * Handles route configurations using components mapping to maintain consistent flow and navigation across the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const usersRoutes: IRoute[] = [
	{
		path: '',
		data: { breadcrumb: 'Users' },
		providers: [Users, UsersStore],
		children: [
			{
				path: '',
				title: 'Users',
				component: UserList,
				data: { breadcrumb: { skip: true } }
			},
			{
				path: 'create',
				title: 'Create User',
				component: UserCreate,
				data: { breadcrumb: 'Create User' }
			},
			{
				path: ':id/update',
				title: 'Update User',
				component: UserUpdate,
				data: { breadcrumb: 'Update User' }
			}
		]
	}
];
