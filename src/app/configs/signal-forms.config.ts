import { isEmpty, isNumber } from 'lodash-es';
import type { SignalFormsConfig } from '@angular/forms/signals';

/**
 * Defines signal forms configuration by setting dynamic class properties and state rules for the interactive form fields.
 * Processes class structures with field state and status checking to ensure clear visual feedback within the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const signalFormsConfig: SignalFormsConfig = {
	classes: {
		'field-valid': ({ state }) => state().valid(),
		'field-dirty': ({ state }) => state().dirty(),
		'field-invalid': ({ state }) => state().invalid(),
		'field-pristine': ({ state }) => !state().dirty(),
		'field-pending': ({ state }) => state().pending(),
		'field-touched': ({ state }) => state().touched(),
		'field-disabled': ({ state }) => state().disabled(),
		'field-untouched': ({ state }) => !state().touched(),
		'field-required': ({ state }) => !!state().required?.(),
		'field-readonly': ({ state }) => !!state().readonly?.(),
		'field-filled': ({ state }) => {
			const fieldValue = state().value();
			return isNumber(fieldValue) || !isEmpty(fieldValue);
		}
	}
} as const;
