import { ActivatedRoute } from '@angular/router';
import type { TRecord, IRouteData } from '@shared/types';
import { Directive, HostBinding, inject, input } from '@angular/core';
import { join, isEmpty, isString, isArray, entries, trim, isNil } from 'lodash-es';

@Directive({ selector: '[hostModifier]' })
export class HostModifier {
	// Dependency injections providing direct access to services and injectors
	private readonly route = inject(ActivatedRoute);

	// Input and output properties reflecting shared state and emitting events
	public readonly behavior = input<'contents' | 'block' | undefined>(undefined);
	public readonly styleClass = input<string | string[] | TRecord<boolean>>([]);

	/**
	 * Provides current layout string by accessing resolved behavior property for host element style and visual state control.
	 * Processes active behavior retrieval using internal getter reference to maintain consistent display output for the host.
	 *
	 * @returns A resolved output string containing applied modifier option for the host element CSS display property binding.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostBinding('style.display')
	public get hostDisplay(): string {
		return this.resolvedBehavior;
	}

	/**
	 * Provides host design classes by processing assigned input using type checking and filtering for uniform visual context.
	 * Processes input transformation using string, array, or object parsing to maintain styling for intended element display.
	 *
	 * @returns A resolved output string containing formatted style tokens for managed host element HTML attribute management.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostBinding('class')
	public get hostClasses(): string {
		// Retrieves style classes property applied to the host directive instance
		const styleClass = this.styleClass();

		// Checks if the signal value is empty providing blank content immediately
		if (isEmpty(styleClass)) return '';

		// Checks if the signal value is string returning exact output immediately
		if (isString(styleClass)) return styleClass;

		// Checks if the signal value is array joining items to string immediately
		if (isArray(styleClass)) return join(styleClass, ' ');

		// Retrieves filtered entries removing elements when class name is invalid
		const filteredClasses = entries(styleClass).filter(
			([className, condition]) => condition && !isEmpty(trim(className))
		);

		// Returns final class names by mapping items to trim whitespace concisely
		return filteredClasses.map(([className]) => className.trim()).join(' ');
	}

	/**
	 * Provides active modifier behavior by evaluating supplied input value and fallback route context for layout integration.
	 * Processes adaptive selection using assigned priority and snapshot source to maintain consistent host element rendering.
	 *
	 * @returns A modifier behavior output containing the active layout state for the host element style and visual structure.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private get resolvedBehavior(): 'contents' | 'block' {
		// Retrieves specific provided behavior option from instance inputs signal
		const behavior = this.behavior();

		// Checks if behavior exists and returns result immediately when available
		if (!isNil(behavior)) return behavior;

		// Returns route snapshot behavior when no explicit input override present
		return this.snapshotBehavior ?? 'contents';
	}

	/**
	 * Provides route behavior by extracting configuration from activated snapshot allowing fallback default source retrieval.
	 * Processes snapshot analysis using strict comparison ensuring valid implicit modifier matches relevant standard layouts.
	 *
	 * @returns A route behavior output containing snapshot source for verified fallback layout when host property is missing.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private get snapshotBehavior(): 'contents' | 'block' | null {
		// Extract host behavior entry from current activated route snapshot state
		const behavior = (this.route.snapshot.data as IRouteData)?.hostBehavior;

		// Return snapshot behavior when it strictly matches accepted layout input
		return behavior === 'contents' || behavior === 'block' ? behavior : null;
	}
}
