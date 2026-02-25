import type { IFileValidationRule } from './file.types';
import type { PrimeNGConfigType } from 'primeng/config';
import type { NgProgressOptions } from 'ngx-progressbar';

export interface IApplicationConfig {
	name: string;
	version: string;
	preloadDelay: number;
	defaultTheme: string;
	rememberMeKey: string;
	authSessionKey: string;
	layoutStateKey: string;
	layoutChannelKey: string;
}

export interface ITransportConfig {
	timeout: number;
	cacheTime: number;
	retryCount: number;
	retryDelay: number;
	rowsPerPage: number;
	requestHeaders: {
		Accept: string;
		'Content-Type': string;
	};
}

export interface IRegexConfig {
	// Language & Character Sets
	accents: RegExp;
	alphabet: RegExp;
	whitespace: RegExp;
	specialChars: RegExp;
	invalidChars: RegExp;
	alphanumeric: RegExp;

	// Numbers & Digits
	cvv: RegExp;
	card: RegExp;
	phone: RegExp;
	numeric: RegExp;
	digitsOnly: RegExp;
	expiryDate: RegExp;

	// URL & Email
	url: RegExp;
	email: RegExp;

	// Slug/String Formatting
	edgeDashes: RegExp;
	multipleDashes: RegExp;

	// Miscellaneous
	zipCode: RegExp;
	timeFormat: RegExp;
	twoDecimalNumber: RegExp;

	// Password Strength
	strongPassword: RegExp;
	mediumPassword: RegExp;
}

export interface IPrimeNGConfig extends PrimeNGConfigType {}

export interface INgProgressConfig extends NgProgressOptions {}

export interface IFileUploadConfig {
	video: IFileValidationRule;
	image: IFileValidationRule;
	document: IFileValidationRule;
}
