import type { TRecord } from '@shared/types';
import { isEmpty, isNumber, mapValues } from 'lodash-es';
import type { FieldState, SignalFormsConfig, FormField } from '@angular/forms/signals';

/**
 * Defines field state configuration by mapping visual classes to underlying conditions of the interactive input elements.
 * Processes input structures using strict boolean validations to ensure accurate styling feedback within the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const fieldStateConfig: TRecord<(state: FieldState<unknown>) => boolean> = {
	'field-valid': (state) => state.valid(),
	'field-dirty': (state) => state.dirty(),
	'field-invalid': (state) => state.invalid(),
	'field-pristine': (state) => !state.dirty(),
	'field-pending': (state) => state.pending(),
	'field-touched': (state) => state.touched(),
	'field-disabled': (state) => state.disabled(),
	'field-untouched': (state) => !state.touched(),
	'field-required': (state) => !!state.required?.(),
	'field-readonly': (state) => !!state.readonly?.(),
	'field-filled': (state) => {
		const value = state.value();
		return isNumber(value) || !isEmpty(value);
	}
} as const;

/**
 * Defines signal forms configuration by setting dynamic class properties and state rules for the interactive form fields.
 * Processes derived predicates and element tag boundaries to establish consistent visual feedback within the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const signalFormsConfig: SignalFormsConfig = {
	classes: mapValues(fieldStateConfig, (predicate) => {
		return ({ state, element }: FormField<unknown>) => {
			return !element.tagName.includes('-') && predicate(state());
		};
	})
} as const;
