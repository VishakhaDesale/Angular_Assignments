import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';

/**
 * Custom preloading strategy that waits 5 seconds after the app loads,
 * then silently preloads ALL lazy-loaded routes in the background.
 *
 * Angular calls preload() once per lazy route when withPreloading() is configured.
 * timer(5000) fires after 5 seconds → switchMap triggers the actual chunk download.
 */
@Injectable({ providedIn: 'root' })
export class DelayedPreloadStrategy implements PreloadingStrategy {
  private readonly preloadTrigger$ = timer(5000).pipe(
    shareReplay({ bufferSize: 1, refCount: false })
  );

  preload(_route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return this.preloadTrigger$.pipe(switchMap(() => load()));
  }
}
