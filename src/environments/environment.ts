import type { IEnvironment } from '@shared/types';

/**
 * Specifies environment configuration by setting applicable environment variables and API endpoints for application deployment.
 * Processes environment property initialization with service URLs and other security keys to maintain consistent configuration.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const environment: IEnvironment = {
	production: true,
	stage: 'production',
	gaId: 'G-XXXXXXXXXX',
	appBaseUrl: 'http://localhost:5454/',
	apiBaseUrl: 'http://localhost:3000/api/',
	mapsApiKey: 'AIzaSyD-1xAbCdEfGhIjKlMnOpQrStUvWxYz012',
	cryptoSecret: 'v3X+YJ+Yz3Tgd9VP5D5x93Mx89knDdsrxGeUepgNEmo='
};
