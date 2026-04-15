import { RouterState } from '@core/services';
import { RouterOutlet } from '@angular/router';
import type { EffectRef } from '@angular/core';
import type { TPlatformLayoutMode } from '@shared/types';
import { PlatformHeader } from '../platform-header/platform-header';
import { PlatformTopbar } from '../platform-topbar/platform-topbar';
import { PlatformSidebar } from '../platform-sidebar/platform-sidebar';
import { LayoutStore, ViewportStore, ViewTransitionStore } from '@store';
import {
	effect,
	inject,
	computed,
	Component,
	untracked,
	ChangeDetectionStrategy
} from '@angular/core';

@Component({
	selector: 'platform-layout',
	styleUrl: './platform-layout.scss',
	templateUrl: './platform-layout.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PlatformHeader, PlatformSidebar, PlatformTopbar, RouterOutlet]
})
export class PlatformLayout {
	// Dependency injections providing direct access to services and injectors
	private readonly layoutStore = inject(LayoutStore);
	private readonly routerState = inject(RouterState);
	private readonly viewportStore = inject(ViewportStore);
	private readonly viewTransitionStore = inject(ViewTransitionStore);

	// Public and private class member variables reflecting state and behavior
	private readonly routeData = this.routerState.routeData;
	private readonly viewportContext = this.viewportStore.viewportContext;
	protected readonly layoutContext = this.layoutStore.platformLayoutContext;
	protected readonly transitionNames = this.viewTransitionStore.transitionNames;

	/**
	 * Computes the visibility status of the primary navigation topbar containing dynamic page details and interface elements.
	 * Returns a boolean validating whether the current route attributes permit displaying the assigned page navigation panel.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly topbarVisible = computed<boolean>(() => {
		return this.routeData().topbar !== false;
	});

	/**
	 * Watches the reactive viewport context to track screen dimension changes and dynamically adjust structural presentation.
	 * Processes extracted properties by resolving composition states and assigning precise layout mode to the provided store.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private readonly watchViewportContext: EffectRef = effect(() => {
		// Retrieves the viewport context snapshot before performing layout update
		const viewportContext = this.viewportContext();

		// Executes inner callback without tracking any reactive signal dependency
		untracked<void>(() => {
			// Destructures the provided source object to extract necessary properties
			const { relaxed, stacked } = viewportContext;

			// Initializes a variable to hold the resolved layout mode before updating
			let alternateMode: TPlatformLayoutMode = 'collapsed';

			// Checks if the layout is not stacked prior to resolving appropriate mode
			if (!stacked) {
				alternateMode = relaxed ? 'extended' : 'compact';
			}

			// Updates the layout store by applying the resolved alternate layout mode
			this.layoutStore.setPlatformLayoutMode(alternateMode);
		});
	});
}
