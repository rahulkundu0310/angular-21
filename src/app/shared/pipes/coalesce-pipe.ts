import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

@Pipe({ name: 'coalesce' })
export class CoalescePipe implements PipeTransform {
	/**
	 * Transforms input value by converting missing or empty elements into the provided fallback to maintain text consistency.
	 * Processes string conversion and whitespace trimming to determine if the parsed value requires the specified substitute.
	 *
	 * @param value - The unknown source field which might be string or number or null checked to satisfy template formatting.
	 * @param fallback - The specified alternate text returned whenever the provided argument is identified as an empty field.
	 * @returns A resolved string containing either the initial argument or the assigned substitute for standard presentation.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public transform(value: string | number | null | undefined, fallback: string = '--'): string {
		return String(value ?? '').trim() || fallback;
	}
}
