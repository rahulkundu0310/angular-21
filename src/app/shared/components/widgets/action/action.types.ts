import type { Params, QueryParamsHandling } from '@angular/router';
import type { TActiveLinkOptions, TRecord, TSeverity } from '@shared/types';

export type TActionMode = 'button' | 'router' | 'link';

export type TActionSize = 'small' | 'medium' | 'large';

export type TActionType = 'button' | 'reset' | 'submit';

export type TActionIconPosition = 'left' | 'right' | 'top' | 'bottom';

export interface IActionIconConfig {
	name: string;
	color?: string;
	size?: number | string;
	strokeWidth?: number | string;
	absoluteStrokeWidth?: boolean;
	position?: TActionIconPosition;
	style?: Partial<CSSStyleDeclaration>;
	ariaHidden?: boolean | 'true' | 'false';
}

export interface IActionLinkConfig {
	url: string;
	target?: '_blank' | '_self' | '_parent' | '_top';
}

export interface IActionRouterConfig {
	fragment?: string;
	queryParams?: Params;
	replaceUrl?: boolean;
	state?: TRecord<unknown>;
	preserveFragment?: boolean;
	skipLocationChange?: boolean;
	routerLink: string | unknown[];
	queryParamsHandling?: QueryParamsHandling;
	routerLinkActiveOptions?: TActiveLinkOptions;
}

export interface IActionConfig {
	label: string;
	badge?: string;
	text?: boolean;
	fluid?: boolean;
	raised?: boolean;
	ariaRole?: string;
	rounded?: boolean;
	tabindex?: number;
	loading?: boolean;
	type?: TActionType;
	size?: TActionSize;
	disabled?: boolean;
	outlined?: boolean;
	ariaLabel?: string;
	autofocus?: boolean;
	styleClass?: string;
	severity?: TSeverity;
	ariaPressed?: boolean;
	ariaExpanded?: boolean;
	ariaDescribedby?: string;
	link?: IActionLinkConfig;
	icon?: IActionIconConfig;
	labelStyleClass?: string;
	badgeSeverity?: TSeverity;
	router?: IActionRouterConfig;
	style?: Partial<CSSStyleDeclaration>;
	labelStyle?: Partial<CSSStyleDeclaration>;
	ariaHaspopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
	ariaCurrent?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
}

export interface IDerivedActionIconConfig {
	name: string;
	color?: string;
	size: number | string;
	strokeWidth: number | string;
	absoluteStrokeWidth: boolean;
	position?: TActionIconPosition;
	style?: Partial<CSSStyleDeclaration>;
	ariaHidden?: boolean | 'true' | 'false';
}

export interface IDerivedActionLinkConfig {
	url: string;
	target: '_blank' | '_self' | '_parent' | '_top';
}

export interface IDerivedActionRouterConfig {
	replaceUrl: boolean;
	queryParams?: Params;
	state?: TRecord<unknown>;
	preserveFragment?: boolean;
	fragment: string | undefined;
	skipLocationChange?: boolean;
	routerLink: string | unknown[];
	queryParamsHandling?: QueryParamsHandling;
	routerLinkActiveOptions: TActiveLinkOptions;
}

export interface IDerivedActionConfig extends IActionConfig {
	text: boolean;
	fluid: boolean;
	raised: boolean;
	loading: boolean;
	rounded: boolean;
	outlined: boolean;
	disabled: boolean;
	size: TActionSize;
	type: TActionType;
	severity: TSeverity;
	icon?: IDerivedActionIconConfig;
	link?: IDerivedActionLinkConfig;
	router?: IDerivedActionRouterConfig;
}
