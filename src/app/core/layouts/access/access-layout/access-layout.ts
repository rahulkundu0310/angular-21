import { RouterOutlet } from '@angular/router';
import { LayoutStore, ViewTransitionStore } from '@store';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
	imports: [RouterOutlet],
	selector: 'access-layout',
	styleUrl: './access-layout.scss',
	templateUrl: './access-layout.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessLayout {
	// Dependency injections providing direct access to services and injectors
	private readonly layoutStore = inject(LayoutStore);
	private readonly viewTransitionStore = inject(ViewTransitionStore);

	// Public and private class member variables reflecting state and behavior
	protected readonly transitionNames = this.viewTransitionStore.transitionNames;
}
