import type { OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, debounceTime, fromEvent, map, filter } from 'rxjs';
import { input, inject, output, Directive, DestroyRef, ElementRef } from '@angular/core';

export type TDebounceEvent = 'input' | 'keyup' | 'keydown' | 'change';

@Directive({ selector: '[debounce]' })
export class Debounce implements OnInit {
	// Dependency injections providing direct access to services and injectors
	private readonly destroyRef = inject(DestroyRef);
	private readonly elementRef = inject(ElementRef<HTMLElement>);

	// Input and output properties reflecting shared state and emitting events
	public readonly delay = input<number>(600);
	public readonly debounced = output<string>();
	public readonly suppress = input<boolean>(false);
	public readonly event = input<TDebounceEvent>('input');

	// Public and private class member variables reflecting state and behavior
	private readonly inputElement: HTMLInputElement | HTMLTextAreaElement =
		this.elementRef.nativeElement;

	/**
	 * Handles initialization cycle by organizing necessary state structures and applying foundational configuration defaults.
	 * Executes startup actions processing data retrieval and stream subscriptions or state configuration to ensure readiness.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	public ngOnInit(): void {
		this.setupDebounceListener();
	}

	/**
	 * Establishes a debounced subscription to the form control value changes to manage buffered and distinct input emissions.
	 * Processes the stream by applying skip filters and timing delays to optimize performance before emitting refined values.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private setupDebounceListener(): void {
		// Retrieves native input element directly from the event target reference
		const inputElement = this.inputElement;

		// Initializes a reactive pipeline for observing native input interactions
		fromEvent<Event>(inputElement, this.event())
			.pipe(
				debounceTime(this.delay()),
				map(() => inputElement.value),
				filter(() => !this.suppress()),
				distinctUntilChanged<string>(),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe({
				next: (value) => {
					// Emits the untrimmed value during typing to preserve user entered spaces
					this.debounced.emit(value);
				}
			});
	}
}
