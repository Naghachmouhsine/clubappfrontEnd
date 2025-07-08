import { ThemeService, ThemeType } from '../../services/theme.service';
import { LangService, LangType } from '../../services/lang.service';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileMenuComponent } from '../../pages/profile-menu/profile-menu.component';
import { HttpClient } from '@angular/common/http';
import { RecempenseService } from 'src/app/services/recempense.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, ProfileMenuComponent],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {
  @Input() nomPage = 'Home';
  @Input() menuId: string = 'main-content';
  @Input() showServicesText: boolean = true;
  @Input() showProfilePicture: boolean = false;
  @Input() showProfileText: boolean = true;
  @Input() showLogoutText: boolean = true;
  @Input() profilePictureUrl: string = '';
  totalPoints:any=0
  theme: ThemeType = 'light';
  themeIcon: string = 'sunny-outline';
  lang: LangType = 'fr';

  isLoggedIn: boolean = false;
  user:any;

  constructor(
    private route: Router,
    private themeService: ThemeService,
    private langService: LangService,
    private popoverController: PopoverController,
    private servicePoints:RecempenseService
  ) {}

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
    this.updateThemeIcon();
    this.lang = this.langService.getLang();

    // Vérifie si un token est présent dans le localStorage
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    
    const userData = localStorage.getItem('user');
    if (userData){
      this.user = JSON.parse(userData); 
      this.servicePoints.points$.subscribe(points => {
      this.totalPoints = points;
    });
    }
     
  }

  cycleTheme() {
    this.theme = this.theme === 'light'
      ? 'dark'
      : this.theme === 'dark'
      ? 'auto'
      : 'light';

    this.themeService.setTheme(this.theme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    this.themeIcon =
      this.theme === 'light'
        ? 'sunny-outline'
        : this.theme === 'dark'
        ? 'moon-outline'
        : 'contrast-outline'; // auto
        
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
 goRecemepense(){
    this.route.navigate(['/recompenses']);
 }
  redirectToLogin() {
    this.route.navigate(['/login']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.route.navigate(['/login']);
  }

  getProfilePictureUrl(): string {
    return this.profilePictureUrl && this.profilePictureUrl.trim() !== ''
      ? this.profilePictureUrl
      : 'assets/images/user_img.jpg';
  }
}
