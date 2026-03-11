import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'user-update',
	styleUrl: './user-update.scss',
	templateUrl: './user-update.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserUpdate {}
