import { ThemeStore } from '@store';
import type { TTheme } from '@shared/types';
import { TitleCasePipe } from '@angular/common';
import { OverlayModule } from 'primeng/overlay';
import { HostModifier } from '@shared/directives';
import { LucideAngularModule } from 'lucide-angular';
import type { IThemeOption } from './theme-switcher.types';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

@Component({
	selector: 'theme-switch',
	styleUrl: './theme-switch.scss',
	templateUrl: './theme-switch.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [OverlayModule, TitleCasePipe, LucideAngularModule],
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }]
})
export class ThemeSwitch {
	// Dependency injections providing direct access to services and injectors
	private readonly themeStore = inject(ThemeStore);

	// Public and private class member variables reflecting state and behavior
	protected readonly theme = this.themeStore.theme;
	protected readonly themeOverlayVisible = signal<boolean>(false);
	protected readonly themeOptions = signal<IThemeOption[]>([
		{ id: 1, label: 'light', icon: 'sun', iconSize: 20 },
		{ id: 2, label: 'dark', icon: 'moon', iconSize: 20 },
		{ id: 3, label: 'system', icon: 'monitor', iconSize: 20 }
	]);

	/**
	 * Toggles the specified theme selector by negating the internal property controlling the current presentation visibility.
	 * Processes reactive overlay updates evaluating the prior condition resolving inverted status revealing or hiding target.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected toggleThemeOverlay(): void {
		this.themeOverlayVisible.update((visible) => !visible);
	}

	/**
	 * Applies the specific visual styling to the associated theme store and promptly dismisses the related selection overlay.
	 * Processes the provided format preference updating primary store details before concealing the target interface element.
	 *
	 * @param theme - The desired design identifier reflecting the chosen presentation style adapted within the current state.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected applyTheme(theme: TTheme): void {
		this.themeStore.updateTheme(theme);
		this.themeOverlayVisible.set(false);
	}
}
