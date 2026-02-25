import { RouterOutlet } from '@angular/router';
import { PlatformStore } from '../platform-store';
import { LayoutStore, ViewTransitionStore } from '@store';
import { PlatformHeader } from '../platform-header/platform-header';
import { PlatformDrawer } from '../platform-drawer/platform-drawer';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
	selector: 'platform-layout',
	styleUrl: './platform-layout.scss',
	templateUrl: './platform-layout.html',
	imports: [PlatformHeader, PlatformDrawer, RouterOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformLayout {
	// Dependency injections providing direct access to services and injectors
	private readonly layoutStore = inject(LayoutStore);
	private readonly platformStore = inject(PlatformStore);
	private readonly viewTransitionStore = inject(ViewTransitionStore);

	// Public and private class member variables reflecting state and behavior
	protected readonly menuItems = this.platformStore.menuItems;
	protected readonly breadcrumbs = this.platformStore.breadcrumbs;
	protected readonly transitionNames = this.viewTransitionStore.transitionNames;
}
