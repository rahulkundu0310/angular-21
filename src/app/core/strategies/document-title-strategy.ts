import { applicationConfig } from '@configs';
import { TitleStrategy } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { inject, Injectable } from '@angular/core';
import type { RouterStateSnapshot } from '@angular/router';

@Injectable()
export class DocumentTitleStrategy extends TitleStrategy {
	// Dependency injections providing direct access to services and injectors
	private readonly title = inject(Title);

	// Public and private class member variables reflecting state and behavior
	private readonly separator: string = ' | ';
	private readonly name: string = applicationConfig.name;

	/**
	 * Overrides document title with custom page title unifying application name and separator for consistent title formatting.
	 * Processes dynamic naming convention with provided title string to ensure uniform document titles across the application.
	 *
	 * @param title - The custom page title string to be combined with application name for optimal browser tab identification.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public overrideTitle(title: string): void {
		this.title.setTitle(`${this.name}${this.separator}${title}`);
	}

	/**
	 * Updates document title by merging application name with route title from snapshot to maintain a unified visual identity.
	 * Processes matched routes to apply naming conventions with separators ensuring clean presentation across browser windows.
	 *
	 * @param snapshot - The router state snapshot containing route configuration and data used to retrieve the document title.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public override updateTitle(snapshot: RouterStateSnapshot): void {
		// Retrieves the page title from route data or utilizes the existing value
		const title = this.buildTitle(snapshot) || this.title.getTitle();

		// Updates the document title incorporating the formatted application name
		this.title.setTitle(`${this.name}${this.separator}${title}`);
	}
}
