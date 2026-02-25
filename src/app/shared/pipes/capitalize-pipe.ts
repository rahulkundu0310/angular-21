import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';
import { capitalize, startCase, lowerCase, isEmpty } from 'lodash-es';

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {
	/**
	 * Transforms the given input text by capitalizing first letter or every word based on the provided capitalization option.
	 * Provides a capitalized text string with applied capitalization to keep standard content display during text formatting.
	 *
	 * @param value - The input value string to be transformed and processed for advance capitalization text display behavior.
	 * @param capitalizeAllWords  - The boolean setting to capitalize all words default to false value for formatting control.
	 * @returns A formatted string output with applied casing rules to ensure correct text casing for standardized formatting.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public transform(value: string, capitalizeAllWords = false): string {
		if (isEmpty(value)) return value;
		return capitalizeAllWords ? startCase(lowerCase(value)) : capitalize(value);
	}
}
