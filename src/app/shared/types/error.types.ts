export interface INormalizedError {
	message: string;
	statusCode: number;
}

export interface IZoneException extends Error {
	ngOriginalError: unknown;
}

export interface IPromiseRejection extends Error {
	rejection?: unknown;
}
