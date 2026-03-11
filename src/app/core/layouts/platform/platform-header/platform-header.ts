import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'platform-header',
	styleUrl: './platform-header.scss',
	templateUrl: './platform-header.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformHeader {}
