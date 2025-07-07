import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppHeaderComponent } from '../../../components/app-header/app-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { InformationReinscriptionComponent } from 'src/app/modals/information-reinscription/information-reinscription.component';
import { EditAdherentModalComponent } from 'src/app/modals/edit-adherent-moda/edit-adherent-moda.component';
@Component({
  selector: 'app-adherant',
  templateUrl: './adherant.component.html',
  styleUrls: ['./adherant.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppHeaderComponent,
    TranslateModule
  ]
})
export class AdherantComponent implements OnInit {
  adherents: any[] = [];

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl : ModalController
  ) {}

  ngOnInit() {
    this.loadAdherents();
  }

  loadAdherents() {
    this.http.get<any[]>('http://localhost:3000/api/adherants')
      .subscribe({
        next: (res) => {this.adherents = res;console.log(res)},
        error: (err) => console.error('Erreur chargement adhérents :', err)
      });
  }

  async onStatusChange(adherent: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: `Changer le statut de ${adherent.nom} vers ${adherent.statut_abonnement} ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Confirmer',
          handler: () => {
            this.http.put(`http://localhost:3000/api/adherents/${adherent.id}/statut`, {
              statut_abonnement: adherent.statut_abonnement
            }).subscribe({
              next: async () => {
                const toast = await this.toastCtrl.create({
                  message: 'Statut mis à jour avec succès.',
                  duration: 2000,
                  color: 'success'
                });
                toast.present();
              },
              error: (err) => console.error('Erreur lors de la mise à jour du statut :', err)
            });
          }
        }
      ]
    });

    await alert.present();
  }

  getStatusClass(statut: string): string {
    return statut?.toLowerCase() === 'inactif' ? 'bg-danger text-white' : '';
  }

  detailUser(id: number) {
    // Cette fonction peut être adaptée pour afficher une modale ou naviguer vers une page
    console.log('Voir détails utilisateur avec ID :', id);
  }
   getStatusColor(status: string): string {
    return status === 'Active' ? 'success' : 'danger';
  }

  getPointsByCategorie(categorie: string): number {
    switch (categorie.toLowerCase()) {
      case 'couple': return 50;
      case 'adulte seul': return 40;
      case 'couple senior': return 35;
      case 'senior seul': return 30;
      case 'étudiant': return 25;
      case 'jeune': return 20;
      case 'enfant': return 15;
      case 'nounou': return 10;
      default: return 0;
    }
  }

  async reinscrire(adherent: any) {
      const modal = await this.modalCtrl.create({
    component: InformationReinscriptionComponent,
    componentProps : {idAdherant : adherent.id}
  });

  modal.onDidDismiss().then(result => {
    if (result.data &&  result.data.isValid) {
      this.loadAdherents(); // si nécessaire
    }
  });

  await modal.present();
  }

async openEditModal(adherent: any) {
  const modal = await this.modalCtrl.create({
    component: EditAdherentModalComponent,
    componentProps: { adherent:   adherent },
  });

 modal.onDidDismiss().then((result) => {
      if (result.data && result.data.updated ) {
        this.loadAdherents()
      }
    });

    return await modal.present();
  } 
}
