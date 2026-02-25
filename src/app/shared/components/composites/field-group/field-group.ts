import { keys, pickBy, isNil } from 'lodash-es';
import { TooltipModule } from 'primeng/tooltip';
import { HostModifier } from '@shared/directives';
import { LucideAngularModule } from 'lucide-angular';
import type { TField, TRecord } from '@shared/types';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { deriveFieldGroupConfig, resolveFieldGroupAriaLive } from './field-group-utils';
import type {
	IFieldGroupConfig,
	IFieldGroupValidation,
	IDerivedFieldGroupConfig
} from './field-group.types';
import {
	input,
	computed,
	Component,
	ViewEncapsulation,
	ChangeDetectionStrategy
} from '@angular/core';

@Component({
	selector: 'field-group',
	styleUrl: './field-group.scss',
	templateUrl: './field-group.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }],
	imports: [LucideAngularModule, TooltipModule, ProgressSpinnerModule]
})
export class FieldGroup<TValue = unknown> {
	// Input and output properties reflecting shared state and emitting events
	public readonly field = input<TField<TValue>>(null);
	public readonly submitted = input<boolean>(false);
	public readonly config = input.required<IDerivedFieldGroupConfig, IFieldGroupConfig>({
		transform: deriveFieldGroupConfig
	});

	/**
	 * Computes field group required state by checking whether the control instance has a required rule linked for validation.
	 * Returns a boolean value indicating whether the field is mandatory, enabling dynamic interface notifiers and compliance.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly isRequired = computed<boolean>(() => {
		// Retrieves current field instance from input signal for state evaluation
		const fieldInstance = this.field();

		// Checks if field instance missing and returns false for mandatory status
		if (!fieldInstance) return false;

		// Returns mandatory status from field state using required accessor value
		return fieldInstance().required();
	});

	/**
	 * Computes error visibility by evaluating control status, validation faults, and configuration setting for prompt alerts.
	 * Returns a boolean value indicating whether detected errors should be rendered based on control validity or dirty state.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly hasValidationError = computed<boolean>(() => {
		// Retrieves current field instance from input signal for state evaluation
		const fieldInstance = this.field();

		// Checks if field instance missing and returns false for mandatory status
		if (!fieldInstance) return false;

		// Returns error state using submitted errors or invalid using dirty state
		return (
			(this.submitted() && !!fieldInstance().errors()) ||
			(fieldInstance().invalid() && fieldInstance().dirty())
		);
	});

	/**
	 * Computes field group classes by assembling a class list from configuration options for reactive style sheet generation.
	 * Returns a class string indicating the computed styling to provide consistent visible appearance for template rendering.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly groupClasses = computed<string>(() => {
		// Retrieves config snapshot from the input signal before state resolution
		const config = this.config();

		// Retrieves current field instance from input signal for state evaluation
		const fieldInstance = this.field();

		// Retrieves pending status from field instance with config as the default
		const pending = fieldInstance?.().pending() ?? config.pending;

		// Retrieves disabled status using field instance or config as the default
		const disabled = fieldInstance?.().disabled() ?? config.disabled;

		// Retrieves readonly status using field instance or config as the default
		const readonly = fieldInstance?.().readonly?.() ?? config.readonly;

		// Destructures the provided source object to extract necessary properties
		const { size, fluid, inline, styleClass, enableValidation } = config;

		// Constructs a class name boolean map for identifying group style entries
		const fieldGroupClassMap: TRecord<boolean> = {
			'field-group-fluid': fluid,
			'field-group-inline': inline,
			[`field-group-${size}`]: true,
			'field-group-pending': pending,
			'field-group-disabled': disabled,
			'field-group-readonly': readonly,
			[styleClass!]: !isNil(styleClass),
			'field-group-validation': enableValidation
		};

		// Returns enabled keys from class map joined as group style string output
		return keys(pickBy(fieldGroupClassMap)).join(' ');
	});

	/**
	 * Computes form field validation state by matching control faults with schema configuration for focused alert indication.
	 * Returns a structured object containing message, visibility context, and accessibility features for invalid field input.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly validationState = computed<IFieldGroupValidation | null>(() => {
		// Retrieves config snapshot from the input signal before state resolution
		const config = this.config();

		// Retrieves current field instance from input signal for state evaluation
		const fieldInstance = this.field();

		// Checks if field instance exists and is valid before any further actions
		if (!fieldInstance) return null;

		// Retrieves current validation issues from field state with errors output
		const fieldErrors = fieldInstance().errors();

		// Checks if faults are absent or returned list is empty before proceeding
		if (!fieldErrors || !fieldErrors.length) return null;

		// Retrieves the first validation error entry from schema validators array
		const validationError = fieldErrors.at(0)!;

		// Retrieves kind string from validation error for use in aria live lookup
		const validationKind = validationError.kind;

		// Returns a structured validation result object for focused alert display
		return {
			kind: validationKind,
			message: validationError.message,
			id: `${config.inputId}-${validationKind}`,
			ariaLive: resolveFieldGroupAriaLive(validationKind)
		} satisfies IFieldGroupValidation;
	});
}
