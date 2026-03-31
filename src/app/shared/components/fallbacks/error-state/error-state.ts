import { HostModifier } from '@shared/directives';
import { Action } from '@shared/components/widgets';
import type { IActionConfig } from '@shared/components/widgets';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

type TErrorAction = Pick<IActionConfig, 'label' | 'ariaLabel' | 'router'>;

@Component({
	imports: [Action],
	selector: 'error-state',
	styleUrl: './error-state.scss',
	templateUrl: './error-state.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }]
})
export class ErrorState {
	// Input and output properties reflecting shared state and emitting events
	public readonly title = input.required<string>();
	public readonly status = input.required<string>();
	public readonly message = input.required<string>();
	public readonly styleClass = input<string | null>(null);
	public readonly actionConfig = input.required<IActionConfig, TErrorAction>({
		transform: (config) => {
			return {
				...config,
				size: 'large',
				type: 'button',
				severity: 'primary'
			};
		}
	});
}
