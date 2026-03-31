import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'app-theme';
  private readonly DEFAULT_THEME: Theme = 'light';

  // RxJS BehaviorSubject to hold the current theme
  private readonly themeSubject = new BehaviorSubject<Theme>(this.loadTheme());
  readonly currentTheme$ = this.themeSubject.asObservable().pipe(
    tap(theme => {
      this.applyTheme(theme);
      this.saveTheme(theme);
    })
  );

  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    const current = this.themeSubject.value;
    this.themeSubject.next(current === 'light' ? 'dark' : 'light');
  }

  /**
   * Set a specific theme
   */
  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
  }

  /**
   * Load theme from localStorage or return default
   */
  private loadTheme(): Theme {
    if (typeof window === 'undefined') {
      return this.DEFAULT_THEME;
    }

    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY) as Theme;
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : this.DEFAULT_THEME;
  }

  /**
   * Apply theme to document root
   */
  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.remove('theme--light', 'theme--dark');
    root.classList.add(`theme--${theme}`);
  }

  /**
   * Save theme to localStorage
   */
  private saveTheme(theme: Theme): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    }
  }
}
