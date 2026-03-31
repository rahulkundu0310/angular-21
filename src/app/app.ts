import { DOCUMENT } from '@angular/common';
import { NgxSonnerToaster } from 'ngx-sonner';
import { RouterOutlet } from '@angular/router';
import { Action } from '@shared/components/widgets';
import { CommonStore, ProgressStore } from '@store';
import { LucideAngularModule } from 'lucide-angular';
import { Preloader } from '@shared/components/fallbacks';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import type { AfterViewInit, EffectRef } from '@angular/core';
import { NgProgressbar, NgProgressRef } from 'ngx-progressbar';
import {
	inject,
	effect,
	Component,
	viewChild,
	Renderer2,
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
	private readonly document = inject(DOCUMENT);
	private readonly renderer = inject(Renderer2);
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

	/**
	 * Watches the initial loading status to track essential rendering phases and trigger the required document style updates.
	 * Processes the evaluated conditions by toggling the specified utility class on the body element to mute all transitions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private readonly watchInitialLoading: EffectRef = effect(() => {
		// Retrieves the initial loading status before muting document transitions
		const initialLoading = this.initialLoading();

		// checks if initial loading invokes adding or removing body element class
		if (initialLoading) {
			this.renderer.addClass(this.document.body, 'transitions-muted');
		} else {
			this.renderer.removeClass(this.document.body, 'transitions-muted');
		}
	});
}
