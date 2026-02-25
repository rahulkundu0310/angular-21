import { Injectable } from '@angular/core';
import type { TCallback } from '@shared/types';

@Injectable({ providedIn: 'root' })
export class Logger {
	// Public and private class member variables reflecting state and behavior
	public readonly groupEnd: TCallback<[]>;
	public readonly group: TCallback<[label: string, ...styles: unknown[]]>;
	public readonly log: TCallback<[message: string, ...context: unknown[]]>;
	public readonly info: TCallback<[message: string, ...context: unknown[]]>;
	public readonly warn: TCallback<[message: string, ...context: unknown[]]>;
	public readonly debug: TCallback<[message: string, ...context: unknown[]]>;
	public readonly error: TCallback<[message: string, ...context: unknown[]]>;
	public readonly groupCollapsed: TCallback<[label: string, ...styles: unknown[]]>;

	/**
	 * Initializes the console wrapper functions by attaching them to valid context while ensuring seamless logging execution.
	 * Establishes bound console method references with centralized fallback handling to maintain consistent runtime behavior.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	constructor() {
		// Updates the log property with a bound console method for debug messages
		this.log = this.bindToConsole(console.log);

		// Updates the info property with a bound console method for status checks
		this.info = this.bindToConsole(console.info);

		// Updates the warn property with a bound console method for warn handling
		this.warn = this.bindToConsole(console.warn);

		// Updates the debug property with a bound console method for deep tracing
		this.debug = this.bindToConsole(console.debug);

		// Updates the error property with a bound console method for fault report
		this.error = this.bindToConsole(console.error);

		// Updates the group property with a bound console method for log grouping
		this.group = this.bindToConsole(console.group);

		// Updates the groupEnd property with a bound console method for group end
		this.groupEnd = this.bindToConsole(console.groupEnd);

		// Updates the groupCollapsed property with a bound console method to fold
		this.groupCollapsed = this.bindToConsole(console.groupCollapsed);
	}

	/**
	 * Binds the provided callback to the console context, returning a bound function to enable safe logging execution process.
	 * Validates the console object existence before binding to guarantee consistent execution across all browser environments.
	 *
	 * @param callback - The console method reference to bind for ensuring correct execution context during logging operations.
	 * @returns A bound console function for safe execution or a silent no-op function as fallback when console is unavailable.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private bindToConsole(callback: TCallback): TCallback {
		if (!console) return () => {};
		return callback.bind(console);
	}
}
