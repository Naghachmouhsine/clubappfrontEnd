import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController, ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstallationModalComponent } from 'src/app/modals/installation-modal/installation-modal.component';

@Component({
  selector: 'app-installation',
  templateUrl: './installation.page.html',
  styleUrls: ['./installation.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class InstallationPage implements OnInit {

  installations: any[] = [];

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadInstallations();
  }

  loadInstallations() {
    this.http.get<any[]>('http://localhost:3000/api/installations')
      .subscribe({
        next: (res) => this.installations = res,
        error: (err) => console.error(err)
      });
  }

  async deleteInstallation(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer cette installation ?',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          handler: () => {
            this.http.delete(`http://localhost:3000/api/installations/${id}`)
              .subscribe({
                next: async () => {
                  this.installations = this.installations.filter(i => i.id !== id);
                  const toast = await this.toastCtrl.create({
                    message: 'Installation supprimée.',
                    duration: 2000,
                    color: 'success'
                  });
                  toast.present();
                },
                error: (err) => console.error(err)
              });
          }
        }
      ]
    });

    await alert.present();
  }

  async detailInstallation(id: number) {
    this.http.get<any>(`http://localhost:3000/api/installations/${id}`).subscribe({
      next: async (installation) => {
        const modal = await this.modalCtrl.create({
          component: InstallationModalComponent,
          componentProps: {
            installationId: id,
            mode: 'detail',
            installationDetails: installation
          }
        });

        modal.onDidDismiss().then(result => {
          if (result.data === true) {
            this.loadInstallations();
          }
        });

        return await modal.present();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des détails de l\'installation', err);
      }
    });
  }

  async editInstallation(id: number) {
  this.http.get<any>(`http://localhost:3000/api/installations/${id}`).subscribe({
    next: async (installation) => {
      const modal = await this.modalCtrl.create({
        component: InstallationModalComponent,
        componentProps: {
          installationId: id,
          mode: 'edit',
          installationDetails: installation
        }
      });

      modal.onDidDismiss().then(result => {
        if (result.data === true) {
          this.loadInstallations();
        }
      });

      return await modal.present();
    },
    error: (err) => {
      console.error('Erreur lors du chargement de l\'installation pour édition', err);
    }
  });
}

  async addInstallation() {
    const modal = await this.modalCtrl.create({
      component: InstallationModalComponent,
      componentProps: { mode: 'add' }
    });

    modal.onDidDismiss().then(result => {
      if (result.data) {
        this.loadInstallations();
      }
    });

    await modal.present();
  }

  /*getBadgeColor(disponibilite: string): string {
  const value = disponibilite.toLowerCase();
  if (value === 'oui') return 'success';
  if (value === 'non') return 'danger';
  return 'medium';
}*/

getDisponibiliteClass(disponibilite: string): string {
  const value = disponibilite.toLowerCase();
  if (value === 'oui') return 'disponible-oui';
  if (value === 'non') return 'disponible-non';
  return 'disponible-inconnu';
}
}
