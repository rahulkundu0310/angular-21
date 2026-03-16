import { Toaster } from '@core/services';
import { Overlay } from 'primeng/overlay';
import type { EffectRef } from '@angular/core';
import { AuthEvent, AuthStore } from '@core/auth';
import { flow, head, upperFirst } from 'lodash-es';
import { LucideAngularModule } from 'lucide-angular';
import { Router, RouterModule } from '@angular/router';
import { selectRequestSnapshot } from '@store/request-status';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HostModifier, ImageFallback } from '@shared/directives';
import {
	effect,
	signal,
	inject,
	computed,
	Component,
	untracked,
	ChangeDetectionStrategy
} from '@angular/core';

@Component({
	selector: 'platform-account',
	styleUrl: './platform-account.scss',
	templateUrl: './platform-account.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }],
	imports: [LucideAngularModule, Overlay, RouterModule, ImageFallback, ProgressSpinnerModule]
})
export class PlatformAccount {
	// Dependency injections providing direct access to services and injectors
	private readonly router = inject(Router);
	private readonly toaster = inject(Toaster);
	private readonly authStore = inject(AuthStore);

	// Public and private class member variables reflecting state and behavior
	protected readonly userDetails = this.authStore.userDetails;
	protected readonly accountOverlayVisible = signal<boolean>(false);
	protected readonly requestSnapshot = selectRequestSnapshot(this.authStore, AuthEvent.SIGN_OUT);

	/**
	 * Computes textual monogram representing the authenticated personal account identity through current profile information.
	 * Returns a concatenated uppercase string by extracting the starting character from the provided name fields efficiently.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly nameInitials = computed<string>(() => {
		// Retrieves the user profile details snapshot to derive the name initials
		const userDetails = this.userDetails();

		// Destructures the provided source object to extract necessary properties
		const { first_name, last_name } = userDetails ?? {};

		// Returns an initials string assembled by mapping over both name segments
		return [first_name, last_name].map(flow(upperFirst, head)).join('');
	});

	/**
	 * Toggles the visibility state of the authenticated account overlay while ensuring no pending network request is running.
	 * Processes the execution by evaluating the pending request snapshot before promptly switching the visible overlay state.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected toggleAccountOverlay(): void {
		// Checks if the dispatched request is still in progress and returns early
		if (this.requestSnapshot().pending) return;

		// Updates the account overlay visibility by inverting on each interaction
		this.accountOverlayVisible.update((visible) => !visible);
	}

	/**
	 * Attempts the account sign out procedure by confirming that no overlapping backend transactions are awaiting completion.
	 * Processes the authentication termination by clearing visible account overlay before triggering an assigned store event.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected attemptSignOut(): void {
		// Checks if the dispatched request is still in progress and returns early
		if (this.requestSnapshot().pending) return;

		// Updates the account overlay to a closed state before the sign out event
		this.accountOverlayVisible.set(false);

		// Executes sign out by dispatching the request directly to the auth store
		this.authStore.signOut();
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

			// Checks if the request was rejected and notifies with the relevant error
			if (status === 'rejected') {
				this.toaster.error(message!);
				return;
			}

			// Navigates toward the designated route after the request fully completes
			this.router.navigateByUrl('/sign-in').finally(() => {
				// Shows a success notification to confirm that this request was completed
				this.toaster.success(message!);
			});
		});
	});
}
