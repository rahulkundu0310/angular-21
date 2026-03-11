import { Users } from './users';
import { inject } from '@angular/core';
import type { IUser } from './users.types';
import { withResetState } from '@store/reset-state';
import { withState, withHooks, patchState, signalStore, withMethods } from '@ngrx/signals';

interface IUsersState {
	users: IUser[];
	totalRecords: number;
}

/**
 * Defines an initial state object to setup store values and ensure normalized default across store features and contexts.
 * Processes fundamental state requirements to establish a reliable structure which enables consistent reactive operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState: IUsersState = {
	users: [],
	totalRecords: 0
};

/**
 * Defines declarative state container which centralizes reactive store management to maintain seamless state integration.
 * Provides composite interface of store properties lifecycle hooks and executable methods to support predictable updates.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const UsersStore = signalStore(
	// Provides initial store schema with baseline value for state composition
	withState(initialState),

	// Provides state restore capability referencing captured initial snapshot
	withResetState<IUsersState>(),

	// Provides store methods enabling state updates and reactive interactions
	withMethods((store) => {
		// Dependency injections providing direct access to services and injectors
		const users = inject(Users);

		// Returns methods collection exposing callable features for public access
		return {};
	}),

	// Provides lifecycle hooks executing side effects during store operations
	withHooks((store) => {
		/**
		 * Handles store destruction by releasing retained resources and dismantling reactive connections to prevent memory leaks.
		 * Executes cleanup procedures such as cancelling inflight requests, resetting store signals, or clearing computed caches.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const onDestroy = (): void => {
			store.resetState(initialState);
		};

		// Returns callbacks collection executed during initialization and cleanup
		return { onDestroy };
	})
);
