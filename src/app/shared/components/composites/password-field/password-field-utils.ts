import { regexConfig } from '@configs';
import { sample, shuffle, times } from 'lodash-es';
import type {
	IPasswordStrength,
	IPasswordFieldConfig,
	IDerivedPasswordFieldConfig
} from './password-field.types';
import {
	passwordStrengthLevels,
	passwordStrengthDisplay,
	passwordCharacterGroups
} from './password-field.config';

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
export function derivePasswordFieldConfig(
	config: IPasswordFieldConfig
): IDerivedPasswordFieldConfig {
	return {
		...config,
		minLength: config.minLength ?? 8,
		feedback: config.feedback ?? false,
		toggleMask: config.toggleMask ?? false,
		generatable: config.generatable ?? false,
		placeholder: config.placeholder ?? 'Enter Password'
	};
}

/**
 * Computes the strength level of a provided password string by evaluating it against predefined regular expression rules.
 * Processes the input by checking multiple criteria to establish a numerical score representing overall passcode quality.
 *
 * @param password - The password string to evaluate for strength level calculation during security validation processing.
 * @returns A numerical value denoting the calculated strength category directly assigned to the input character patterns.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function assessPasswordStrength(password: string): number {
	// Destructures the provided source object to extract necessary properties
	const { weak, medium, strong } = passwordStrengthLevels;

	// Checks if the password meets strong criteria and returns assigned level
	if (regexConfig.strongPassword.test(password)) return strong;

	// Checks if the password meets medium criteria and returns assigned level
	if (regexConfig.mediumPassword.test(password)) return medium;

	// Checks if the password has length above zero and returns assigned level
	if (password.length > 0) return weak;

	// Returns zero as fallback when no strength criteria match valid patterns
	return 0;
}

/**
 * Resolves the provided password string into comprehensive visual indicator metrics alongside exact character inclusions.
 * Processes the derived assessment score by mapping it against predefined display constants creating a structured format.
 *
 * @param password - The password string to evaluate for computing specific rendering metrics and strict structural rules.
 * @returns An assembled object providing the suitable descriptive title alongside precise structural validation booleans.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function resolvePasswordStrength(password: string): IPasswordStrength {
	// Destructures the provided source object to extract necessary properties
	const { ceiling, offset, labels, meters } = passwordStrengthDisplay;

	// Retrieves numeric score representing strength of the evaluated password
	const assessedStrength = assessPasswordStrength(password);

	// Retrieves a clamped strength index by applying Math min against ceiling
	const strengthIndex = Math.min(assessedStrength - offset, ceiling);

	// Returns the strength label meter index and three character type results
	return {
		label: labels[strengthIndex],
		meter: meters[strengthIndex],
		hasNumeric: regexConfig.numeric.test(password),
		hasAlphabet: regexConfig.alphabet.test(password),
		hasSpecial: regexConfig.specialChars.test(password)
	};
}

/**
 * Generates a secure random password by merging essential character groups and filling remaining slots from a mixed pool.
 * Processes randomized selections through advanced sampling methods with exhaustive shuffling to ensure unpredictability.
 *
 * @param minLength - The lowest numeric bound dictating the shortest size allowed when building a secure random password.
 * @returns A reliably constructed random password string satisfying all mandatory character inclusion rules consistently.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function generateSecurePassword(minLength: number): string {
	// Destructures the provided source object to extract necessary properties
	const { symbols, numbers, uppercase, lowercase } = passwordCharacterGroups;

	// Assembles required characters by sampling one entry from every category
	const requiredCharacters = [
		sample([...symbols])!,
		sample([...numbers])!,
		sample([...uppercase])!,
		sample([...lowercase])!
	];

	// Computes the filler count by subtracting required length from minLength
	const fillerCount = Math.max(0, minLength - requiredCharacters.length);

	// Retrieves a combined character pool from all four password type strings
	const characterPool = [...(symbols + numbers + uppercase + lowercase)];

	// Retrieves random characters from pool to satisfy required filler counts
	const fillerCharacters = times(fillerCount, () => sample(characterPool)!);

	// Returns required and filler characters shuffled into the final password
	return shuffle([...requiredCharacters, ...fillerCharacters]).join('');
}
