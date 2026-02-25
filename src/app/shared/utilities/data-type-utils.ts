import { isArray, isEmpty, isNumber, isString, isFinite, isNaN, isObject } from 'lodash-es';

/**
 * Determines whether a string represents a finite number by testing numeric formatting and rejecting NaN/Infinity values.
 * Processes type checking using string conversion and analysis to ensure proper numeric detection in validation contexts.
 *
 * @param value - The unknown source input containing possible numeric value to be tested for validation or type checking.
 * @returns A boolean indicating whether the input represents a valid numeric string acceptable for arithmetic operations.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function isNumeric(value: unknown): boolean {
	return (isString(value) || isNumber(value)) && !isNaN(+value) && isFinite(+value);
}

/**
 * Determines actual zero state by confirming number type and performing strict comparison against the numeric zero value.
 * Processes type checking using strict equality evaluation to ensure precise zero value detection in validation contexts.
 *
 * @param value - The number input containing potential numeric zero value to be tested for validations and type checking.
 * @returns A boolean indicating whether the input represents an actual zero number appropriate for arithmetic operations.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function isNumericZero(value: number): boolean {
	return isNumber(value) && value === 0;
}

/**
 * Determines array emptiness by verifying the array type and running emptiness checks for complete array state detection.
 * Processes type checking using emptiness inspection rules to ensure proper array state detection in validation contexts.
 *
 * @param value - The unknown source input containing possible array value to be tested for validations and type checking.
 * @returns A boolean indicating whether the input represents an empty array appropriate for list verification operations.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function isEmptyArray(value: unknown): boolean {
	return isArray(value) && isEmpty(value);
}

/**
 * Determines object emptiness by confirming object type and running emptiness checks for complete object state detection.
 * Processes type checking using emptiness inspection rules to ensure valid object state detection in validation contexts.
 *
 * @param value - The unknown source input containing possible object value to be tested for validations or type checking.
 * @returns A boolean indicating whether the input represents an empty object compatible for data verification operations.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function isEmptyObject(value: unknown): boolean {
	return isObject(value) && isEmpty(value);
}

/**
 * Determines string emptiness by confirming string type and testing blank content for accurate emptiness status checking.
 * Processes type checking using emptiness inspection rules to ensure empty string state detection in validation contexts.
 *
 * @param value - The string input containing potential string value to be tested for string validation and type checking.
 * @returns A boolean indicating whether the input represents an empty string compatible for text verification operations.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function isEmptyString(value: string): boolean {
	return isString(value) && isEmpty(value);
}

/**
 * Determines integer precision by verifying digit count and handling length checking for accurate integer size detection.
 * Processes string conversion utilizing length measurement to ensure correct precision evaluation in validation contexts.
 *
 * @param value - The number input containing numeric entry value to be tested for precision validation and type checking.
 * @param limit - The number input containing integer length limit to be tested strictly for validation and type checking.
 * @returns A boolean indicating whether the input represents a valid precise number compatible for arithmetic operations.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function isPrecise(value: number, limit = 2): boolean {
	return String(value).split('.').at(0)?.length === limit;
}
