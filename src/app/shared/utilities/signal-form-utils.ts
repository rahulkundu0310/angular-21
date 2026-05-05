import { isPromise } from './data-type-utils';
import { firstValueFrom, isObservable } from 'rxjs';
import type { WritableSignal } from '@angular/core';
import { disabled, form } from '@angular/forms/signals';
import { assertInInjectionContext, isSignal, signal } from '@angular/core';
import type { FieldState, TreeValidationResult } from '@angular/forms/signals';
import { entries, isBoolean, isFunction, isNil, isEmpty, isArray } from 'lodash-es';
import type {
	TRecord,
	TFactory,
	IFormContext,
	TFormFieldTree,
	TFormSubmitOptions,
	IFormRestoreOptions,
	IFormSubmitHandlers,
	IFormInstanceOptions,
	IFormRestoreHandlers
} from '@shared/types';
import type {
	IForm,
	IFormState,
	TFormSchemaPath,
	TFieldPredicate,
	TFieldPredicates,
	TFormStateAction,
	IFormStateOptions
} from '../types';

/**
 * Defines a strictly typed reference to the reactive form factory function enabling specific structural schema creations.
 * Processes inline assertions transforming this external function into an explicit contract ensuring accurate validation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const formSource = form as unknown as IForm;

/**
 * Constructs a reactive form state combining structural field trees with submission tracking from provided source models.
 * Processes provided configuration schemas and handles validation callbacks to manage targeted error focusing operations.
 *
 * @param model - The writable signal instance containing initial entity properties leveraged for establishing form state.
 * @param options - The optional configuration argument providing schema definitions with validation callback preferences.
 * @returns A structured state model combining the configured form tree alongside an immutable execution tracking context.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function formState<TModel>(
	model: WritableSignal<TModel>,
	options?: IFormStateOptions<TModel>
): IFormState<TModel> {
	// Asserts function execution needs an active dependency injection context
	assertInInjectionContext(formState);

	// Initializes a variable to hold boolean indicating form stands submitted
	const submitted = signal<boolean>(false);

	// Destructures the provided source object to extract necessary properties
	const {
		name,
		schema,
		action,
		injector,
		onInvalid,
		ignoreValidators,
		focusInvalidField = false
	} = options ?? {};

	// Retrieves configured submission handlers preserving structural contexts
	// Retrieves configured bound submission handlers preserving current state
	const { processInvalid, processAction } = resolveSubmitHandlers(submitted, {
		action,
		onInvalid,
		focusInvalidField
	});

	// Constructs an option object handling form creation and submission phases
	const formOptions: IFormInstanceOptions<TModel> = {
		name,
		injector,
		submission: {
			ignoreValidators,
			action: processAction,
			onInvalid: processInvalid
		}
	};

	// Retrieves constructed tree instance evaluating structural schema inputs
	const formTree = !schema
		? formSource<TModel>(model, formOptions)
		: formSource<TModel>(model, schema, formOptions);

	// Retrieves configured bound reversions handlers preserving current state
	const { restoreSubmitted, restoreState, restoreFields } = resolveRestoreHandlers(
		model,
		formTree,
		submitted
	);

	// Returns structured object combining configured tree and readonly status
	return {
		restoreFields,
		form: formTree,
		restoreSubmitted,
		restore: restoreState,
		submitted: submitted.asReadonly()
	};
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

/**
 * Normalizes specified action inputs into a standard Promise structure supporting integrated field evaluation operations.
 * Processes omitted inputs alongside observable streams or promise objects producing standard formats for form consumers.
 *
 * @param action - The expected return value containing asynchronous streams or pending promises or direct static outputs.
 * @returns An executable predictable payload resolving into the finalized validation result for upcoming command actions.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function normalizeAction<TModel>(
	action: ReturnType<TFormStateAction<TModel>> | undefined
): Promise<TreeValidationResult> {
	// Checks if action is missing and returns resolved promise with undefined
	if (isNil(action)) return Promise.resolve<TreeValidationResult>(undefined);

	// Checks if action represents promise input and returns provided instance
	if (isPromise<TreeValidationResult>(action)) return action;

	// Checks if action is observable stream and returns converted first value
	if (isObservable(action)) return firstValueFrom(action);

	// Returns action wrapped inside resolved promise ensuring standard format
	return Promise.resolve<TreeValidationResult>(action);
}

/**
 * Resolves configured submission callbacks managing valid and invalid form states during the underlying schema execution.
 * Processes the provided configuration options extracting crucial actions to handle error targeting and expected outcome.
 *
 * @param submitted - The writable boolean indicator tracking ongoing validation status through current execution context.
 * @param options - The specified configuration parameters supplying operational callbacks alongside bound focus behavior.
 * @returns A structured reference containing executable handler mappings designed to process initiated submission phases.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function resolveSubmitHandlers<TModel>(
	submitted: WritableSignal<boolean>,
	options: TFormSubmitOptions<TModel>
): IFormSubmitHandlers<TModel> {
	// Destructures the provided source object to extract necessary properties
	const { action, onInvalid, focusInvalidField = false } = options ?? {};

	// Configures callback handling invalid state updates with focus targeting
	const processInvalid = (field: TFormFieldTree<TModel>, context: IFormContext<TModel>): void => {
		// Updates submitted state passing true indicating validation errors exist
		submitted.set(true);

		// Checks if invalid field focusing preference is enabled for this process
		if (focusInvalidField) {
			// Initializes a variable to hold specific parameters defining field focus
			let focusOptions: FocusOptions | undefined = undefined;

			// Checks if provided property contains explicit parameters beyond boolean
			if (!isBoolean(focusInvalidField)) focusOptions = focusInvalidField;

			// Retrieves the first validation error item from this active form summary
			const initialError = field().errorSummary().at(0);

			// Initiates targeted focus on bound control element for the initial field
			initialError?.fieldTree().focusBoundControl(focusOptions);
		}

		// Executes optional validation error callback resolving provided contexts
		onInvalid?.(field, context);
	};

	// Configures callback handling valid submission resolving async operation
	const processAction = (
		field: TFormFieldTree<TModel>,
		context: IFormContext<TModel>
	): Promise<TreeValidationResult> => {
		// Updates submission state assigning false before proceeding to execution
		submitted.set(false);

		// Returns normalized promise resolution from the optional action callback
		return normalizeAction(action?.(field, context));
	};

	// Returns a specifically typed object resolving valid submission handlers
	return { processInvalid, processAction };
}

/**
 * Resolves configured restoration callbacks managing form state reversions safely during the underlying schema execution.
 * Processes the provided entity model bindings extracting crucial operations to evaluate partial and complete inversions.
 *
 * @param model - The writable signal instance containing initial entity properties leveraged for resetting target states.
 * @param formTree - The structured hierarchy supplying interactive properties crucial for clearing specific form entries.
 * @param submitted - The writable boolean indicator tracking earlier submission status through entire validation context.
 * @returns A structured reference containing executable handler mappings designed to initiate necessary rollback outcome.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function resolveRestoreHandlers<TModel>(
	model: WritableSignal<TModel>,
	formTree: TFormFieldTree<TModel>,
	submitted: WritableSignal<boolean>
): IFormRestoreHandlers<TModel> {
	// Configures callback handling submission state reversals assigning false
	const restoreSubmitted = (): void => submitted.set(false);

	// Configures function handling complete form state restoration procedures
	const restoreState = (options?: IFormRestoreOptions<TModel>): void => {
		// Destructures the provided source object to extract necessary properties
		const { value, markPristine = true, markUnsubmitted = true } = options ?? {};

		// Checks if provided value contains valid entries assigning updated state
		if (!isNil(value) && !isEmpty(value)) model.set(value);

		// Checks if unsubmitted property requires reverting this submission state
		if (markUnsubmitted) restoreSubmitted();

		// Checks if pristine property requires restoring the untouched form state
		if (markPristine) formTree().reset();
	};

	// Configures callback handling partial form restoration targeting entries
	const restoreFields = <TKey extends keyof TModel>(
		fields: TKey | TKey[],
		options?: IFormRestoreOptions<Partial<TModel>>
	): void => {
		// Destructures the provided source object to extract necessary properties
		const { value, markPristine = true, markUnsubmitted = true } = options ?? {};

		// Normalizes provided fields input ensuring array structure for iteration
		const fieldsToRestore = isArray(fields) ? fields : [fields];

		// Checks if provided value contains valid entries assigning partial state
		if (!isNil(value) && !isEmpty(value)) {
			model.update((values) => ({ ...values, ...value }));
		}

		// Checks if unsubmitted property requires reverting this submission state
		if (markUnsubmitted) restoreSubmitted();

		// Checks if pristine property requires restoring untouched field statuses
		if (markPristine) {
			// Iterates through normalized collections performing targeted evaluations
			for (const field of fieldsToRestore) {
				// Retrieves targeted field instance evaluating underlying schema bindings
				const fieldInstance = Reflect.get(formTree, field);

				// Checks if evaluated instance represents valid structure executing reset
				if (isFunction(fieldInstance)) fieldInstance().reset();
			}
		}
	};

	// Returns a specifically typed object resolving form restoration handlers
	return { restoreSubmitted, restoreState, restoreFields };
}
