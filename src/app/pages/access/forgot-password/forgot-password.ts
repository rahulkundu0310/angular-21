import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	imports: [RouterLink],
	selector: 'forgot-password',
	styleUrl: './forgot-password.scss',
	templateUrl: './forgot-password.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPassword {}
