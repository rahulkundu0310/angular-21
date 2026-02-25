import type {
	IFieldGroupConfig,
	IDerivedFieldGroupConfig,
	TFieldValidationAriaLive,
	TFieldValidationAriaLiveMap
} from './field-group.types';

/**
 * Derives the initial field configuration by allocating comprehensive fallback values for consistent interface rendering.
 * Processes the source parameters by merging predefined rules to ensure missing attributes receive compatible assignment.
 *
 * @param config - The partial specification object containing current properties before the resolution process concludes.
 * @returns A normalized derivation object specifying essential styling and functional provisions for evaluated structure.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function deriveFieldGroupConfig(config: IFieldGroupConfig): IDerivedFieldGroupConfig {
	return {
		...config,
		fluid: config.fluid ?? true,
		size: config.size ?? 'large',
		inline: config.inline ?? false,
		pending: config.pending ?? false,
		disabled: config.disabled ?? false,
		readonly: config.readonly ?? false,
		enableValidation: config.enableValidation ?? true
	};
}

/**
 * Determines ARIA live mode by mapping validation kinds to announcement levels for screen readers during priority alerts.
 * Processes kind lookup and fallback selection in a map returning polite when no entry exists within validation contexts.
 *
 * @param validationKind - The validation kind used to evaluate the live mode, falling back to polite when it is unmapped.
 * @returns An ARIA live mode string describing announcement priority for screen readers when validation messages surface.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolveFieldGroupAriaLive(validationKind: string): TFieldValidationAriaLive {
	// Constructs aria live maps using kinds keys with assertive polite values
	const validationAriaLiveMap: TFieldValidationAriaLiveMap = {
		required: 'assertive',
		invalidAddress: 'assertive',
		passwordMismatch: 'assertive',
		invalidPhoneNumber: 'assertive'
	};

	// Returns mapped aria live value via kind key or polite when not provided
	return validationAriaLiveMap[validationKind] ?? 'polite';
}
