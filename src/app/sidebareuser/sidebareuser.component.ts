import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface SidebarMenuItem {
  label: string;
  icon: string;
  route?: string;
  active?: boolean;
  badge?: string;
  children?: SidebarMenuItem[];
  open?: boolean;
}

interface SidebarUser {
  name: string;
  role: string;
  avatarUrl: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebareuser',
  templateUrl: './sidebareuser.component.html',
  styleUrls: ['./sidebareuser.component.scss'],
})
export class SidebareuserComponent implements OnInit {
  user: SidebarUser = {
    name: 'John Doe',
    role: 'SIDEBAR.ROLE_MEMBER',
    avatarUrl: 'assets/avatar.png',
    badge: 'SIDEBAR.PREMIUM',
  };

  menu: SidebarMenuItem[] = [
    {
      label: 'SIDEBAR.HOME',
      icon: 'fa fa-home',
      route: '/home',
      active: true,
    },
    {
      label: 'SIDEBAR.RESERVATIONS',
      icon: 'fa fa-calendar-check',
      route: '/reservation',
      badge: '2',
    },
    {
      label: 'SIDEBAR.PROFILE',
      icon: 'fa fa-user',
      route: '/userprofile',
    },
    {
      label: 'SIDEBAR.SETTINGS',
      icon: 'fa fa-cog',
      children: [
        {
          label: 'SIDEBAR.THEME',
          icon: 'fa fa-moon',
        },
        {
          label: 'SIDEBAR.LANGUAGE',
          icon: 'fa fa-language',
        },
      ],
    },
  ];

  theme: 'light' | 'dark' | 'auto' = 'auto';
  lang: 'fr' | 'en' | 'ar' = 'fr';
  isRtl = false;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.lang = this.translate.currentLang as 'fr' | 'en' | 'ar';
    this.isRtl = this.lang === 'ar';
  }

  get themeIcon() {
    return this.theme === 'dark' ? 'fa fa-moon' : this.theme === 'light' ? 'fa fa-sun' : 'fa fa-adjust';
  }
  get langIcon() {
    return this.lang === 'ar' ? 'fa fa-language' : this.lang === 'en' ? 'flag-icon flag-icon-gb' : 'flag-icon flag-icon-fr';
  }

  onMenuClick(item: SidebarMenuItem) {
    if (item.children) {
      item.open = !item.open;
    } else {
      this.menu.forEach(m => m.active = false);
      item.active = true;
      // Navigation à ajouter selon le router
    }
  }

  toggleTheme() {
    if (this.theme === 'auto') this.theme = 'dark';
    else if (this.theme === 'dark') this.theme = 'light';
    else this.theme = 'auto';
    // Gestion du thème global à ajouter
  }

  toggleLang() {
    if (this.lang === 'fr') this.lang = 'en';
    else if (this.lang === 'en') this.lang = 'ar';
    else this.lang = 'fr';
    this.translate.use(this.lang);
    this.isRtl = this.lang === 'ar';
    // Gestion du RTL globale à ajouter
  }

  logout() {
    // Logique de déconnexion à ajouter
  }
}
