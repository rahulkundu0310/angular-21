import { AuthStore } from '@core/auth';
import { ErrorState } from '@shared/components/fallbacks';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
	imports: [ErrorState],
	selector: 'page-not-found',
	styleUrl: './page-not-found.scss',
	templateUrl: './page-not-found.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFound {
	// Dependency injections providing direct access to services and injectors
	private readonly authStore = inject(AuthStore);

	// Public and private class member variables reflecting state and behavior
	protected readonly authenticated = this.authStore.authenticated;
}
