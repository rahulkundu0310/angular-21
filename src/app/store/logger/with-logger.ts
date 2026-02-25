import { DateTime } from 'luxon';
import { Logger } from '@core/services';
import type { TKeys } from '@shared/types';
import { getStateSource } from '../accessors';
import { environment } from '@env/environment';
import { effect, inject } from '@angular/core';
import { isEqual, cloneDeep, pick, capitalize } from 'lodash-es';
import { signalStoreFeature, withHooks, withMethods } from '@ngrx/signals';

export interface ILoggerOptions<TState> {
	storeName: string;
	disabled?: boolean;
	collapsed?: boolean;
	monitor?: TKeys<TState>[];
}

/**
 * Initializes a modular signal store feature to extend state management capabilities with specialized reactive behaviors.
 * Establishes automated state recording routines to track state changes and facilitate debugging when logging is enabled.
 *
 * @param options - The logger options object containing store identifier, state monitor filter and console view settings.
 * @returns A signal store feature that equips the store with automatic state change logger and side effect tracking hook.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function withLogger<TState extends object>(options: ILoggerOptions<TState>) {
	// Destructures the provided source object to extract necessary properties
	const { storeName, monitor, collapsed = false, disabled = environment.production } = options;

	// Returns signal store feature combining properties and reactive behavior
	return signalStoreFeature(
		// Provides store methods enabling state updates and reactive interactions
		withMethods((store) => {
			/**
			 * Retrieves the current state snapshot from the store filtering it precisely based on the configured monitoring criteria.
			 * Processes the underlying source state object to return either the specific monitored keys or the complete state object.
			 *
			 * @returns A state snapshot object containing either the explicitly filtered properties or the complete underlying state.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const _getStateSnapshot = (): Partial<TState> => {
				// Retrieves the active state source from store context using the accessor
				const stateSource = getStateSource<TState>(store);

				// Returns the filtered subset or the entire state source if not monitored
				return monitor?.length ? pick(stateSource, monitor) : stateSource;
			};

			// Returns methods collection exposing callable features for public access
			return { _getStateSnapshot };
		}),

		// Provides lifecycle hooks executing side effects during store operations
		withHooks(({ _getStateSnapshot }) => {
			/**
			 * Handles store initialization by configuring reactive contexts and organizing state signals for consistent interactions.
			 * Executes startup tasks such as triggering initial data loads, registering effects, or configuring reactive derivations.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const onInit = (): void => {
				// Dependency injections providing direct access to services and injectors
				const logger = inject(Logger);

				// Checks if the logger is disabled to prevent unnecessary logging outputs
				if (disabled) return;

				// Initializes a variable holding a deep copy of the state for comparisons
				let previousState = cloneDeep(_getStateSnapshot());

				// Registers reactive side effect which executes when signal value updates
				effect(() => {
					// Updates local reference by accessing current source state object values
					const currentState = _getStateSnapshot();

					// Checks if the current state matches the previous one to skip log action
					if (isEqual(previousState, currentState)) return;

					// Retrieves the current time using milliseconds for precise logs tracking
					const logTimestamp = DateTime.now().toFormat('HH:mm:ss.SSS');

					// Constructs the formatted log header combining store label and timestamp
					const logGroupLabel = `[${capitalize(storeName)}] - @ ${logTimestamp}`;

					// Defines the visual style for the log group header using bold formatting
					const logHeaderStyle = 'font-weight: bold; font-size: 12px;';

					// Defines the visual styles for the previous state label using grey color
					const logPrevStateStyle = 'color: #9E9E9E; font-weight: normal;';

					// Defines the visual style for the next state label using the green color
					const logNextStateStyle = 'color: #4CAF50; font-weight: normal;';

					// Encloses operation trying to prudent handle potential runtime exception
					try {
						// Checks the collapsed flag and opens console group expanded or collapsed
						if (!collapsed) console.group(`%c${logGroupLabel}`, logHeaderStyle);
						else console.groupCollapsed(`%c${logGroupLabel}`, logHeaderStyle);

						// Logs the previous state snapshot to the console for historical tracking
						logger.log('%c prev state', logPrevStateStyle, previousState);

						// Logs the updated state snapshot to the console for verification purpose
						logger.log('%c next state', logNextStateStyle, currentState);
					} finally {
						// Closes the open console group to ensure subsequent logs remain unnested
						logger.groupEnd();
					}

					// Updates the previous state reference to match the current state version
					previousState = cloneDeep(currentState);
				});
			};

			// Returns callbacks collection executed during initialization and cleanup
			return { onInit };
		})
	);
}
