import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SharedIonicModule } from '../../shared/shared-ionic.module';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverController } from '@ionic/angular';

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
export class ProfileMenuComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private serviceAuth: AuthService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.serviceAuth.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.serviceAuth.userConnecter$.subscribe(user => {
      this.user = user;
    });
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
        {
          text: this.translate.instant('profile.logout'),
          handler: () => { this.logout() }
        }
      ]
    });
    await alert.present();
  }

  logout() {
    this.serviceAuth.logout();
    this.popoverController.dismiss(null, 'logout');
    this.router.navigate(['/login']);
  }

}
