import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'platform-drawer',
	styleUrl: './platform-drawer.scss',
	templateUrl: './platform-drawer.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformDrawer {}
