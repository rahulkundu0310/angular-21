import type { Signal } from '@angular/core';
import type { EventCreator } from '@ngrx/signals/events';
import type { TCallback, TRecord, TTypedRecord } from '@shared/types';

export type TRequestStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export type TEventsKey<TEvents extends TRecord> = keyof TEvents & string;

export type TRequestEventInput<TEvents extends string = string> = TEvents | readonly TEvents[];

export type TRequestStatusEvent<TEvent extends string = string> =
	| TEvent
	| EventCreator<TEvent, unknown>;

export type TRequestStatusEvents<TEvent extends string = string> =
	| TRequestStatusEvent<TEvent>
	| readonly TRequestStatusEvent<TEvent>[];

export type TRequestStatusRecord<TEvents extends TRecord> = {
	[TEvent in TEventsKey<TEvents>]: IRequestSnapshot<TEvents[TEvent]>;
};

export type TRequestStateUpdater<TEvent extends string = string> = TCallback<
	[IRequestStatusState<TEvent>],
	Partial<IRequestStatusState<TEvent>>
>;

export type TRequestStatusSnapshot<
	TEvents extends TRecord,
	TEventKeys extends TEventsKey<TEvents>
> = {
	[TEvent in TEventKeys]: IRequestEventSnapshot<TEvents, TEvent>;
}[TEventKeys];

export interface IRequestEntity<TData = unknown> {
	data?: TData;
	message: string | null;
	status: TRequestStatus;
}

export interface IRequestSnapshot<TData = unknown> {
	event: string;
	isIdle: boolean;
	isPending: boolean;
	data: TData | null;
	isRejected: boolean;
	isDisabled: boolean;
	isFulfilled: boolean;
	message: string | null;
	status: TRequestStatus;
}

export interface IRequestStatusState<TEvents extends string = string> {
	requests: TTypedRecord<TEvents, IRequestEntity>;
}

export interface IRequestStatusOptions<TEvents extends TRecord = TRecord> {
	resetDelay?: number;
	events?: TRequestStatusEvents<TEventsKey<TEvents>>;
}

export type IRequestStatusPayload<TState extends object, TData = unknown> = {
	message?: string;
	data?: TData | null;
} & Partial<TState>;

export interface IRequestEventSnapshot<
	TEvents extends TRecord,
	TEvent extends TEventsKey<TEvents>
> extends IRequestSnapshot<TEvents[TEvent]> {
	event: TEvent;
}

export interface IRequestStatusSelector {
	event: string;
	store: IRequestStatusStore;
}

export interface IRequestStatusStore<TEvents extends TRecord = TRecord> {
	requestStatus: Signal<TRequestStatusRecord<TEvents>>;
}
