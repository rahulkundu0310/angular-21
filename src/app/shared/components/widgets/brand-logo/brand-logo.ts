import { ThemeStore } from '@store';
import { RouterLink } from '@angular/router';
import type { UrlTree } from '@angular/router';
import { HostModifier } from '@shared/directives';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import type { TBrandAppearance, TBrandVariant, TBrandMode } from './brand.types';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

@Component({
	selector: 'brand-logo',
	styleUrl: './brand-logo.scss',
	templateUrl: './brand-logo.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgOptimizedImage, RouterLink, NgTemplateOutlet],
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }]
})
export class BrandLogo {
	// Dependency injections providing direct access to services and injectors
	private readonly themeStore = inject(ThemeStore);

	// Input and output properties reflecting shared state and emitting events
	public readonly mode = input<TBrandMode>();
	public readonly width = input.required<number>();
	public readonly height = input.required<number>();
	public readonly interactive = input<boolean>(true);
	public readonly destination = input<string | UrlTree>('/');
	public readonly variant = input<TBrandVariant>('standard');

	// Public and private class member variables reflecting state and behavior
	private readonly systemTheme = this.themeStore.systemTheme;
	private readonly resolvedTheme = this.themeStore.resolvedTheme;

	/**
	 * Computes appropriate brand color by evaluating the supplied input property against the resolved contextual theme state.
	 * Returns a string literal to construct the intended image asset path and the specific presentation style for the layout.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly appearance = computed<TBrandAppearance>(() => {
		// Retreives requested brand style preference from the active input signal
		const mode = this.mode();

		// Retreives current system styling directly from the reactive store state
		const systemTheme = this.systemTheme();

		// Retreives active calculated theme selection from the global store state
		const resolvedTheme = this.resolvedTheme();

		// Declares appearance map linking design preferences with visual palettes
		const appearanceMap: Record<TBrandMode, TBrandAppearance> = {
			dark: 'white',
			light: 'black',
			color: 'color'
		} as const;

		// Checks if explicit styling preference exists and returns matching value
		if (mode) return appearanceMap[mode];

		// Checks if required theme properties are absent and returns color string
		if (!this.resolvedTheme || !this.systemTheme) return 'color';

		// Returns mapped appearance string evaluating context for correct styling
		return appearanceMap[resolvedTheme === 'system' ? systemTheme : resolvedTheme];
	});
}
