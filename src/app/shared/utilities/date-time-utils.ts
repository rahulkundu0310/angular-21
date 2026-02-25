import { DateTime } from 'luxon';
import { isDate, isNil, isString, toNumber } from 'lodash-es';

/**
 * Determines date validity by verifying input values against instances and format strings for accurate date verification.
 * Processes varied inputs using parsing logic to ensure precise date state integrity confirmation in validation contexts.
 *
 * @param value - The unknown source input containing potential date value to be checked for validation and type checking.
 * @param format - The format string used to parse input for consistent date object interpretation and precise validation.
 * @returns A boolean indicating whether the input represents a valid date instance suitable for date checking operations.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function isValidDate(value: unknown, format = 'yyyy-MM-dd'): boolean {
	// Checks if input value is a DateTime object and ensures that it is valid
	if (DateTime.isDateTime(value)) return value.isValid;

	// Validates native inputs correctly against the internal datetime pattern
	if (isDate(value)) return DateTime.fromJSDate(value).isValid;

	// Validates string inputs correctly against the provided datetime pattern
	if (isString(value)) return DateTime.fromFormat(value, format).isValid;

	// Returns false if the input is not DateTime or Date or valid date string
	return false;
}

/**
 * Determines timestamp validity by checking number or string types within Unix ranges for precise timestamp verification.
 * Processes type checking using timestamp range evaluation to ensure precise time state detection in validation contexts.
 *
 * @param timestamp - The unknown timestamp containing potential time value to be tested for validation and type checking.
 * @returns A boolean indicating whether the input represents a precise time appropriate for time verification operations.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function isTimestamp(timestamp: string | number): boolean {
	// Evaluates the data type of the timestamp to handle each case separately
	switch (typeof timestamp) {
		// Permits fall-through to handle both the strings and numbers input types
		case 'number':
		case 'string': {
			// Normalizes the input timestamp into a numeric integer value for parsing
			const numericTimestamp = toNumber(timestamp);

			// Creates a structured date-time value from the Unix timestamp in seconds
			const parsedTimestamp = DateTime.fromSeconds(numericTimestamp);

			// Retrieves minimum valid timestamp corresponding to 1970-01-01 Unix time
			const minimumTimestamp = DateTime.fromISO('1970-01-01').toUnixInteger();

			// Calculates maximum valid timestamp based on current time plus 100 years
			const maximumTimestamp = DateTime.now().plus({ years: 100 }).toUnixInteger();

			// Checks validity and confirm the timestamp is between min and max values
			return (
				parsedTimestamp.isValid &&
				parsedTimestamp.toUnixInteger() >= minimumTimestamp &&
				parsedTimestamp.toUnixInteger() <= maximumTimestamp
			);
		}

		// Returns false for the non-number and non-string timestamps input values
		default:
			return false;
	}
}

/**
 * Formats current time by converting to specified timezone and applying the output format for time formatting operations.
 * Processes custom time formats with timezone conversion to facilitate standardized output for consistent time rendering.
 *
 * @param timezone - The timezone string identifier for time conversion utilizing the specified zone input for formatting.
 * @param format - The time format string used to configure display layout utilizing default hh:mm a format for rendering.
 * @returns A formatted time string in the specified timezone and custom format string parsed for consistent time display.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function formatTime(timezone: string, format = 'hh:mm a'): string {
	// Retrieves the current datetime value adjusted for the provided timezone
	const formattedTime = DateTime.now().setZone(timezone);

	// Returns the current time utilizing the specified display format pattern
	return formattedTime.toFormat(format);
}

/**
 * Formats date input by converting various date types to formatted string with timezone awareness for date normalization.
 * Processes input formats using conversion and timezone support to facilitate final output for consistent date rendering.
 *
 * @param date - The unknown date input containing potential date elements to be tested for validations and type checking.
 * @param format - The string value containing date format pattern used to format output for consistent date presentation.
 * @param timezone - The optional timezone identifier for date conversion applying the provided zone input for formatting.
 * @returns A formatted date string in the specified output format with timezone context used for consistent date display.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */

export function formatDate(date: unknown, format: string, timezone?: string): string {
	// Returns an empty string if the provided date value is null or undefined
	if (isNil(date)) return '';

	// Initializes local date variable for holding the formatted date instance
	let formattedDate: DateTime | undefined;

	// Evaluates input type and handles date parsing process for normalization
	switch (typeof date) {
		// Permits numeric inputs as a Unix timestamp for date instance conversion
		case 'number':
			formattedDate = DateTime.fromSeconds(date);
			break;

		// Permits string inputs as date objects or Unix timestamps for conversion
		case 'string':
			// Prioritizes timestamp validation to handles numeric strings efficiently
			if (isTimestamp(date)) {
				formattedDate = DateTime.fromSeconds(toNumber(date));
			} else {
				// Retreives the parsed string via a standardized ISO 8601 date formatting
				const parsedIsoDate = DateTime.fromISO(date);

				// Checks if the ISO instance is valid to avoid manual fallback processing
				if (parsedIsoDate.isValid) formattedDate = parsedIsoDate;
				else formattedDate = DateTime.fromJSDate(new Date(date));
			}
			break;

		// Permits Date object inputs as a source during date instances conversion
		case 'object':
			if (isDate(date)) formattedDate = DateTime.fromJSDate(date);
			else if (DateTime.isDateTime(date)) formattedDate = date;
			break;

		// Returns an empty string for unsupported or invalid submitted date value
		default:
			return '';
	}

	// Returns an empty string when date instance is invalid or undefined date
	if (!formattedDate || !formattedDate.isValid) return '';

	// Applies timezone conversion to parsed date if timezone parameter passed
	if (timezone) formattedDate = formattedDate.setZone(timezone);

	// Returns the formatted date instance as a requested string format output
	return formattedDate.toFormat(format);
}
