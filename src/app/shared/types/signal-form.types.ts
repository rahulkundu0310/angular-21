import type { Observable } from 'rxjs';
import type { Injector, Signal, WritableSignal } from '@angular/core';
import type { TCallback, TFactory, TMaybe, TRecord } from '@shared/types';
import type {
	FieldTree,
	SchemaPath,
	SchemaPathTree,
	TreeValidationResult
} from '@angular/forms/signals';

export type TFieldPath = string | number;

export type TFormIgnoreValidators = 'pending' | 'none' | 'all';

export type TFieldPredicate = boolean | Signal<boolean> | TFactory<boolean>;

export type TFieldPredicates<TValue> = Partial<Record<keyof TValue, TFieldPredicate>>;

export type TFormStateSchema<TModel> = object | ((schema: TFormSchemaPath<TModel>) => void);

export type TFormSchemaPath<TValue> = SchemaPathTree<TValue> & TRecord<SchemaPath<unknown>>;

export type TFormConfiguration<TModel> = TFormStateSchema<TModel> | IFormInstanceOptions<TModel>;

export type TFieldTree<TValue = unknown, TNullable extends boolean = false> = TNullable extends true
	? TMaybe<FieldTree<TValue, TFieldPath>>
	: FieldTree<TValue, TFieldPath>;

export type IFormContext<TRootModel, TSubmittedModel = unknown> = {
	readonly root: FieldTree<TRootModel, TFieldPath>;
	readonly submitted: FieldTree<TSubmittedModel, TFieldPath>;
} & {};

export type TFormSubmitHandler<TRootModel, TSubmittedModel = unknown, TReturn = void> = TCallback<
	[
		fieldTree: FieldTree<TRootModel & TSubmittedModel, TFieldPath>,
		context: IFormContext<TRootModel, TSubmittedModel>
	],
	TReturn
>;

export type TFormStateAction<TModel> = TFormSubmitHandler<
	TModel,
	unknown,
	void | TreeValidationResult | Promise<TreeValidationResult> | Observable<TreeValidationResult>
>;

export interface IFormSubmissionOptions<TModel> {
	onInvalid?: TFormSubmitHandler<TModel, unknown>;
	ignoreValidators?: TFormIgnoreValidators;
	action: TFormSubmitHandler<TModel, unknown, Promise<TreeValidationResult>>;
}

export interface IFormInstanceOptions<TModel> {
	name?: string;
	injector?: Injector;
	submission?: IFormSubmissionOptions<TModel>;
}

export type IForm = <TModel>(
	model: WritableSignal<TModel>,
	schemaOrOptions?: TFormConfiguration<TModel>,
	options?: IFormInstanceOptions<TModel> | undefined
) => FieldTree<TModel, TFieldPath>;

export interface IFormStateOptions<TModel> {
	name?: string;
	injector?: Injector;
	schema?: TFormStateSchema<TModel>;
	action?: TFormStateAction<TModel>;
	ignoreValidators?: TFormIgnoreValidators;
	focusInvalidField?: boolean | FocusOptions;
	onInvalid?: TFormSubmitHandler<TModel, unknown>;
}

export interface IFormState<TModel> {
	readonly form: FieldTree<TModel, TFieldPath>;
	readonly submitted: Signal<boolean>;
}
