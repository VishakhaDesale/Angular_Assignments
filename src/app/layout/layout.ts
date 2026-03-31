import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { ThemeService, Theme } from '../services/theme.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class LayoutComponent {
  private readonly sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  readonly sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  readonly currentTheme$: Observable<Theme>;

  constructor(readonly themeService: ThemeService) {
    this.currentTheme$ = this.themeService.currentTheme$;
  }

  toggle(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  close(): void {
    this.sidebarOpenSubject.next(false);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}