import { RouterOutlet } from '@angular/router';
import type { EffectRef } from '@angular/core';
import { PlatformStore } from '../platform-store';
import type { TPlatformLayoutMode } from '@store';
import { PlatformHeader } from '../platform-header/platform-header';
import { PlatformSidebar } from '../platform-sidebar/platform-sidebar';
import { CommonStore, LayoutStore, ViewportStore, ViewTransitionStore } from '@store';
import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';

@Component({
	selector: 'platform-layout',
	styleUrl: './platform-layout.scss',
	templateUrl: './platform-layout.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PlatformHeader, PlatformSidebar, RouterOutlet]
})
export class PlatformLayout {
	// Dependency injections providing direct access to services and injectors
	private readonly commonStore = inject(CommonStore);
	private readonly layoutStore = inject(LayoutStore);
	private readonly platformStore = inject(PlatformStore);
	private readonly viewportStore = inject(ViewportStore);
	private readonly viewTransitionStore = inject(ViewTransitionStore);

	// Public and private class member variables reflecting state and behavior
	protected readonly breadcrumbs = this.platformStore.breadcrumbs;
	protected readonly initialLoading = this.commonStore.initialLoading;
	private readonly viewportContext = this.viewportStore.viewportContext;
	protected readonly layoutContext = this.layoutStore.platformLayoutContext;
	protected readonly transitionNames = this.viewTransitionStore.transitionNames;

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
