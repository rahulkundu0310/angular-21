import type { Observable } from 'rxjs';

export type TNoop = TCallback<[]>;

export type TKeys<TObject> = keyof TObject;

export interface TRxMethod {
	destroy(): void;
}

export type TNullable<TValue> = TValue | null;

export type TEmptyRecord = Record<never, never>;

export type TPartial<TObject> = Partial<TObject>;

export type TIndexed = Record<string, unknown>;

export type TValueOf<TObject> = TObject[keyof TObject];

export type TMaybe<TValue> = TValue | null | undefined;

export type TFactory<TReturn = unknown> = () => TReturn;

export type TRecord<TValue = unknown> = Record<string, TValue>;

export type TPartialRecord<TObject extends TRecord> = Partial<TObject>;

export type TNoInfer<TValue> = [TValue][TValue extends unknown ? 0 : never];

export type TConstructor<TInstance> = abstract new (...params: never[]) => TInstance;

export type TObservableFactory<TFunction = unknown> = TFactory<Observable<TFunction>>;

export type TWithFallback<TValue, TFallback> = TValue extends undefined ? TFallback : TValue;

export type TTypedRecord<TKeys extends PropertyKey, TValue = unknown> = Record<TKeys, TValue>;

export type TCallback<TParams extends unknown[] = [], TReturn = void> = (
	...params: TParams
) => TReturn;

export type TAsyncCallback<TParams extends unknown[] = [], TReturn = void> = (
	...params: TParams
) => Promise<TReturn>;

export interface TKeyValue<TObject, TKey extends keyof TObject = keyof TObject> {
	key: TKey;
	value: TObject[TKey];
}

export type TPromise<TValue, TFallback = never> = Promise<
	TValue extends TRecord | null | undefined ? TFallback : TValue | TFallback
>;

export type TObservable<TValue, TFallback = never> = Observable<
	TValue extends TRecord | null | undefined ? TFallback : TValue | TFallback
>;

// export type TConstructor<TInstance = unknown, TParams extends unknown[] = unknown[]> = new (
// 	...params: TParams
// ) => TInstance;

export type TCallbackReturn<TParams extends unknown[] = []> =
	| void
	| TCallback<TParams>
	| (TCallback<TParams> | void)[];
