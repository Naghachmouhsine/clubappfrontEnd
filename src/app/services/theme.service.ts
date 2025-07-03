import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeType = 'light' | 'dark' | 'auto';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeType>(this.getInitialTheme());
  theme$ = this.themeSubject.asObservable();

  setTheme(theme: ThemeType) {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  getTheme(): ThemeType {
    return this.themeSubject.value;
  }

  private getInitialTheme(): ThemeType {
    const saved = localStorage.getItem('theme') as ThemeType | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(theme: ThemeType) {
    let finalTheme = theme;
    if (theme === 'auto') {
      finalTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.body.classList.toggle('dark-theme', finalTheme === 'dark');
    document.body.classList.toggle('light-theme', finalTheme === 'light');
  }
}
