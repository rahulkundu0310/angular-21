import type { TCallback, TRecord } from './toolkit.types';
import type {
	Data,
	Route,
	Params,
	RouterState,
	NavigationEnd,
	NavigationStart,
	NavigationError,
	NavigationCancel,
	IsActiveMatchOptions,
	NavigationCancellationCode
} from '@angular/router';

export type TRouteLayout = 'public' | 'access' | 'platform';

export type TRouteScope = 'general' | 'visitor' | 'private';

export type TActiveLinkOptions = { exact: boolean } | IsActiveMatchOptions;

export interface IMatchRouteOptions extends IsActiveMatchOptions {
	reactive: boolean;
}

export interface IRouteData {
	cache?: boolean;
	preload?: boolean;
	moduleId?: number;
	pageTitle?: string;
	scope?: TRouteScope;
	shouldDelay?: boolean;
	preloadDelay?: number;
	layout?: TRouteLayout;
	showNavigationIndicator?: boolean;
	hostBehavior?: 'contents' | 'block';
	breadcrumb?: string | IRouteBreadcrumb;
}

export interface IRouteBreadcrumb {
	icon?: string;
	home?: boolean;
	skip?: boolean;
	iconSize?: number;
	disabled?: boolean;
	context?: TRecord<unknown>;
	label?: string | TCallback<[Data, Params], string>;
}

export interface IRoute extends Omit<Route, 'data' | 'children'> {
	data?: IRouteData;
	children?: IRoute[];
}

export interface INavigationEnd {
	state: RouterState;
	event: NavigationEnd;
}

export interface INavigationStart {
	state: RouterState;
	event: NavigationStart;
}

export interface INavigationFailed {
	state: RouterState;
	error: unknown | null;
	reason: string | null;
	code: NavigationCancellationCode | null;
	event: NavigationError | NavigationCancel;
}
