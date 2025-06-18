import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController, IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserModalComponent } from 'src/app/modals/user-modal/user-modal.component';
import { AppHeaderComponent } from "../../../components/app-header/app-header.component";

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.page.html',
  styleUrls: ['./utilisateur.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppHeaderComponent
]
})
export class UtilisateurPage implements OnInit {

  utilisateurs: any[] = [];

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadUtilisateurs();
  }

  loadUtilisateurs() {
    this.http.get<any[]>('http://localhost:3000/api/utilisateurs')
      .subscribe({
        next: (res) => this.utilisateurs = res,
        error: (err) => console.error(err)
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
            this.http.delete(`http://localhost:3000/api/utilisateurs/${id}`)
              .subscribe({
                next: async () => {
                  this.utilisateurs = this.utilisateurs.filter(u => u.id !== id);
                  const toast = await this.toastCtrl.create({
                    message: 'Utilisateur supprimé.',
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

  // Méthode pour afficher les détails de l'utilisateur
async detailUser(id: number) {
  // Tu fais une requête pour récupérer les détails de l'utilisateur
  this.http.get<any>(`http://localhost:3000/api/utilisateurs/${id}`).subscribe({
    next: async (user) => {
      // Si tu as un composant modal pour afficher les détails
      const modal = await this.modalCtrl.create({
        component: UserModalComponent, // Le même composant modal, mais tu peux l'utiliser pour l'affichage des détails
        componentProps: {
          userId: id,       // Passe l'ID de l'utilisateur à la modal
          mode: 'detail',    // Passer le mode "détail" pour que le modal affiche les détails de manière spécifique
          userDetails: user  // Passe les détails de l'utilisateur récupérés dans la requête
        }
      });

      modal.onDidDismiss().then(result => {
        // Si tu souhaites, tu peux gérer la fermeture du modal, par exemple recharger la liste des utilisateurs.
        if (result.data === true) {
          this.loadUtilisateurs(); // Par exemple, on peut rafraîchir la liste si une modification a eu lieu
        }
      });

      return await modal.present();
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des détails de l\'utilisateur', err);
    }
  });
}

  // Méthode pour éditer l'utilisateur
  async editUser(id: number) {
    const modal = await this.modalCtrl.create({
      component: UserModalComponent,
      componentProps: { userId: id, mode: 'edit' }
    });

    modal.onDidDismiss().then(result => {
      if (result.data === true) {
        this.loadUtilisateurs(); // Refresh après modification
      }
    });

    return await modal.present();
  }


  async addUser() {
    const modal = await this.modalCtrl.create({
      component: UserModalComponent,
      componentProps: {
        mode: 'add'
      }
    });

    modal.onDidDismiss().then(result => {
      if (result.data) {
        this.loadUtilisateurs(); // Mise à jour si ajout réussi
      }
    });

    await modal.present();
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
}
