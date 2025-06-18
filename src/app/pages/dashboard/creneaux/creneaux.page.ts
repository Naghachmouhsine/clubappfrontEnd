import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule, ModalController } from '@ionic/angular';
import { CreneauModalComponent } from '../../../modals/creneau-modal/creneau-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppHeaderComponent } from "../../../components/app-header/app-header.component";

@Component({
  selector: 'app-creneaux',
  templateUrl: './creneaux.page.html',
  styleUrls: ['./creneaux.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AppHeaderComponent
]
})



export class CreneauxPage implements OnInit {
  creneaux: any[] = [];
  installations: any[] = [];

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadInstallations();
    this.loadCreneaux();
  }

  loadInstallations() {
    this.http.get<any[]>('http://localhost:3000/api/installations').subscribe({
      next: (data) => (this.installations = data),
      error: (err) => console.error('Erreur chargement installations', err),
    });
  }

  loadCreneaux() {
    this.http.get<any[]>('http://localhost:3000/api/creneaux').subscribe({
      next: (data) => (this.creneaux = data),
      error: (err) => console.error('Erreur chargement créneaux', err),
    });
  }

  async addCreneau() {
    const modal = await this.modalCtrl.create({
      component: CreneauModalComponent,
      componentProps: { mode: 'add', installations: this.installations },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.reload) {
        this.loadCreneaux();
      }
    });

    await modal.present();
  }

  async editCreneau(id: number) {
    const creneau = this.creneaux.find((c) => c.id === id);
    if (!creneau) return;

    const modal = await this.modalCtrl.create({
      component: CreneauModalComponent,
      componentProps: {
        mode: 'edit',
        creneau,
        installations: this.installations,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.reload) {
        this.loadCreneaux();
      }
    });

    await modal.present();
  }

  async detailCreneau(id: number) {
    const creneau = this.creneaux.find((c) => c.id === id);
    if (!creneau) return;

    const modal = await this.modalCtrl.create({
      component: CreneauModalComponent,
      componentProps: {
        mode: 'detail',
        creneau,
        installations: this.installations,
      },
    });

    await modal.present();
  }

  deleteCreneau(id: number) {
    if (!confirm('Voulez-vous vraiment supprimer ce créneau ?')) {
      return;
    }

    this.http.delete(`http://localhost:3000/api/creneaux/${id}`).subscribe({
      next: () => this.loadCreneaux(),
      error: (err) => console.error('Erreur suppression créneau', err),
    });
  }

  getInstallationNom(installation_id: number): string {
    const inst = this.installations.find((i) => i.id === installation_id);
    return inst ? inst.nom : 'N/A';
  }

  getDisponibiliteClass(disponible: string | boolean): string {
    return disponible === 'oui' || disponible === true ? 'disponible-oui' : 'disponible-non';
  }
}
