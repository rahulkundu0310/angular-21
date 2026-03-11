import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'user-list',
	styleUrl: './user-list.scss',
	templateUrl: './user-list.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserList {}
