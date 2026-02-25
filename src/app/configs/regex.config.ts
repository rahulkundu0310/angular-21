import type { IRegexConfig } from '@shared/types';

/**
 * Defines regex pattern configuration by setting standard matching rules and schemas for the field validation operations.
 * Processes format constraints and search criteria to maintain consistent input sanitization flow within the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const regexConfig: IRegexConfig = {
	// Language & Character Sets
	whitespace: /\s+/g,
	alphabet: /[a-zA-Z]/,
	accents: /[\u0300-\u036f]/g,
	invalidChars: /[^a-z0-9-]/g,
	alphanumeric: /^[a-zA-Z0-9\s]+$/,
	specialChars: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/,

	// Numbers & Digits
	cvv: /^\d{3}$/,
	card: /^\d{16}$/,
	numeric: /[0-9]/,
	phone: /^\d{10}$/,
	digitsOnly: /[^\d]/g,
	expiryDate: /^(0[1-9]|1[0-2])([0-9]{2})$/,

	// URL & Email
	email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
	url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/i,

	// Slug/String Formatting
	edgeDashes: /^-|-$/g,
	multipleDashes: /-+/g,

	// Miscellaneous
	zipCode: /^[0-9]{1,5}(-[0-9]{1,4})?$/,
	twoDecimalNumber: /^\d+(\.\d{1,2})?$/,
	timeFormat: /^([0-1]?\d|2[0-3])?(:[0-5]?\d?)?(:[0-5]?\d?)?$/,

	// Password Strength
	strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
	mediumPassword:
		/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/
} as const;
