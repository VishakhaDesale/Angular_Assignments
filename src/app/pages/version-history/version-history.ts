import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import versionsData from './angular-versions.json';

ModuleRegistry.registerModules([AllCommunityModule]);

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
  imports: [AgGridAngular],
  templateUrl: './version-history.html',
  styleUrl: './version-history.scss'
})
export class VersionHistoryComponent {
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
  readonly filteredRowData = signal<AngularVersion[]>(this.rowData);

  constructor() {
    this.search$
      .pipe(
        map(value => value.trim().toLowerCase()),
        debounceTime(350),
        distinctUntilChanged(),
        map(term => this.filterRows(term)),
        takeUntilDestroyed()
      )
      .subscribe(rows => this.filteredRowData.set(rows));
  }

  onFilterInput(event: Event) {
    this.search$.next((event.target as HTMLInputElement).value);
  }

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