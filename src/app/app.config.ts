import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { DelayedPreloadStrategy } from './strategies/custom-preload.strategy';

/**
 * Global application configuration.
 * - provideHttpClient(withFetch()): enables HttpClient using the native Fetch API
 * - withPreloading(DelayedPreloadStrategy): preloads all lazy chunks after 5 seconds
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(DelayedPreloadStrategy)),
    provideHttpClient(withFetch()),
  ]
};
