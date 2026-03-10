export interface IPasswordFieldConfig {
	inputId: string;
	feedback?: boolean;
	minLength?: number;
	styleClass?: string;
	toggleMask?: boolean;
	placeholder?: string;
	generatable?: boolean;
	inputStyleClass?: string;
	style?: Partial<CSSStyleDeclaration>;
	inputStyle?: Partial<CSSStyleDeclaration>;
}

export interface IDerivedPasswordFieldConfig extends IPasswordFieldConfig {
	inputId: string;
	feedback: boolean;
	minLength: number;
	toggleMask: boolean;
	placeholder: string;
	generatable: boolean;
}

export interface IPasswordStrength {
	label: string;
	meter: string;
	hasNumeric: boolean;
	hasSpecial: boolean;
	hasAlphabet: boolean;
}
