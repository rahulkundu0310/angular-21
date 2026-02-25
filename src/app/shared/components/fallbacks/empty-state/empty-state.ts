import { HostModifier } from '@shared/directives';
import { LucideAngularModule } from 'lucide-angular';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'empty-state',
	styleUrl: './empty-state.scss',
	imports: [LucideAngularModule],
	templateUrl: './empty-state.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }]
})
export class EmptyState {
	// Input and output properties reflecting shared state and emitting events
	public readonly icon = input<string | null>(null);
	public readonly iconSize = input<number>(20, { alias: 'iconSize ' });
	public readonly message = input.required<string>();
	public readonly iconStrokeWidth = input<number>(2, { alias: 'iconStrokeWidth ' });
}
