import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '',                redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview',        loadComponent: () => import('./pages/overview/overview').then(m => m.OverviewComponent) },
      { path: 'version-history', loadComponent: () => import('./pages/version-history/version-history').then(m => m.VersionHistoryComponent) },
      { path: 'core-concepts',   loadComponent: () => import('./pages/core-concepts/core-concepts').then(m => m.CoreConceptsComponent) },
      { path: 'movies',          loadComponent: () => import('./pages/movies/movies').then(m => m.MoviesComponent) },
    ]
  }
];