import { RouterState } from '@core/services';
import { PlatformStore } from '../platform-store';
import { Breadcrumb } from '@shared/components/widgets';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

@Component({
	imports: [Breadcrumb],
	selector: 'platform-topbar',
	styleUrl: './platform-topbar.scss',
	templateUrl: './platform-topbar.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformTopbar {
	// Dependency injections providing direct access to services and injectors
	private readonly routerState = inject(RouterState);
	private readonly platformStore = inject(PlatformStore);

	// Public and private class member variables reflecting state and behavior
	private readonly routeData = this.routerState.routeData;
	protected readonly breadcrumbs = this.platformStore.breadcrumbs;

	/**
	 * Computes the descriptive page caption extracted from current route data configuration to populate the component topbar.
	 * Returns a resolved string providing the designated heading text or null when the matched routing segment lacks content.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly caption = computed<string | null>(() => {
		return this.routeData().caption ?? null;
	});
}
