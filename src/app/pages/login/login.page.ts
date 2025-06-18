import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ToastController,
  MenuController
} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedIonicModule } from '../../shared/shared-ionic.module';
import { AuthService } from '../../services/auth.service'; // <-- importer le service
import { HttpClientModule } from '@angular/common/http'; // <-- pour l'import
import {  ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    SharedIonicModule,
    FormsModule,
    HttpClientModule // <-- important !
  ],
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  isModal=false;//true dans le cas d'afficher comme modal
  msg="" // message sera afficher lorsque  adherant diot reserver
  email: string = '';
  password: string = '';
  messageAuthRequire: string = ''; // Message d'erreur pour l'authentification requise
  to="home" // Variable pour stocker l'URL de redirection après la connexion (par défaut 'home')
  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private toastController: ToastController,
    private authService: AuthService,
    private route:ActivatedRoute,
    private modalCntrl:ModalController
  ) {}

  async close() {
    await this.modalCntrl.dismiss();
  }
    ionViewDidEnter() {
      if(this.isModal)
        this.msg="pour reserver un creneaux"
      console.log('ionViewDidEnter LoginPage');
      this.route.queryParams.subscribe(params => {
        console.log('Query Params:', params);
        if (params['error'] === 'auth_required') {
          this.presentToast(params["message"], 'danger', 6000);
          this.to= params['to'] || 'home';
        }
      });
    }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  async onLogin() {
    if (!this.email || !this.password) {
      return this.presentToast('Veuillez remplir tous les champs.', 'danger');
    }
  
    try {
      const response = await this.authService.login(this.email, this.password).toPromise();
  
      // Vérification si la réponse est valide
      if (response && response.token) {
        // Stocker le token dans le localStorage
        localStorage.setItem('token', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        await this.presentToast('Connexion réussie', 'success');
        if(!this.isModal)
          this.router.navigate(['/'+this.to]);
        else
          this.modalCntrl.dismiss({user : response.user,loginValide:true})
      } else {
        await this.presentToast('Réponse invalide du serveur', 'danger');
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      const message = error?.error?.message || 'Erreur inconnue';
      await this.presentToast(message, 'danger');
    }
  }
  

  private async presentToast(message: string, color: 'success' | 'danger',duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration: duration,
      color,
      position: 'top',
    });
    await toast.present();
  }
}
