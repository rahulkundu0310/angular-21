import { AuthStore } from '@core/auth';
import { ErrorState } from '@shared/components/fallbacks';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
	imports: [ErrorState],
	selector: 'internal-server-error',
	styleUrl: './internal-server-error.scss',
	templateUrl: './internal-server-error.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InternalServerError {
	// Dependency injections providing direct access to services and injectors
	private readonly authStore = inject(AuthStore);

	// Public and private class member variables reflecting state and behavior
	protected readonly authenticated = this.authStore.authenticated;
}
