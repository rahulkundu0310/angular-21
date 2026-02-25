import { isNil } from 'lodash-es';
import type {
	IActionConfig,
	IActionIconConfig,
	IActionLinkConfig,
	IActionRouterConfig,
	IDerivedActionConfig,
	IDerivedActionIconConfig,
	IDerivedActionLinkConfig,
	IDerivedActionRouterConfig
} from './action.types';

/**
 * Derives the source action configuration by allocating comprehensive fallback values for consistent interface rendering.
 * Processes the parent parameters by resolving subsidiary objects to ensure missing attributes receive valid assignments.
 *
 * @param config - The partial specification object containing current properties before the resolution process concludes.
 * @returns A normalized derivation object specifying essential styling and functional provisions for evaluated structure.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function deriveActionConfig(config: IActionConfig): IDerivedActionConfig {
	return {
		...config,
		text: config.text ?? false,
		fluid: config.fluid ?? false,
		size: config.size ?? 'large',
		type: config.type ?? 'button',
		raised: config.raised ?? true,
		rounded: config.rounded ?? false,
		loading: config.loading ?? false,
		disabled: config.disabled ?? false,
		outlined: config.outlined ?? false,
		severity: config.severity ?? 'primary',
		icon: deriveActionIconConfig(config.icon),
		link: deriveActionLinkConfig(config.link),
		router: deriveActionRouterConfig(config.router)
	};
}

/**
 * Derives the optional icon configuration by allocating comprehensive fallback values for consistent interface rendering.
 * Processes the source parameters by merging predefined rules to ensure missing attributes receive compatible assignment.
 *
 * @param config - The partial specification object containing current properties before the resolution process concludes.
 * @returns A normalized derivation object specifying reliable styling and functional provisions for an evaluated element.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function deriveActionIconConfig(
	config: IActionIconConfig | undefined
): IDerivedActionIconConfig | undefined {
	if (isNil(config)) return undefined;
	return {
		name: config.name,
		color: config.color,
		size: config.size ?? 20,
		position: config.position ?? 'left',
		strokeWidth: config.strokeWidth ?? 2,
		ariaHidden: config.ariaHidden ?? 'true',
		style: config.style ?? Object.create(null),
		absoluteStrokeWidth: config.absoluteStrokeWidth ?? false
	};
}

/**
 * Derives the optional link configuration by allocating comprehensive fallback values for consistent navigation behavior.
 * Processes the source parameters by merging predefined rules to ensure missing attributes receive compatible assignment.
 *
 * @param config - The partial specification object containing current properties before the resolution process concludes.
 * @returns A normalized derivation object specifying essential linking and functional provisions for evaluated structure.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function deriveActionLinkConfig(
	config: IActionLinkConfig | undefined
): IDerivedActionLinkConfig | undefined {
	if (isNil(config)) return undefined;
	return {
		url: config.url,
		target: config.target ?? '_self'
	};
}

/**
 * Derives the optional router configuration by allocating comprehensive fallback values for predictable state navigation.
 * Processes the source parameters by merging predefined rules to ensure missing attributes receive compatible assignment.
 *
 * @param config - The partial specification object containing current properties before the resolution process concludes.
 * @returns A normalized derivation object specifying essential routing and functional provisions for evaluated structure.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function deriveActionRouterConfig(
	config: IActionRouterConfig | undefined
): IDerivedActionRouterConfig | undefined {
	if (isNil(config)) return undefined;
	return {
		state: config.state,
		fragment: config.fragment,
		routerLink: config.routerLink,
		queryParams: config.queryParams,
		replaceUrl: config.replaceUrl ?? false,
		preserveFragment: config.preserveFragment ?? false,
		skipLocationChange: config.skipLocationChange ?? false,
		queryParamsHandling: config.queryParamsHandling ?? undefined,
		routerLinkActiveOptions: config.routerLinkActiveOptions ?? { exact: false }
	};
}
