import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedIonicModule } from '../../shared/shared-ionic.module';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mot-passe-oublie',
  imports: [
    SharedIonicModule,
    FormsModule,
    TranslateModule,

  ],
  templateUrl: './mot-passe-oublie.component.html',
  styleUrls: ['./mot-passe-oublie.component.scss'],
})
export class MotPasseOublieComponent {

  email: string = '';

  constructor(private toastCtrl: ToastController, private http: HttpClient, private route: Router) { }

  onSendLink() {
    console.log(this.email)
    this.http.post('http://localhost:3000/api/envoiEmail', { email: this.email })
      .subscribe({
        next: async () => {
          const toast = await this.toastCtrl.create({
            message: 'Un lien de réinitialisation a été envoyé.',
            duration: 3000,
            color: 'success'
          });
          toast.present();
        },
        error: async (error) => {
          let errorMessage = ""
          if (error.status === 404) {
            errorMessage = error.error.message;
          } else {
            errorMessage = "Une erreur est survenue. Veuillez réessayer plus tard.";
          }

          const toast = await this.toastCtrl.create({
            message: errorMessage,
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        }
      });
  }


}
