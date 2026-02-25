import { compact } from 'lodash-es';
import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
	/**
	 * Transforms input full name by extracting initial characters from name segments via the provided maximum initials limit.
	 * Provides an uppercase initials string using applied extraction to ensure standard name display within valid formatting.
	 *
	 * @param value - The source input string to be fully restructured and processed for initial letter extraction formatting.
	 * @param initialsCount - The numeric limit for maximum initials to collect using standard option of 1 for output control.
	 * @returns A formatted initials string using strict uppercase format for standard name output within visual presentation.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public transform(value: string, initialsCount: 1 | 2 = 1): string {
		// Return empty string if full name input is null, undefined, or empty value
		if (!value) return '';

		// Split trimmed name to segments and remove empty strings using compact method
		const initialLetters = compact(value.trim().split(/\s+/));

		// Extract first character from each name segment for initial letter collection
		const initialSegments = initialLetters.map((segment) => segment[0]);

		// Slice initials to maximum count, join, and convert to uppercase letter format
		return initialSegments.slice(0, initialsCount).join('').toUpperCase();
	}
}
