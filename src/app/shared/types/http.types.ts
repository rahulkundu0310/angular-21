import type { TRecord } from './toolkit.types';
import type { HttpParams, HttpContext, HttpHeaders } from '@angular/common/http';

export type TRequestHeaders = HttpHeaders | TRecord<string | string[]>;

export type TRequestQuerySerialization = 'repeat' | 'brackets' | 'comma';

export type TRequestBody = object | File | Blob | ArrayBuffer | FormData | null;

export type TRequestMethod = 'GET' | 'PUT' | 'HEAD' | 'POST' | 'DELETE' | 'PATCH' | 'OPTIONS';

export type TRequestParams =
	| HttpParams
	| TRecord<string | number | boolean | readonly (string | number | boolean)[]>;

export interface IBaseRequestOptions {
	timeout?: number;
	referrer?: string;
	mode?: RequestMode;
	integrity?: string;
	pathPrefix?: string;
	keepalive?: boolean;
	cache?: RequestCache;
	context?: HttpContext;
	params?: TRequestParams;
	reportProgress?: boolean;
	withCredentials?: boolean;
	headers?: TRequestHeaders;
	priority?: RequestPriority;
	redirect?: RequestRedirect;
	version?: string | undefined;
	referrerPolicy?: ReferrerPolicy;
	useBaseUrl?: boolean | undefined;
	credentials?: RequestCredentials;
	observe?: 'body' | 'events' | 'response';
	querySerialization?: TRequestQuerySerialization;
	responseType?: 'json' | 'arraybuffer' | 'blob' | 'text';
}

export type TRequestOptions<TBody extends TRequestBody | undefined = undefined> =
	TBody extends undefined ? IBaseRequestOptions : IBaseRequestOptions & { body?: TBody };

export interface IResponse<TDataset = TRecord, TNonNullable extends boolean = false> {
	message: string;
	success: boolean;
	status: IResponseStatus;
	publish: IResponseMetadata;
	dataset: TNonNullable extends true ? TDataset : TDataset | null;
}

export interface IResponseStatus {
	status_code: number;
	status_info: string | undefined;
}

export interface IResponseMetadata {
	version: string;
	developer: string;
}

export interface IPromiseRejection extends Error {
	rejection?: unknown;
}

export interface INormalizedError {
	message: string;
	statusCode: number;
}
