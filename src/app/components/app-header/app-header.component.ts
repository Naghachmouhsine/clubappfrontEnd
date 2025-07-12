import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ThemeService, ThemeType } from '../../services/theme.service';
import { LangService, LangType } from '../../services/lang.service';
import { RecempenseService } from '../../services/recempense.service';
import { AuthService } from '../../services/auth.service';
import { ProfileMenuComponent } from '../../pages/profile-menu/profile-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    ProfileMenuComponent, // Utilisé dynamiquement dans popoverController.create()
  ],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  @Input() nomPage = 'Home';
  @Input() menuId = 'main-content';
  @Input() showServicesText = true;
  @Input() showProfilePicture = false;
  @Input() showProfileText = true;
  @Input() showLogoutText = true;
  @Input() profilePictureUrl = '';

  totalPoints: number = 0;
  theme: ThemeType = 'light';
  themeIcon = 'sunny-outline';
  lang: LangType = 'fr';

  isLoggedIn = false;
  user: any = null;

  constructor(
    private route: Router,
    private themeService: ThemeService,
    private langService: LangService,
    private popoverController: PopoverController,
    private servicePoints: RecempenseService,
    private serviceAuth: AuthService,
    private menuCtrl: MenuController
  ) {}

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
    this.lang = this.langService.getLang();
    this.updateThemeIcon();

    
    this.serviceAuth.isLoggedIn$.subscribe(isLogin => {
      this.isLoggedIn = isLogin;

      if (isLogin) {
        this.servicePoints.points$.subscribe(points => {
          this.totalPoints = points;
        });
      }
    });

    this.serviceAuth.userConnecter$.subscribe(user => {
      this.user = user;
    });
  }

  cycleTheme() {
    this.theme =
      this.theme === 'light' ? 'dark' :
      this.theme === 'dark' ? 'auto' :
      'light';

    this.themeService.setTheme(this.theme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    this.themeIcon =
      this.theme === 'light' ? 'sunny-outline' :
      this.theme === 'dark' ? 'moon-outline' :
      'contrast-outline';
  }

async openProfileMenu(event: MouseEvent) {
  const popover = await this.popoverController.create({
    component: ProfileMenuComponent,
    event: event,
    translucent: true,
  });

  await popover.present();

  const { data, role } = await popover.onDidDismiss();

  
  console.log('Popover fermé avec rôle :', role);

  if (role === 'logout') {
    this.serviceAuth.checkAuthStatus(); 
    this.route.navigate(['/login']);  // ou n'importe quelle action
  }
}


  async navigateTo(path: string) {
    // 🎯 Simuler un clic à l'extérieur pour fermer le menu
    this.simulateOutsideClick();
    
    // Attendre que le menu se ferme puis naviguer
    setTimeout(() => {
      this.route.navigate([path]);
    }, 150);
  }

  // 🎯 Simulation de clic à l'extérieur du menu
  private simulateOutsideClick() {
    try {
      // Chercher le backdrop du menu
      const backdrop = document.querySelector('ion-backdrop, .menu-backdrop');
      if (backdrop) {
        (backdrop as HTMLElement).click();
        return;
      }

      // Simuler un clic sur le contenu principal
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

      // Fallback: fermeture classique
      this.menuCtrl.close('main-menu');
    } catch (error) {
      console.log('Simulation échouée, fermeture classique');
      this.menuCtrl.close('main-menu');
    }
  }

  scrollToServices() {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  setLang(lang: LangType) {
    this.langService.setLang(lang);
    this.lang = lang;
  }

  t(key: string) {
    return this.langService.t(key);
  }

  goHome() {
    this.route.navigate(['/']);
  }

  goRecempense() {
    this.route.navigate(['/recompenses']);
  }

  redirectToLogin() {
    this.route.navigate(['/login']);
  }

  logout() {
    this.serviceAuth.logout();
    this.isLoggedIn = false;
    this.route.navigate(['/login']);
  }

  getProfilePictureUrl(): string {
    if (this.isLoggedIn) {
      return this.profilePictureUrl?.trim()
        ? this.profilePictureUrl
        : 'assets/images/user_img.jpg';
    } else {
      return 'assets/images/logo/image.png';
    }
  }
}
