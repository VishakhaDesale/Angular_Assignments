import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const BASE_URL = 'https://api.imdbapi.dev';

export interface MovieSummary {
  id: string;
  title: string;
  year: string;
  type: string;
  posterUrl: string;
  description: string;
}

export interface MovieDetail {
  id: string;
  title: string;
  year: string;
  type: string;
  posterUrl: string;
  description: string;
  runtime: string;
  genres: string[];
  director: string;
  actors: string[];
  rating: number;
  voteCount: number;
}

interface ImdbImage {
  url?: string;
}

interface ImdbRating {
  aggregateRating?: number;
  voteCount?: number;
}

interface ImdbName {
  displayName?: string;
}

interface ImdbTitle {
  id?: string;
  type?: string;
  isAdult?: boolean;
  primaryTitle?: string;
  primaryImage?: ImdbImage;
  startYear?: number;
  runtimeSeconds?: number;
  genres?: string[];
  rating?: ImdbRating;
  plot?: string;
  directors?: ImdbName[];
  stars?: ImdbName[];
}

interface ImdbSearchTitlesResponse {
  titles?: ImdbTitle[];
}

/**
 * MovieService — imdbapi.dev integration using HttpClient + RxJS.
 */
@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);

  /**
   * Search titles by query via GET /search/titles.
   */
  searchMovies(query: string): Observable<MovieSummary[]> {
    return this.http
      .get<ImdbSearchTitlesResponse>(`${BASE_URL}/search/titles`, {
        params: { query, limit: 24 }
      })
      .pipe(
        map(res => (res.titles ?? []).filter(title => !title.isAdult).map(title => this.toMovieSummary(title)))
      );
  }

  /**
   * Fetch full title details by IMDb ID via GET /titles/{titleId}.
   */
  getMovieDetail(titleId: string): Observable<MovieDetail | null> {
    return this.http
      .get<ImdbTitle>(`${BASE_URL}/titles/${encodeURIComponent(titleId)}`)
      .pipe(map(title => this.toMovieDetail(title)));
  }

  private toMovieSummary(title: ImdbTitle): MovieSummary {
    return {
      id: title.id ?? '',
      title: title.primaryTitle ?? 'Untitled',
      year: title.startYear ? String(title.startYear) : 'N/A',
      type: title.type ?? 'unknown',
      posterUrl: title.primaryImage?.url ?? '',
      description: title.plot ?? 'No description available.'
    };
  }

  private toMovieDetail(title: ImdbTitle): MovieDetail {
    return {
      id: title.id ?? '',
      title: title.primaryTitle ?? 'Untitled',
      year: title.startYear ? String(title.startYear) : 'N/A',
      type: title.type ?? 'unknown',
      posterUrl: title.primaryImage?.url ?? '',
      description: title.plot ?? 'No description available.',
      runtime: title.runtimeSeconds ? `${Math.round(title.runtimeSeconds / 60)} min` : 'N/A',
      genres: title.genres ?? [],
      director: (title.directors ?? []).map(d => d.displayName).filter(Boolean).join(', ') || 'N/A',
      actors: (title.stars ?? []).map(s => s.displayName).filter((name): name is string => Boolean(name)),
      rating: title.rating?.aggregateRating ?? 0,
      voteCount: title.rating?.voteCount ?? 0
    };
  }
}
