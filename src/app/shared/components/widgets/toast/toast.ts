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
	public readonly id = input.required<TToastId>();
	public readonly type = input.required<TToastType>();
	public readonly message = input.required<string>();
	public readonly dismissible = input<boolean>(true);
	public readonly state = input.required<typeof toastState>();
	public readonly action = input<IToastAction | undefined>(undefined);
	public readonly cancel = input<IToastAction | undefined>(undefined);
	public readonly description = input<string | undefined>(undefined);
}
