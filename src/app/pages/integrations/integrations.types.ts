export type TIntegrationStatus = 'connected' | 'disconnected' | 'pending' | 'error';

export interface IIntegration {
	id: string;
	icon: string;
	name: string;
	provider: string;
	description: string;
	status: TIntegrationStatus;
}
