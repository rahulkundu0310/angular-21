import { DrawerModule } from 'primeng/drawer';
import { PlatformStore } from '../platform-store';
import { HostModifier } from '@shared/directives';
import { LucideAngularModule } from 'lucide-angular';
import { BrandLogo } from '@shared/components/widgets';
import { CommonStore, LayoutStore, ViewportStore } from '@store';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlatformNavigation } from '../platform-navigation/platform-navigation';

@Component({
	selector: 'platform-sidebar',
	styleUrl: './platform-sidebar.scss',
	templateUrl: './platform-sidebar.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }],
	imports: [BrandLogo, DrawerModule, LucideAngularModule, PlatformNavigation]
})
export class PlatformSidebar {
	// Dependency injections providing direct access to services and injectors
	private readonly commonStore = inject(CommonStore);
	private readonly layoutStore = inject(LayoutStore);
	private readonly platformStore = inject(PlatformStore);
	private readonly viewportStore = inject(ViewportStore);

	// Public and private class member variables reflecting state and behavior
	protected readonly menuItems = this.platformStore.menuItems;
	protected readonly initialLoading = this.commonStore.initialLoading;
	protected readonly viewportContext = this.viewportStore.viewportContext;
	protected readonly layoutContext = this.layoutStore.platformLayoutContext;
	protected readonly navigationDrawerVisible = this.layoutStore.navigationDrawerVisible;

	/**
	 * Closes the navigation drawer by updating the attached visibility attribute to grant a refined and accessible interface.
	 * Processes structural mutations passing a boolean value into the provided state container to enforce element collapsing.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected closeNavigationDrawer(): void {
		this.layoutStore.setNavigationDrawerVisibility(false);
	}
}
