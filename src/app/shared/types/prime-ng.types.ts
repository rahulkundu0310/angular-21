import type { OverlayOptions } from 'primeng/api';

export interface IOverlayListenerEvent extends Event {}

export type TOverlayOptions = Partial<Omit<OverlayOptions, 'onShow' | 'onHide' | 'listener'>>;
