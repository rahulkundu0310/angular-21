import type { Observable } from 'rxjs';
import type { Injector, Signal, WritableSignal } from '@angular/core';
import type { TCallback, TFactory, TMaybe, TRecord } from '@shared/types';
import type {
	FieldTree,
	SchemaPath,
	SchemaPathTree,
	TreeValidationResult
} from '@angular/forms/signals';

export type TFormIgnoreValidators = 'pending' | 'none' | 'all';

export type TFieldPredicate = boolean | Signal<boolean> | TFactory<boolean>;

export type TFieldPredicates<TValue> = Partial<Record<keyof TValue, TFieldPredicate>>;

export type TFormStateSchema<TModel> = object | ((schema: TFormSchemaPath<TModel>) => void);

export type TFormSchemaPath<TValue> = SchemaPathTree<TValue> & TRecord<SchemaPath<unknown>>;

export type TFieldTree<TValue = unknown, TNullable extends boolean = false> = TNullable extends true
	? TMaybe<FieldTree<TValue>>
	: FieldTree<TValue>;

export interface IFormContext<TModel> {
	readonly root: FieldTree<TModel>;
	readonly submitted: FieldTree<TModel>;
}

export type TFormSubmitHandler<TModel, TReturn = void> = TCallback<
	[FieldTree<TModel>, IFormContext<TModel>],
	TReturn
>;

export type TFormStateAction<TModel> = TFormSubmitHandler<
	TModel,
	void | TreeValidationResult | Promise<TreeValidationResult> | Observable<TreeValidationResult>
>;

export interface IFormSubmissionOptions<TModel> {
	onInvalid?: TFormSubmitHandler<TModel>;
	ignoreValidators?: TFormIgnoreValidators;
	action: TFormSubmitHandler<TModel, Promise<TreeValidationResult>>;
}

export interface IFormOptions<TModel> {
	name?: string;
	injector?: Injector;
	submission?: IFormSubmissionOptions<TModel>;
}

export type IForm = <TModel>(
	model: WritableSignal<TModel>,
	schemaOrOptions?: TFormStateSchema<TModel> | IFormOptions<TModel>,
	options?: IFormOptions<TModel>
) => FieldTree<TModel>;

export interface IFormStateOptions<TModel> {
	name?: string;
	injector?: Injector;
	schema?: TFormStateSchema<TModel>;
	action?: TFormStateAction<TModel>;
	onInvalid?: TFormSubmitHandler<TModel>;
	ignoreValidators?: TFormIgnoreValidators;
	focusInvalidField?: boolean | FocusOptions;
}

export interface IFormState<TModel> {
	readonly form: FieldTree<TModel>;
	readonly submitted: Signal<boolean>;
}
