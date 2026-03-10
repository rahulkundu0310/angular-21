import { ProgressStore } from '@store';
import { RouterState } from '@core/services';
import { NgxSonnerToaster } from 'ngx-sonner';
import { RouterOutlet } from '@angular/router';
import { Action } from '@shared/components/widgets';
import { LucideAngularModule } from 'lucide-angular';
import { Preloader } from '@shared/components/fallbacks';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import type { AfterViewInit, EffectRef } from '@angular/core';
import { NgProgressbar, NgProgressRef } from 'ngx-progressbar';
import {
	effect,
	inject,
	signal,
	Component,
	untracked,
	viewChild,
	ChangeDetectionStrategy
} from '@angular/core';

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
	private readonly routerState = inject(RouterState);
	private readonly progressStore = inject(ProgressStore);

	// Public and private class member variables reflecting state and behavior
	protected readonly isInitialLoading = signal<boolean>(true);
	private readonly navigationEnd = this.routerState.navigationEnd;
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

	/**
	 * Watches the router navigation events to track active routing completions and update initial interface loading contexts.
	 * Processes the evaluated conditions by verifying transition endpoints and applying required overall state modifications.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private readonly watchNavigationEnd: EffectRef = effect(() => {
		// Retrieves the reactive navigation end event captured from router source
		const navigationEnd = this.navigationEnd();

		// Executes inner callback without tracking any reactive signal dependency
		untracked<void>(() => {
			// Checks if the navigation end event is missing before further processing
			if (!navigationEnd) return;

			// Retrieves the current initial loading state to check for view readiness
			const isInitialLoading = this.isInitialLoading();

			// Checks if loading remains active and deactivates it to finish rendering
			if (isInitialLoading) this.isInitialLoading.set(false);
		});
	});
}
