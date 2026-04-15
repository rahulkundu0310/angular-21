import { inject } from '@angular/core';
import { Integrations } from './integrations';
import { withResetState } from '@store/reset-state';
import type { IIntegration } from './integrations.types';
import { withState, patchState, signalStore, withMethods } from '@ngrx/signals';

interface IIntegrationsState {
	integrations: IIntegration[];
	totalRecords: number;
}

/**
 * Defines an initial state object to setup store values and ensure normalized default across store features and contexts.
 * Processes fundamental state requirements to establish a reliable structure which enables consistent reactive operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState: IIntegrationsState = {
	integrations: [],
	totalRecords: 0
};

/**
 * Defines declarative state container which centralizes reactive store management to maintain seamless state integration.
 * Provides composite interface of store properties lifecycle hooks and executable methods to support predictable updates.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const IntegrationsStore = signalStore(
	// Provides initial store schema with baseline value for state composition
	withState(initialState),

	// Provides state restore capability referencing captured initial snapshot
	withResetState<IIntegrationsState>(),

	// Provides store methods enabling state updates and reactive interactions
	withMethods((store) => {
		// Dependency injections providing direct access to services and injectors
		const integrations = inject(Integrations);

		// Returns methods collection exposing callable features for public access
		return {};
	})
);
