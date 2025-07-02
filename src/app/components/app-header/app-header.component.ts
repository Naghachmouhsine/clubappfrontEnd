import { ThemeService, ThemeType } from '../../services/theme.service';
import { LangService, LangType } from '../../services/lang.service';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileMenuComponent } from '../../pages/profile-menu/profile-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  @Input() nomPage = 'Home';
  @Input() menuId: string = 'main-content';
  @Input() showServicesText: boolean = true;
  @Input() showProfilePicture: boolean = false;
  @Input() showProfileText: boolean = true;
  @Input() showLogoutText: boolean = true;
  @Input() profilePictureUrl: string = '';
  theme: ThemeType = 'light';
  themeIcon: string = 'sunny-outline';
  lang: LangType = 'fr';

  constructor(
    private route: Router,
    private themeService: ThemeService,
    private langService: LangService,
    private popoverController: PopoverController
  ) {
    this.theme = this.themeService.getTheme();
    this.updateThemeIcon();
    this.lang = this.langService.getLang();
  }

  cycleTheme() {
    if (this.theme === 'light') {
      this.theme = 'dark';
    } else if (this.theme === 'dark') {
      this.theme = 'auto';
    } else {
      this.theme = 'light';
    }
    this.themeService.setTheme(this.theme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    if (this.theme === 'light') {
      this.themeIcon = 'sunny-outline';
    } else if (this.theme === 'dark') {
      this.themeIcon = 'moon-outline';
    } else {
      this.themeIcon = 'contrast-outline'; // auto
    }
  }

  async openProfileMenu(event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: ProfileMenuComponent,
      event: event,
      translucent: true,
    });
    await popover.present();
  }

  scrollToServices() {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
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
}