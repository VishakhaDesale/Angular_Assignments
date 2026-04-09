import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import { startWith } from 'rxjs';
import { SearchService } from '../../services/search.service';
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
  private readonly searchService = inject(SearchService);

  readonly colDefs: ColDef<AngularVersion>[] = [
    { field: 'version',         headerName: 'Version',          flex: 1, minWidth: 150 },
    { field: 'year',            headerName: 'Year',             flex: 0, minWidth: 80,  maxWidth: 90 },
    { field: 'feature',         headerName: 'Key Feature',      flex: 2, minWidth: 200 },
    { field: 'rendering',       headerName: 'Rendering',        flex: 1, minWidth: 130 },
    { field: 'moduleSystem',    headerName: 'Module System',    flex: 1, minWidth: 150 },
    { field: 'changeDetection', headerName: 'Change Detection', flex: 1, minWidth: 160 },
    { field: 'status',          headerName: 'Status',           flex: 0, minWidth: 90,  maxWidth: 110 }
  ];

  readonly rowData: AngularVersion[] = versionsData;
  readonly searchTerm = toSignal(
    this.searchService.searchTerm$.pipe(startWith('')),
    { initialValue: '' }
  );

  /**
   * Handle filter input and push to search stream
   */
  onFilterInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    this.searchService.updateSearchTerm(target.value);
  }
}