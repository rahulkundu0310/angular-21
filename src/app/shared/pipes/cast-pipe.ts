import { Pipe } from '@angular/core';
import type { TConstructor } from '@shared/types';
import type { PipeTransform } from '@angular/core';

@Pipe({ name: 'cast' })
export class CastPipe implements PipeTransform {
	/**
	 * Transforms input value by casting to the specified target type with reliable and effective type conversion and casting.
	 * Provides a typed output by applying type casting to ensure type safety and conversion standards within type operations.
	 *
	 * @param value - The unknown source input of external format to be transformed for comprehensive type casting operations.
	 * @param type - The target class constructor or instance reference used to cast the input value for strict type matching.
	 * @returns A strongly typed result matching the specified target structure for safe usage within strictly typed contexts.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public transform<TTarget>(value: unknown, type: TConstructor<TTarget> | TTarget): TTarget {
		return value as TTarget;
	}
}
