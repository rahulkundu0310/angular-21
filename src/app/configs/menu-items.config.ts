import type { IMenuItem } from '@shared/types';

/**
 * Defines menu items configuration by mapping visual icon properties and routing structures for navigation accessibility.
 * Processes nested layout elements and interactive links to generate intuitive traversal pathways within the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const menuItemsConfig: IMenuItem[] = [
	{
		id: 1,
		iconSize: 20,
		label: 'Dashboard',
		routerLink: '/dashboard',
		icon: 'layout-dashboard'
	},
	{
		id: 2,
		iconSize: 20,
		icon: 'users',
		label: 'Users',
		routerLink: '/users'
	},
	{
		id: 3,
		iconSize: 20,
		icon: 'settings',
		label: 'Settings',
		items: [
			{
				id: 31,
				parent: 3,
				icon: 'plug',
				iconSize: 20,
				label: 'Integrations',
				routerLink: '/integrations'
			},
			{
				id: 32,
				parent: 3,
				icon: 'chart-bar',
				iconSize: 20,
				label: 'Analytics',
				routerLink: '/analytics'
			}
		]
	}
];
