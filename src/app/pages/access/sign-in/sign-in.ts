import { applicationConfig } from '@configs';
import { AuthEvent, AuthStore } from '@core/auth';
import { Action } from '@shared/components/widgets';
import { Router, RouterLink } from '@angular/router';
import type { TSignInModel } from './sign-in.schema';
import type { IOperationState } from '@shared/types';
import type { EffectRef, OnInit } from '@angular/core';
import { decryption, encryption } from '@shared/utilities';
import { Logger, RouterState, Toaster } from '@core/services';
import { selectRequestSnapshot } from '@store/request-status';
import { PreventAutofill, TrimInput } from '@shared/directives';
import { initialSignInModel, signInSchema } from './sign-in.schema';
import { FieldGroup, PasswordField } from '@shared/components/composites';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import {
	effect,
	inject,
	signal,
	computed,
	Component,
	untracked,
	ChangeDetectionStrategy
} from '@angular/core';

@Component({
	selector: 'sign-in',
	styleUrl: './sign-in.scss',
	templateUrl: './sign-in.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FieldGroup, FormField, TrimInput, PreventAutofill, RouterLink, PasswordField, Action]
})
export class SignIn implements OnInit {
	// Dependency injections providing direct access to services and injectors
	private readonly router = inject(Router);
	private readonly logger = inject(Logger);
	private readonly toaster = inject(Toaster);
	private readonly authStore = inject(AuthStore);
	private readonly routerState = inject(RouterState);

	// Public and private class member variables reflecting state and behavior
	protected readonly submitted = signal<boolean>(false);
	protected readonly transitioning = signal<boolean>(false);
	private readonly rememberMeKey = applicationConfig.rememberMeKey;
	protected readonly signInModel = signal<TSignInModel>(initialSignInModel);
	protected readonly requestSnapshot = selectRequestSnapshot(this.authStore, AuthEvent.SIGN_IN);
	protected readonly signInForm = form<TSignInModel>(this.signInModel, (schema) => {
		validateStandardSchema(schema, signInSchema);
	});

	/**
	 * Handles initialization cycle by organizing necessary state structures and applying foundational configuration defaults.
	 * Executes startup actions such as data retrieval, stream subscription, or state configuration for operational readiness.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public ngOnInit(): void {
		this.restoreCredentials();
	}

	/**
	 * Computes the current operation state by merging active transitions and pending requests to drive interactive behaviors.
	 * Returns a resolved object containing the essential reactive properties designed to constrain changes during processing.
	 *
	 * @since 11 March 2026
	 * @author Rahul Kundu
	 */
	protected readonly operationState = computed<IOperationState>(() => {
		// Retrieves the transitioning status needed for computed state resolution
		const transitioning = this.transitioning();

		// Retrieves the pending status from the snapshot for the state resolution
		const { pending } = this.requestSnapshot();

		// Determines the combined processing outcome from all contributing values
		const processing = pending || transitioning;

		// Returns the resolved state derived from the combined processing outcome
		return { loading: processing, disabled: processing };
	});

	/**
	 * Attempts the initial authentication procedure by intercepting incoming submission events to inspect access credentials.
	 * Processes checking the current form validity before dispatching collected authentication models into an assigned store.
	 *
	 * @param event - The generic interaction object containing the target element reference to block default browser reloads.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected attemptSignIn(event: Event): void {
		// Prevents default event behavior to stop unwanted browser page reloading
		event.preventDefault();

		// Checks if the dispatched operation status is disabled and returns early
		if (this.operationState().disabled) return;

		// Updates submitted state to mark the form as ready for validation errors
		this.submitted.set(true);

		// Checks if the form is invalid and prevents submission and returns early
		if (this.signInForm().invalid()) return;

		// Updates transitioning to begin tracking the complete submission process
		this.transitioning.set(true);

		// Executes sign in by dispatching collected form values to the auth store
		this.authStore.signIn(this.signInModel());
	}

	/**
	 * Restores previously secured authentication credentials by extracting an encrypted string from persistent local storage.
	 * Processes decryption and parsing of recovered values to directly update the internal form model for immediate bindings.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private restoreCredentials(): void {
		// Retrieves stored value from local storage by the remember me identifier
		const storedCredentials = localStorage.getItem(this.rememberMeKey);

		// Checks if stored credentials are missing from storage and returns early
		if (!storedCredentials) return;

		// Wraps execution in a try block to catch and handle any thrown exception
		try {
			// Decrypts stored credentials into a usable string for further processing
			const decryptedCredentials = decryption(storedCredentials);

			// Serializes the decrypted string into a parsed object for model patching
			const serializedCredentials = JSON.parse(decryptedCredentials);

			// Updates the form model by merging recovered credentials into each entry
			this.signInModel.update((formModel) => {
				return { ...formModel, ...serializedCredentials };
			});
		} catch (error) {
			this.logger.error('Failed to decrypt or parse credentials', error);
		}
	}

	/**
	 * Watches the reactive request snapshot to track execution phases and coordinate subsequent contextual interface actions.
	 * Processes the evaluated statuses by resolving target events and extracting typed payloads to manage dependent outcomes.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private readonly watchRequestSnapshot: EffectRef = effect(() => {
		// Retrieves the reactive request snapshot to track incoming state changes
		const { status, message } = this.requestSnapshot();

		// Executes inner callback without tracking any reactive signal dependency
		untracked<void>(() => {
			// Checks if the request status is idle or pending state and returns early
			if (status === 'idle' || status === 'pending') return;

			// Updates the submitted state to reflect the request being fully resolved
			this.submitted.set(false);

			// Checks if the request was rejected and notifies with the relevant error
			if (status === 'rejected') {
				this.transitioning.set(false);
				this.toaster.error(message!);
				return;
			}

			// Retrieves the form model snapshot to prepare for credential persistence
			const formModel = this.signInModel();

			// Retrieves current query parameter entries derived from the active route
			const queryParams = this.routerState.queryParams();

			// Retrieves the redirect path from query params falling back to dashboard
			const redirectPath = queryParams?.['redirectUrl'] ?? '/dashboard';

			// Encrypts latest credentials into a secure string for further processing
			const encryptedCredentials = encryption(JSON.stringify(formModel));

			// Checks if remember me is not enabled to purge or retain the credentials
			if (!formModel.rememberMe) localStorage.removeItem(this.rememberMeKey);
			else localStorage.setItem(this.rememberMeKey, encryptedCredentials);

			// Navigates toward the designated route after the request fully completes
			this.router.navigateByUrl(redirectPath).finally(() => {
				// Updates transitioning to cease tracking the complete submission process
				this.transitioning.set(false);

				// Shows an error notification to inform that the request was unsuccessful
				// Shows a success notification to confirm that this request was completed
				this.toaster.success(message!);
			});
		});
	});
}
