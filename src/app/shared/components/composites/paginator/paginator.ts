import { range } from 'lodash-es';
import { FormsModule } from '@angular/forms';
import type { EffectRef } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import type { Nullable } from 'primeng/ts-helpers';
import { LucideAngularModule } from 'lucide-angular';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HostModifier, PreventAutofill } from '@shared/directives';
import type {
	TPaginatorSlot,
	IPaginationState,
	IPaginatorReport,
	TPaginatorEllipsis
} from './paginator.types';
import {
	input,
	output,
	effect,
	signal,
	computed,
	Component,
	untracked,
	ChangeDetectionStrategy
} from '@angular/core';

@Component({
	selector: 'paginator',
	styleUrl: './paginator.scss',
	templateUrl: './paginator.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: HostModifier, inputs: ['behavior'] }],
	imports: [
		FormsModule,
		TooltipModule,
		PreventAutofill,
		InputNumberModule,
		LucideAngularModule,
		ProgressSpinnerModule
	]
})
export class Paginator {
	// Input and output properties reflecting shared state and emitting events
	public readonly pageNumber = input<number>(1);
	public readonly loading = input<boolean>(false);
	public readonly itemsPerPage = input<number>(10);
	public readonly showReport = input<boolean>(false);
	public readonly alwaysVisible = input<boolean>(false);
	public readonly paginated = output<IPaginationState>();
	public readonly jumpToPageInput = input<boolean>(true);
	public readonly totalRecords = input.required<number>();
	public readonly boundaryControls = input<boolean>(true);
	public readonly directionControls = input<boolean>(true);
	public readonly visibleSlots = input<number, number>(7, {
		transform: (value: number) => Math.max(5, value)
	});

	// Public and private class member variables reflecting state and behavior
	protected readonly requestedPage = signal<number | null>(null);
	protected readonly ellipsis = signal<TPaginatorEllipsis>('ellipsis');

