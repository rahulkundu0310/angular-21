import { getStateSource } from '../accessors';
import type { TRecord, TKeys } from '@shared/types';
import { computed, effect, untracked } from '@angular/core';
import { entries, isArray, isString, keys, pick } from 'lodash-es';
import {
	withProps,
	withState,
	withHooks,
	patchState,
	withMethods,
	withComputed,
	signalStoreFeature
} from '@ngrx/signals';
import type {
	TEventsKey,
	IRequestEntity,
	IRequestSnapshot,
	IRequestStatusState,
	TRequestStatusEvent,
	TRequestStateUpdater,
	TRequestStatusRecord,
	IRequestStatusOptions,
	IRequestStatusPayload
} from './request-status.types';

/**
 * Initializes an initial state object to seed store data and ensure consistent default across store features and modules.
 * Processes fundamental state requirements to establish a robust data schema that supports consistent reactive operation.
 *
 * @param events - The event type strings used to pre-populate request entities for predictable initial tracking purposes.
 * @returns An initial state object containing request entities indexed by event types for shared request status defaults.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const initialState = (events: string[] = []): IRequestStatusState => ({
	requests: Object.fromEntries(
		events.map((event) => {
			return [event, { status: 'idle', message: null }];
		})
	)
});

/**
 * Initializes a modular signal store feature to extend state management capabilities with specialized reactive behaviors.
 * Establishes reactive status tracking with automated reset process to orchestrate asynchronous request state lifecycles.
 *
 * @param options - The request status options object containing reset delay period and automatic event tracking behavior.
 * @returns A signal store feature that equips the store with request status tracking and automatic state cleanup process.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function withRequestStatus<TState extends object, TEvents extends TRecord = TRecord>(
	options: IRequestStatusOptions<TEvents> = {}
) {
	// Destructures the provided source object to extract necessary properties
	const { resetDelay = 1500, events = [] } = options;

	// Updates input format ensuring events are consistently handled as arrays
	const normalizedEvents = isArray(events) ? events : [events];

	// Updates events list by extracting string identifiers from event objects
	const eventTypes = normalizedEvents.map((event) => getEventType(event));

	// Returns signal store feature combining properties and reactive behavior
	return signalStoreFeature(
		// Provides initial store schema with baseline value for state composition
		withState(initialState(eventTypes)),

		// Provides custom properties extending store instance with static members
		withProps((store) => {
			/**
			 * Declares a normalized snapshot for a given key showing data with status and message props for stable state consumption.
			 * Processes entity details deriving consistent status values keeping request snapshot checking simpler and more reliable.
			 *
			 * @param event - The event identifier string used to label the snapshot and map to the linked request entry within store.
			 * @param entity - The optional request entity providing status message and data fields to safely compute snapshot states.
			 * @returns A typed snapshot describing status message data and derived values for seamless consumption within components.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const _getRequestSnapshot = (
				event: TEventsKey<TEvents>,
				entity?: IRequestEntity<unknown>
			): IRequestSnapshot => {
				return {
					event,
					data: entity?.data ?? null,
					status: entity?.status || 'idle',
					message: entity?.message || null,
					isPending: entity?.status === 'pending',
					isDisabled: entity?.status === 'pending',
					isRejected: entity?.status === 'rejected',
					isFulfilled: entity?.status === 'fulfilled',
					isIdle: !entity || entity.status === 'idle'
				} as const;
			};

			// Returns properties collection exposing shared members for public access
			return { _getRequestSnapshot };
		}),

		// Provides derived signals projecting current values from reactive source
		withComputed((store) => {
			/**
			 * Computes request status signal exposing per key snapshots enabling callers to read status directly via property access.
			 * Returns a proxy backed accessor that maps property keys to snapshots, keeping status selection deferred and consistent.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const requestStatus = computed<TRequestStatusRecord<TEvents>>(() => {
				// Updates local reference by accessing current request state signal value
				const requests = store.requests();

				// Returns a proxy object intercepting property access for dynamic lookups
				return new Proxy(Object.create(null), {
					ownKeys() {
						return Reflect.ownKeys(requests);
					},
					get(_, prop) {
						// Updates property key type casting it to the specified event string type
						const event = prop as TEventsKey<TEvents>;

						// Returns the request snapshot for the specified event from current state
						return store._getRequestSnapshot(event, requests[event]);
					},
					getOwnPropertyDescriptor(_, prop) {
						// Updates property key type casting it to the specified event string type
						const event = prop as TEventsKey<TEvents>;

						// Returns property descriptor setting enumeration and configuration flags
						return {
							enumerable: true,
							configurable: true,
							value: store._getRequestSnapshot(event, requests[event])
						};
					}
				});
			});

			// Returns signals collection exposing calculated values for public access
			return { requestStatus };
		}),

		// Provides store methods enabling state updates and reactive interactions
		withMethods((store) => {
			/**
			 * Updates the loading state for a specific event triggering the pending status transition within the target state entity.
			 * Processes the event identifier by executing loading status mutations through state patching in asynchronous operations.
			 *
			 * @param event - The event identifier string used to track and update the corresponding request status in store contexts.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const markPending = (event: TEventsKey<TEvents>): void => {
				patchState(store, setPending(event));
			};

			/**
			 * Updates the finalized state for a specific event triggering the fulfilled status transition within target state entity.
			 * Processes the event identifier by executing success status mutations through state patching in asynchronous operations.
			 *
			 * @param event - The event identifier string used to track and update the corresponding request status in store contexts.
			 * @param result - The optional payload object containing data and message used for updating related fields on completion.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const markFulfilled = <TEvent extends TEventsKey<TEvents>>(
				event: TEvent,
				result?: IRequestStatusPayload<TState, TEvents[TEvent]>
			): void => {
				markResolved(event, 'fulfilled', result);
			};

			/**
			 * Updates the rejected state for a single event triggering the rejected status transition within the target state entity.
			 * Processes the event identifier by executing failure status mutations through state patching in asynchronous operations.
			 *
			 * @param event - The event identifier string used to track and update the corresponding request status in store contexts.
			 * @param result - The optional payload object containing data and message used for updating related fields on completion.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const markRejected = <TEvent extends TEventsKey<TEvents>>(
				event: TEvent,
				result?: IRequestStatusPayload<TState, TEvents[TEvent]>
			): void => {
				markResolved(event, 'rejected', result);
			};

			/**
			 * Updates the settled state for a specific event by triggering fulfilled, rejected status within the target state entity.
			 * Processes event identifier by wiring data, message, status mutations through state patching in asynchronous operations.
			 *
			 * @param event - The event identifier string used to track and update the corresponding request status in store contexts.
			 * @param status - The completion status type, indicating whether the request was fulfilled or rejected during settlement.
			 * @param result - The optional payload object containing data and message used for updating related fields on completion.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const markResolved = <TEvent extends TEventsKey<TEvents>>(
				event: TEvent,
				status: 'fulfilled' | 'rejected',
				result?: IRequestStatusPayload<TState, TEvents[TEvent]>
			): void => {
				// Retrieves the data entity from result or defaults to the null reference
				const data = result?.data ?? null;

				// Retrieves the message entity from result or defaults to an empty string
				const message = result?.message ?? '';

				// Retrieves the active state source from store context using the accessor
				const stateSource = getStateSource<TState>(store);

				// Retrieves the keys from the state model as a typed array of key strings
				const stateKeys = keys(stateSource) as TKeys<TState>[];

				// Normalizes the result object by picking only available state properties
				const normalizedState = pick<Partial<TState>>(result, stateKeys);

				// Determines the status updater based on the outcome of the passed action
				const statusUpdater =
					status === 'fulfilled'
						? setFulfilled(event, { data, message })
						: setRejected(event, { data, message });

				// Updates the store state with the provided update entries and properties
				patchState(store, statusUpdater, normalizedState);
			};

			// Returns methods collection exposing callable features for public access
			return { markPending, markFulfilled, markRejected, markResolved };
		}),

		// Provides lifecycle hooks executing side effects during store operations
		withHooks((store) => {
			// Initializes a variable to store timeout references for scheduled events
			const eventTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

			/**
			 * Handles store initialization by configuring reactive contexts and organizing state signals for consistent interactions.
			 * Executes startup tasks such as triggering initial data loads, registering effects, or configuring reactive derivations.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const onInit = () => {
				// Registers reactive side effect which executes when signal value updates
				effect(() => {
					// Updates local reference by accessing current request state signal value
					const requests = store.requests();

					// Executes code without establishing subscriptions to any accessed signal
					untracked(() => {
						// Iterates through request entries to process status changes and timeouts
						entries<IRequestEntity>(requests).forEach(([event, request]) => {
							// Checks if the request has achieved a final fulfilled or rejected status
							if (request.status === 'fulfilled' || request.status === 'rejected') {
								// Checks if an active timeout already exists for this specific event name
								if (eventTimeouts.has(event)) {
									clearTimeout(eventTimeouts.get(event));
								}

								// Updates state by scheduling a reset operation after that specific delay
								const eventTimeout = setTimeout(() => {
									patchState(store, setIdle(event));
								}, resetDelay);

								// Sets or Updates the timeout registry tracking the active reset timer id
								eventTimeouts.set(event, eventTimeout);
							}
						});
					});
				});
			};

			/**
			 * Handles store destruction by releasing retained resources and dismantling reactive connections to prevent memory leaks.
			 * Executes cleanup procedures such as cancelling inflight requests, resetting store signals, or clearing computed caches.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const onDestroy = (): void => {
				// Iterates through current timeouts ensuring all pending timers are unset
				eventTimeouts.forEach((timeout) => clearTimeout(timeout));

				// Updates store state by resetting it to the initial default state object
				patchState(store, initialState(eventTypes));

				// Clears the internal timeout registry removing active tracked references
				eventTimeouts.clear();
			};

			// Returns callbacks collection executed during initialization and cleanup
			return { onInit, onDestroy };
		})
	);
}

/**
 * Provides the actual event type string from an event input, supporting both base string events and typed event creators.
 * Processes event inputs to normalize identifiers, ensuring consistent keys for request entity indexing and access paths.
 *
 * @param event - The event identifier required to find and update the particular entry inside the persistent store state.
 * @returns A normalized event type string used as a stable core key for indexing request entities within the request map.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function getEventType(event: TRequestStatusEvent): string {
	return isString(event) ? event : event.type;
}

/**
 * Updates request status to idle and clears any message to reset the tracked state entity to its default baseline values.
 * Processes the event key and basic fields to update required values while preserving unrelated request entry properties.
 *
 * @param event - The event identifier required to find and update the particular entry inside the persistent store state.
 * @returns A request state updater function producing partial changes for patching state and coordinating request status.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function setIdle(event: TRequestStatusEvent): TRequestStateUpdater {
	return (state: IRequestStatusState) => ({
		requests: {
			...state.requests,
			[getEventType(event)]: { status: 'idle', message: null }
		}
	});
}

/**
 * Updates request status to pending and clears message values to indicate an active operation is in progress in UI state.
 * Processes the event key and basic fields to update required values while preserving unrelated request entry properties.
 *
 * @param event - The event identifier required to find and update the particular entry inside the persistent store state.
 * @returns A request state updater function producing partial changes for patching state and coordinating request status.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function setPending(event: TRequestStatusEvent): TRequestStateUpdater {
	return (state: IRequestStatusState) => ({
		requests: {
			...state.requests,
			[getEventType(event)]: { status: 'pending', message: null }
		}
	});
}

/**
 * Updates request status to fulfilled and applies payload fields, noting a success message and optional response content.
 * Processes the event key and payload fields to update needed values while preserving unrelated request entry properties.
 *
 * @param event - The event identifier required to find and update the particular entry inside the persistent store state.
 * @param payload - The optional payload providing message and data values used to enrich the request entry during update.
 * @returns A request state updater function producing partial changes for patching state and coordinating request status.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function setFulfilled<TState extends object>(
	event: TRequestStatusEvent,
	payload?: IRequestStatusPayload<TState>
): TRequestStateUpdater {
	return (state: IRequestStatusState) => ({
		requests: {
			...state.requests,
			[getEventType(event)]: {
				status: 'fulfilled',
				message: payload?.message || null,
				...(!!payload?.data && { data: payload.data })
			}
		}
	});
}

/**
 * Updates request status to rejected and applies payload fields, recording failure message and optional response content.
 * Processes the event key and payload fields to update needed values while preserving unrelated request entry properties.
 *
 * @param event - The event identifier required to find and update the particular entry inside the persistent store state.
 * @param payload - The optional payload providing message and data values used to enrich the request entry during update.
 * @returns A request state updater function producing partial changes for patching state and coordinating request status.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function setRejected<TState extends object>(
	event: TRequestStatusEvent,
	payload?: IRequestStatusPayload<TState>
): TRequestStateUpdater {
	return (state: IRequestStatusState) => ({
		requests: {
			...state.requests,
			[getEventType(event)]: {
				status: 'rejected',
				message: payload?.message || null,
				...(!!payload?.data && { data: payload.data })
			}
		}
	});
}

// ----------------------------------------------------------
// // Provides root scoped store instance to manage state for dependency tree
// { providedIn: 'root' },

// // Provides type constraint defining required structure for state instance
// { state: type<TState>() },

// // Returns signal store feature combining properties and reactive behavior
// return signalStoreFeature()

// // Provides initial store schema with baseline value for state composition
// withState(),

// // Provides state change tracking with snapshots printed in console groups
// withLogger(),

// // Provides storage capability saving properties and restoring upon reload
// withStorage(),

// // Provides state restore capability referencing captured initial snapshot
// withResetState(),

// // Provides navigation behavior managing routing events and state snapshot
// withNavigation(),

// // Provides router integration exposing navigation events and state stream
// withRouterState(),

// // Provides tracking of asynchronous request status with automated cleanup
// withRequestStatus(),

// // Provides custom properties extending store instance with static members
// withProps((store) => {
//     // Returns properties collection exposing shared members for public access
//     return {};
// }),

// // Provides derived signals projecting current values from reactive source
// withComputed((store) => {
//     // Returns signals collection exposing calculated values for public access
//     return {};
// }),

// // Provides linked state slices deriving state values from reactive source
// withLinkedState((store) => {
//     // Returns signals collection exposing dependent signals for public access
//     return {};
// }),

// // Provides store methods enabling state updates and reactive interactions
// withMethods((store) => {
//     // Returns methods collection exposing callable features for public access
//     return {};
// }),

// // Provides lifecycle hooks executing side effects during store operations
// withHooks((store) => {
//     // Returns callbacks collection executed during initialization and cleanup
//     return {};
// }),
