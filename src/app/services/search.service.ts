import { Injectable } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly searchSubject = new Subject<string>();

  readonly searchTerm$ = this.searchSubject.pipe(
    map(term => term.trim().toLowerCase()),
    debounceTime(300),
    distinctUntilChanged()
  );

  updateSearchTerm(term: string): void {
    this.searchSubject.next(term);
  }
}