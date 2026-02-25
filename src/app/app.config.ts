import { appRoutes } from './app.routes';
import { provideNgxMask } from 'ngx-mask';
import { ViewTransitionStore } from '@store';
import { Initializer } from '@core/services';
import { providePrimeNG } from 'primeng/config';
import type { ApplicationConfig } from '@angular/core';
import { PreloadModuleStrategy } from '@core/strategies';
import { primeNgConfig, signalFormsConfig } from '@configs';
import { provideSignalFormsConfig } from '@angular/forms/signals';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
	provideRouter,
	withPreloading,
	withRouterConfig,
	withViewTransitions,
	withInMemoryScrolling,
	withComponentInputBinding,
	withExperimentalAutoCleanupInjectors
} from '@angular/router';
import {
	provideLucideIcons,
	provideExceptionHandler,
	provideCachedRouteStrategy,
	provideConfirmationService,
	provideDocumentTitleStrategy
} from '@core/providers';
import {
	requestHeaderInterceptor,
	requestExceptionInterceptor,
	responseTransformInterceptor
} from '@core/interceptors';

/**
 * Composes bootstrap context parameters by aggregating essential providers and strategies for establishing the ecosystem.
 * Processes initialization settings using routing behaviors and interceptors to maintain stable and functional lifecycle.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const appConfig: ApplicationConfig = {
	providers: [
		provideNgxMask(),
		provideLucideIcons(),
		provideExceptionHandler(),
		provideCachedRouteStrategy(),
		provideConfirmationService(),
		providePrimeNG(primeNgConfig),
		provideDocumentTitleStrategy(),
		provideBrowserGlobalErrorListeners(),
		provideSignalFormsConfig(signalFormsConfig),
		provideAppInitializer(() => inject(Initializer).initialize),
		provideHttpClient(
			withInterceptors([
				requestHeaderInterceptor,
				requestExceptionInterceptor,
				responseTransformInterceptor
			])
		),
		provideRouter(
			appRoutes,
			withComponentInputBinding(),
			withPreloading(PreloadModuleStrategy),
			withExperimentalAutoCleanupInjectors(),
			withInMemoryScrolling({
				anchorScrolling: 'enabled',
				scrollPositionRestoration: 'top'
			}),
			withRouterConfig({
				urlUpdateStrategy: 'eager',
				paramsInheritanceStrategy: 'always',
				resolveNavigationPromiseOnError: true,
				canceledNavigationResolution: 'computed'
			}),
			withViewTransitions({
				skipInitialTransition: true,
				onViewTransitionCreated: (viewTransition) => {
					const viewTransitionStore = inject(ViewTransitionStore);
					viewTransitionStore.handleTransition(viewTransition);
				}
			})
		)
	]
};
