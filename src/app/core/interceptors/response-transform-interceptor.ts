import { map } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import type { HttpEvent, HttpInterceptorFn } from '@angular/common/http';

/**
 * Intercepts incoming responses to standardize the payload structure ensuring uniform output for the client interactions.
 * Processes the event to clone the instance preserving internal state to allow further operations in validation contexts.
 *
 * @param request - The outgoing object containing headers and payload information required for executing the transaction.
 * @param next - The delegate handler responsible for passing control to subsequent logic defined within a pipeline chain.
 * @returns An observable stream containing the processed network events for unified tracking by the subscribed observers.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const responseTransformInterceptor: HttpInterceptorFn = (request, next) => {
	return next(request).pipe(
		map((event: HttpEvent<unknown>) => {
			// Checks if the event is a correct http response instance before altering
			if (!(event instanceof HttpResponse)) return event;
			return event.clone<unknown>({ body: event.body });
		})
	);
};
