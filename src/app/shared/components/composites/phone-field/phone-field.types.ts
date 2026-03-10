export interface IPhoneFieldValue {
	number: string;
	dialCode: string;
	countryCode: string;
}

export interface IPhoneFieldConfig {
	inputId: string;
	styleClass?: string;
	placeholder?: string;
	inputStyleClass?: string;
	selectStyleClass?: string;
	style?: Partial<CSSStyleDeclaration>;
	inputStyle?: Partial<CSSStyleDeclaration>;
	selectStyle?: Partial<CSSStyleDeclaration>;
}

export interface IDerivedPhoneFieldConfig extends IPhoneFieldConfig {
	inputId: string;
	placeholder: string;
}

export interface IPhoneFieldCountry {
	id: number;
	alpha2: string;
	dialCode: string;
	flagImage: string;
	isoShortName: string;
	sampleNationalNumber: string;
}
