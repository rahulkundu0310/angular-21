import type { TPlatformLayoutMode } from '@store';
import { HostModifier } from '@shared/directives';
import { LucideAngularModule } from 'lucide-angular';
import { CommonStore, LayoutStore, ViewportStore } from '@store';
import { PlatformAccount } from '../platform-account/platform-account';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
	selector: 'platform-header',
	styleUrl: './platform-header.scss',
	templateUrl: './platform-header.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucideAngularModule, PlatformAccount],
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }]
})
export class PlatformHeader {
	// Dependency injections providing direct access to services and injectors
	private readonly commonStore = inject(CommonStore);
	private readonly layoutStore = inject(LayoutStore);
	private readonly viewportStore = inject(ViewportStore);

	// Public and private class member variables reflecting state and behavior
	protected readonly initialLoading = this.commonStore.initialLoading;
	private readonly viewportContext = this.viewportStore.viewportContext;
	protected readonly layoutContext = this.layoutStore.platformLayoutContext;

	/**
	 * Toggles the primary structural orientation by evaluating detected viewport constraints and available screen dimensions.
	 * Processes responsive thresholds resolving precise drawer visibility or assigning alternate modes to the provided store.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected toggleLayoutMode(): void {
		// Destructures the provided source object to extract necessary properties
		const { relaxed, compact, stacked } = this.viewportContext();

		// Checks if the layout is stacked prior to toggling the navigation drawer
		if (stacked) {
			this.layoutStore.toggleNavigationDrawerVisibility();
			return;
		}

		// Retrieves the current layout mode before resolving the alternate option
		const layoutMode = this.layoutStore.platformLayoutMode();

		// Initializes a variable to hold the resolved layout mode before updating
		let alternateMode: TPlatformLayoutMode = layoutMode;

		// Checks if the viewport breakpoint is relaxed or compact to resolve mode
		if (relaxed) {
			alternateMode = layoutMode === 'extended' ? 'compact' : 'extended';
		} else if (compact) {
			alternateMode = layoutMode === 'compact' ? 'collapsed' : 'compact';
		}

		// Updates the layout store by applying the resolved alternate layout mode
		this.layoutStore.setPlatformLayoutMode(alternateMode);
	}
}