	/**
	 * Computes pagination visibility status by evaluating permanent viewport preference alongside calculated page boundaries.
	 * Returns a boolean value indicating whether the pagination element justifies presentation avoiding unwanted empty state.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly renderVisible = computed<boolean>(() => {
		// Retrieves total page boundary from reactive signal for state resolution
		const totalPages = this.totalPages();

		// Retrieves always visible setting from input signal for state resolution
		const alwaysVisible = this.alwaysVisible();

		// Returns a resolved visibility checking override against page boundaries
		return alwaysVisible || totalPages > 1;
	});

	/**
	 * Computes sequential available segments dividing the provided records count by the configured maximum capacity per page.
	 * Returns a derived numeric value representing the exact pagination length ensuring minimum positive baseline boundaries.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly totalPages = computed<number>(() => {
		// Retrieves total records boundary from input signal for state resolution
		const totalRecords = this.totalRecords();

		// Retrieves maximum items per page from input signal for state resolution
		const itemsPerPage = this.itemsPerPage();

		// Retrieves unbounded page count dividing total records by maximum limits
		const unboundedPages = Math.ceil(totalRecords / itemsPerPage);

		// Returns a calculated total page count enforcing minimum positive limits
		return itemsPerPage <= 0 ? 1 : Math.max(1, unboundedPages);
	});

	/**
	 * Computes starting entry index multiplying the provided page offset property against the configured capacity limitation.
	 * Returns a constrained numeric value representing the absolute sequence position ensuring strictly enforced lower bound.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly firstIndex = computed<number>(() => {
		// Retrieves current page reference from input signal for state resolution
		const pageNumber = this.pageNumber();

		// Retrieves maximum items per page from input signal for state resolution
		const itemsPerPage = this.itemsPerPage();

		// Retrieves unbounded initial index multiplying page offset by item limit
		const unboundedIndex = (pageNumber - 1) * itemsPerPage;

		// Returns a constrained first index ensuring strictly enforced boundaries
		return Math.max(0, unboundedIndex);
	});

	/**
	 * Computes trailing entry index combining the provided starting offset property alongside the configured page limitation.
	 * Returns a constrained numeric value representing the absolute sequence position ensuring strictly enforced upper bound.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly lastIndex = computed<number>(() => {
		// Retrieves initial entry index from reactive signal for state resolution
		const firstIndex = this.firstIndex();

		// Retrieves maximum items per page from input signal for state resolution
		const itemsPerPage = this.itemsPerPage();

		// Retrieves total records boundary from input signal for state resolution
		const totalRecords = this.totalRecords();

		// Retrieves unbounded closing index adding page capacity to initial entry
		const unboundedIndex = firstIndex + itemsPerPage;

		// Returns a constrained closing index ensuring strictly enforced boundary
		return Math.min(unboundedIndex, totalRecords);
	});

	/**
	 * Computes detailed pagination report aggregating current indices alongside evaluated boundaries and total dataset count.
	 * Returns a structured overview containing consolidated sequence attributes necessary for driving positional assessments.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly pageReport = computed<IPaginatorReport>(() => {
		// Retrieves closing entry index from reactive signal for state resolution
		const lastIndex = this.lastIndex();

		// Retrieves initial entry index from reactive signal for state resolution
		const firstIndex = this.firstIndex();

		// Retrieves current page reference from input signal for state resolution
		const pageNumber = this.pageNumber();

		// Retrieves total page boundary from reactive signal for state resolution
		const totalPages = this.totalPages();

		// Retrieves total records boundary from input signal for state resolution
		const totalRecords = this.totalRecords();

		// Determines whether total record count equals zero resolving empty state
		const empty = totalRecords === 0;

		// Determines initial record position evaluating resolved empty conditions
		const firstRecord = empty ? 0 : firstIndex + 1;

		// Returns a composed object containing consolidated pagination attributes
		return {
			empty,
			pageNumber,
			totalPages,
			firstRecord,
			totalRecords,
			lastRecord: lastIndex
		};
	});

	/**
	 * Computes adaptive pagination sequence evaluating calculated boundary thresholds alongside configured viewport segments.
	 * Returns a structured array merging positional numeric indicators with ellipsis markers indicating omitted page numbers.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected readonly pageSlots = computed<TPaginatorSlot[]>(() => {
		// Retrieves ellipsis keyword value from bound signal for state resolution
		const ellipsis = this.ellipsis();

		// Retrieves current page reference from input signal for state resolution
		const pageNumber = this.pageNumber();

		// Retrieves total page boundary from reactive signal for state resolution
		const totalPages = this.totalPages();

		// Retrieves visible slots boundary from input signal for state resolution
		const visibleSlots = this.visibleSlots();

		// Checks if total page amount remains within allowed visible slots limits
		if (totalPages <= visibleSlots) {
			// Returns a sequential numeric array holding all pages without truncation
			return range(1, totalPages + 1);
		}

		// Initializes variable defining initial page number starting the sequence
		const firstPage: TPaginatorSlot = 1;

		// Retrieves resolved threshold determining sequence structural boundaries
		const threshold = Math.ceil(visibleSlots / 2);

		// Determines initial boundary condition verifying current index threshold
		const startBoundary = pageNumber <= threshold;

		// Determines final boundary condition verifying reverse numeric threshold
		const endBoundary = pageNumber > totalPages - threshold;

		// Checks if starting boundary evaluates true generating opening sequences
		if (startBoundary) {
			// Retrieves leading boundary size deducting trailing ellipsis slot counts
			const boundarySize = visibleSlots - 2;

			// Retrieves structured numeric array holding initial pagination sequences
			const leadingSequence = range(1, boundarySize + 1);

			// Returns a structured pagination array injecting trailing ellipsis items
			return [...leadingSequence, ellipsis, totalPages];
		}

		// Checks if trailing boundary evaluates true generating closing sequences
		if (endBoundary) {
			// Retrieves trailing boundary size deducting reserved ellipsis placements
			const boundarySize = visibleSlots - 2;

			// Retrieves starting numerical offset resolving targeted array boundaries
			const startOffset = totalPages - boundarySize + 1;

			// Retrieves structured numeric array covering ending pagination sequences
			const trailingSequence = range(startOffset, totalPages + 1);

			// Returns a structured pagination array inserting starting ellipsis marks
			return [firstPage, ellipsis, ...trailingSequence];
		}

		// Retrieves evaluated available slots deducting boundaries and indicators
		const availableSlots = visibleSlots - 4;

		// Retrieves calculated offset distance resolving balanced pagination size
		const offset = Math.floor(availableSlots / 2);

		// Retrieves starting position index resolving middle pagination sequences
		const startSequence = pageNumber - offset;

		// Retrieves trailing position index resolving middle pagination sequences
		const endSequence = pageNumber + offset + 1;

		// Retrieves sequential numeric array covering middle pagination sequences
		const innerSequence = range(startSequence, endSequence);

		// Returns a structured pagination array injecting multiple ellipsis items
		return [firstPage, ellipsis, ...innerSequence, ellipsis, totalPages];
	});

	/**
	 * Manages requested page number adjustments evaluating calculated numeric boundaries alongside active loading indicators.
	 * Processes validated index calculations updating resolved sequence metrics and emitting the configured pagination event.
	 *
	 * @param page - The specific numeric value providing expected structural thresholds resolving precise offset positioning.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected changePage(page: number): void {
		// Retrieves current loading status from input signal for state resolution
		const loading = this.loading();

		// Retrieves current page reference from input signal for state resolution
		const pageNumber = this.pageNumber();

		// Retrieves total page boundary from reactive signal for state resolution
		const totalPages = this.totalPages();

		// Retrieves total records boundary from input signal for state resolution
		const totalRecords = this.totalRecords();

		// Retrieves maximum items per page from input signal for state resolution
		const itemsPerPage = this.itemsPerPage();

		// Determines if requested target page exceeds calculated total boundaries
		const invalidRange = page < 1 || page > totalPages;

		// Checks if execution should terminate evaluating invalid state condition
		if (invalidRange || page === pageNumber || loading) return;

		// Updates requested page tracker assigning validated pagination positions
		this.requestedPage.set(page);

		// Retrieves calculated target index multiplying page offset by item limit
		const targetIndex = (page - 1) * itemsPerPage;

		// Emits a configured pagination event containing updated state attributes
		this.paginated.emit({
			totalPages,
			itemsPerPage,
			totalRecords,
			pageNumber: page,
			pageIndex: page - 1,
			firstIndex: targetIndex
		});
	}

	/**
	 * Manages keyboard interactions evaluating specific keystrokes to execute intended state mutations across page sequences.
	 * Processes captured keyboard events verifying specific user inputs against mapped triggers performing expected behavior.
	 *
	 * @param event - The emitted keyboard event object providing expected key presses required to evaluate positional shifts.
	 * @param page - The nullable page number extracted from connected input field establishing requested pagination position.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	protected jumpToPage(event: KeyboardEvent, page: Nullable<number>): void {
		// Retrieves evaluated target page resolving the provided pagination value
		const targetPage = Number(page);

		// Retrieves current page selection from input signal for state resolution
		const pageNumber = this.pageNumber();

		// Checks if missing target equals active position before it returns early
		if (!targetPage || targetPage === pageNumber) return;

		// Evaluates keyboard event strings determining targeted pagination action
		switch (event.code) {
			// Permits handled keyboard interaction executing pagination state updates
			case 'Enter':
			case 'ArrowUp':
			case 'ArrowDown':
			case 'NumpadEnter':
				this.changePage(targetPage);
				break;

			// No executions are performed evaluating unsupported keyboard event types
			default:
				break;
		}
	}

	/**
	 * Watches the reactive loading status to track asynchronous operations and clear requested target trackers at completion.
	 * Processes the evaluated conditions by reviewing expected state indicators and clearing temporary pagination references.
	 *
	 * @since 01 December 2025
	 * @author Rahul Kundu
	 */
	private readonly watchRequestResolution: EffectRef = effect(() => {
		// Retrieves current loading status from input signal for state resolution
		const loading = this.loading();

		// Retrieves current page selection from input signal for state resolution
		const pageNumber = this.pageNumber();

		// Executes inner callback without tracking any reactive signal dependency
		untracked<void>(() => {
			// Checks if loading finishes and updates the requested page value to null
			if (!loading) this.requestedPage.set(null);
		});
	});
}
