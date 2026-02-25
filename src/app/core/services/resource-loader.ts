import { Logger } from './logger';
import { ReplaySubject } from 'rxjs';
import type { Observable } from 'rxjs';
import type { TRecord } from '@shared/types';
import { inject, Injectable } from '@angular/core';

type TResourceType = 'script' | 'style';

interface IResourceOptions {
	async?: boolean;
	attributes?: TRecord<string>;
}

@Injectable({ providedIn: 'root' })
export class ResourceLoader {
	// Dependency injections providing direct access to services and injectors
	private readonly logger = inject(Logger);

	// Public and private class member variables reflecting state and behavior
	private resourceCache = new Map<string, ReplaySubject<Event>>();

	/**
	 * Initiates the asynchronous load of an external CSS stylesheet by delegating the request to that central resource loader.
	 * Processes the style type to ensure the resource is completely appended into this document head for successful rendering.
	 *
	 * @param url - The input string containing the target URL employed to identify and retrieve the requested external source.
	 * @param options - The request options object containing headers, query, context, credentials and some additional options.
	 * @returns An observable stream which emits the load event upon success or errors if the requested resource fails to load.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public loadStyle(url: string, options: IResourceOptions = {}): Observable<Event> {
		return this.loadResource(url, 'style', options);
	}

	/**
	 * Initiates the asynchronous load of an external JavaScript file by delegating the request to the central resource loader.
	 * Processes the script type to ensure the resource is correctly appended into this document body for successful execution.
	 *
	 * @param url - The input string containing the target URL employed to identify and retrieve the requested external source.
	 * @param options - The request options object containing headers, query, context, credentials and some additional options.
	 * @returns An observable stream which emits the load event upon success or errors if the requested resource fails to load.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public loadScript(url: string, options: IResourceOptions = {}): Observable<Event> {
		return this.loadResource(url, 'script', options);
	}

	/**
	 * Handles the entire lifecycle for dynamically loading an external resource including caching creation and event handling.
	 * Processes requests by checking internal cache first before creating and appending the appropriate DOM element to a page.
	 *
	 * @param url - The input string containing the target URL employed to identify and retrieve the requested external source.
	 * @param type - The type of resource either script or style that determines the appropriate DOM element node for creation.
	 * @param options - The request options object containing headers, query, context, credentials and some additional options.
	 * @returns An observable stream which emits the load event upon success or errors if the requested resource fails to load.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private loadResource(
		url: string,
		type: TResourceType,
		options: IResourceOptions = {}
	): Observable<Event> {
		// Updates the resource key by generating a normalized unique cache string
		const resourceKey = this.getResourceCacheKey(url);

		// Checks for existing cached resource and returns its observable if found
		if (this.resourceCache.has(resourceKey))
			return this.resourceCache.get(resourceKey)!.asObservable();

		// Initializes a new ReplaySubject to multicast load events to subscribers
		const resourceSubject = new ReplaySubject<Event>(1);

		// Sets the new subject in the resources cache mapped to the generated key
		this.resourceCache.set(resourceKey, resourceSubject);

		// Updates variable by creating configured DOM element from specified type
		const resourceElement = this.createResourceElement(url, type, options);

		// Attaches a load event handler to emit success events to the subscribers
		resourceElement.onload = (event) => {
			// Emits the load event to all active subscribers using the replay subject
			resourceSubject.next(event);

			// Completes the subject to signal that no further events will be received
			resourceSubject.complete();
		};

		// Attaches an error event handler to manage resource loading failure case
		resourceElement.onerror = (event) => {
			// Updates error message variable using descriptive text for logging usage
			const errorMessage = `Failed to load ${type} resource: ${url}`;

			// Captures the error message and the event details to the logging service
			this.logger.error(errorMessage, event);

			// Removes the failed resource from cache to support future retry attempts
			this.resourceCache.delete(resourceKey);

			// Emits the error event to subscribers to resolve this failure gracefully
			resourceSubject.error(event);
		};

		// Updates the target DOM element based on whether type is script or style
		const resourceTarget = type === 'script' ? document.body : document.head;

		// Appends the prepared resource element to the determined target location
		resourceTarget.appendChild(resourceElement);

		// Returns the observable stream allowing callers to listen to load events
		return resourceSubject.asObservable();
	}

	/**
	 * Constructs and configures a script or link DOM element for dynamic resource loading based on the specified type and URL.
	 * Processes standard properties and any custom attributes provided in the options returning the element for DOM insertion.
	 *
	 * @param url - The input string containing the target URL employed to identify and retrieve the requested external source.
	 * @param type - The type of resource either script or style that determines the appropriate DOM element node for creation.
	 * @param options - The request options object containing headers, query, context, credentials and some additional options.
	 * @returns A fully configured dynamic HTML element with all necessary attributes applied and ready for DOM tree insertion.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private createResourceElement(
		url: string,
		type: TResourceType,
		options: IResourceOptions = {}
	): HTMLScriptElement | HTMLLinkElement {
		// Initializes a variable to hold the dynamically created resource element
		let resourceElement!: HTMLScriptElement | HTMLLinkElement;

		// Checks element type and assigns properties specific to styles or script
		if (type === 'script') resourceElement = document.createElement('script');
		else resourceElement = document.createElement('link');

		// Checks if the instance is a link element to assign style specific props
		if (resourceElement instanceof HTMLLinkElement) {
			// Updates the element href attribute using the provided resource url text
			resourceElement.href = url;

			// Sets the type attribute to text/css ensuring correct rendering of style
			resourceElement.type = 'text/css';

			// Defines the relationship of the linked resource as a standard CSS sheet
			resourceElement.rel = 'stylesheet';
		} else {
			// Updates the src attribute to point to the external javascript file path
			resourceElement.src = url;

			// Sets the type attribute to text/javascript for correct script execution
			resourceElement.type = 'text/javascript';

			// Enables asynchronous loading if the async option is supplied in options
			if (options?.async) resourceElement.async = true;
		}

		// Checks if custom attributes are provided to apply them onto the element
		if (options?.attributes) {
			Object.entries(options.attributes).forEach(([key, value]) =>
				resourceElement.setAttribute(key, value)
			);
		}

		// Returns the fully configured HTML resource ready for insertion into DOM
		return resourceElement;
	}

	/**
	 * Generates a normalized unique cache key using the resource URL by leveraging the browser native link parsing capability.
	 * Processes the provided URL to resolve relative paths into absolute paths ensuring consistent and reliable deduplication.
	 *
	 * @param url - The input string containing the target URL utilized to locate and retrieve the requested external resource.
	 * @returns A normalized absolute URL string operating as the canonical identifier for the internal resource cache storage.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private getResourceCacheKey(url: string): string {
		// Updates an anchor element to leverage browser native parsing capability
		const anchorElement = document.createElement('a');

		// Assigns the URL to trigger the browser's built-in normalization process
		anchorElement.href = url;

		// Returns the resolved absolute URL string acting as the unique cache key
		return anchorElement.href;
	}
}
