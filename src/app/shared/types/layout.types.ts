export type TAccessLayoutMode = 'compact' | 'extended';

export type TPlatformLayoutMode = 'compact' | 'extended' | 'collapsed';

export interface IAccessLayoutContext {
	compact: boolean;
	extended: boolean;
}

export interface IPlatformLayoutContext {
	compact: boolean;
	extended: boolean;
	collapsed: boolean;
}
