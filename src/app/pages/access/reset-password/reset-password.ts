import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'reset-password',
	styleUrl: './reset-password.scss',
	templateUrl: './reset-password.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPassword {}
