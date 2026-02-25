import { NgxSonnerToaster } from 'ngx-sonner';
import { RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-root',
	styleUrl: './app.scss',
	templateUrl: './app.html',
	imports: [RouterOutlet, NgxSonnerToaster],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
