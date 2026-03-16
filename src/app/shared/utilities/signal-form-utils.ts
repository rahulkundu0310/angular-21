import { isPromise } from './data-type-utils';
import { firstValueFrom, isObservable } from 'rxjs';
import type { WritableSignal } from '@angular/core';
import { disabled, form } from '@angular/forms/signals';
import type { IFormOptions, TFactory, TRecord } from '@shared/types';
import { entries, isBoolean, isFunction, isNil, isEmpty } from 'lodash-es';
import { assertInInjectionContext, isSignal, signal } from '@angular/core';
import type { FieldState, TreeValidationResult } from '@angular/forms/signals';
import type {
	IForm,
	IFormState,
	TFormSchemaPath,
	TFieldPredicate,
	TFieldPredicates,
	TFormStateAction,
	IFormStateOptions
} from '../types';

const nativeForm = form as unknown as IForm;

export function formState<TModel>(
	model: WritableSignal<TModel>,
	options?: IFormStateOptions<TModel>
): IFormState<TModel> {
	assertInInjectionContext(formState);

	const submitted = signal<boolean>(false);

	const {
		name,
		schema,
		action,
		injector,
		onInvalid,
		ignoreValidators,
		focusInvalidField = false
	} = options ?? {};

	const formOptions: IFormOptions<TModel> = {
		name,
		injector,
		submission: {
			ignoreValidators,
			onInvalid: (field, context) => {
				submitted.set(true);

				if (focusInvalidField) {
					let focusOptions: FocusOptions | undefined = undefined;

					if (!isBoolean(focusInvalidField)) focusOptions = focusInvalidField;

					const initialError = field().errorSummary().at(0);
					initialError?.fieldTree().focusBoundControl(focusOptions);
				}

				onInvalid?.(field, context);
			},
			action: (field, context) => {
				submitted.set(false);
				return normalizeAction(action?.(field, context));
			}
		}
	};

	const formTree = !schema
		? nativeForm<TModel>(model, formOptions)
		: nativeForm<TModel>(model, schema, formOptions);

	return { form: formTree, submitted: submitted.asReadonly() };
}

/**
 * Manages conditional field disabling across form schema by applying predicate-based assessment to specified field paths.
 * Processes iteration over mapped definitions, checking for absent instances before enforcing the normalized constraints.
 *
 * @param schemaPath - The form schema path tree containing field instances attached to model properties providing lookup.
 * @param predicates - The field predicate mappings defining conditional rules for named keys requiring status evaluation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function disableFields<TValue extends TRecord>(
	schemaPath: TFormSchemaPath<TValue>,
	predicates: TFieldPredicates<TValue>
): void {
	// Retrieves the validation entries from the predicates schema definitions
	const predicateEntries = entries<TFieldPredicate | undefined>(predicates);

	// Iterates through every single entry in the predicate definition records
	for (const [fieldName, predicate] of predicateEntries) {
		// Retrieves this associated field instance using current field identifier
		const fieldInstance = schemaPath[fieldName];

		// Checks if field instance or predicate is absent and continues iteration
		if (isNil(fieldInstance) || isNil(predicate)) continue;

		// Disables the field instance applying the normalized predicate condition
		disabled(fieldInstance, normalizePredicate(predicate));
	}
}

/**
 * Handles validation accessibility by directing the keyboard focus to the first invalid input element needing correction.
 * Processes error summary to retrieve the initial error and activates the connected control element for error resolution.
 *
 * @param formState - The field state object providing error summary details required to identify the first invalid entry.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function focusInvalidField<TValue extends TRecord>(formState: FieldState<TValue>): void {
	// Retrieves the error summary collection connected with active form state
	const errorSummary = formState.errorSummary();

	// Checks if the error summary contains no entries and returns immediately
	if (isEmpty(errorSummary)) return;

	// Retrieves the first available error object from the summary collections
	const initialError = errorSummary.at(0);

	// Initiates focus on the bound control element of the initial error field
	initialError?.fieldTree().focusBoundControl();
}

/**
 * Normalizes provided predicate inputs into a standard factory function supporting integrated field status specification.
 * Processes signals, boolean values, and callback passthrough creating a uniform wrapper instance for external consumers.
 *
 * @param predicate - The field predicate accepting boolean, signal, or handler types for conditional resolution checking.
 * @returns An executable instance returning boolean output for field disability state evaluation and control constraints.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function normalizePredicate(predicate: TFieldPredicate): TFactory<boolean> {
	// Checks if predicate is signal input and returns unwrapped boolean state
	if (isSignal(predicate)) return () => predicate();

	// Checks if predicate is boolean type and returns static factory instance
	if (isBoolean(predicate)) return () => predicate;

	// Checks if predicate is function input and returns the provided instance
	if (isFunction(predicate)) return predicate;

	// Returns factory function resolving false as fallback for invalid inputs
	return () => false;
}

function normalizeAction<TModel>(
	action: ReturnType<TFormStateAction<TModel>> | undefined
): Promise<TreeValidationResult> {
	if (isNil(action)) return Promise.resolve<TreeValidationResult>(undefined);
	if (isPromise<TreeValidationResult>(action)) return action;
	if (isObservable(action)) return firstValueFrom(action);
	return Promise.resolve<TreeValidationResult>(action);
}
