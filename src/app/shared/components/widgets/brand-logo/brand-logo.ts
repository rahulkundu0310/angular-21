import { RouterLink } from '@angular/router';
import type { UrlTree } from '@angular/router';
import { HostModifier } from '@shared/directives';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'brand-logo',
	styleUrl: './brand-logo.scss',
	templateUrl: './brand-logo.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgOptimizedImage, RouterLink, NgTemplateOutlet],
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }]
})
export class BrandLogo {
	// Input and output properties reflecting shared state and emitting events
	public readonly mode = input<'light' | 'dark' | 'color'>('color');
	public readonly width = input.required<number>({ alias: 'width' });
	public readonly variant = input<'compact' | 'standard'>('standard');
	public readonly height = input.required<number>({ alias: 'height' });
	public readonly interactive = input<boolean>(true, { alias: 'interactive' });
	public readonly destination = input<string | UrlTree>('/', { alias: 'destination ' });
}
