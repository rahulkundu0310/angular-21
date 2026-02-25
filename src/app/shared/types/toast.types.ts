import type { TCallback, TFactory, TPromise } from './toolkit.types';
import type { ExternalToast, ToasterProps, ToastT, ToastTypes } from 'ngx-sonner';

export type TToastEntry = ToastT;

export type TToastId = string | number;

export type TToastTheme = ToasterProps['theme'];

export type TToastPromiseId = TToastId | undefined;

export type TToastType = Omit<ToastTypes, 'action'>;

export interface IToastOptions extends ExternalToast {}

export type TToastPosition = ToasterProps['position'];

export type TToastResolver<TValue> = string | TCallback<[value: TValue], string>;

export type TToastPromise<TValue> = TPromise<TValue> | TFactory<TPromise<TValue>>;

export interface IToastAction {
	label: string;
	onClick: TCallback<[event?: MouseEvent]>;
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
