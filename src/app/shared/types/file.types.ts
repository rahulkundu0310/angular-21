export type TFileSize = 'kb' | 'mb';

export type TFileType = 'video' | 'image' | 'document';

export interface IFileValidationOptions {
	maxFileSize: number;
	fileSizeUnit: TFileSize;
	allowedExtensions: string[];
}

export interface IFileValidationError {
	fileName: string;
	fileSize: number;
	isSizeExceeded: boolean;
	isExtensionValid: boolean;
	allowedExtensions: string[];
}

export interface IFileValidationRule {
	maxFileSize: number;
	fileSizeUnit: TFileSize;
	acceptAttribute: string;
	allowedExtensions: string[];
}

export interface IFileEntry {
	file: File;
	name: string;
	size: string;
	extension: string;
}
