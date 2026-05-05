import { Menu } from 'primeng/menu';
import type { TCallback } from '../types';
import type { OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';
import { Directive, inject, PLATFORM_ID } from '@angular/core';
import { absolutePosition, isTouchDevice } from '@primeuix/utils';

@Directive({ selector: 'p-menu' })
export class MenuNormalizer implements OnInit {
	// Dependency injections providing direct access to services and injectors
	private readonly platformId = inject(PLATFORM_ID);
	private readonly menuInstance = inject(Menu, { optional: true, self: true });

	/**
	 * Handles initialization cycle by organizing necessary state structures and applying foundational configuration defaults.
	 * Executes startup actions such as data retrieval, stream subscription, or state configuration for operational readiness.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public ngOnInit(): void {
		this.overrideOverlayListeners();
	}

	/**
	 * Overrides the injected component behavior preserving strict spatial alignment during native window scroll and resizing.
	 * Processes the viewport placement assessment updating floating element boundary protecting consistent layout visibility.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private overrideOverlayListeners(): void {
		// Retrieves injected source instance applying custom behavioral overrides
		const menuInstance = this.menuInstance;

		// Checks if retrieved source instance lacks valid reference returns early
		if (!menuInstance) return;

		// Overrides existing scroll listener preventing default layout disruption
		menuInstance.bindScrollListener = () => {
			// Retreives the current runtime environment identifying browser execution
			const isBrowserContext = isPlatformBrowser(this.platformId);

			// Checks if specific scroll handler requires fresh browser initialization
			if (!menuInstance.scrollHandler && isBrowserContext) {
				// Defines realign behavior updating precise layout coordinate positioning
				const realignOverlayPosition: TCallback = () => {
					// Checks if view remains visible preventing layout shifts while arranging
					if (menuInstance.visible) {
						absolutePosition(menuInstance.container, menuInstance.target);
					}
				};

				// Initializes connected scroll handler maintaining precise target binding
				menuInstance.scrollHandler = new ConnectedOverlayScrollHandler(
					menuInstance.target,
					realignOverlayPosition
				);
			}

			// Binds designated scroll handler execution triggering event subscription
			menuInstance.scrollHandler?.bindScrollListener();
		};

		// Overrides existing resize listener preventing default layout disruption
		menuInstance.onWindowResize = () => {
			// Checks if menu remains visible preventing layout shifts on touch screen
			if (menuInstance.visible && !isTouchDevice()) {
				absolutePosition(menuInstance.container, menuInstance.target);
			}
		};
	}
}
