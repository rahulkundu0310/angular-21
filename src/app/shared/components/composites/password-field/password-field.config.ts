/**
 * Defines password strength levels by establishing reliable numeric thresholds for the essential validation computations.
 * Processes specific condition mappings across evaluation rules to determine the ultimate security of provided passwords.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const passwordStrengthLevels = {
	weak: 1,
	medium: 2,
	strong: 3
} as const;

/**
 * Defines password strength display by establishing visual meter parameters and corresponding text labels for interfaces.
 * Processes element adjustments alongside proportional divisions to ensure accurate feedback rendering during keystrokes.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const passwordStrengthDisplay = {
	offset: 1,
	ceiling: 2,
	labels: ['weak', 'medium', 'strong'],
	meters: ['33.33%', '66.66%', '100%']
} as const;

/**
 * Defines password character groups by establishing distinct string collections to complete complex security evaluations.
 * Processes specific category assignments mapping alphanumeric and symbolic values to ensure precise pattern comparisons.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const passwordCharacterGroups = {
	symbols: '!@#$%^&*',
	numbers: '1234567890',
	uppercase: 'QWERTYUIOPASDFGHJKLZXCVBNM',
	lowercase: 'qwertyuiopasdfghjklzxcvbnm'
} as const;
