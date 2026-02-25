import { RouterLink } from '@angular/router';
import type { IBreadcrumb } from '@shared/types';
import { HostModifier } from '@shared/directives';
import { NgTemplateOutlet } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'breadcrumb',
	styleUrl: './breadcrumb.scss',
	templateUrl: './breadcrumb.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, LucideAngularModule, NgTemplateOutlet],
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }]
})
export class Breadcrumb {
	// Input and output properties reflecting shared state and emitting events
	public readonly requireMultiple = input<boolean>(true);
	public readonly breadcrumbs = input.required<IBreadcrumb[]>();
}
