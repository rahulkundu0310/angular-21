import { DOCUMENT } from '@angular/common';
import type { OnDestroy } from '@angular/core';
import type { TTheme, TThemeAttribute } from '@shared/types';
import { inject, Injectable, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Theme implements OnDestroy {
	// Dependency injections providing direct access to services and injectors
	private readonly document = inject(DOCUMENT);
	private readonly renderer = inject(RendererFactory2).createRenderer(null, null);

	// Public and private class member variables reflecting state and behavior
	private transitionTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

	/**
	 * Applies theme appearance by modifying the root element using an expected visual scheme and specific targeting property.
	 * Processes string evaluations replacing prior styling definitions or attaching custom layout parameters upon assignment.
	 *
	 * @param preset - The chosen style option used to overwrite current design choices ensuring superior palette integration.
	 * @param attribute - The optional key name directing where the provided design gets attached inside the rendered content.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public applyTheme(preset: TTheme, attribute: TThemeAttribute = 'class'): void {
		const documentElement = this.document.documentElement;

		this.renderer.setStyle(documentElement, 'color-scheme', preset);

		if (attribute !== 'class') {
			this.renderer.setAttribute(documentElement, attribute, preset);
			return;
		}

		this.renderer.removeClass(documentElement, 'light');
		this.renderer.removeClass(documentElement, 'dark');
		this.renderer.addClass(documentElement, preset);
	}

	/**
	 * Suppresses visual animations temporarily by appending a custom styling class to the root element blocking color shifts.
	 * Processes layout reflows clearing pending timers and removing the muting class after a scheduled timeout period passes.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public suppressTransitions(): void {
		const documentElement = this.document.documentElement;

		if (this.transitionTimeout) clearTimeout(this.transitionTimeout);

		this.renderer.addClass(documentElement, 'transitions-muted');

		void this.document.body.offsetHeight;

		this.transitionTimeout = setTimeout(() => {
			this.renderer.removeClass(documentElement, 'transitions-muted');
		}, 1);
	}

	/**
	 * Handles destruction stages by performing clearing operations to prevent memory issues and maintain resource efficiency.
	 * Executes teardown tasks such as unsubscribing from streams, clearing active timers, or releasing all allocated storage.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public ngOnDestroy(): void {
		if (this.transitionTimeout) clearTimeout(this.transitionTimeout);
	}
}
