import { isArray, isEmpty } from 'lodash-es';
import type { TRecord } from '@shared/types';
import { getEventType } from './with-request-status';
import { type Signal, computed } from '@angular/core';
import type {
	TEventsKey,
	IRequestSnapshot,
	TRequestEventInput,
	IRequestStatusStore,
	TRequestStatusEvents,
	IRequestStatusSelector,
	TRequestStatusSnapshot
} from './request-status.types';

/**
 * Selects the earliest non-idle status snapshot signal from status sources and event selectors to resolve request states.
 * Processes provided store and event arguments into a normalized selector list to resolve outputs in validation contexts.
 *
 * @param store - The store object containing mapped event snapshots used to determine the current resolved event outcome.
 * @param events - The specific event or collection of events to track within the provided store for watched event record.
 * @returns A reactive signal resolving the first active request snapshot or the stored baseline fallback status snapshot.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function selectRequestSnapshot<
	TEvents extends TRecord,
	TEventKeys extends TEventsKey<TEvents>
>(
	store: IRequestStatusStore<TEvents>,
	events: TRequestEventInput<TEventKeys>
): Signal<TRequestStatusSnapshot<TEvents, TEventKeys>>;

/**
 * Selects the earliest non-idle status snapshot signal from status sources and event selectors to resolve request states.
 * Processes provided store and event arguments into a normalized selector list to resolve outputs in validation contexts.
 *
 * @param store - The store object containing mapped event snapshots used to determine the current resolved event outcome.
 * @param events - The specific event or collection of events to track within the provided store for watched event record.
 * @returns A reactive signal resolving the first active request snapshot or the stored baseline fallback status snapshot.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function selectRequestSnapshot(
	store: IRequestStatusStore,
	events: TRequestStatusEvents
): Signal<IRequestSnapshot> {
	// Initializes a variable to hold selector entries for event status checks
	const selectors: IRequestStatusSelector[] = [];

	// Adds normalized event selectors for the provided store and event values
	selectors.push(...normalizeEvents(store, events));

	// Checks if no selectors were collected after full normalization sequence
	if (isEmpty(selectors)) {
		throw new Error('No events found please specify at least one event');
	}

	// Returns computed signal that provides the first active request snapshot
	return computed<IRequestSnapshot>(() => {
		// Iterates through every selector to find the first active request status
		for (const { event, store } of selectors) {
			// Retreives request snapshot for this event key from current store record
			const requestStatus = store.requestStatus()[event];

			// Checks if request snapshot is not idle, then returns the current status
			if (!requestStatus.isIdle) return requestStatus;
		}

		// Retreives first selector entry to provide fallback snapshot as baseline
		const [{ store, event }] = selectors;

		// Returns request snapshot for first selector as the final fallback value
		return store.requestStatus()[event];
	});
}

/**
 * Normalizes event inputs into selector entries pairing each event type string with the specified status store reference.
 * Processes event inputs into an array and gets type keys to produce selector list for each event in validation contexts.
 *
 * @param store - The store containing request status snapshots used for every selector entry assembled from event inputs.
 * @param events - The event or event list to normalize into selector entries following extracting each event type string.
 * @returns An array of selector objects pairing the specified store with normalized event type strings for type checking.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function normalizeEvents(
	store: IRequestStatusStore,
	events: TRequestStatusEvents
): IRequestStatusSelector[] {
	const normalizedEvents = isArray(events) ? events : [events];
	return normalizedEvents.map((event) => ({ store, event: getEventType(event) }));
}
