import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedIonicModule } from '../../shared/shared-ionic.module';
import { AlertController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [
    SharedIonicModule,
    TranslateModule
  ],
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent {
  isLoggedIn = false;
  constructor(private router: Router, private alertCtrl: AlertController, private translate: TranslateService) {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('profile.logout_title'),
      message: this.translate.instant('profile.logout_confirm'),
      buttons: [
        { text: this.translate.instant('profile.cancel'), role: 'cancel' },
        { text: this.translate.instant('profile.logout'), handler: () => this.logout() }
      ]
    });
    await alert.present();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
