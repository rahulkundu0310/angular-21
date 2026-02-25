export type TEnvironmentStage = 'development' | 'staging' | 'production';

export interface IEnvironment {
	gaId: string;
	apiBaseUrl: string;
	appBaseUrl: string;
	mapsApiKey: string;
	production: boolean;
	cryptoSecret: string;
	stage: TEnvironmentStage;
}
