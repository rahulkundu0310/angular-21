import { inject } from '@angular/core';
import { Analytics } from './analytics';
import { withResetState } from '@store/reset-state';
import type { IAnalyticsReport } from './analytics.types';
import { withState, patchState, signalStore, withMethods } from '@ngrx/signals';

interface IAnalyticsState {
	reports: IAnalyticsReport[];
}

/**
 * Defines an initial state object to setup store values and ensure normalized default across store features and contexts.
 * Processes fundamental state requirements to establish a reliable structure which enables consistent reactive operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState: IAnalyticsState = {
	reports: []
};

/**
 * Defines declarative state container which centralizes reactive store management to maintain seamless state integration.
 * Provides composite interface of store properties lifecycle hooks and executable methods to support predictable updates.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const AnalyticsStore = signalStore(
	// Provides initial store schema with baseline value for state composition
	withState(initialState),

	// Provides state restore capability referencing captured initial snapshot
	withResetState<IAnalyticsState>(),

	// Provides store methods enabling state updates and reactive interactions
	withMethods((store) => {
		// Dependency injections providing direct access to services and injectors
		const analytics = inject(Analytics);

		// Returns methods collection exposing callable features for public access
		return {};
	})
);
