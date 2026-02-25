import { HttpAgent } from '@core/http';
import type { ICountry } from '@shared/types';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Common {
	// Dependency injections providing direct access to services and injectors
	private readonly http = inject(HttpAgent);

	/**
	 * Retrieves the complete collection of country reference data from the internal assets to populate the application state.
	 * Processes the retrieval request to fetch the static json source and return it as a structured list of country entities.
	 *
	 * @returns An observable containing the list of countries populated with detailed geographic and administrative metadata.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public fetchCountries() {
		// Constructs the API endpoint URL target for the current resource request
		const endpoint = `./data/countries.json?cache_buster=${Date.now()}`;

		// Perform HTTP request with provided endpoint URL and optional parameters
		return this.http.get<ICountry[]>(endpoint, { useBaseUrl: false });
	}
}
