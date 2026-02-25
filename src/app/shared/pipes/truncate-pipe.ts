import { Pipe } from '@angular/core';
import { isEmpty, truncate } from 'lodash-es';
import type { PipeTransform } from '@angular/core';

interface ITruncateOptions {
	addEllipsis?: boolean;
	completeWords?: boolean;
}

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
	/**
	 * Transforms input text by shortening to defined character limit with flexible extra options for precise string trimming.
	 * Provides a truncated text string using optional ellipsis and correct word completion integration for output formatting.
	 *
	 * @param value - The source input string to be transformed and processed for standardized text shortening specifications.
	 * @param limit - This maximum character count limit for applied text shortening using precise length control requirement.
	 * @param options - The configuration object containing ellipsis and smart word completion setting for formatting control.
	 * @returns A shortened text string using custom operations for compact output with optional ellipsis and word completion.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public transform(value: string, limit: number, options: ITruncateOptions = {}): string {
		// Checks if the given input value was empty and returns the empty literal
		if (isEmpty(value)) return '';

		// Destructures the provided source object to extract necessary properties
		const { addEllipsis = true, completeWords = false } = options;

		// Returns truncated text based on given character limit and valid options
		return truncate(value, {
			length: limit,
			omission: addEllipsis ? '...' : undefined,
			separator: completeWords ? ' ' : undefined
		});
	}
}
