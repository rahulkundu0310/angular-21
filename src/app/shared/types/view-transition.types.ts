import type { TRouteLayout } from './router.types';

export type TViewTransitionMode = 'cross-layout' | 'intra-layout' | 'none';

export type TViewTransitionName = 'none' | 'access-outlet' | 'platform-outlet';

export interface ITransitionNames {
	accessOutlet: TViewTransitionName;
	platformOutlet: TViewTransitionName;
}

export interface ITransitionContext {
	mode: TViewTransitionMode;
	target: TRouteLayout | null;
}
