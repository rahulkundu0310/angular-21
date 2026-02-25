import { isFunction } from 'lodash-es';
import { Injectable } from '@angular/core';
import { toast, toastState } from 'ngx-sonner';
import { Toast } from '@shared/components/widgets';
import { generateObjectId } from '@shared/utilities';
import type {
	TToastId,
	TToastType,
	TToastResolver,
	TToastMessagePayload,
	TToastPromisePayload
} from '@shared/types';

@Injectable({ providedIn: 'root' })
export class Toaster {
	/**
	 * Renders a success toast notification signaling that a requested operation has been executed and completed successfully.
	 * Processes the success state to render a green checkmark icon and apply success specific configuration to the component.
	 *
	 * @param payload - The payload containing the displayed message text and optional configuration properties for the toast.
	 * @returns An unique identifier of the generated toast instance for any subsequent manual update or dismissal operations.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public success(...payload: TToastMessagePayload): TToastId {
		return this.invokeToast(payload, 'success');
	}

	/**
	 * Renders an error toast notification signaling that a requested operation has failed or a critical problem has occurred.
	 * Processes the error state to render a red alert icon and apply the error specific configuration to the toast component.
	 *
	 * @param payload - The payload containing the displayed message text and optional configuration properties for the toast.
	 * @returns An unique identifier of the generated toast instance for any subsequent manual update or dismissal operations.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public error(...payload: TToastMessagePayload): TToastId {
		return this.invokeToast(payload, 'error');
	}

	/**
	 * Renders an informational toast notification signaling neutral status updates or general non critical platform messages.
	 * Processes the info state to render a blue info symbol and apply the info specific configuration to the toast component.
	 *
	 * @param payload - The payload containing the displayed message text and optional configuration properties for the toast.
	 * @returns An unique identifier of the generated toast instance for any subsequent manual update or dismissal operations.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public info(...payload: TToastMessagePayload): TToastId {
		return this.invokeToast(payload, 'info');
	}

	/**
	 * Renders a warning toast notification indicating a potential problem that requires manual attention but is not critical.
	 * Processes the warning status to render a yellow warning icon and apply warning specific configuration to the component.
	 *
	 * @param payload - The payload containing the displayed message text and optional configuration properties for the toast.
	 * @returns An unique identifier of the generated toast instance for any subsequent manual update or dismissal operations.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public warning(...payload: TToastMessagePayload): TToastId {
		return this.invokeToast(payload, 'warning');
	}

	/**
	 * Renders a loading toast notification signaling that a background operation is currently running and pending completion.
	 * Processes the loading status to render a spinner icon and assign loading specific configuration to the toast component.
	 *
	 * @param payload - The payload containing the displayed message text and optional configuration properties for the toast.
	 * @returns An unique identifier of the generated toast instance for any subsequent manual update or dismissal operations.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public loading(...payload: TToastMessagePayload): TToastId {
		return this.invokeToast(payload, 'loading');
	}

	/**
	 * Dismisses a specific toast notification by its unique identifier or dismisses all current toasts if no key is provided.
	 * Processes the final animation for the targeted toast instances before removing them completely from the user interface.
	 *
	 * @param toastId - The unique identifier of the specified toast to dismiss, or undefined to dismiss all displayed toasts.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public dismiss(toastId?: TToastId): void {
		toast.dismiss(toastId);
	}

	/**
	 * Renders a dynamic toast notification that automatically monitors and reflects the lifecycle of an asynchronous promise.
	 * Processes the promise resolution to automatically transition the toast state from loading to success or error feedback.
	 *
	 * @param payload - The payload containing a promise or factory and the state configuration for lifecycle status messages.
	 * @returns An unique identifier of the generated toast instance for any subsequent manual update or dismissal operations.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public promise<TValue>(...payload: TToastPromisePayload<TValue>): TToastId {
		// Destructures the specified source array to extract necessary properties
		const [promise, state] = payload;

		// Generates an unique identifier if one was not contained in state object
		const toastId = state.id ?? generateObjectId();

		// Destructures the provided source object to extract necessary properties
		const { loading, success, error, finally: finalize } = state;

		// Renders the starting loading state to provide immediate visual feedback
		this.invokeToast([loading, { ...state, id: toastId }], 'loading');

		// Initializes the promise by invoking the factory function if is provided
		const toastOperation = isFunction(promise) ? promise() : promise;

		// Creates a function to resolve a message from a static or dynamic source
		const toastMessage = <TValue>(value: TValue, resolver: TToastResolver<TValue>): string =>
			isFunction(resolver) ? resolver(value) : resolver;

		// Binds handlers to promise lifecycle events for success error completion
		toastOperation
			.then((result) => {
				const message = toastMessage(result, success);
				this.invokeToast([message, { ...state, id: toastId }], 'success');
			})
			.catch((operationError) => {
				const message = toastMessage(operationError, error);
				this.invokeToast([message, { ...state, id: toastId }], 'error');
			})
			.finally(() => finalize?.());

		// Returns the unique identifier promptly for synchronous external control
		return toastId;
	}

	/**
	 * Renders a toast notification utilizing the custom Toast component with consistent styling and configuration parameters.
	 * Processes the message payload and severity to render a standardized toast instance across all the notification methods.
	 *
	 * @param payload - The message payload containing the displayed text and optional configuration properties for the toast.
	 * @param type - The toast type determining the visual variant and icon displayed for the notification component instance.
	 * @returns An unique identifier of the generated toast instance for any subsequent manual update or dismissal operations.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private invokeToast(payload: TToastMessagePayload, type: TToastType): TToastId {
		// Destructures the specified source array to extract necessary properties
		const [message, options] = payload;

		// Generates an unique identifier if one is not included in options object
		const toastId = options?.id ?? generateObjectId();

		// Returns the toast identifier after displaying custom component instance
		return toast.custom(Toast, {
			...options,
			id: toastId,
			unstyled: true,
			classes: {
				toast: 'toast-group',
				...options?.classes
			},
			componentProps: {
				type,
				message,
				id: toastId,
				state: toastState,
				action: options?.action,
				cancel: options?.cancel,
				description: options?.description,
				dismissible: options?.dismissible ?? true
			}
		});
	}
}
