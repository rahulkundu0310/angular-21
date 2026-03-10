import type { toastState } from 'ngx-sonner';
import { HostModifier } from '@shared/directives';
import type { IToastAction, TToastId, TToastType } from '@shared/types';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'toast',
	styleUrl: './toast.scss',
	templateUrl: './toast.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }]
})
export class Toast {
	// Input and output properties reflecting shared state and emitting events
	public readonly id = input.required<TToastId>({ alias: 'id' });
	public readonly type = input.required<TToastType>({ alias: 'type' });
	public readonly message = input.required<string>({ alias: 'message' });
	public readonly dismissible = input<boolean>(true, { alias: 'dismissible' });
	public readonly state = input.required<typeof toastState>({ alias: 'state' });
	public readonly action = input<IToastAction | undefined>(undefined, { alias: 'action' });
	public readonly cancel = input<IToastAction | undefined>(undefined, { alias: 'cancel' });
	public readonly description = input<string | undefined>(undefined, { alias: 'description' });
}
