import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'platform-header',
	imports: [],
	templateUrl: './platform-header.html',
	styleUrl: './platform-header.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformHeader {}
