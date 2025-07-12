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
    
    // Nettoyer toutes les classes de thème existantes
    document.body.classList.remove('dark-theme', 'light-theme', 'theme-dark', 'theme-light');
    
    // Appliquer le nouveau thème
    if (finalTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.add('light-theme');
    }
    
    // Mettre à jour les variables CSS pour Ionic
    this.updateIonicTheme(finalTheme as 'light' | 'dark');
  }
  
  private updateIonicTheme(theme: 'light' | 'dark') {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      // Appliquer les variables Ionic pour le mode sombre
      root.style.setProperty('--ion-background-color', '#181818');
      root.style.setProperty('--ion-text-color', '#FFD700');
      root.style.setProperty('--ion-toolbar-background', '#232323');
      root.style.setProperty('--ion-item-background', '#232323');
      root.style.setProperty('--ion-card-background', '#232323');
    } else {
      // Réinitialiser aux valeurs par défaut pour le mode clair
      root.style.removeProperty('--ion-background-color');
      root.style.removeProperty('--ion-text-color');
      root.style.removeProperty('--ion-toolbar-background');
      root.style.removeProperty('--ion-item-background');
      root.style.removeProperty('--ion-card-background');
    }
  }
}
