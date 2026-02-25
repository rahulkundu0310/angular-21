import type { FieldTree } from '@angular/forms/signals';

export type TFieldSize = 'small' | 'medium' | 'large';

export type TField<T = unknown> = FieldTree<T> | null | undefined;
