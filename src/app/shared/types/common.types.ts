import type { TTypedRecord } from './toolkit.types';

export interface IOptionItem {
	value: unknown;
	label: string;
}

export interface ITableColumn {
	field?: string;
	label: string;
}

export type TSeverity =
	| 'info'
	| 'light'
	| 'danger'
	| 'success'
	| 'warning'
	| 'primary'
	| 'contrast'
	| 'secondary';

export type TFieldSize = 'small' | 'medium' | 'large';

export interface IOperationState {
	loading: boolean;
	disabled: boolean;
}

export type TOperationsState<TEvent extends string = string> = Partial<
	TTypedRecord<TEvent, IOperationState>
>;
