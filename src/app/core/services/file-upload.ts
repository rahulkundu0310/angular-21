import { Toaster } from './toaster';
import { fileUploadConfig } from '@configs';
import { inject, Injectable } from '@angular/core';
import { formatFileSize, validateFiles } from '@shared/utilities';
import type { IFileValidationError, IFileValidationOptions, TFileType } from '@shared/types';

@Injectable({ providedIn: 'root' })
export class FileUpload {
	// Dependency injections providing direct access to services and injectors
	private toaster = inject(Toaster);

	/**
	 * Retrieves the validation configuration rules including size limits and allowed extensions for the particular file type.
	 * Processes configuration retrieval to enforce strict security policies during file selection and data upload operations.
	 *
	 * @param type - The file type identifier used to identify and retrieve the corresponding upload validation configuration.
	 * @returns A validation options object containing file size limits and accepted extensions for file validation workflows.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public getValidationOptions(type: TFileType): IFileValidationOptions {
		// Retrieves upload configuration rule based on given file type identifier
		const uploadRule = fileUploadConfig[type];

		// Checks if upload rule is present to prevent invalid configuration usage
		if (!uploadRule) {
			throw new Error(`Missing validation configuration for file type ${type}`);
		}

		// Returns validation options object with size limits and allow extensions
		return {
			maxFileSize: uploadRule.maxFileSize,
			fileSizeUnit: uploadRule.fileSizeUnit,
			allowedExtensions: uploadRule.allowedExtensions
		};
	}

	/**
	 * Validates selected files by checking each item for size limits and allowed extensions and provides a refined file list.
	 * Processes file validation with sizing and extension checking to provide validation error details within upload context.
	 *
	 * @param files - The list of file objects to be checked against size limits and accepted extensions for chosen file type.
	 * @param type - This file type identifier is used to select size limits and allowed extensions for the relevant criteria.
	 * @returns An array of file objects containing items that match the configured rules after checks, alerts, and filtering.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public validateFiles(files: File[], type: TFileType): File[] {
		// Retrieves validation criteria options for given file type configuration
		const validationOptions = this.getValidationOptions(type);

		// Validates files against criteria returning array for failed validations
		const validationErrors = validateFiles(files, validationOptions);

		// Notifies user about validation failures via toast messages for feedback
		this.handleValidationErrors(type, validationErrors);

		// Returns filtered array with only files that passed all validation rules
		return this.excludeInvalidFiles(files, validationErrors);
	}

	/**
	 * Handles validation alerts by iterating through every error during each upload and using toast alerts for user feedback.
	 * Processes the error details covering size limits and extension checking to provide clear support during upload actions.
	 *
	 * @param type - The file type identifier used to retrieve specific configuration rule for structuring the error messages.
	 * @param errors - The collection of validation error objects containing rejected files for rendering toast notifications.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private handleValidationErrors(type: TFileType, errors: IFileValidationError[]): void {
		// Returns early if the provided error list contains no validation entries
		if (!errors.length) return;

		// Retrieves the file upload configuration rule based on the provided type
		const uploadRule = fileUploadConfig[type];

		// Iterates through each failing item within the supplied validation array
		for (const error of errors) {
			// Checks if the file size exceeds the maximum limit specified in the rule
			if (error.isSizeExceeded) {
				// Formats maximum file size value into a readable text string for display
				const formattedMaxSize = formatFileSize(uploadRule.maxFileSize);

				// Displays an error message indicating the file exceeds valid size limits
				this.toaster.error(
					`${error.fileName} exceeds the maximum size of ${formattedMaxSize}`
				);

				// Continues to the next iteration of the loop skipping the remaining part
				continue;
			}

			// Checks if the file extension matches valid format specified in the rule
			if (!error.isExtensionValid) {
				// Formats allowed file extensions into uppercase into the readable string
				const extensionsText = error.allowedExtensions
					.map((extension) => extension.toUpperCase())
					.join(' | ');

				// Displays an error message indicating the file omitting valid extensions
				this.toaster.error(
					`${error.fileName} must be one of these types ${extensionsText}`
				);
			}
		}
	}

	/**
	 * Retrieves valid upload files by filtering out entries whose names appear in the given error list before the submission.
	 * Processes name matching against error entries and provides the source list when no issues exist in validation contexts.
	 *
	 * @param files - The list of file objects already checked and still requiring filtering based on the validation findings.
	 * @param errors - The collection of validation error objects describing rejected files used to identify names to exclude.
	 * @returns An array of file objects containing only upload items not referenced by errors, or the source array unchanged.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private excludeInvalidFiles(files: File[], errors: IFileValidationError[]): File[] {
		// Returns early with original files when no validation errors are present
		if (!errors.length) return files;

		// Creates a Set of filenames that failed validation for efficient lookups
		const failedFileNames = new Set(errors.map(({ fileName }) => fileName));

		// Returns valid files by filtering inputs with matching failed file names
		return files.filter((file) => !failedFileNames.has(file.name));
	}
}
