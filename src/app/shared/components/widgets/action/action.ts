import type { TRecord } from '@shared/types';
import { RouterModule } from '@angular/router';
import { isNil, keys, pickBy } from 'lodash-es';
import { HostModifier } from '@shared/directives';
import { NgTemplateOutlet } from '@angular/common';
import { deriveActionConfig } from './action-utils';
import { LucideAngularModule } from 'lucide-angular';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import type { TActionMode, IActionConfig, IDerivedActionConfig } from './action.types';
import {
	input,
	output,
	computed,
	Component,
	ViewEncapsulation,
	ChangeDetectionStrategy
} from '@angular/core';

@Component({
	selector: 'action',
	styleUrl: './action.scss',
	templateUrl: './action.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }],
	imports: [RouterModule, NgTemplateOutlet, LucideAngularModule, ProgressSpinnerModule]
})
export class Action {
	// Input and output properties reflecting shared state and emitting events
	public readonly blurred = output<FocusEvent>();
	public readonly clicked = output<MouseEvent>();
	public readonly focused = output<FocusEvent>();
	public readonly formId = input<string | null>(null);
	public readonly config = input.required<IDerivedActionConfig, IActionConfig>({
		transform: deriveActionConfig
	});

	/**
	 * Computes the targeted interaction behavior by evaluating the provided routing and path properties within configuration.
	 * Returns a union string identifier indicating whether the control serves as a button or standard link or routed element.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public actionMode = computed<TActionMode>(() => {
		// Retrieves config snapshot from the input signal before state resolution
		const { router, link } = this.config();

		// Checks if only router is present without link before returning the type
		if (!!router && !link) return 'router';

		// Checks if only link is present without router before returning the type
		if (!router && !!link) return 'link';

		// Returns button as the default action type when no routing config exists
		return 'button';
	});

	/**
	 * Computes action classes by assembling a class list from the configuration settings for reactive style sheet generation.
	 * Returns a class string indicating the computed styling to provide consistent visible appearance for template rendering.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public actionClasses = computed<string>(() => {
		// Retrieves config snapshot from the input signal before state resolution
		const {
			text,
			icon,
			size,
			fluid,
			badge,
			label,
			raised,
			loading,
			rounded,
			outlined,
			disabled,
			severity,
			styleClass
		} = this.config();

		// Retrieves icon position using null safety or falls back to empty object
		const { position } = icon ?? Object.create(null);

		// Determines whether the icon position is vertical as top or bottom value
		const stackedIcon = position === 'top' || position === 'bottom';

		// Constructs a class name boolean map for organizing action style entries
		const actionClassMap: TRecord<boolean> = {
			'action-text': text,
			'action-fluid': fluid,
			'action-raised': raised,
			[`action-${size}`]: true,
			'action-loading': loading,
			'action-rounded': rounded,
			[`action-${severity}`]: true,
			[styleClass!]: !isNil(styleClass),
			'action-outlined': outlined ?? false,
			'action-disabled': disabled ?? false,
			'action-vertical': !!icon && stackedIcon,
			'action-icon-only': !!icon && !label && !badge
		};

		// Returns active keys from class map joined as action style string output
		return keys(pickBy(actionClassMap)).join(' ');
	});
}
