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
	public readonly width = input.required<number>();
	public readonly height = input.required<number>();
	public readonly interactive = input<boolean>(true);
	public readonly mode = input<'light' | 'dark' | 'color'>('color');
	public readonly variant = input<'compact' | 'expanded'>('expanded');
	public readonly destination = input<string | UrlTree>('/', { alias: 'destination ' });
}
