import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
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
        this.themeService.applyTheme(this.theme);
      }
    });

    // Gestion du menu selon route + fermeture automatique
    this.router.events.subscribe((event) => {
      this.menuCtrl.enable(this.router.url !== '/login');
      
      // 🎯 Fermer le menu automatiquement lors de navigation
      if (event instanceof NavigationEnd) {
        this.forceCloseMenuOnNavigation();
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }

async navigateTo(path: string) {
  this.isDashboardOpen = false;
  
  // 🎯 SOLUTION RADICALE : Fermeture immédiate et navigation
  this.forceCloseMenuRadical();
  
  // Navigation immédiate
  this.router.navigate([path]);
}

// 🎯 SOLUTION RADICALE : Force la fermeture par manipulation directe
private forceCloseMenuRadical() {
  try {
    // 1. Fermeture directe du menu
    this.menuCtrl.close('main-menu');
    
    // 2. Manipulation directe du DOM
    const menu = document.querySelector('ion-menu[menu-id="main-menu"]') as HTMLElement;
    if (menu) {
      // Supprimer toutes les classes d'ouverture
      menu.classList.remove('show-menu', 'menu-open');
      menu.classList.add('menu-closed');
      
      // Forcer l'attribut fermé
      menu.setAttribute('aria-hidden', 'true');
      menu.style.transform = 'translateX(-100%)';
    }
    
    // 3. Supprimer tous les overlays/backdrops
    const overlays = document.querySelectorAll('ion-backdrop, .menu-backdrop, ion-menu-backdrop');
    overlays.forEach(overlay => overlay.remove());
    
    // 4. Nettoyer le body
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    
    // 5. Reset après navigation
    setTimeout(() => {
      if (menu) {
        menu.style.transform = '';
        menu.classList.remove('menu-closed');
      }
    }, 300);
    
  } catch (error) {
    // Fallback silencieux
    this.menuCtrl.close('main-menu');
  }
}

// 🎯 Force la fermeture du menu lors de navigation automatique
private forceCloseMenuOnNavigation() {
  this.isDashboardOpen = false;
  this.menuCtrl.close('main-menu');
  
  // Force la fermeture visuelle
  setTimeout(() => {
    const menu = document.querySelector('ion-menu[menu-id="main-menu"]') as HTMLElement;
    if (menu) {
      menu.classList.remove('show-menu', 'menu-open');
    }
  }, 10);
}

  toggleDashboardSubmenu() {
    this.isDashboardOpen = !this.isDashboardOpen;
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
