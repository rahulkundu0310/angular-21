import { NgxSonnerToaster } from 'ngx-sonner';
import { RouterOutlet } from '@angular/router';
import type { AfterViewInit } from '@angular/core';
import { Action } from '@shared/components/widgets';
import { CommonStore, ProgressStore } from '@store';
import { LucideAngularModule } from 'lucide-angular';
import { Preloader } from '@shared/components/fallbacks';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgProgressbar, NgProgressRef } from 'ngx-progressbar';
import { inject, Component, viewChild, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-root',
	styleUrl: './app.scss',
	templateUrl: './app.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		Action,
		Preloader,
		RouterOutlet,
		NgProgressbar,
		NgxSonnerToaster,
		ConfirmDialogModule,
		LucideAngularModule
	]
})
export class App implements AfterViewInit {
	// Dependency injections providing direct access to services and injectors
	private readonly commonStore = inject(CommonStore);
	private readonly progressStore = inject(ProgressStore);

	// Public and private class member variables reflecting state and behavior
	protected readonly initialLoading = this.commonStore.initialLoading;
	protected readonly progressRef = viewChild<NgProgressRef>(NgProgressRef);

	/**
	 * Handles view initialization phase after component views and child content are safely rendered and available for access.
	 * Executes post-render configurations and DOM manipulations to guarantee visual components are prepared for interactions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public ngAfterViewInit(): void {
		this.progressStore.register(this.progressRef());
	}
}
