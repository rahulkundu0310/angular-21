import { withLogger } from './logger';
import type { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Common } from '@core/services';
import type { ICountry } from '@shared/types';
import { withResetState } from './reset-state';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, filter, tap, throwError } from 'rxjs';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';

interface ICommonState {
	countries: ICountry[];
	silentNavigation: boolean;
	_titleSegment: string | null;
}

/**
 * Defines an initial state object to setup store values and ensure normalized default across store features and contexts.
 * Processes fundamental state requirements to establish a reliable structure which enables consistent reactive operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState: ICommonState = {
	countries: [],
	_titleSegment: null,
	silentNavigation: false
};

/**
 * Defines declarative state container which centralizes reactive store management to maintain seamless state integration.
 * Provides composite interface of store properties, lifecycle hooks and executing methods to support predictable updates.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const CommonStore = signalStore(
	// Provides root scoped store instance to manage state for dependency tree
	{ providedIn: 'root' },

	// Provides initial store schema with baseline value for state composition
	withState(initialState),

	// Provides state restore capability referencing captured initial snapshot
	withResetState<ICommonState>(),

	// Provides state change tracking with snapshots printed in console groups
	withLogger<ICommonState>({ storeName: 'Common', monitor: ['countries'] }),

	// Provides custom properties extending store instance with static members
	withProps((store) => {
		/**
		 * Declares a page title segment by converting signal to a stream and filtering null values for title handling operations.
		 * Processes signal transform excluding null to deliver reactive title segment stream within the browser title management.
		 *
		 * @returns An observable containing the page title segment with filtered non-null string value for browser title display.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const pageTitleSegment = toObservable(store._titleSegment).pipe(
			filter((segment): segment is string => !!segment)
		);

		// Returns properties collection exposing shared members for public access
		return { pageTitleSegment };
	}),

	// Provides store methods enabling state updates and reactive interactions
	withMethods((store) => {
		// Dependency injections providing direct access to services and injectors
		const common = inject(Common);

		/**
		 * Updates the page title segment within the signal state to support the dynamic modification of the browser window title.
		 * Processes signal operations with segment assignment to ensure consistent synchronization for the browser title display.
		 *
		 * @param segment - The segment string containing the input page title for reactive synchronization with the signal state.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const setPageTitleSegment = (segment: string): void => {
			patchState(store, { _titleSegment: segment });
		};

		/**
		 * Updates the silent navigation status within the signal state to accommodate the dynamic control of navigation feedback.
		 * Processes signal updates with mode assignment to ensure consistent synchronization for the navigation feedback display.
		 *
		 * @param isSilent - The boolean flag containing the silent mode value for reactive synchronization with the signal state.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const setSilentNavigation = (isSilent: boolean): void => {
			patchState(store, { silentNavigation: isSilent });
		};

		/**
		 * Retrieves a single country entity from the store state by matching the unique alpha2 identifier used as the search key.
		 * Processes the array lookup operation to locate the corresponding country record containing full administrative details.
		 *
		 * @param countryCode - The unique two character string code alpha2 used to identify the given country entity in the list.
		 * @returns A specific matching country object if found within the store state, or undefined if no matching record exists.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const getCountry = (countryCode: string): ICountry | undefined => {
			return store.countries().find(({ alpha2 }) => alpha2 === countryCode);
		};

		/**
		 * Loads country reference data from static assets to initialize the store state with comprehensive geographical contents.
		 * Processes the retrieval operation to update the state with fetched country data and handles potential execution errors.
		 *
		 * @returns An observable containing the list of countries populated with detailed geographic and administrative metadata.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const loadCountries = (): Observable<ICountry[]> => {
			return common.fetchCountries().pipe(
				tap((result) => {
					patchState(store, { countries: result });
				}),
				catchError((operationError) => {
					return throwError(() => operationError);
				})
			);
		};

		// Returns methods collection exposing callable features for public access
		return { getCountry, loadCountries, setPageTitleSegment, setSilentNavigation };
	})
);
