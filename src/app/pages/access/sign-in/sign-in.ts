import { Toaster } from '@core/services';
import { applicationConfig } from '@configs';
import { AuthEvent, AuthStore } from '@core/auth';
import { Router, RouterLink } from '@angular/router';
import { FieldGroup } from '@shared/components/composites';
import { selectRequestSnapshot } from '@store/request-status';
import { PreventAutofill, TrimInput } from '@shared/directives';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { initialSignInModel, signInSchema, type TSignInModel } from './sign-in.schema';
import {
	effect,
	inject,
	signal,
	Component,
	untracked,
	ChangeDetectionStrategy
} from '@angular/core';

@Component({
	selector: 'sign-in',
	styleUrl: './sign-in.scss',
	templateUrl: './sign-in.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FieldGroup, FormField, TrimInput, PreventAutofill, RouterLink]
})
export class SignIn {
	// Dependency injections providing direct access to services and injectors
	private readonly router = inject(Router);
	private readonly toaster = inject(Toaster);
	private readonly authStore = inject(AuthStore);

	// Public and private class member variables reflecting state and behavior
	protected readonly submitted = signal<boolean>(false);
	private readonly rememberMeKey = applicationConfig.rememberMeKey;
	protected readonly signInModel = signal<TSignInModel>(initialSignInModel);
	private readonly requestSnapshot = selectRequestSnapshot(this.authStore, AuthEvent.SIGN_IN);
	protected readonly signInForm = form<TSignInModel>(this.signInModel, (schema) => {
		validateStandardSchema(schema, signInSchema);
	});

	public signInOnSubmit(event: Event) {
		event.preventDefault();
		this.submitted.set(true);

		if (this.signInForm().invalid()) return;
		this.authStore.signIn(this.signInModel());
	}

	private readonly watchRequestSnapshot = effect(() => {
		const { event, status, message, data } = this.requestSnapshot();

		untracked(() => {
			if (status === 'idle') return;

			if (status === 'pending') {
				// Start loader
				return;
			}

			if (status === 'rejected') {
				// Hide loader
				// Show Toast
				return;
			}

			switch (event) {
				case AuthEvent.SIGN_IN:
					// data is now properly typed as IAuthSession
					console.log(data?.user_details); // Works without bracket notation!
					console.log(data?.access_token);
					// Hide loader
					// Show Toast
					break;
				default:
					break;
			}
		});
	});
}
