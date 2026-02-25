import type { IMenuItem } from '@shared/types';

export const menuItemsConfig: IMenuItem[] = [
	{
		id: 1,
		iconSize: 20,
		label: 'Dashboard',
		routerLink: '/dashboard',
		icon: 'layout-dashboard',
		styleClass: 'menu-item-dashboard'
	},
	{
		id: 2,
		iconSize: 20,
		icon: 'users',
		label: 'Users',
		items: [
			{
				id: 21,
				parent: 2,
				icon: 'list',
				iconSize: 20,
				label: 'All Users',
				routerLink: '/users'
			},
			{
				id: 22,
				parent: 2,
				icon: 'plus',
				iconSize: 20,
				label: 'Create User',
				routerLink: '/users/create'
			},
			{
				id: 23,
				parent: 2,
				iconSize: 20,
				icon: 'pencil',
				label: 'Update User',
				routerLink: '/users/update'
			}
		]
	},
	{
		id: 3,
		iconSize: 20,
		icon: 'chart-bar',
		label: 'Analytics',
		routerLink: '/analytics'
	},
	{
		id: 4,
		iconSize: 20,
		icon: 'settings',
		label: 'Settings',
		routerLink: '/settings'
	}
];
