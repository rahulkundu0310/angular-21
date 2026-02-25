import { inject } from '@angular/core';
import { of, switchMap, timer } from 'rxjs';
import type { ResolveFn } from '@angular/router';
import { PlatformStore } from '../platform-store';
import { menuItemsConfig } from '@/src/app/configs';

export const platformResolver: ResolveFn<unknown> = (route, state) => {
	const platformStore = inject(PlatformStore);

	return timer(100).pipe(
		switchMap(() => {
			platformStore.setMenuItems(menuItemsConfig);
			return of(null);
		})
	);
};
