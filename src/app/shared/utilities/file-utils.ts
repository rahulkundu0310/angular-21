import { isEmpty, isString } from 'lodash-es';
import type { TFileType, IFileValidationError, IFileValidationOptions } from '../types';

/**
 * Validates uploaded files by checking item size and extension against configured criteria for valid transfer operations.
 * Processes file screening with size and extension checking to supply validation error details during transfer workflows.
 *
 * @param files - The list of input assets for applying validation checks and verifying comprehensive configuration rules.
 * @param options - The validation option object containing maximum size, unit and allowed extensions for rule evaluation.
 * @returns An array of validation error objects containing files info and validation details for failed asset processing.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function validateFiles(
	files: File[],
	options: IFileValidationOptions
): IFileValidationError[] {
	// Returns early with an empty array when no files uploaded for validation
	if (isEmpty(files)) return [];

	// Initializes the empty array to store files which fail validation checks
	const validationErrors: IFileValidationError[] = [];

	// Destructures the provided source object to extract necessary properties
	const { maxFileSize, fileSizeUnit, allowedExtensions } = options;

	// Iterates through every file to perform all individual validation checks
	for (const file of files) {
		// Destructures the provided source object to extract necessary properties
		const { name: fileName, size: fileSize } = file;

		// Converts FileList to array format for iteration and validation handling
		const fileSizeInKilobytes = fileSize / 1024;

		// Converts size from bytes into megabytes for a size comparison operation
		const fileSizeInMegabytes = fileSize / (1024 * 1024);

		// Extracts file extension from the name and normalize to lowercase format
		const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';

		// Validates file extension against allowed extensions list for type check
		const isExtensionValid = allowedExtensions.includes(fileExtension);

		// Converts the maxFileSize from bytes to the suitable unit for comparison
		const maxFileSizeInUnit =
			fileSizeUnit === 'mb' ? maxFileSize / (1024 * 1024) : maxFileSize / 1024;

		// Determines if file size exceeds the maximum limit via size unit setting
		const isSizeExceeded =
			fileSizeUnit === 'mb'
				? fileSizeInMegabytes > maxFileSizeInUnit
				: fileSizeInKilobytes > maxFileSizeInUnit;

		// Checks validity and adds files that failed test criteria into the array
		if (!isExtensionValid || isSizeExceeded) {
			validationErrors.push({
				fileName: fileName,
				fileSize: fileSize,
				isSizeExceeded: isSizeExceeded,
				isExtensionValid: isExtensionValid,
				allowedExtensions: allowedExtensions
			});
		}
	}

	// Returns an array containing files and metadata failing validation rules
	return validationErrors;
}

/**
 * Formats file size by converting bytes to appropriate units and generating readable strings for file size presentations.
 * Processes byte conversion with logarithmic calculation and decimal formatting to provide human-readable size within UI.
 *
 * @param bytes - The file size numeric values in bytes for the transformation and formatting processing execution method.
 * @returns A formatted string containing converted size value with proper unit label for display or presentation purpose.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function formatFileSize(bytes: number): string {
	// Returns empty string for zero or negative bytes to handle the edge case
	if (bytes <= 0) return '';

	// Defines the decimal precision constant for rounding size to two decimal
	const DECIMAL_PRECISION = 2;

	// Defines base-1000 conversion for calculating the metric file size units
	const UNIT_CONVERSION_BASE = 1000;

	// Defines the array of size units from bytes to yottabytes for formatting
	const FILE_SIZE_UNITS = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	// Calculates the proper unit index via logarithmic conversion calculation
	const unitIndex = Math.floor(Math.log(bytes) / Math.log(UNIT_CONVERSION_BASE));

	// Converts byte to appropriate unit by dividing with the calculated power
	const convertedSize = bytes / Math.pow(UNIT_CONVERSION_BASE, unitIndex);

	// Formats converted size to fixed decimal places for the readable display
	const formattedSize = parseFloat(convertedSize.toFixed(DECIMAL_PRECISION));

	// Returns the formatted string combining size value and proper unit label
	return `${formattedSize} ${FILE_SIZE_UNITS[unitIndex]}`;
}

/**
 * Generates Base64 string by converting uploaded file using FileReader API and handling file data for encoding operation.
 * Processes file conversion with promise async handling and error management to supply Base64 data within upload context.
 *
 * @param file - The File object containing uploaded resources for Base64 string generation and content encoding pipeline.
 * @returns A promise containing Base64 encoded string using data URL format for file representation and storage purposes.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export async function generateBase64FromFile(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		// Creates FileReader to handle the file reading and conversion operations
		const fileReader = new FileReader();

		// Defines the load completion handler to process read result successfully
		fileReader.onloadend = () => {
			// Checks result type to resolve with string or reject with error response
			if (isString(fileReader.result)) resolve(fileReader.result);
			else reject(new Error('Failed to convert file to Base64, result is not a string'));
		};

		// Defines error handler to manage all file reading failures in processing
		fileReader.onerror = () => {
			reject(new Error('Failed to read file content because of a processing error'));
		};

		// Initiates file reading process to convert the content to the Base64 URL
		fileReader.readAsDataURL(file);
	});
}

/**
 * Determines file type category by analyzing MIME type and content type for file classification and categorization needs.
 * Processes MIME type validation with pattern matching and type detection to provide file category within upload context.
 *
 * @param mimeType - The MIME type string containing media type identification for file categorization and classification.
 * @returns A file type category incorporating video, image, and documents used for efficient classification and handling.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function getFileType(mimeType: string): TFileType {
	// Normalizes the content type to lowercase style for insensitive matching
	mimeType = mimeType.toLowerCase();

	// Checks if the content format starts with video for video classification
	if (mimeType.startsWith('video/')) return 'video';

	// Checks if the content format starts with image for image classification
	if (mimeType.startsWith('image/')) return 'image';

	// Returns document as default format for all the other content categories
	return 'document';
}
