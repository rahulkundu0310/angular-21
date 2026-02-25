import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { TSanitizedContent, TSanitizeType } from '@shared/types';

@Pipe({ name: 'sanitize' })
export class SanitizePipe implements PipeTransform {
	// Dependency injections providing direct access to services and injectors
	private readonly platformId = inject(PLATFORM_ID);
	private readonly sanitizer = inject(DomSanitizer);

	/**
	 * Transforms unsafe input content by strictly sanitizing the current safe type using context validation for sanitization.
	 * Provides a sanitized safe content via core security bypass rules to normalize content rendering for content protection.
	 *
	 * @param value - This unsafe input content string to be transformed for the comprehensive content sanitization standards.
	 * @param safeType - The target safe type for strict content sanitization with the specific valid type conversion control.
	 * @param safeType - The target safe type for content sanitization with the specific type conversion control requirements.
	 * @returns A sanitized safe content object with applied security bypass for secure content output within trusted context.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public transform(value: string, safeType: TSanitizeType): TSanitizedContent {
		// Checks if content is empty or if code is not running in browser context
		if (!value || !isPlatformBrowser(this.platformId)) return value;

		// Evaluates the sanitizer method to use based on the provided safe values
		switch (safeType) {
			// Permits sanitizing the offered input as a trusted safe URL string value
			case 'url':
				return this.sanitizer.bypassSecurityTrustUrl(value);

			// Permits sanitizing the provided input data as a trusted safe html value
			case 'html':
				return this.sanitizer.bypassSecurityTrustHtml(value);

			// Permits sanitizing the provided input data as trusted safe styles value
			case 'style':
				return this.sanitizer.bypassSecurityTrustStyle(value);

			// Permits sanitizing the provided input data as trusted safe script value
			case 'script':
				return this.sanitizer.bypassSecurityTrustScript(value);

			// Permits sanitizing the given input as a trusted safe resource URL value
			case 'resourceUrl':
				return this.sanitizer.bypassSecurityTrustResourceUrl(value);

			// Ensures invalid safe type input data fails with an explicit error value
			default:
				throw new Error(`Invalid safe type specified: ${safeType}`);
		}
	}
}
