import WebFont from 'webfontloader';
import { CommonStore } from '@store';
import type { Observer } from 'rxjs';
import { environment } from '@env/environment';
import { inject, Injectable } from '@angular/core';
import { ResourceLoader } from './resource-loader';
import { catchError, forkJoin, map, Observable, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Initializer {
	// Dependency injections providing direct access to services and injectors
	private readonly commonStore = inject(CommonStore);
	private readonly resourceLoader = inject(ResourceLoader);

	/**
	 * Provides the centralized entry point for the application initialization process ensuring all dependencies are resolved.
	 * Delegates the required resource loading execution to the dedicated internal function to isolate implementation details.
	 *
	 * @returns An observable containing the completion state indicating all essential initialization processes are finalized.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public get initialize(): Observable<void> {
		return this.loadInitialResources();
	}

	/**
	 * Loads the required application resources sequentially to ensure the interface is completely ready for user interaction.
	 * Handles the execution flow by chaining countries array retrieval with parallel loading of external libraries and fonts.
	 *
	 * @returns An observable containing the completion state indicating all essential initialization processes are finalized.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private loadInitialResources(): Observable<void> {
		return this.commonStore.loadCountries().pipe(
			switchMap(() => {
				return forkJoin([this.loadGoogleMaps(), this.loadGoogleFonts()]).pipe(
					map(() => void 0)
				);
			}),
			catchError((operationError) => {
				return throwError(() => operationError);
			})
		);
	}

	/**
	 * Loads the selected Google Fonts asynchronously to initialize the typography system with defined typefaces and variants.
	 * Handles the font loading process using WebFont loader and manages the active and inactive states for stream completion.
	 *
	 * @returns An observable containing the completion state that signifies the Google Fonts configurations are fully loaded.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private loadGoogleFonts(): Observable<void> {
		return new Observable((observer: Observer<void>) => {
			WebFont.load({
				google: {
					families: [
						// Material icons with variable font configuration using specific settings
						'Material Symbols Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',

						// Montserrat font with all weights/styles support for rich text rendering
						'Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic'
					]
				},

				// Completes the observer stream upon successful Google font load callback
				active: () => observer.complete(),

				// Completes the observer stream if font loading request process times out
				inactive: () => observer.complete()
			});
		});
	}

	/**
	 * Loads the Google Maps API script asynchronously to initialize the full set of configured desired features and services.
	 * Handles the configuration and accesses the remote library by constructing the endpoint using current environment entry.
	 *
	 * @returns An observable containing the completion event that signifies the Google Maps library instance is fully loaded.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private loadGoogleMaps(): Observable<Event> {
		// Retrieves the Google Maps API key from the current environment settings
		const mapsApiKey = environment.mapsApiKey;

		// Constructs the dynamic Google Maps API URL with the required parameters
		const mapsEndpoint = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${mapsApiKey}&callback=Function.prototype&loading=async`;

		// Returns the library script load observable via injected resource loader
		return this.resourceLoader.loadScript(mapsEndpoint, { async: true });
	}
}
