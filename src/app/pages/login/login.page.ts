import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastController, MenuController, ModalController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { SharedIonicModule } from '../../shared/shared-ionic.module';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    SharedIonicModule,
    FormsModule,
    HttpClientModule,
    TranslateModule
  ],
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';
  isModal = false;
  to: string = 'home';
  msg: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private menuCtrl: MenuController,
    private authService: AuthService,
    private modalCntrl: ModalController
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidEnter() {
    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'auth_required') {
        this.msg = 'Authentification requise pour accéder à cette page.';
        this.to = params['to'] || 'home';
        this.presentToast(params['message'] || this.msg, 'danger', 5000);
      }

      if (params['updateMotPass'] === 'true') {
        this.presentToast(params['message'] || 'Mot de passe mis à jour avec succès.', 'success', 4000);
      }

      if (this.isModal) {
        this.msg = 'Authentifiez-vous pour réserver un créneau.';
      }
    });
  }

  async onLogin() {
    if (!this.email || !this.password) {
      return this.presentToast('Veuillez remplir tous les champs.', 'danger', 3000);
    }

    try {
      const response = await this.authService.login(this.email, this.password).toPromise();

      if (response && response.token && response.user) {
        await this.presentToast('Connexion réussie.', 'success');

        if (this.isModal) {
          this.modalCntrl.dismiss({
            loginValide: true,
            user: response.user,
            token: response.token
          });
        } else {
          this.router.navigate(['/' + this.to]);
        }
      } else {
        this.presentToast('Réponse invalide du serveur.', 'danger', 3000);
      }
    } catch (error: any) {
      const msg = error?.error?.message || 'Erreur inconnue lors de la connexion.';
      this.presentToast(msg, 'danger', 3000);
    }
  }

  async presentToast(message: string, color: 'success' | 'danger', duration = 3000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'top',
      cssClass: color === 'success' ? 'custom-toast success-toast' : 'custom-toast'
    });
    toast.present();
  }

  navigateTO(path: string) {
    this.router.navigate([path]);
  }

  async close() {
    await this.modalCntrl.dismiss();
  }
}
