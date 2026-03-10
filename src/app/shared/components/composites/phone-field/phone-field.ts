import { CommonStore } from '@store';
import { NgxMaskDirective } from 'ngx-mask';
import { SanitizePipe } from '@shared/pipes';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { LucideAngularModule } from 'lucide-angular';
import type { EffectRef, ElementRef } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { FieldState, HostModifier, PreventAutofill } from '@shared/directives';
import { derivePhoneFieldConfig, transformCountry } from './phone-field-utils';
import type {
	IPhoneFieldValue,
	IPhoneFieldConfig,
	IPhoneFieldCountry,
	IDerivedPhoneFieldConfig
} from './phone-field.types';
import {
	input,
	model,
	effect,
	inject,
	signal,
	computed,
	Component,
	viewChild,
	untracked,
	ChangeDetectionStrategy
} from '@angular/core';

@Component({
	selector: 'phone-field',
	styleUrl: './phone-field.scss',
	templateUrl: './phone-field.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }],
	imports: [
		FieldState,
		FormsModule,
		SanitizePipe,
		SelectModule,
		PreventAutofill,
		NgxMaskDirective,
		LucideAngularModule
	]
})
export class PhoneField implements FormValueControl<IPhoneFieldValue | null> {
	// Dependency injections providing direct access to services and injectors
	private readonly commonStore = inject(CommonStore);

	// Input and output properties reflecting shared state and emitting events
	public readonly disabled = input<boolean>(false);
	public readonly value = model<IPhoneFieldValue | null>(null);
	public readonly config = input.required<IDerivedPhoneFieldConfig, IPhoneFieldConfig>({
		alias: 'config',
		transform: derivePhoneFieldConfig
	});

	// Public and private class member variables reflecting state and behavior
	protected readonly phoneNumber = signal<string>('');
	protected readonly selectedCountry = signal<IPhoneFieldCountry | null>(null);
	protected readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

	/**
	 * Computes the complete list of available country profiles by transforming essential store records into tailored objects.
	 * Returns an array of specific entities containing localized phone details alongside precise country flag image resource.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly countries = computed<IPhoneFieldCountry[]>(() => {
		return this.commonStore.countries().map(transformCountry);
	});

	/**
	 * Assigns the specific country profile while clearing existing values to prepare the underlying state for future entries.
	 * Processes the transition by moving keyboard focus onto the primary input element to ensure immediate field interaction.
	 *
	 * @param country - The country object containing distinct localized dialing rules needed for reliable formatting outputs.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected applyCountryFormat(country: IPhoneFieldCountry): void {
		// Checks if the field has been disabled by the consumer and returns early
		if (this.disabled()) return;

		// Updates the bound form value to null before applying a selected country
		this.value.set(null);

		// Updates the phone number to be empty before a country selection applies
		this.phoneNumber.set('');

		// Updates the active country by assigning the incoming regional selection
		this.selectedCountry.set(country);

		// Moves keyboard focus directly onto the input element after value update
		this.inputRef()?.nativeElement.focus();
	}

	/**
	 * Updates the phone number signal from the latest input entry to ensure the visual field and internal state stay aligned.
	 * Processes empty or missing country cases by clearing the bound form value or applying exact details to the field model.
	 *
	 * @param event - The generic interaction object containing the target element reference to evaluate submitted keystrokes.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected updatePhoneNumber(event: Event): void {
		// Checks if the field has been disabled by the consumer and returns early
		if (this.disabled()) return;

		// Retrieves native input element directly from the event target reference
		const inputElement = event.target as HTMLInputElement;

		// Retrieves the currently selected country record from the reactive state
		const selectedCountry = this.selectedCountry();

		// Updates the stored phone number with the value sourced from the element
		this.phoneNumber.set(inputElement.value);

		// Checks if the input or country is missing and resolves the output value
		if (!inputElement.value || !selectedCountry) {
			this.value.set(null);
		} else {
			this.value.set({
				number: inputElement.value,
				dialCode: selectedCountry.dialCode,
				countryCode: selectedCountry.alpha2
			});
		}
	}

	/**
	 * Initiates keyboard focus toward the targeted form field to establish immediate accessibility and seamless interactions.
	 * Processes the focus operation by delegating essential execution parameters seamlessly to the associated native control.
	 *
	 * @param options - The optional configuration dictionary containing preferred scroll behaviors and visibility attributes.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public focus(options?: FocusOptions): void {
		this.inputRef()?.nativeElement.focus(options);
	}

	/**
	 * Resolves the requested country profile from the transformed regional collection matching the provided search parameter.
	 * Processes the lookup by iterating through the computed array and returning an empty configuration upon unknown entries.
	 *
	 * @param code - The two letter geographic string utilized to correctly recognize and retrieve the proper targeted entity.
	 * @returns A structured country profile corresponding to the exact search letters otherwise deriving an unassigned state.
	 *
	 * @since 10 March 2026
	 * @author Rahul Kundu
	 */
	private resolveCountry(code: string): IPhoneFieldCountry | null {
		return this.countries().find(({ alpha2 }) => alpha2 === code) ?? null;
	}

	/**
	 * Watches the underlying form state to track external property modifications and synchronize reactive reference bindings.
	 * Processes the evaluated conditions by resolving missing values and applying exact character inputs avoiding recursions.
	 *
	 * @since 10 March 2026
	 * @author Rahul Kundu
	 */
	private readonly watchValue: EffectRef = effect(() => {
		// Retrieves the current password value to be used for strength resolution
		const value = this.value();

		// Executes inner callback without tracking any reactive signal dependency
		untracked<void>(() => {
			// Retrieves the currently selected country record from the reactive state
			const selectedCountry = this.selectedCountry();

			// Checks if the current value is null and resets the internal field state
			if (!value) {
				// Updates the phone number to be empty before a country selection applies
				this.phoneNumber.set('');

				// Checks if country is not resolved yet before falling back to US default
				if (!selectedCountry) {
					this.selectedCountry.set(this.resolveCountry('US'));
				}

				// Returns early from the effect callback after the bound value is cleared
				return;
			}

			// Checks if the region has changed between the selected and current value
			if (selectedCountry?.alpha2 !== value.countryCode) {
				// Retrieves the matching country profile that corresponds to stored value
				const country = this.resolveCountry(value.countryCode);

				// Checks if the resolved country entry exists and applies it to selection
				if (country) this.selectedCountry.set(country);
			}

			// Updates the phone number to reflect the numeric sequence in bound value
			this.phoneNumber.set(value.number);
		});
	});
}
