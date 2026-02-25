import { getStateSource } from '../accessors';
import type { TCallback } from '@shared/types';
import type { StateSource } from '@ngrx/signals';
import { withHooks, patchState, withMethods, signalStoreFeature } from '@ngrx/signals';

type TStateSource<TState extends object = object> = StateSource<TState>;

interface IResetStore<TState extends object> extends TStateSource<TState> {
	_setInitialState: TCallback<[Partial<TStore<TState>>]>;
}

type TStore<TState extends object = object> = {
	[TKey in keyof TState as TKey extends `_${string}` ? never : TKey]: TState[TKey];
};

/**
 * Initializes a modular signal store feature to extend state management capabilities with specialized reactive behaviors.
 * Establishes lifecycle hooks to capture initial state automatically and exposes reset methods to undo the state changes.
 *
 * @returns A signal store feature that equips the store with state reset mechanisms and automatic initial state recovery.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function withResetState<TState extends object>() {
	// Returns signal store feature combining properties and reactive behavior
	return signalStoreFeature(
		// Provides store methods enabling state updates and reactive interactions
		withMethods((store) => {
			// Initializes a variable to store the initial state of the store instance
			let initialState: Partial<TStore<TState>> = Object.create(null);

			/**
			 * Updates the initial state snapshot used as a default reset target for the store feature instance during initialization.
			 * Processes the provided state object to establish a reliable initial snapshot crucial for future state reset operations.
			 *
			 * @param state - The partial state snapshot containing initial values stored as a default target for state reset process.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const _setInitialState = (state: Partial<TStore<TState>>): void => {
				initialState = state;
			};

			/**
			 * Resets store state to the captured initial snapshot, or patches with override state when selective resets are required.
			 * Processes the request to revert state changes by restoring the cached snapshot, or applying a specific override object.
			 *
			 * @param overrideState - The partial state object containing override values used to update properties for reset process.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const resetState = (overrideState?: Partial<TStore<TState>>): void => {
				patchState(store, overrideState ?? initialState);
			};

			// Returns methods collection exposing callable features for public access
			return { _setInitialState, resetState };
		}),

		// Provides lifecycle hooks executing side effects during store operations
		withHooks((store) => {
			/**
			 * Handles store initialization by configuring reactive contexts and organizing state signals for consistent interactions.
			 * Executes startup tasks such as triggering initial data loads, registering effects, or configuring reactive derivations.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const onInit = (): void => {
				store._setInitialState(getStateSource(store));
			};

			// Returns callbacks collection executed during initialization and cleanup
			return { onInit };
		})
	);
}

/**
 * Updates internal initial state reference of a store instance externally to manually configure the default reset target.
 * Processes the input state to update the internal initial state reference ensuring correct behavior during state resets.
 *
 * @param store - The store instance containing the reset feature functions required to update the initial state snapshot.
 * @param state - The partial public state object to be registered as the new default baseline for future state reset operations.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function setResetState<TState extends object>(
	store: IResetStore<TState>,
	state: Partial<TStore<TState>>
): void {
	if ('_setInitialState' in store) {
		store._setInitialState(state);
		return;
	}
	throw new Error('Cannot set reset state because the store is not configured with withReset');
}
