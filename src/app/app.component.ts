import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule, MenuController, PopoverController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { ProfileMenuComponent } from './pages/profile-menu/profile-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common'; // <-- à importer
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { MenuService } from './services/menu.service';
import { Subscription } from 'rxjs';
import { ThemeService, ThemeType } from './services/theme.service';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppHeaderComponent,
    TranslateModule
  ],
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  user: any = null;
  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private popoverController: PopoverController,
    private menuService: MenuService,
    private themeService: ThemeService,
    private translate: TranslateService
  ) {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
    // Initialisation dynamique de la langue par défaut
    const lang = localStorage.getItem('lang') || 'fr';
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }

  isDashboardOpen = false;
  theme: ThemeType = 'auto';
  private menuSub: Subscription | undefined;

  ngOnInit() {
    const savedTheme = this.getSavedTheme();
    const themeToApply = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : this.getSystemTheme();
    this.applyTheme(themeToApply);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (this.theme === 'auto') {
        this.applyTheme(this.getSystemTheme());
      }
    });
    this.router.events.subscribe(() => {
      if (this.router.url === '/login') {
        this.menuCtrl.enable(false);
      } else {
        this.menuCtrl.enable(true);
      }
    });
    this.menuSub = this.menuService.openMenu$.subscribe(() => {
      this.menuCtrl.enable(true, 'main-content');
      this.menuCtrl.open('main-content');
    });
    this.theme = this.themeService.getTheme();
    this.themeService.applyTheme(this.theme);
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
      this.themeService.applyTheme(theme);
    });
  }

  ngOnDestroy() {
    if (this.menuSub) this.menuSub.unsubscribe();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.menuCtrl.close();
  }

  async openProfileMenu(event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: ProfileMenuComponent,
      event: event,
      translucent: true,
    });
    await popover.present();
  }

  logout() {
    console.log('Déconnexion...');
    this.router.navigate(['/login']);
    this.menuCtrl.close();
  }

  toggleDashboardSubmenu() {
    this.isDashboardOpen = !this.isDashboardOpen;
  }

  setTheme(theme: ThemeType) {
    this.themeService.setTheme(theme);
  }

  setLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    window.location.reload();
  }

  getSavedTheme(): 'light' | 'dark' | 'auto' | null {
    return (localStorage.getItem('theme') as any) || null;
  }

  getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(theme: 'light' | 'dark') {
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }
}
