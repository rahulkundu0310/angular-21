import { inject } from '@angular/core';
import { Dashboard } from './dashboard';
import { withResetState } from '@store/reset-state';
import type { IDashboardActivity, IDashboardMetrics } from './dashboard.types';
import { withState, patchState, signalStore, withMethods } from '@ngrx/signals';

interface IDashboardState {
	metrics: IDashboardMetrics | null;
	activities: IDashboardActivity[];
}

/**
 * Defines an initial state object to setup store values and ensure normalized default across store features and contexts.
 * Processes fundamental state requirements to establish a reliable structure which enables consistent reactive operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState: IDashboardState = {
	metrics: null,
	activities: []
};

/**
 * Defines declarative state container which centralizes reactive store management to maintain seamless state integration.
 * Provides composite interface of store properties lifecycle hooks and executable methods to support predictable updates.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const DashboardStore = signalStore(
	// Provides initial store schema with baseline value for state composition
	withState(initialState),

	// Provides state restore capability referencing captured initial snapshot
	withResetState<IDashboardState>(),

	// Provides store methods enabling state updates and reactive interactions
	withMethods((store) => {
		// Dependency injections providing direct access to services and injectors
		const dashboard = inject(Dashboard);

		// Returns methods collection exposing callable features for public access
		return {};
	})
);
