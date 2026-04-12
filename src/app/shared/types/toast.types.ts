import type { TCallback, TFactory, TPromise } from './toolkit.types';
import type { ExternalToast, ToasterProps, ToastT, ToastTypes } from 'ngx-sonner';

export type TToastEntry = ToastT;

export type TToastId = string | number;

export type TToastTheme = ToasterProps['theme'];

export type TToastPromiseId = TToastId | undefined;

export type TToastType = Omit<ToastTypes, 'action'>;

export type TToastPosition = ToasterProps['position'];

export interface IToastOptions extends ExternalToast {}

export type TToastResolver<TValue> = string | TCallback<[value: TValue], string>;

export type TToastPromise<TValue> = TPromise<TValue> | TFactory<TPromise<TValue>>;

export interface TToastActionIcon {
	name: string;
	size: number | string;
	strokeWidth?: number | string;
	absoluteStrokeWidth?: boolean;
	ariaHidden?: boolean | 'true' | 'false';
}

export interface TToastActionTooltip {
	tooltip: string;
	tooltipEvent?: 'focus' | 'hover';
	tooltipPosition?: 'left' | 'top' | 'bottom' | 'right';
}

export interface IToastAction {
	label: string;
	ariaLabel?: string;
	icon?: TToastActionIcon;
	tooltip?: TToastActionTooltip;
	clicked: TCallback<[event?: MouseEvent]>;
}

export type TToastMessagePayload = [message: string, options?: IToastOptions];

export type TToastPromisePayload<TValue> = [
	promise: TToastPromise<TValue>,
	state: IToastPromiseState<TValue>
];

export interface IToastPromiseState<TValue = unknown> extends ExternalToast {
	loading: string;
	error: TToastResolver<unknown>;
	success: TToastResolver<TValue>;
	finally?: TCallback<[], void | TPromise<void>>;
}
