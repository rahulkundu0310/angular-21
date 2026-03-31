import type { Overlay } from 'primeng/overlay';
import { OverlayModule } from 'primeng/overlay';
import { LucideAngularModule } from 'lucide-angular';
import type { ElementRef, EffectRef } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { FieldState, HostModifier, PreventAutofill } from '@shared/directives';
import type {
	IPasswordStrength,
	IPasswordFieldConfig,
	IDerivedPasswordFieldConfig
} from './password-field.types';
import {
	generateSecurePassword,
	resolvePasswordStrength,
	derivePasswordFieldConfig
} from './password-field-utils';
import {
	input,
	model,
	signal,
	effect,
	computed,
	viewChild,
	Component,
	untracked,
	ChangeDetectionStrategy
} from '@angular/core';

@Component({
	selector: 'password-field',
	styleUrl: './password-field.scss',
	templateUrl: './password-field.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }],
	imports: [OverlayModule, LucideAngularModule, PreventAutofill, FieldState]
})
export class PasswordField implements FormValueControl<string> {
	// Input and output properties reflecting shared state and emitting events
	public readonly value = model<string>('');
	public readonly disabled = input<boolean>(false);
	public readonly config = input.required<IDerivedPasswordFieldConfig, IPasswordFieldConfig>({
		transform: derivePasswordFieldConfig
	});

	// Public and private class member variables reflecting state and behavior
	protected readonly isMasked = signal<boolean>(true);
	protected readonly overlay = viewChild<Overlay>('overlay');
	protected readonly isOverlayVisible = signal<boolean>(false);
	protected readonly strengthState = signal<IPasswordStrength | null>(null);
	protected readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

	/**
	 * Computes the overlay header string by assessing the active password strength status to provide precise visual feedback.
	 * Returns a dynamically assembled message detailing the established quality ranking or stating minimum length boundaries.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly overlayHeaderLabel = computed<string>(() => {
		// Retrieves config snapshot from the input signal before state resolution
		const { minLength } = this.config();

		// Retrieves strength label value from password state stored within signal
		const strengthLabel = this.strengthState()?.label;

		// Checks if strength label exists and returns a formatted password string
		if (strengthLabel) return `${strengthLabel} password`;

		// Returns minimum length requirement string used as header fallback label
		return `must have at least ${minLength} characters.`;
	});

	/**
	 * Toggles the visual presentation of the password string by alternating between obscured symbols and readable characters.
	 * Processes the boolean signal update by inverting the internal visibility state to accurately reflect requested changes.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected toggleMask(): void {
		// Checks if the field has been disabled by the consumer and returns early
		if (this.disabled()) return;

		// Updates password visibility by inverting boolean to reveal actual state
		this.isMasked.update((masked) => !masked);
	}

	/**
	 * Activates the appearance of the password strength feedback overlay during focus events on the designated input element.
	 * Processes the focus action by checking defined configuration rules to determine whether the overlay should be revealed.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected showFeedbackOverlay(): void {
		// Checks if the field has been disabled by the consumer and returns early
		if (this.disabled()) return;

		// Checks if feedback is provided in config before marking overlay visible
		if (this.config().feedback) this.isOverlayVisible.set(true);
	}

	/**
	 * Dismisses the password strength feedback overlay after evaluating designated keyboard interactions to hide the element.
	 * Processes the keyboard event by validating captured keystrokes against standard closure patterns to update local state.
	 *
	 * @param event - The keyboard interaction object containing the specific input stroke to evaluate valid closing triggers.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected dismissFeedbackOverlay(event: KeyboardEvent): void {
		// Checks if feedback is suppressed or field is disabled and returns early
		if (!this.config().feedback || this.disabled()) return;

		// Determines whether the Tab or Escape keypress should dismiss an overlay
		const shouldDismiss = event.key === 'Tab' || event.code === 'Escape';

		// Checks if key triggered a dismiss while overlay is active before hiding
		if (shouldDismiss && this.isOverlayVisible()) this.isOverlayVisible.set(false);
	}

	/**
	 * Updates the internal password state by reading the current string value directly from the triggered input control node.
	 * Processes the browser action to retrieve the latest character sequence and propagate it to the reactive signal tracker.
	 *
	 * @param event - The generic interaction object containing the target element reference to evaluate submitted keystrokes.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected updatePassword(event: Event): void {
		// Checks if the field has been disabled by the consumer and returns early
		if (this.disabled()) return;

		// Retrieves native input element directly from the event target reference
		const inputElement = event.target as HTMLInputElement;

		// Updates the stored password value with input retrieved from the element
		this.value.set(inputElement.value);
	}

	/**
	 * Generates a secure random password by retrieving an assembled string sequence to populate the underlying input element.
	 * Processes the configuration rules to alter the local value while focusing the field and revealing the feedback overlay.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected generatePassword(): void {
		// Retrieves config snapshot from the input signal before state resolution
		const { feedback, generatable, minLength } = this.config();

		// Checks if feedback or generatable values are inactive and returns early
		if (!feedback || !generatable || this.disabled()) return;

		// Updates the bound value signal by assigning a secure generated password
		this.value.set(generateSecurePassword(minLength));

		// Moves keyboard focus directly onto the input element after value update
		this.inputRef()?.nativeElement.focus();

		// Checks if overlay is currently hidden and makes it visible for feedback
		if (!this.isOverlayVisible()) this.isOverlayVisible.set(true);
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
	 * Watches the underlying password state to track internal property modifications and perform proper strength diagnostics.
	 * Processes the evaluated conditions by checking configuration rules and calculating expected visual feedback attributes.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private readonly watchValue: EffectRef = effect(() => {
		// Retrieves the current password value to be used for strength resolution
		const value = this.value();

		// Executes inner callback without tracking any reactive signal dependency
		untracked<void>(() => {
			// Checks if feedback is enabled in config and updates this strength state
			if (this.config().feedback) {
				this.strengthState.set(resolvePasswordStrength(value));
			}
		});
	});
}
