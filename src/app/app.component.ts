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
  
  // 🎯 Approche multiple pour fermer le menu
  await this.closeMenuWithMultipleMethods();
  
  // Navigation
  setTimeout(() => {
    this.router.navigate([path]);
  }, 150);
}

// 🎯 Méthode avec plusieurs approches simultanées
private async closeMenuWithMultipleMethods() {
  console.log('🎯 Fermeture menu avec méthodes multiples');
  
  // Méthode 1: Simulation de clic
  this.forceMenuCloseWithClick();
  
  // Méthode 2: Fermeture directe
  this.menuCtrl.close('main-menu');
  
  // Méthode 3: Désactiver temporairement
  setTimeout(() => {
    this.menuCtrl.enable(false, 'main-menu');
    setTimeout(() => {
      this.menuCtrl.enable(true, 'main-menu');
    }, 50);
  }, 10);
}

// 🎯 Méthode brutale pour fermer le menu avec simulation de clic
private forceMenuCloseWithClick() {
  try {
    console.log('🎯 Tentative de fermeture du menu...');
    
    // 1. Essayer de cliquer sur le backdrop
    const backdrop = document.querySelector('ion-backdrop');
    if (backdrop) {
      console.log('✅ Backdrop trouvé, simulation du clic');
      (backdrop as HTMLElement).click();
      return;
    }

    // 2. Essayer de cliquer sur l'overlay du menu
    const menuOverlay = document.querySelector('.menu-backdrop, ion-menu-backdrop');
    if (menuOverlay) {
      console.log('✅ Menu overlay trouvé, simulation du clic');
      (menuOverlay as HTMLElement).click();
      return;
    }

    // 3. Simuler un clic en dehors du menu sur le body
    console.log('🎯 Simulation clic sur body');
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: window.innerWidth - 10, // Clic à droite de l'écran
      clientY: 10
    });
    document.body.dispatchEvent(clickEvent);
    
    // 4. Force brutale : désactiver et réactiver le menu
    setTimeout(() => {
      console.log('🔧 Force brutale : disable/enable menu');
      this.menuCtrl.enable(false, 'main-menu');
      setTimeout(() => {
        this.menuCtrl.enable(true, 'main-menu');
      }, 10);
    }, 30);
    
  } catch (error) {
    console.log('❌ Erreur simulation clic, fermeture directe');
    this.menuCtrl.close('main-menu');
  }
}




  toggleDashboardSubmenu() {
    this.isDashboardOpen = !this.isDashboardOpen;
    // Ne pas fermer le menu lors du toggle du sous-menu
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
