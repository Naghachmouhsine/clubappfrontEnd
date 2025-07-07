import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonContent } from "@ionic/angular/standalone";
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  imports: [SharedIonicModule, CommonModule, FormsModule],
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss']
})
export class ResetPasswordPage implements OnInit {

  token: string = '';
  isTokenValid = false;
  email = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (this.token) {
      this.http.post(`http://localhost:3000/api/verify-token`, { token: this.token }).subscribe({
        next: (res: any) => {
          this.isTokenValid = true;
          this.email = res.email;
        },
        error: (err) => {
          this.errorMessage = 'Le lien est invalide ou a expiré.';
          console.log(err)
        }
      });
    }
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.http.post('http://localhost:3000/api/reset-password', {
      email: this.email,
      newPassword: this.newPassword
    }).subscribe({
      next: (res:any) => {
        this.router.navigate(['/login'],
          {
            queryParams: {
              updateMotPass: 'true',
              message: "Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter."
            }
          });
      },
      error: async (err) => {
        console.log(err)
        this.errorMessage =err.error.message;
        const toast = await this.toastCtrl.create({
            message: this.errorMessage,
            duration: 3000,
            color: 'danger'
          });
          toast.present();
      }
    });
  }
}
