import type { IRoute } from '@shared/types';
import { Integrations } from './integrations';
import { IntegrationsStore } from './integrations-store';
import { IntegrationList } from './integration-list/integration-list';

/**
 * Defines module routes by configuring all required navigation paths and components for feature access and route controls.
 * Handles route configurations using components mapping to maintain consistent flow and navigation across the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const integrationsRoutes: IRoute[] = [
	{
		path: '',
		data: { breadcrumb: 'Integrations' },
		providers: [Integrations, IntegrationsStore],
		children: [
			{
				path: '',
				title: 'Integrations',
				component: IntegrationList,
				data: { breadcrumb: { skip: true } }
			}
		]
	}
];
