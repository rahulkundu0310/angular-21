import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'user-create',
	styleUrl: './user-create.scss',
	templateUrl: './user-create.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCreate {}
