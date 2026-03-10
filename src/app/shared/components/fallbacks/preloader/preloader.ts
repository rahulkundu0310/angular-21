import { HostModifier } from '@shared/directives';
import { BrandLogo } from '@shared/components/widgets';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	imports: [BrandLogo],
	selector: 'preloader',
	styleUrl: './preloader.scss',
	templateUrl: './preloader.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }]
})
export class Preloader {
	// Input and output properties reflecting shared state and emitting events
	public readonly branding = input<boolean>(true, { alias: 'branding ' });
	public readonly animation = input<boolean>(false, { alias: 'animation' });
	public readonly message = input<string>('Loading...', { alias: 'message' });
}
