import { DateTime } from 'luxon';
import { Pipe } from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import { formatDate } from '@shared/utilities';
import type { PipeTransform } from '@angular/core';
import { isDate, isNumber, isString } from 'lodash-es';

type TTimezoneOptions = Pick<TFormatDateOptions, 'timezone' | 'displayTimezone'>;

type TTimezone = 'auto' | 'EST' | 'EDT' | 'PST' | 'PDT' | 'CST' | 'CDT' | 'MST' | 'MDT';

interface TFormatDateOptions {
	format: string;
	timezone: string;
	includeTimeAgo: boolean;
	displayTimezone: TTimezone;
	includeTimezoneLabel: boolean;
}

@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
	// Public and private class member variables reflecting state and behavior
	private readonly timeAgo = new TimeAgo('en-US');

	/**
	 * Transforms input value by converting mixed data types to string with timezone support for consistent date presentation.
	 * Provides a formatted date string with specific timezone conversion and optional time ago or timezone label integration.
	 *
	 * @param value - The unknown source input which might be number or string or date instance for timezone-aware conversion.
	 * @param options - The configuration object containing timezone, format and time ago display options for date processing.
	 * @returns A formatted date string in the requested timezone, with optional time ago output, and optional timezone label.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public transform(value: unknown, options: Partial<TFormatDateOptions> = {}): string {
		// Destructures the provided source object to extract necessary properties
		const {
			format = 'MMM d, yyyy',
			includeTimeAgo = false,
			displayTimezone = 'auto',
			includeTimezoneLabel = false,
			timezone = 'America/New_York'
		} = options;

		// Initializes a variable by formatting input based upon the configuration
		let formattedDate: string = formatDate(value, format, timezone);

		// Returns early if the formatted date string is invalid to prevent errors
		if (!formattedDate) return '';

		// Checks if the timezone label inclusion is enabled for the output string
		if (includeTimezoneLabel) {
			// Retrieves the timezone abbreviation using the date and display settings
			const timezoneAbbreviation = this.normalizeTimezone(value, {
				timezone,
				displayTimezone
			});

			// Constructs the formatted string via appending the timezone abbreviation
			formattedDate = `${formattedDate} (${timezoneAbbreviation})`;
		}

		// Checks if the elapsed time calculation is enabled for the output string
		if (includeTimeAgo) {
			// Retrieves the normalized date object from the raw value for calculation
			const normalizedDateTime = this.normalizeToDateTime(value);

			// Checks if the formatted date instance exists and has a valid date value
			if (!!normalizedDateTime && normalizedDateTime.isValid) {
				// Retrieves the native JavaScript Date value from the normalized instance
				const normalizedDate = normalizedDateTime.toJSDate();

				// Retrieves the relative time text with the time ago with minute rounding
				const timeAgoLabel = this.timeAgo.format(normalizedDate, 'round-minute');

				// Constructs the formatted string via the appending the elapsed time text
				formattedDate = `${formattedDate} - ${timeAgoLabel}`;
			}
		}

		// Produces the formatted date string after all processing transformations
		return formattedDate;
	}

	/**
	 * Normalizes timezone abbreviation from given date using stored options to provide consistent labels for date formatting.
	 * Processes overrides first or derives abbreviation from the normalized date time with a fallback in validation contexts.
	 *
	 * @param date - The unknown date object which might be number, string, date instance or falsy for timezone normalization.
	 * @param options - The configuration object containing timezone and display timezone options for generated abbreviations.
	 * @returns A normalized timezone abbreviation string or configured override value when valid manual timezone is supplied.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private normalizeTimezone(date: unknown, options: TTimezoneOptions): string {
		// Destructures the provided source object to extract necessary properties
		const { timezone, displayTimezone } = options;

		// Checks if the display timezone is manually configured and returns input
		if (displayTimezone !== 'auto') return displayTimezone;

		// Initializes the value by normalizing input date for timezone extraction
		const dateTime = this.normalizeToDateTime(date);

		// Returns a default fallback timezone abbreviation if the date is invalid
		if (!dateTime || !dateTime.isValid) return 'EST';

		// Returns the timezone abbreviation using the new zone for input instance
		return dateTime.setZone(timezone).toFormat('ZZZZ');
	}

	/**
	 * Transforms the provided source value into a standardized date object instance ensuring unification for date management.
	 * Processes empty checking and type branches for date objects and ISO strings or seconds values in validation procedures.
	 *
	 * @param date - The unknown date object which might be number, string, date instance or falsy for datetime compatibility.
	 * @returns A consistent date time instance or null if the input data is invalid or unsupported for accurate calculations.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private normalizeToDateTime(date: unknown): DateTime | null {
		// Returns early if the input is null or undefined to prevent system error
		if (!date) return null;

		// Checks if the input data is already a valid internal date-time instance
		if (DateTime.isDateTime(date)) return date;

		// Checks if the input is a string and parses it as a ISO 8601 date format
		if (isString(date)) return DateTime.fromISO(date);

		// Checks if the input is a Date object and converts it to internal format
		if (isDate(date)) return DateTime.fromJSDate(date);

		// Checks if the source is a number and interprets it as timestamp seconds
		if (isNumber(date)) return DateTime.fromSeconds(date);

		// Returns null for any input types that do not match the supported format
		return null;
	}
}
