import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, MenuController, PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { ProfileMenuComponent } from './pages/profile-menu/profile-menu.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ThemeService, ThemeType } from './services/theme.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RecempenseService } from './services/recempense.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    HttpClientModule,
    CommonModule,
    AppHeaderComponent,
    TranslateModule
  ],
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  user: any = null;
  isDashboardOpen = false;
  theme: ThemeType = 'auto';
  loginIn: boolean = false;
  private authSub?: Subscription;
  private userSub?: Subscription;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private popoverController: PopoverController,
    private themeService: ThemeService,
    private translate: TranslateService,
    private http: HttpClient,
    private servicePoints: RecempenseService,
    private serviceAuth: AuthService
  ) {
    const lang = localStorage.getItem('lang') || 'fr';
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }

  ngOnInit() {
    // Auth reactive
    this.authSub = this.serviceAuth.isLoggedIn$.subscribe(status => {
      this.loginIn = status;
    });

    this.userSub = this.serviceAuth.userConnecter$.subscribe(user => {
      this.user = user;
      if (user) {
        this.http.get<any>(`http://localhost:3000/api/getPoints/${user.id}`).subscribe({
          next: data => this.servicePoints.setPoints(data?.points || 0),
          error: err => console.error('Erreur chargement points', err)
        });
      }
    });

    // Thème système
    this.theme = this.themeService.getTheme();
    this.themeService.applyTheme(this.theme);
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
      this.themeService.applyTheme(theme);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (this.theme === 'auto') {
        this.applyTheme(this.getSystemTheme());
      }
    });

    // Gestion du menu selon route
    this.router.events.subscribe(() => {
      this.menuCtrl.enable(this.router.url !== '/login');
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }

  async navigateTo(path: string) {
    this.isDashboardOpen = false;
    try {
      await this.menuCtrl.close();
      this.router.navigate([path]);
    } catch (error) {
      console.error('Erreur lors de la fermeture du menu:', error);
      this.router.navigate([path]);
    }
  }

  toggleDashboardSubmenu() {
    this.isDashboardOpen = !this.isDashboardOpen;
    this.menuCtrl.close();
  }

  async openProfileMenu(event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: ProfileMenuComponent,
      event,
      translucent: true,
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
    if (role === 'logout') {
      this.router.navigate(['/login']);
    }
  }

  setTheme(theme: ThemeType) {
    this.themeService.setTheme(theme);
  }

  setLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    window.location.reload();
  }

  getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(theme: 'light' | 'dark') {
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }
}
