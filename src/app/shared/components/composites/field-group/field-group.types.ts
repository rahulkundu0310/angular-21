import type { TFieldSize, TRecord } from '@shared/types';

export type TFieldValidationAriaLive = 'off' | 'polite' | 'assertive';

export type TFieldValidationAriaLiveMap = Partial<TRecord<TFieldValidationAriaLive>>;

export interface IFieldGroupHint {
	label?: string;
	tooltip?: string;
	ariaRole?: string;
	ariaLabel?: string;
	tooltipEvent?: 'focus' | 'hover';
	tooltipPosition?: 'left' | 'top' | 'bottom' | 'right';
}

export interface IFieldGroupConfig {
	label?: string;
	fluid?: boolean;
	inputId: string;
	inline?: boolean;
	size?: TFieldSize;
	pending?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	styleClass?: string;
	hint?: IFieldGroupHint;
	affixStyleClass?: string;
	enableValidation?: boolean;
	style?: Partial<CSSStyleDeclaration>;
}

export interface IDerivedFieldGroupConfig extends IFieldGroupConfig {
	fluid: boolean;
	inline: boolean;
	pending: boolean;
	size: TFieldSize;
	disabled: boolean;
	readonly: boolean;
	enableValidation: boolean;
}

export interface IFieldGroupValidation {
	id: string;
	kind: string;
	message: string | undefined;
	ariaLive: TFieldValidationAriaLive;
}
