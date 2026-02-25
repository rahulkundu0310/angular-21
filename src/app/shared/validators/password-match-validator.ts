import { validate } from '@angular/forms/signals';
import type { SchemaPath, RootFieldContext, ValidationError } from '@angular/forms/signals';

/**
 * Initializes the match validator by correlating the password schema fields for dependable input verification operations.
 * Establishes reactive validation verifying password matching and raises errors to sustain checks during form validation.
 *
 * @param passwordField - The primary password schema path to be validated for exact password matching validation process.
 * @param confirmPasswordField - The confirm password schema path to compare with primary password for validation process.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function passwordMatchValidator(
	passwordField: SchemaPath<string>,
	confirmPasswordField: SchemaPath<string>
): void {
	validate(confirmPasswordField, (context: RootFieldContext<string>) => {
		// Retrieves the confirm password value currently under validation process
		const confirmPasswordValue = context.value();

		// Retrieves password content registering as a reactive validation process
		const passwordValue = context.valueOf(passwordField);

		// Returns early with null if either field is empty for required validator
		if (!confirmPasswordValue || !passwordValue) return null;

		// Returns early with null if confirmation matches primary password values
		if (confirmPasswordValue === passwordValue) return null;

		// Returns custom error object whenever both values do not match correctly
		return {
			kind: 'passwordMismatch',
			message: 'Password confirmation does not match'
		} satisfies ValidationError;
	});
}
