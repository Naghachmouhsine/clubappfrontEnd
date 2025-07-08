import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController, IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserModalComponent } from 'src/app/modals/user-modal/user-modal.component';
import { AppHeaderComponent } from '../../../components/app-header/app-header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.page.html',
  styleUrls: ['./utilisateur.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppHeaderComponent,
    TranslateModule
  ]
})
export class UtilisateurPage implements OnInit {

  utilisateurs: any[] = [];

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loadUtilisateurs();
  }

  loadUtilisateurs() {
    this.http.get<any[]>('http://localhost:3000/api/utilisateurs').subscribe({
      next: res => {
        this.utilisateurs = res.map(user => ({
          ...user,
          selectedRole: user.role
        }));
      },
      error: err => {
        console.error('Erreur chargement utilisateurs', err);
        this.showToast('Erreur lors du chargement des utilisateurs', 'danger');
      }
    });
  }

  async deleteUser(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer cet utilisateur ?',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          handler: () => {
            this.http.delete(`http://localhost:3000/api/utilisateurs/${id}`).subscribe({
              next: async () => {
                this.utilisateurs = this.utilisateurs.filter(u => u.id !== id);
                this.showToast('Utilisateur supprimé.', 'success');
              },
              error: err => {
                console.error('Erreur suppression utilisateur', err);
                this.showToast('Erreur lors de la suppression', 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async detailUser(id: number) {
    this.http.get<any>(`http://localhost:3000/api/utilisateurs/${id}`).subscribe({
      next: async (user) => {
        const modal = await this.modalCtrl.create({
          component: UserModalComponent,
          componentProps: {
            userId: id,
            mode: 'detail',
            userDetails: user
          }
        });

        modal.onDidDismiss().then(result => {
          if (result.data === true) {
            this.loadUtilisateurs();
          }
        });

        await modal.present();
      },
      error: err => {
        console.error('Erreur récupération détails utilisateur', err);
        this.showToast('Erreur lors de la récupération des détails', 'danger');
      }
    });
  }

  async editUser(id: number) {
    const modal = await this.modalCtrl.create({
      component: UserModalComponent,
      componentProps: { userId: id, mode: 'edit' }
    });

    modal.onDidDismiss().then(result => {
      if (result.data === true) {
        this.loadUtilisateurs();
      }
    });

    await modal.present();
  }

  async addUser() {
    const modal = await this.modalCtrl.create({
      component: UserModalComponent,
      componentProps: { mode: 'add' }
    });

    modal.onDidDismiss().then(result => {
      if (result.data) {
        this.loadUtilisateurs();
      }
    });

    await modal.present();
  }

  async onRoleChange(user: any) {
    const newRole = user.selectedRole;
    const oldRole = user.role;

    const alert = await this.alertCtrl.create({
      header: 'Confirmer la modification',
      message: `Voulez-vous vraiment changer le rôle de ${user.nom} vers ${newRole.toUpperCase()} ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => { user.selectedRole = oldRole; }
        },
        {
          text: 'Confirmer',
          handler: () => {
            this.http.put(`http://localhost:3000/api/updateRoleUser`, { id: user.id, newRole }).subscribe({
              next: () => {
                user.role = newRole;  // Met à jour localement le rôle
                this.showToast('Rôle mis à jour.', 'success');
                this.loadUtilisateurs();
              },
              error: err => {
                user.selectedRole = oldRole; // rollback en cas d'erreur
                console.error('Erreur mise à jour rôle', err);
                this.showToast('Erreur lors de la mise à jour du rôle', 'danger');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'adherent': return 'role-adherent';
      case 'coach': return 'role-coach';
      case 'responsable': return 'role-responsable';
      case 'admin': return 'role-admin';
      case 'user': return 'role-user';
      default: return '';
    }
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
