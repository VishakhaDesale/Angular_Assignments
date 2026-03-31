import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'app-theme';
  private readonly DEFAULT_THEME: Theme = 'light';

  // Signal to hold the current theme
  currentTheme = signal<Theme>(this.loadTheme());

  constructor() {
    // Whenever the theme signal changes, apply it to the DOM and save to localStorage
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
      this.saveTheme(theme);
    });
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    this.currentTheme.update(theme => (theme === 'light' ? 'dark' : 'light'));
  }

  /**
   * Set a specific theme
   */
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
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
