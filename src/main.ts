import { App } from './app/app';
import { appConfig } from './app/app.config';
import { environment } from '@env/environment';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

/**
 * Enables production execution by configuring framework optimizations when the target deployment environment is detected.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
if (environment.production) enableProdMode();

/**
 * Bootstraps the frontend by initializing primary component using configurations and catching startup errors for logging.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
bootstrapApplication(App, appConfig).catch((error) => console.error(error));
