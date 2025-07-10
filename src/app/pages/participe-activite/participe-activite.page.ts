import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';
import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { DateHeureParticipationModalComponent } from 'src/app/modals/date-heure-participation-modal/date-heure-participation-modal.component';
@Component({
  selector: 'app-participe-activite',
  templateUrl: './participe-activite.page.html',
  styleUrls: ['./participe-activite.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SharedIonicModule,
    AppHeaderComponent,
    TranslateModule
  ]
})
export class ParticipeActivitePage implements OnInit {
  activites: any[] = []
  userConnecter: any;
  constructor(private http: HttpClient, private serviceAuth: AuthService, private modalController: ModalController) { }

  ngOnInit() {
    this.serviceAuth.userConnecter$.subscribe(user => {
      this.userConnecter = user;
    });
    this.loadActivites()
  }

  loadActivites() {
    this.http.get<any[]>("http://localhost:3000/api/getAllActivite/0")
      .subscribe({
        next: (res) => this.activites = res,
        error: (err) => console.error('Erreur chargement activitges :', err)
      });

  }

  async participerActivite(activie: any) {
    console.log(this.userConnecter)
    if (this.userConnecter.role !== 'adherent') {
      alert('Seuls les adhérents peuvent participer à un événement.');
      return;
    }
    const modal = await this.modalController.create({
      component: DateHeureParticipationModalComponent
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      console.log('Date choisie :', data.date);
      console.log('Heure choisie :', data.time);
    }

    const participationData = {
      idAdherant: this.userConnecter.id,
      idActivite: activie.id,
      dateParticipation: data.date.split("T")[0],
      heurParticipation: data.time
    };
    console.log(participationData)
    this.http.post<any>('http://localhost:3000/api/ParticiperActivite', participationData)
      .subscribe({
        next: (rep) => {
          if (rep.isParticiper && rep.message) {
            alert(`${rep.message} : ${activie.type}`); // le message pour indiquer a user que deje participer dans evenement
          } else {
            alert(`Vous êtes participer a l'activte: ${activie.type}`);
          }
        },
        error: (err) => {
          console.error('Erreur participation:', err);

          // if (err.status === 0 || err.message.includes('ERR_CONNECTION_REFUSED')) {
            alert('Impossible de se connecter au serveur. Veuillez vérifier votre connexion.');
          // } else if (err.status === 401) {
          //   alert('Session expirée. Veuillez vous reconnecter.');
          // } else if (err.status === 409) {
          //   alert('Vous êtes déjà inscrit à cet événement.');
          // } else {
          //   alert('Une erreur est survenue lors de la participation. Veuillez réessayer.');
          // }
        }
      });
  }



  async ouvrirModalParticipation() {
    const modal = await this.modalController.create({
      component: DateHeureParticipationModalComponent
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      console.log('Date choisie :', data.date);
      console.log('Heure choisie :', data.time);
    }
  }

}
