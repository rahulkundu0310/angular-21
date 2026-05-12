export interface IPaginationState {
	pageIndex: number;
	firstIndex: number;
	pageNumber: number;
	totalPages: number;
	itemsPerPage: number;
	totalRecords: number;
}

export interface IPaginatorReport {
	empty: boolean;
	lastRecord: number;
	pageNumber: number;
	totalPages: number;
	firstRecord: number;
	totalRecords: number;
}

export type TPaginatorEllipsis = 'ellipsis';

export type TPaginatorSlot = number | TPaginatorEllipsis;
