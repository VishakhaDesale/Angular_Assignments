import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, startWith, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { MovieService, MovieSummary, MovieDetail } from '../../services/movie.service';
import { AppStateService } from '../../services/app-state.service';

/**
 * MoviesComponent — movie search page powered by imdbapi.dev.
 *
 * Architecture:
 *  - FormControl + RxJS pipeline (debounce → switchMap) handles search input.
 *  - toSignal() bridges the Observable → Signal so the OnPush template reacts
 *    without an async pipe.
 *  - AppStateService holds loading/error Signals shared across the app.
 *  - selectedDetail is a component-local Signal (not global state).
 */
@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movies.html',
  styleUrl: './movies.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent {
  private readonly movieService = inject(MovieService);
  private readonly appState     = inject(AppStateService);

  // ── Search input ──────────────────────────────────────────────────────────
  readonly searchCtrl = new FormControl('', { nonNullable: true });

  // ── Signal refs from AppStateService (synchronous UI flags) ──────────────
  readonly isLoading = this.appState.isLoading;
  readonly errorMsg  = this.appState.errorMsg;

  // ── Selected movie state (Signal + RxJS interop) ─────────────────────────
  readonly selectedMovieId = signal<string | null>(null);
  readonly isDetailLoading  = signal<boolean>(false);

  /**
   * Search pipeline:
   *  valueChanges → debounce 400ms → distinctUntilChanged
   *    → tap (set loading) → switchMap (cancel stale HTTP call, search API)
   *  Bridged to Signal via toSignal() — no async pipe needed in template.
   */
  readonly movies = toSignal(
    this.searchCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => {
        this.appState.setLoading(true);
        this.appState.clearError();
        this.selectedMovieId.set(null);
      }),
      switchMap(query => {
        const normalizedQuery = query.trim();
        if (!normalizedQuery) {
          this.appState.setLoading(false);
          return of([] as MovieSummary[]);
        }
        return this.movieService.searchMovies(normalizedQuery).pipe(
          tap(() => this.appState.setLoading(false)),
          catchError(() => {
            this.appState.setLoading(false);
            this.appState.setError('Failed to fetch movies. Please try again.');
            return of([] as MovieSummary[]);
          })
        );
      })
    ),
    { initialValue: [] as MovieSummary[] }
  );

  readonly selectedDetail = toSignal(
    toObservable(this.selectedMovieId).pipe(
      switchMap(movieId => {
        if (!movieId) {
          this.isDetailLoading.set(false);
          return of(null as MovieDetail | null);
        }

        this.isDetailLoading.set(true);
        return this.movieService.getMovieDetail(movieId).pipe(
          tap(() => this.isDetailLoading.set(false)),
          catchError(() => {
            this.isDetailLoading.set(false);
            this.appState.setError('Failed to load movie details.');
            return of(null as MovieDetail | null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  // ── Derived state (computed) ──────────────────────────────────────────────
  readonly hasResults    = computed(() => (this.movies() ?? []).length > 0);
  readonly hasSearchTerm = computed(() => this.searchCtrl.value.trim().length > 0);

  /**
   * On card click — fetch full movie details by IMDb ID.
   * Uses RxJS (not Signal) since it's an async HTTP call.
   */
  openDetail(movie: MovieSummary): void {
    if (this.selectedMovieId() === movie.id) {
      // Toggle off if same card clicked again
      this.selectedMovieId.set(null);
      return;
    }

    this.selectedMovieId.set(movie.id);
  }

  closeDetail(): void {
    this.selectedMovieId.set(null);
  }

  hasPoster(url: string | null | undefined): boolean {
    return !!url;
  }
}
