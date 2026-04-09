import { Component, HostListener, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  readonly sidebarOpen = signal<boolean>(false);
  readonly currentTheme;

  constructor(readonly themeService: ThemeService) {
    this.currentTheme = this.themeService.currentTheme;
  }

  /**
   * Toggle sidebar open/closed state
   */
  toggle(): void {
    this.sidebarOpen.update(value => !value);
  }

  /** Close the sidebar */
  close(): void {
    this.sidebarOpen.set(false);
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