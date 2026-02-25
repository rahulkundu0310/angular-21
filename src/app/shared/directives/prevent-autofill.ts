import { isEmpty } from 'lodash-es';
import type { TNoop } from '@shared/types';
import { InputNumber } from 'primeng/inputnumber';
import type { AfterViewInit, OnDestroy } from '@angular/core';
import { Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';

@Directive({ selector: '[preventAutofill]' })
export class PreventAutofill<TElement = HTMLInputElement | InputNumber>
	implements AfterViewInit, OnDestroy
{
	// Dependency injections providing direct access to services and injectors
	private readonly renderer = inject(Renderer2);
	private readonly elementRef = inject(ElementRef<TElement>);

	// Public and private class member variables reflecting state and behavior
	private readonly listeners: TNoop[] = [];
	private readonly inputInstance: TElement = this.elementRef.nativeElement;

	/**
	 * Handles view initialization phase after component views and child content are safely rendered and available for access.
	 * Executes post-render configurations and DOM manipulations to guarantee visual components are prepared for interactions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	ngAfterViewInit(): void {
		this.setupAutofillPrevention();
	}

	/**
	 * Intercepts focus on the input field to trigger attribute randomization preventing standard browser autofill mechanisms.
	 * Processes the focus event by enforcing randomized name and autocomplete attributes to maintain strict security context.
	 *
	 * @param event - The focus event object containing control context for field protection against browser autofill actions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostListener('focus', ['$event'])
	public handleFieldFocus(event: FocusEvent): void {
		this.setupAutofillPrevention();
	}

	/**
	 * Intercepts blur on the input field to reapply attribute randomization enforcing persistent browser autofill prevention.
	 * Processes the blur event by regenerating randomized name and autocomplete attributes to stop delayed browser capturing.
	 *
	 * @param event - The leave event object containing control context for field protection through active autofill blocking.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostListener('blur', ['$event'])
	public handleFieldBlur(event: FocusEvent): void {
		this.setupAutofillPrevention();
	}

	/**
	 * Enforces autofill prevention by applying randomized attributes to discourage current browsers from filling form fields.
	 * Processes the input control by reviewing its kinds and applying attribute randomization or tailored handling as needed.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private setupAutofillPrevention(): void {
		// Retrieves native input element handle from injected ElementRef instance
		const inputInstance = this.inputInstance;

		// Evaluates the instance type to determine the autofill prevention method
		switch (true) {
			// Permits handling of PrimeNG InputNumber instances using a custom method
			case inputInstance instanceof InputNumber:
				this.preventInputNumberAutofill(inputInstance);
				break;

			// Permits handling of native input elements by applying random attributes
			case inputInstance instanceof HTMLInputElement:
				this.randomizeInputAttributes(inputInstance);
				break;

			// No operations are performed for unsupported or unrecognized input types
			default:
				break;
		}
	}

	/**
	 * Enforces autofill prevention for PrimeNG InputNumber by targeting its inner input element for direct attribute updates.
	 * Processes this component by applying random names and autocomplete values and refreshing them on focus and blur events.
	 *
	 * @param instance - The Input number instance holding the internal input element reference for renewing random attribute.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private preventInputNumberAutofill(instance: InputNumber): void {
		// Retrieves native HTML input element from InputNumber component instance
		const inputElement = instance.input.nativeElement;

		// Defines closure function to apply random attributes to prevent autofill
		const handleInputRandomization = (): void => {
			this.randomizeInputAttributes(inputElement);
		};

		// Executes the function immediately upon initial protection configuration
		handleInputRandomization();

		// Return early if listeners are active to avoid stacking duplicate events
		if (!isEmpty(this.listeners)) return;

		// Attaches blur and focus event listeners to update attributes on changes
		this.listeners.push(
			this.renderer.listen(inputElement, 'blur', handleInputRandomization),
			this.renderer.listen(inputElement, 'focus', handleInputRandomization)
		);
	}

	/**
	 * Applies random attributes by generating unique attribute strings and assigning them to the input for autofill blocking.
	 * Processes attribute setup using the renderer assignment to ensure secure form input protection against browser capture.
	 *
	 * @param element - The HTML input element containing the target for attribute randomization and secure autofill blocking.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private randomizeInputAttributes(element: HTMLInputElement): void {
		// Generates random string value to assign as unique attribute raw content
		const randomAttributeValue = Math.random().toString(36).slice(-6);

		// Applies the generated string as the name attribute to suppress autofill
		this.renderer.setAttribute(element, 'name', randomAttributeValue);

		// Applies generated string as autocomplete attribute to suppress autofill
		this.renderer.setAttribute(element, 'autocomplete', randomAttributeValue);
	}

	/**
	 * Handles destruction stages by performing clearing operations to prevent memory issues and maintain resource efficiency.
	 * Executes teardown tasks such as unsubscribing from streams, clearing active timers, or releasing all allocated storage.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public ngOnDestroy(): void {
		this.listeners.forEach((listener) => listener());
	}
}
