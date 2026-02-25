import { isObject } from 'lodash-es';
import { getState } from '@ngrx/signals';
import type { StateSource } from '@ngrx/signals';

/**
 * Provides the underlying state source object from the input signal store instance to facilitate reliable internal state.
 * Processes the store instance to safely extract the underlying state source required for initializing reset state setup.
 *
 * @param store - The unknown store object that needs to be validated against the defined state source structure and keys.
 * @returns A typed state source object enabling direct access to the underlying state values and properties of the store.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function getStateSource<TState extends object>(store: unknown): TState {
	if (isStateSource<TState>(store)) return getState(store as StateSource<TState>);
	throw new Error('Cannot get state the store is not configured with withReset or is invalid');
}

/**
 * Determines whether the provided object matches the state source signature to ensure type safety during operation cycle.
 * Processes type checking using property inspection method to ensure valid state source detection in validation contexts.
 *
 * @param store - The unknown store object that needs to be validated against the defined state source structure and keys.
 * @returns A boolean indicating whether the provided object is a valid state source capable of data retrieval operations.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function isStateSource<TState extends object>(store: unknown): store is StateSource<TState> {
	// Checks if the provided store input is valid and is a non-null data type
	if (!store || !isObject(store)) return false;

	// Retrieves all the property symbols directly defined on the store object
	const storeSymbols = Object.getOwnPropertySymbols(store);

	// Returns true if any symbol description equals the specific state source
	return storeSymbols.some((symbol) => symbol.description === 'STATE_SOURCE');
}
