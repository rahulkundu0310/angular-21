import type { TRecord } from './toolkit.types';
import type { Params, QueryParamsHandling } from '@angular/router';
import type { IRouteBreadcrumb, TActiveLinkOptions } from './router.types';

export interface IMenuItem {
	id: number;
	label: string;
	icon?: string;
	iconSize?: number;
	expanded?: boolean;
	items?: IMenuItem[];
	iconWeight?: number;
	routerLink?: string;
	styleClass?: string;
	queryParams?: Params;
	parent?: number | null;
	state?: TRecord<unknown>;
	queryParamsHandling?: QueryParamsHandling;
	routerLinkActiveOptions?: TActiveLinkOptions;
}

export interface IBreadcrumbContext {
	breadcrumbPath: string;
	breadcrumbMeta: IRouteBreadcrumb | null;
}

export interface IBreadcrumb {
	label: string;
	home: boolean;
	disabled: boolean;
	routerLink: string;
	queryParams: Params;
	icon: string | null;
	iconSize: number | null;
	state?: TRecord<unknown>;
	context: TRecord<unknown> | null;
	queryParamsHandling?: QueryParamsHandling;
}
