import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { PlatformStore } from '../../core/layouts/platform';
import { LucideAngularModule } from 'lucide-angular';
import type { IMenuItem } from '../../shared/types';

@Component({
	selector: 'sample',
	imports: [RouterModule, LucideAngularModule],
	templateUrl: './sample.html',
	styleUrl: './sample.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sample {
	private readonly platformStore = inject(PlatformStore);

	public readonly menuItems = this.platformStore.menuItems;
	public readonly breadcrumbs = this.platformStore.breadcrumbs;

	public onToggleMenuItem(menuItem: IMenuItem): void {
		this.platformStore.toggleMenuExpansion(menuItem.id);
	}
}
