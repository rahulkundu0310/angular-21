import { computed } from '@angular/core';
import { withResetState } from './reset-state';
import type { NgProgressRef } from 'ngx-progressbar';
import { withState, patchState, withMethods, signalStore, withComputed } from '@ngrx/signals';

interface TProgressState {
	_count: number;
	instance: NgProgressRef | null;
}

/**
 * Defines an initial state object to setup store values and ensure normalized default across store features and contexts.
 * Processes fundamental state requirements to establish a reliable structure which enables consistent reactive operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState: TProgressState = {
	_count: 0,
	instance: null
};

/**
 * Defines declarative state container which centralizes reactive store management to maintain seamless state integration.
 * Provides composite interface of store properties lifecycle hooks and executable methods to support predictable updates.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const ProgressStore = signalStore(
	// Provides root scoped store instance to manage state for dependency tree
	{ providedIn: 'root' },

	// Provides initial store schema with baseline value for state composition
	withState(initialState),

	// Provides state restore capability referencing captured initial snapshot
	withResetState<TProgressState>(),

	// Provides derived signals projecting current values from reactive source
	withComputed((store) => {
		/**
		 * Computes the latest progress amount by reading assigned instance reference and normalizing missing values consistently.
		 * Returns a number representing the current measured amount or zero when the instance reference has not been initialized.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const progress = computed<number>(() => store.instance()?.progress() ?? 0);

		/**
		 * Computes the active progress status by reading assigned instance reference and normalizing missing values consistently.
		 * Returns a boolean indicating whether progress is running or false when the instance reference has not been initialized.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const active = computed<boolean>(() => store.instance()?.active() ?? false);

		// Returns signals collection exposing calculated values for public access
		return { active, progress };
	}),

	// Provides store methods enabling state updates and reactive interactions
	withMethods((store) => {
		/**
		 * Resets the active progress tracking counter to zero establishing a pristine baseline state for future operation cycles.
		 * Processes state mutation by patching the store property to remove assigned count and prevent stale activity monitoring.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const reset = (): void => {
			patchState(store, { _count: 0 });
		};

		/**
		 * Updates the current progress indicator by passing a specific numeric amount during active cycles to guarantee accuracy.
		 * Processes running status verifying ongoing operations prior to assigning the specified value directly to the reference.
		 *
		 * @param value - The exact numeric modifier applied to calculate current completion percentage overriding former amounts.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const update = (value: number): void => {
			if (!store.active()) return;
			store.instance()?.set(value);
		};

		/**
		 * Increments the current progress value by applying a designated numeric amount to advance ongoing tracking continuously.
		 * Processes validation to verify ongoing activity before pushing the requested addition directly to an internal instance.
		 *
		 * @param amount - The optional numeric input utilized to advance the active completion indicator ensuring proper updates.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const increment = (amount?: number): void => {
			if (!store.active()) return;
			store.instance()?.inc(amount);
		};

		/**
		 * Initiates the primary progression sequence activating an attached tracking mechanism to monitor assigned running tasks.
		 * Processes validation to verify ongoing activity to strictly prevent duplicated initialization in concurrent executions.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const start = (): void => {
			if (store.active()) return;
			store.instance()?.start();
		};

		/**
		 * Completes the primary progression sequence concluding an attached tracking mechanism to finalize defined running tasks.
		 * Processes validation to verify ongoing activity to strictly prevent duplicated finalizations for concurrent executions.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const complete = (): void => {
			if (!store.active()) return;
			store.instance()?.complete();
		};

		/**
		 * Coordinates the progression sequences by guiding concurrent executions to ensure accurate indicator status assignments.
		 * Processes the internal counter modifying designated tracking metrics and conditionally triggering required resolutions.
		 *
		 * @param operation - The defined action identifier dictating whether to initiate or conclude an active ongoing procedure.
		 * @param monitorCount - The boolean modifier driving numerical updates alongside primary operational mechanism mutations.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const track = (operation: 'start' | 'complete', monitorCount: boolean = true): void => {
			if (operation === 'start') {
				// Checks if progress bar has no active process running to trigger a start
				if (!store.active()) start();

				// Checks if count tracking is active before running the increment process
				if (monitorCount) {
					patchState(store, (state) => {
						return { _count: state._count + 1 };
					});
				}
			} else {
				// Checks if count tracking is active before running the decrement process
				if (monitorCount) {
					patchState(store, (state) => {
						return { _count: Math.max(0, state._count - 1) };
					});
				}

				// Checks if count depleted or tracking turned off to trigger a completion
				if (!store._count() || !monitorCount) complete();
			}
		};

		/**
		 * Registers the progress reference initializing an essential connection to provided indicator utilities within the store.
		 * Processes state mutation by patching the target attribute to inject the specified dependency or assign a null instance.
		 *
		 * @param instance - The injected external interface utilized to direct active executions or an undefined value to detach.
		 *
		 * @since 01 December 2025
		 * @author Rahul Kundu
		 */
		const register = (instance: NgProgressRef | undefined): void => {
			patchState(store, { instance: instance ?? null });
		};

		// Returns methods collection exposing callable features for public access
		return {
			track,
			start,
			reset,
			update,
			register,
			complete,
			increment
		};
	})
);
