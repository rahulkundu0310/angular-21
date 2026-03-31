import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';

@Directive({ selector: '[imageFallback]' })
export class ImageFallback {
	// Dependency injections providing direct access to services and injectors
	private readonly elementRef = inject(ElementRef<HTMLImageElement>);

	// Input and output properties reflecting shared state and emitting events
	public readonly sourceLoaded = output<void>();
	public readonly fallbackUsed = output<void>();
	public readonly fallback = input.required<string>();

	// Public and private class member variables reflecting state and behavior
	private fallbackApplied: boolean = false;
	private readonly imageInstance: HTMLImageElement = this.elementRef.nativeElement;

	/**
	 * Intercepts load on the native element to broadcast a successful state resolving the supplied source asset consistently.
	 * Processes rendering lifecycle emitting the completion event to notify external structures about the expected execution.
	 *
	 * @param event - The load event object containing element context confirming the provided media asset completed mounting.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostListener('load', ['$event'])
	protected processImageLoad(event: Event): void {
		this.sourceLoaded.emit();
	}

	/**
	 * Intercepts error on the native element to substitute failing source asset with the provided alternative string address.
	 * Processes corrupted image by bypassing infinite loops while assigning fallback references and emitting execution event.
	 *
	 * @param event - The error event object containing control context when addressing the provided media asset presentation.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	@HostListener('error', ['$event'])
	protected processImageError(event: Event): void {
		// Checks if the fallback image has already been applied and returns early
		if (this.fallbackApplied) return;

		// Updates the internal guard to prevent the fallback from being reapplied
		this.fallbackApplied = true;

		// Assigns the fallback source to the image element replacing failed asset
		this.imageInstance.src = this.fallback();

		// Broadcasts the fallback output event to notify all registered consumers
		this.fallbackUsed.emit();
	}
}
