import { Component, DestroyRef, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import { Subject, debounceTime, distinctUntilChanged, map, BehaviorSubject, Observable } from 'rxjs';
import versionsData from './angular-versions.json';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface AngularVersion {
  version: string;
  year: number;
  feature: string;
  rendering: string;
  moduleSystem: string;
  changeDetection: string;
  status: string;
}

@Component({
  selector: 'app-version-history',
  imports: [CommonModule, AgGridAngular],
  templateUrl: './version-history.html',
  styleUrl: './version-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionHistoryComponent {
  /** Search input stream */
  private readonly search$ = new Subject<string>();

  readonly colDefs: ColDef<AngularVersion>[] = [
    { field: 'version',         headerName: 'Version',          flex: 1, minWidth: 150 },
    { field: 'year',            headerName: 'Year',             flex: 0, minWidth: 80,  maxWidth: 90 },
    { field: 'feature',         headerName: 'Key Feature',      flex: 2, minWidth: 200 },
    { field: 'rendering',       headerName: 'Rendering',        flex: 1, minWidth: 130 },
    { field: 'moduleSystem',    headerName: 'Module System',    flex: 1, minWidth: 150 },
    { field: 'changeDetection', headerName: 'Change Detection', flex: 1, minWidth: 160 },
    { field: 'status',          headerName: 'Status',           flex: 0, minWidth: 90,  maxWidth: 110 }
  ];

  private readonly rowData: AngularVersion[] = versionsData;
  private readonly filteredRowDataSubject = new BehaviorSubject<AngularVersion[]>(this.rowData);
  readonly filteredRowData$ = this.filteredRowDataSubject.asObservable();
  private readonly destroy = inject(DestroyRef);

  constructor() {
    this.search$
      .pipe(
        map(value => value.trim().toLowerCase()),
        debounceTime(350),
        distinctUntilChanged(),
        map(term => this.filterRows(term)),
        takeUntilDestroyed()
      )
      .subscribe({
        next: (rows) => this.filteredRowDataSubject.next(rows),
        error: (err) => console.error('Filter error:', err)
      });
    // Cleanup on destroy
    this.destroy.onDestroy(() => this.filteredRowDataSubject.complete());
  }

  /**
   * Handle filter input and push to search stream
   */
  onFilterInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    this.search$.next(target.value);
  }

  /**
   * Filter rows based on search term across all fields
   */
  private filterRows(term: string): AngularVersion[] {
    if (!term) {
      return this.rowData;
    }

    return this.rowData.filter(row =>
      [
        row.version,
        String(row.year),
        row.feature,
        row.rendering,
        row.moduleSystem,
        row.changeDetection,
        row.status
      ].some(value => value.toLowerCase().includes(term))
    );
  }
}