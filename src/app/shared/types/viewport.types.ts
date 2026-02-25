export type TViewportType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type TDeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';

export type TBreakpoints = Record<Exclude<TViewportType, 'xs'>, number>;

export interface TViewportContext {
	stacked: boolean;
	compact: boolean;
	relaxed: boolean;
	portrait: boolean;
	landscape: boolean;
	touchDevice: boolean;
	hoverCapable: boolean;
	hybridDevice: boolean;
	pointerDevice: boolean;
	freezeColumns: boolean;
	deviceType: TDeviceType;
}
