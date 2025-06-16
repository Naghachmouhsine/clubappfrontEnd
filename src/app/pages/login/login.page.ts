import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ToastController,
  MenuController
} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedIonicModule } from '../../shared/shared-ionic.module';
import { AuthService } from '../../services/auth.service'; // <-- importer le service
import { HttpClientModule } from '@angular/common/http'; // <-- pour l'import

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
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

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
        await this.presentToast('Connexion réussie', 'success');
        this.router.navigate(['/home']);
      } else {
        await this.presentToast('Réponse invalide du serveur', 'danger');
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      const message = error?.error?.message || 'Erreur inconnue';
      await this.presentToast(message, 'danger');
    }
  }
  

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }
}
