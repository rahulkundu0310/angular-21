import { CastPipe } from '@shared/pipes';
import { MenuModule } from 'primeng/menu';
import type { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { HostModifier } from '@shared/directives';
import { PlatformStore } from '../platform-store';
import { LucideAngularModule } from 'lucide-angular';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

@Component({
	selector: 'platform-navigation',
	styleUrl: './platform-navigation.scss',
	templateUrl: './platform-navigation.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }],
	imports: [RouterModule, LucideAngularModule, TooltipModule, MenuModule, CastPipe]
})
export class PlatformNavigation {
	// Dependency injections providing direct access to services and injectors
	private readonly platformStore = inject(PlatformStore);

	// Input and output properties reflecting shared state and emitting events
	public readonly layout = input.required<'extended' | 'compact'>();

	// Public and private class member variables reflecting state and behavior
	protected readonly asMenuItems: MenuItem[] = [];
	protected readonly menuItems = this.platformStore.menuItems;

	/**
	 * Toggles the expansion behavior of the targeted menu item shaping the visual structure to reveal or collapse navigation.
	 * Processes requested identifier by delegating interaction events directly using the provided store for precise behavior.
	 *
	 * @param menuId - The numeric identifier to resolve the target menu item entry for modifying the current expansion state.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected toggleMenuExpansion(menuId: number): void {
		this.platformStore.toggleMenuExpansion(menuId);
	}
}
