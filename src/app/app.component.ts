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
    // 🎯 Essayer plusieurs méthodes pour fermer le menu
    await this.forceCloseMenu();
    
    // Attendre un peu que le menu se ferme
    setTimeout(() => {
      this.router.navigate([path]);
    }, 200);
  } catch (error) {
    console.error('Erreur lors de la navigation:', error);
    this.router.navigate([path]);
  }
}

// 🎯 Méthode principale pour forcer la fermeture du menu
private async forceCloseMenu() {
  // Méthode 1: Simulation de clic à l'extérieur
  this.simulateOutsideClick();
  
  // Méthode 2: Manipulation directe du DOM
  setTimeout(() => {
    this.manipulateMenuDOM();
  }, 50);
  
  // Méthode 3: Fermeture classique en backup
  setTimeout(() => {
    this.menuCtrl.close('main-menu');
  }, 100);
}

// 🎯 Manipulation directe du DOM du menu
private manipulateMenuDOM() {
  try {
    const menuElement = document.querySelector('ion-menu[menu-id="main-menu"]');
    if (menuElement) {
      // Forcer la classe de fermeture
      menuElement.classList.remove('show-menu');
      menuElement.classList.add('menu-hidden');
      
      // Déclencher l'événement de fermeture
      const closeEvent = new CustomEvent('ionMenuDidClose', {
        detail: { menuId: 'main-menu' }
      });
      menuElement.dispatchEvent(closeEvent);
    }
    
    // Supprimer l'overlay/backdrop s'il existe
    const backdrop = document.querySelector('.menu-backdrop, ion-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  } catch (error) {
    console.log('Manipulation DOM échouée');
  }
}

// 🎯 Méthode pour simuler un clic à l'extérieur du menu
private simulateOutsideClick() {
  try {
    // Méthode 1: Simuler un clic sur le backdrop du menu
    const backdrop = document.querySelector('ion-backdrop');
    if (backdrop) {
      (backdrop as HTMLElement).click();
      return;
    }

    // Méthode 2: Simuler un clic sur le contenu principal
    const mainContent = document.querySelector('#main-content');
    if (mainContent) {
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      mainContent.dispatchEvent(clickEvent);
      return;
    }

    // Méthode 3: Simuler un tap/touch sur l'overlay
    const overlay = document.querySelector('ion-menu ion-backdrop, .menu-backdrop');
    if (overlay) {
      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true
      });
      overlay.dispatchEvent(touchEvent);
      return;
    }

    // Méthode 4: Forcer la fermeture via MenuController
    this.menuCtrl.close('main-menu');
  } catch (error) {
    console.log('Simulation de clic échouée, fermeture classique');
    this.menuCtrl.close('main-menu');
  }
}

// 🎯 Méthode alternative : forcer la fermeture avec événement personnalisé
private forceMenuClose() {
  try {
    // Émettre un événement personnalisé pour fermer le menu
    const closeEvent = new CustomEvent('menuClose', {
      detail: { menuId: 'main-menu' },
      bubbles: true
    });
    document.dispatchEvent(closeEvent);
    
    // Backup: fermeture classique
    setTimeout(() => {
      this.menuCtrl.close('main-menu');
    }, 50);
  } catch (error) {
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
