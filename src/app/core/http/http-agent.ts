import type { Observable } from 'rxjs';
import { transportConfig } from '@configs';
import { environment } from '@env/environment';
import { Injectable, inject } from '@angular/core';
import { isArray, isObject, entries } from 'lodash-es';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import type {
	TRecord,
	IResponse,
	TRequestBody,
	TRequestMethod,
	TRequestParams,
	TRequestOptions,
	TRequestHeaders
} from '@shared/types';

@Injectable({ providedIn: 'root' })
export class HttpAgent {
	// Dependency injections providing direct access to services and injectors
	private readonly httpClient = inject(HttpClient);

	// Public and private class member variables reflecting state and behavior
	private readonly baseUrl: string = environment.apiBaseUrl;

	/**
	 * Invokes an HTTP request using a server URL and provided parameters returning an Observable for asynchronous operations.
	 * Processes incoming arguments to construct a normalized URL and combines specified options before executing the request.
	 *
	 * @param url - The request path string to be properly combined with a base URL for building the complete target endpoint.
	 * @param options - The configuration object containing headers, query params, context, credentials or additional options.
	 * @returns An observable stream which emits the HTTP response of the requested generic entity for reactive subscriptions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public get<TResponse = IResponse>(
		url: string,
		options?: TRequestOptions
	): Observable<TResponse> {
		// Builds the request URL by processing the provided request path segments
		const requestUrl = this.buildRequestUrl(url, options);

		// Builds the request configuration object from the provided input options
		const requestOptions = this.buildRequestOptions(options);

		// Executes the request using the normalized URL and request configuration
		return this.httpClient.get<TResponse>(requestUrl, requestOptions);
	}

	/**
	 * Invokes an HTTP request using a server URL and provided parameters returning an Observable for asynchronous operations.
	 * Processes incoming arguments to construct a normalized URL and combines specified options before executing the request.
	 *
	 * @param url - The request path string to be properly combined with a base URL for building the complete target endpoint.
	 * @param body - The payload object enclosing data to be sent in the request body for updating the resource on the server.
	 * @param options - The configuration object containing headers, query params, context, credentials or additional options.
	 * @returns An observable stream which emits the HTTP response of the requested generic entity for reactive subscriptions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public post<TResponse = IResponse>(
		url: string,
		body?: TRequestBody,
		options?: TRequestOptions
	): Observable<TResponse> {
		// Builds the request URL by processing the provided request path segments
		const requestUrl = this.buildRequestUrl(url, options);

		// Builds the request configuration object from the provided input options
		const requestOptions = this.buildRequestOptions(options);

		// Executes the request using the normalized URL and request configuration
		return this.httpClient.post<TResponse>(requestUrl, body ?? null, requestOptions);
	}

	/**
	 * Invokes an HTTP request using a server URL and provided parameters returning an Observable for asynchronous operations.
	 * Processes incoming arguments to construct a normalized URL and combines specified options before executing the request.
	 *
	 * @param url - The request path string to be properly combined with a base URL for building the complete target endpoint.
	 * @param body - The payload object enclosing data to be sent in the request body for updating the resource on the server.
	 * @param options - The configuration object containing headers, query params, context, credentials or additional options.
	 * @returns An observable stream which emits the HTTP response of the requested generic entity for reactive subscriptions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public put<TResponse = IResponse>(
		url: string,
		body?: TRequestBody,
		options?: TRequestOptions
	): Observable<TResponse> {
		// Builds the request URL by processing the provided request path segments
		const requestUrl = this.buildRequestUrl(url, options);

		// Builds the request configuration object from the provided input options
		const requestOptions = this.buildRequestOptions(options);

		// Executes the request using the normalized URL and request configuration
		return this.httpClient.put<TResponse>(requestUrl, body, requestOptions);
	}

	/**
	 * Invokes an HTTP request using a server URL and provided parameters returning an Observable for asynchronous operations.
	 * Processes incoming arguments to construct a normalized URL and combines specified options before executing the request.
	 *
	 * @param url - The request path string to be properly combined with a base URL for building the complete target endpoint.
	 * @param body - The payload object enclosing data to be sent in the request body for updating the resource on the server.
	 * @param options - The configuration object containing headers, query params, context, credentials or additional options.
	 * @returns An observable stream which emits the HTTP response of the requested generic entity for reactive subscriptions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public patch<TResponse = IResponse>(
		url: string,
		body?: TRequestBody,
		options?: TRequestOptions
	): Observable<TResponse> {
		// Builds the request URL by processing the provided request path segments
		const requestUrl = this.buildRequestUrl(url, options);

		// Builds the request configuration object from the provided input options
		const requestOptions = this.buildRequestOptions(options);

		// Executes the request using the normalized URL and request configuration
		return this.httpClient.patch<TResponse>(requestUrl, body, requestOptions);
	}

	/**
	 * Invokes an HTTP request using a server URL and provided parameters returning an Observable for asynchronous operations.
	 * Processes incoming arguments to construct a normalized URL and combines specified options before executing the request.
	 *
	 * @param url - The request path string to be properly combined with a base URL for building the complete target endpoint.
	 * @param options - The configuration object containing headers, query params, context, credentials or additional options.
	 * @returns An observable stream which emits the HTTP response of the requested generic entity for reactive subscriptions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public delete<TResponse = IResponse>(
		url: string,
		options?: TRequestOptions
	): Observable<TResponse> {
		// Builds the request URL by processing the provided request path segments
		const requestUrl = this.buildRequestUrl(url, options);

		// Builds the request configuration object from the provided input options
		const requestOptions = this.buildRequestOptions(options);

		// Executes the request using the normalized URL and request configuration
		return this.httpClient.delete<TResponse>(requestUrl, requestOptions);
	}

	/**
	 * Invokes an HTTP request using a server URL and provided parameters returning an Observable for asynchronous operations.
	 * Processes incoming arguments to construct a normalized URL and combines specified options before executing the request.
	 *
	 * @param url - The request path string to be properly combined with a base URL for building the complete target endpoint.
	 * @param method - The request method specifying the particular operation to be performed on the targeted server resource.
	 * @param options - The configuration object containing headers, query params, context, credentials or additional options.
	 * @returns An observable stream which emits the HTTP response of the requested generic entity for reactive subscriptions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public request<TResponse = IResponse>(
		url: string,
		method: TRequestMethod,
		options?: TRequestOptions
	): Observable<TResponse> {
		// Builds the request URL by processing the provided request path segments
		const requestUrl = this.buildRequestUrl(url, options);

		// Builds the request configuration object from the provided input options
		const requestOptions = this.buildRequestOptions(options);

		// Executes the request using the normalized URL and request configuration
		return this.httpClient.request<TResponse>(method, requestUrl, requestOptions);
	}

	/**
	 * Invokes an HTTP request using a server URL and provided parameters returning an Observable for asynchronous operations.
	 * Processes incoming arguments to construct a normalized URL and combines specified options before executing the request.
	 *
	 * @param url - The request path string to be properly combined with a base URL for building the complete target endpoint.
	 * @param options - The configuration object containing headers, query params, context, credentials or additional options.
	 * @returns An observable stream which emits the HTTP response of the requested generic entity for reactive subscriptions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public head(url: string, options?: TRequestOptions): Observable<void> {
		// Builds the request URL by processing the provided request path segments
		const requestUrl = this.buildRequestUrl(url, options);

		// Builds the request configuration object from the provided input options
		const requestOptions = this.buildRequestOptions(options);

		// Executes the request using the normalized URL and request configuration
		return this.httpClient.head<void>(requestUrl, requestOptions);
	}

	/**
	 * Invokes an HTTP request using a server URL and provided parameters returning an Observable for asynchronous operations.
	 * Processes incoming arguments to construct a normalized URL and combines specified options before executing the request.
	 *
	 * @param url - The request path string to be properly combined with a base URL for building the complete target endpoint.
	 * @param options - The configuration object containing headers, query params, context, credentials or additional options.
	 * @returns An observable stream which emits the HTTP response of the requested generic entity for reactive subscriptions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public options<TResponse = unknown>(
		url: string,
		options?: TRequestOptions
	): Observable<TResponse> {
		// Builds the request URL by processing the provided request path segments
		const requestUrl = this.buildRequestUrl(url, options);

		// Builds the request configuration object from the provided input options
		const requestOptions = this.buildRequestOptions(options);

		// Executes the request using the normalized URL and request configuration
		return this.httpClient.options<TResponse>(requestUrl, requestOptions);
	}

	/**
	 * Invokes JSONP request using a URL and the specified callback param returning an Observable for asynchronous operations.
	 * Processes incoming arguments to construct a normalized URL and associated callback param before initiating the request.
	 *
	 * @param url - The request URL string to be utilized as the absolute target endpoint during the cross-domain interaction.
	 * @param callbackParam - The query parameter name specifying the callback wrapper for enclosing the HTTP response entity.
	 * @returns An observable stream which emits the HTTP response of the requested generic entity for reactive subscriptions.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public jsonp<TResponse = TRecord>(url: string, callbackParam: string): Observable<TResponse> {
		// Builds the request URL by processing the provided request path segments
		const requestUrl = this.buildRequestUrl(url, {
			useBaseUrl: false,
			version: undefined,
			pathPrefix: undefined
		});

		// Executes the request using the normalized URL and callback param string
		return this.httpClient.jsonp<TResponse>(requestUrl, callbackParam);
	}

	/**
	 * Builds the HTTP request specifications object by adopting the provided outgoing options for proper server transmission.
	 * Processes incoming requirements including headers, parameters and body structure for accurate network protocol schemas.
	 *
	 * @param options - The configuration object containing headers, query params, context, credentials or additional options.
	 * @returns A fully constructed specification object comprising params, headers, options for the server request execution.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private buildRequestOptions(options: TRequestOptions<TRequestBody> = {}): TRecord {
		// Builds the request params using options for the current request payload
		const requestParams = this.buildRequestParams(options);

		// Builds the request headers from options for the current request payload
		const requestHeaders = this.buildRequestHeaders(options);

		// Destructures the provided source object to extract necessary properties
		const { body, version, useBaseUrl, pathPrefix, querySerialization, ...serializedOptions } =
			options;

		// Returns a final configuration combining options with params and headers
		return {
			...serializedOptions,
			params: requestParams,
			headers: requestHeaders,
			...(!!body && { body }),
			observe: options.observe || 'body',
			responseType: options.responseType || 'json'
		};
	}

	/**
	 * Builds the HTTP request URL string by correctly compiling the provided outgoing options for proper server transmission.
	 * Processes incoming path components including version, prefix and target endpoint for accurate network protocol schemas.
	 *
	 * @param url - The request path string to be properly combined with a base URL for building the complete target endpoint.
	 * @param options - The configuration object containing headers, query params, context, credentials or additional options.
	 * @returns A fully constructed derived URL string with standard path segments formatted for the server request execution.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private buildRequestUrl(url: string, options: TRequestOptions = {}): string {
		// Destructures the provided source object to extract necessary properties
		const { useBaseUrl = true, version, pathPrefix } = options;

		// Returns the original URL directly if the base url flag is not specified
		if (!useBaseUrl) return url;

		// Initializes the endpoint using the base path property as the foundation
		let requestUrl = this.baseUrl;

		// Appends version string to target url if it is provided and is not empty
		if (version?.trim()) requestUrl += `/${version}`;

		// Appends path prefix string to target url if it is present and not empty
		if (pathPrefix?.trim()) requestUrl += `/${pathPrefix}`;

		// Returns the concatenated request URL after sanitizing duplicate slashes
		return `${requestUrl}/${url}`.replace(/([^:])\/\/+/g, '$1/');
	}

	/**
	 * Builds the HTTP request headers object by interpreting the provided outgoing properties for proper server transmission.
	 * Processes incoming header values to normalize nested arrays or primitive entries for accurate network protocol schemas.
	 *
	 * @param options - The configuration object containing headers, query params, context, credentials or additional options.
	 * @returns A serialized HTTP headers object comprising mapped key-value pairs formatted for the server request execution.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private buildRequestHeaders(options: TRequestOptions = {}): TRequestHeaders {
		// Destructures the provided source object to extract necessary properties
		const { headers } = options;

		// Retrieves headers from specific request or defaults to transport config
		const defaultHeaders = transportConfig.requestHeaders;

		// Checks for null or undefined headers and returns the predefined headers
		if (!headers) return defaultHeaders;

		// Checks if the headers argument is already an valid HttpHeaders instance
		if (headers instanceof HttpHeaders) {
			// Initializes a new HttpHeaders instance to aggregate the default headers
			let requestHeaders = new HttpHeaders(defaultHeaders);

			// Iterates through every header name stored within the HttpHeaders object
			for (const key of headers.keys()) {
				// Retrieves all string values associated with the current HTTP header key
				const value = headers.getAll(key);

				// Checks if there are values set on the combined header in requestHeaders
				if (value) requestHeaders = requestHeaders.set(key, value);
			}

			// Returns the fully constructed HttpHeaders instance with updated headers
			return requestHeaders;
		}

		// Returns merged request headers combining defaults with provided entries
		return { ...defaultHeaders, ...headers };
	}

	/**
	 * Builds the HTTP request parameters object by interpreting the provided outgoing options for proper server transmission.
	 * Processes incoming query options to normalize nested objects or array structures for accurate network protocol schemas.
	 *
	 * @param options - The configuration object containing headers, query params, context, credentials or additional options.
	 * @returns A serialized HTTP params object comprising encoded key-value pairs formatted for the server request execution.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private buildRequestParams(options: TRequestOptions = {}): TRequestParams {
		// Destructures the provided source object to extract necessary properties
		const { params, querySerialization = 'repeat' } = options;

		// Initializes a new HttpParams instance to aggregate the query parameters
		let requestParams = new HttpParams();

		// Checks for null or undefined parameter then returns an empty HttpParams
		if (!params) return requestParams;

		// Checks if params is a valid instance of HttpParams returns it instantly
		if (params instanceof HttpParams) return params;

		// Iterates through every key and value pair in the params object provided
		for (const [key, value] of entries(params)) {
			// Checks if the value is an array to append its values as separate params
			if (isArray(value)) {
				// Checks if query serialization uses a comma pattern for array parameters
				if (querySerialization === 'comma') {
					const serializedValue = value.join(',');
					requestParams = requestParams.append(key, serializedValue);
				}
				// Checks if query serialization uses bracket formats for array parameters
				else if (querySerialization === 'brackets') {
					value.forEach((entry) => {
						requestParams = requestParams.append(`${key}[]`, entry);
					});
				}
				// Checks if query serialization uses repeat patterns for array parameters
				else {
					value.forEach((entry) => {
						requestParams = requestParams.append(key, entry);
					});
				}

				// Continues to the next iteration of the loop skipping the remaining part
				continue;
			}

			// Checks if the value is an object to append nested key-value definitions
			if (isObject(value)) {
				// Iterates through nested object entries appending bracketed query values
				entries(value).forEach(([nestedKey, nestedValue]) => {
					requestParams = requestParams.append(`${key}[${nestedKey}]`, nestedValue);
				});

				// Continues to the next iteration of the loop skipping the remaining part
				continue;
			}

			// Updates the outgoing params via appending the primitive keys and values
			requestParams = requestParams.append(key, value);
		}

		// Returns the fully constructed HttpParams with these appended parameters
		return requestParams;
	}
}
