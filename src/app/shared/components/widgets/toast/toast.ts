import type { toastState } from 'ngx-sonner';
import { TooltipModule } from 'primeng/tooltip';
import { HostModifier } from '@shared/directives';
import { LucideAngularModule } from 'lucide-angular';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import type { IToastAction, TToastId, TToastType } from '@shared/types';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'toast',
	styleUrl: './toast.scss',
	templateUrl: './toast.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }],
	imports: [TooltipModule, LucideAngularModule, ProgressSpinnerModule]
})
export class Toast {
	// Input and output properties reflecting shared state and emitting events
	public readonly id = input.required<TToastId>();
	public readonly message = input.required<string>();
	public readonly dismissible = input<boolean>(true);
	public readonly type = input.required<TToastType>();
	public readonly state = input.required<typeof toastState>();
	public readonly description = input<string | undefined>(undefined);
	public readonly action = input<IToastAction | undefined>(undefined);
	public readonly cancel = input<IToastAction | undefined>(undefined);
}
