import { z } from 'zod';

/**
 * Defines a model type inferred from the schema to ensure field values follow consistent shapes and naming for consumers.
 * Processes derived typing to reflect schema rules for each field and enables precise parsing within validation contexts.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export type TSignInModel = z.infer<typeof signInSchema>;

/**
 * Defines a validation schema which describes field rules and messages for dirty or submitted inputs with clear feedback.
 * Processes required checking, length limits, pattern matching to evaluate updates and completion in validation contexts.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const signInSchema = z
	.object({
		rememberMe: z.boolean().default(false),
		password: z
			.string()
			.min(1, 'Please provide a password')
			.max(30, 'Please provide a valid password'),
		email: z
			.string()
			.min(1, 'Please provide an email address')
			.pipe(z.email('Please provide a valid email address'))
	})
	.readonly();

/**
 * Defines initial model values to provide the baseline collection of defaults for fields prior to updates and validation.
 * Processes default values setting a predictable start state, and support consistent checking within validation contexts.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const initialSignInModel: TSignInModel = {
	email: 'r.kundu5@gmail.com',
	password: '123456',
	rememberMe: false
} as const;
