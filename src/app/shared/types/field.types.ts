import type { FieldTree } from '@angular/forms/signals';

export type TFieldSize = 'small' | 'medium' | 'large';

export type TFieldTree<TValue = unknown, TNullable extends boolean = false> = TNullable extends true
	? FieldTree<TValue> | null | undefined
	: FieldTree<TValue>;
