import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';
  private prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  private manualOverride = false;

  readonly theme = signal<'light' | 'dark'>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.theme());

    this.prefersDark.addEventListener('change', (e) => {
      if (!this.manualOverride) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.theme.set(newTheme);
        this.applyTheme(newTheme);
      }
    });
  }

  private getInitialTheme(): 'light' | 'dark' {
    const saved = localStorage.getItem(this.storageKey);
    if (saved === 'light' || saved === 'dark') {
      this.manualOverride = true;
      return saved;
    }
    return this.prefersDark.matches ? 'dark' : 'light';
  }

  toggleTheme(): void {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme, true);
  }

  setTheme(theme: 'light' | 'dark', manual = true): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    if (manual) {
      this.manualOverride = true;
      localStorage.setItem(this.storageKey, theme);
    }
  }

  applyTheme(theme: 'light' | 'dark'): void {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(`${theme}-theme`);
  }

  resetToSystemPreference(): void {
    localStorage.removeItem(this.storageKey);
    this.manualOverride = false;
    const systemTheme = this.prefersDark.matches ? 'dark' : 'light';
    this.setTheme(systemTheme, false);
  }
}
