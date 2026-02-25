import { applicationConfig } from '@configs';
import { getStateSource } from '../accessors';
import { isPlatformServer } from '@angular/common';
import { effect, inject, PLATFORM_ID } from '@angular/core';
import type { TCallback, TFactory, TKeys } from '@shared/types';
import { cloneDeep, isEmpty, isNil, kebabCase, keys, omit, pick } from 'lodash-es';
import { getState, withHooks, patchState, withMethods, signalStoreFeature } from '@ngrx/signals';

export interface IStorageBroadcast<TState> {
	key?: string;
	onChange?: (state: TState) => void;
}

export interface IStorageOptions<TState extends object> {
	include: TKeys<TState>[];
	exclude: TKeys<TState>[];
	storage: TFactory<Storage>;
	broadcast?: IStorageBroadcast<TState>;
	exception: TCallback<[error: unknown], void>;
	deserialize: TCallback<[value: string], TState>;
	shouldStore: TCallback<[state: TState], boolean>;
	serialize: TCallback<[state: Omit<TState, keyof TState>], string>;
}

/**
 * Initializes a modular signal store feature to extend state management capabilities with specialized reactive behaviors.
 * Establishes storage persistence strategy to propagate alterations and broadcast modifications across browser instances.
 *
 * @param key - The unique storage identifier to preserve state entries in configured storage and broadcast modifications.
 * @param options - The configuration object containing storage provider and methods for state parsing and error handling.
 * @returns A signal store feature that equips the store with persistence and automatic storage synchronization mechanism.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function withStorage<TState extends object>(
	key: string,
	options: Partial<IStorageOptions<TState>> = {}
) {
	// Initializes a variable defining normalized options with fallback values
	const normalizedOptions: IStorageOptions<TState> = {
		broadcast: options.broadcast,
		include: options.include ?? [],
		exclude: options.exclude ?? [],
		deserialize: options.deserialize ?? JSON.parse,
		serialize: options.serialize ?? JSON.stringify,
		shouldStore: options.shouldStore ?? (() => true),
		storage: options.storage ?? (() => localStorage),
		exception: options.exception ?? ((error) => console.error(error))
	};

	// Returns signal store feature combining properties and reactive behavior
	return signalStoreFeature(
		// Provides store methods enabling state updates and reactive interactions
		withMethods((store) => {
			/**
			 * Sanitizes incoming persisted state by filtering unsupported fields before applying updates to current store properties.
			 * Processes the provided payload by deep cloning current store content selecting allowed keys and patching valid entries.
			 *
			 * @param state - The incoming state object which may be null, applied to refresh stored fields by matching specific keys.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const _sanitizeAndUpdateState = (state: TState | null): void => {
				// Checks if this incoming state is null and exits before mutation happens
				if (isNil(state)) return;

				// Retreives current store state cloning to prevent any reference mutation
				const stateSource = cloneDeep(getState(store));

				// Retreives incoming fields limited to keys present on store state schema
				const sanitizedState = pick(state, keys(stateSource));

				// Checks if sanitized result is valid ensuring store source update occurs
				if (!isEmpty(sanitizedState)) patchState(store, sanitizedState);
			};

			/**
			 * Rehydrates the internal store state by retrieving the persisted content from storage and updating the specific context.
			 * Processes source values by resolving the serialized payload and filtering the entries to refresh the stored properties.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const _rehydratePersistedState = (): void => {
				// Retreives persisted state by using the provided specific key identifier
				const persistedState = resolvePersistedState(key, normalizedOptions);

				// Sanitizes retrieved payload ensuring allowed fields refresh store state
				_sanitizeAndUpdateState(persistedState);
			};

			/**
			 * Manages the broadcast channel initialization by creating a connection for state synchronization across active contexts.
			 * Processes routines by validating configuration options creating the communication pipeline and binding listener events.
			 *
			 * @returns A broadcast channel instance enabling message exchange or null when property not provided or exception occurs.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const _setupBroadcastListener = (): BroadcastChannel | null => {
				// Retreives application name property using project configuration context
				const { name } = applicationConfig;

				// Destructures the provided source object to extract necessary properties
				const { broadcast, exception, deserialize, storage } = normalizedOptions;

				// Checks if broadcast option is missing and exits before channel creation
				if (!broadcast) return null;

				// Encloses operation trying to prudent handle potential runtime exception
				try {
					// Constructs channel namespace identifier combining name and provided key
					const channelNamespace = `${kebabCase(name)}-channel-${key}`;

					// Constructs channel identifier using configured key or default namespace
					const channelIdentifier = broadcast.key ?? channelNamespace;

					// Instantiates new broadcast channel object utilizing resolved identifier
					const channelInstance = new BroadcastChannel(channelIdentifier);

					// Registers listeners to process incoming broadcast storage update events
					channelInstance.onmessage = (event: MessageEvent<string>) => {
						// Retreives serialized string value received from latest message property
						const serializedValue = event.data;

						// Checks if retrieved string is empty and exits before processing actions
						if (isEmpty(serializedValue)) return;

						// Encloses operation trying to prudent handle potential runtime exception
						try {
							// Deserializes storage string providing valid state object representation
							const deserializedValue = deserialize(serializedValue);

							// Sanitizes deserialized payload ensuring valid fields update store state
							_sanitizeAndUpdateState(deserializedValue);

							// Triggers callback to broadcast the restored state to external listeners
							broadcast?.onChange?.(deserializedValue);

							// Persists stringified object to storage ensuring cache state consistency
							storage().setItem(key, serializedValue);
						} catch (error) {
							// Captures execution errors passing details to specific exception handler
							exception(error);
						}
					};

					// Returns channel instance enabling message exchange with active contexts
					return channelInstance;
				} catch (error) {
					// Captures execution errors passing details to specific exception handler
					exception(error);

					// Returns null value signifying broadcast channel creation process failed
					return null;
				}
			};

			// Returns methods collection exposing callable features for public access
			return { _rehydratePersistedState, _setupBroadcastListener };
		}),

		// Provides lifecycle hooks executing side effects during store operations
		withHooks((store) => {
			// Dependency injections providing direct access to services and injectors
			const platformId = inject(PLATFORM_ID);

			// Initializes a variable managing reference to broadcast channel instance
			let broadcastStream: BroadcastChannel | null = null;

			/**
			 * Handles store initialization by configuring reactive contexts and organizing state signals for consistent interactions.
			 * Executes startup tasks such as triggering initial data loads, registering effects, or configuring reactive derivations.
			 *
			 * @since 01 December 2025
			 * @author Rahul Kundu
			 */
			const onInit = () => {
				// Checks if active platform is server skipping client specific operations
				if (isPlatformServer(platformId)) return;

				// Hydrates store state by applying previously persisted value from source
				store._rehydratePersistedState();

				// Initializes broadcast listener assigning channel instance for operation
				broadcastStream = store._setupBroadcastListener();

				// Destructures the provided source object to extract necessary properties
				const { exception, shouldStore, serialize, storage, exclude, include } =
					normalizedOptions;

				// Registers reactive side effect which executes when signal value updates
				effect(() => {
					// Retreives current store state cloning to prevent any reference mutation
					const currentState = cloneDeep(getStateSource<TState>(store));

					// Checks if current state satisfies condition required for storage update
					if (!shouldStore(currentState)) return;

					// Retreives persistable fields applying include or exclude options schema
					const persistableState = !isEmpty(include)
						? pick(currentState, include)
						: omit(currentState, exclude);

					// Encloses operation trying to prudent handle potential runtime exception
					try {
						// Serializes persistable object converting to string format for retention
						const serializedValue = serialize(persistableState);

						// Posts serialized item to broadcast channel ensuring context value match
						broadcastStream?.postMessage(serializedValue);

						// Persists stringified object to storage ensuring cache state consistency
						storage().setItem(key, serializedValue);
					} catch (error: unknown) {
						// Captures execution errors passing details to specific exception handler
						exception(error);
					}
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
				// Closes active broadcast channel and resets the local reference variable
				broadcastStream?.close();
				broadcastStream = null;
			};

			// Returns callbacks collection executed during initialization and cleanup
			return { onInit, onDestroy };
		})
	);
}

/**
 * Resolves persisted state from storage retrieving serialized content under specified key and converting to typed output.
 * Processes retrieval by accessing storage checking for value existence deserializing contents and processing exceptions.
 *
 * @param key - The unique storage identifier to locate and retrieve serialized state content from the configured storage.
 * @param options - The configuration object containing storage provider and methods for state parsing and error handling.
 * @returns A deserialized state object from storage or null when the source is missing or conversion raises an exception.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
function resolvePersistedState<TState extends object>(
	key: string,
	options: IStorageOptions<TState>
): TState | null {
	// Destructures the provided source object to extract necessary properties
	const { storage, exception, deserialize } = options;

	// Encloses operation trying to prudent handle potential runtime exception
	try {
		// Retrieves serialized string value located under specific key identifier
		const persistedValue = storage().getItem(key);

		// Checks if retrieved string is empty or null avoiding processing failure
		if (isEmpty(persistedValue)) return null;

		// Returns deserialized object by turning stored string into usable object
		return deserialize(persistedValue!);
	} catch (error) {
		// Captures execution errors passing details to specific exception handler
		exception(error);

		// Returns null value indicating failure to retrieve valid storage content
		return null;
	}
}
