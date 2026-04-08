import { entries } from 'lodash-es';
import { fieldStateConfig } from '@config';
import type { EffectRef } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { Directive, ElementRef, effect, inject } from '@angular/core';

@Directive({ selector: '[fieldState]' })
export class FieldState {
	// Dependency injections providing direct access to services and injectors
	private readonly elementRef = inject(ElementRef<HTMLElement>);
	private readonly field = inject(FormField, { optional: true });

	// Public and private class member variables reflecting state and behavior
	private readonly elementInstance: HTMLElement = this.elementRef.nativeElement;

	/**
	 * Watches the registered form field state to track internal property modifications and trigger dynamic class assignments.
	 * Processes the evaluated conditions by iterating over configuration entries and toggling respective classes on elements.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private readonly watchFieldState: EffectRef = effect(() => {
		// Retrieves current field state from the injected resource when evaluated
		const fieldState = this.field?.state();

		// Checks if field state is missing or invalid and exits current execution
		if (!fieldState) return;

		// Iterates over config entries to toggle element classes using predicates
		entries(fieldStateConfig).forEach(([className, predicate]) => {
			this.elementInstance.classList.toggle(className, predicate(fieldState));
		});
	});
}
