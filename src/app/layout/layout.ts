import { Component, OnInit, DestroyRef, HostListener, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { ThemeService, Theme } from '../services/theme.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  private readonly sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  readonly sidebarOpen$ = this.sidebarOpenSubject.asObservable();
  private readonly destroy = inject(DestroyRef);

  readonly currentTheme$: Observable<Theme>;

  constructor(readonly themeService: ThemeService) {
    this.currentTheme$ = this.themeService.currentTheme$;
    // Cleanup on destroy
    this.destroy.onDestroy(() => this.sidebarOpenSubject.complete());
  }

  /**
   * Toggle sidebar open/closed state
   */
  toggle(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  /** Close the sidebar */
  close(): void {
    this.sidebarOpenSubject.next(false);
  }

  /** Close sidebar on Escape key */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.close();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}