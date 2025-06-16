import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';
import { ModalController } from '@ionic/angular';
import { ActiviteModalComponent } from 'src/app/modals/activite-modal/activite-modal.component';
interface Activite {
  id: number;
  titre: string;
  description: string;
  type: string;
  coach_assigne: string;
}

@Component({
  selector: 'app-activites',
  imports: [CommonModule, SharedIonicModule],
  templateUrl: './activites.page.html',
  styleUrls: ['./activites.page.scss'],
})
export class ActivitesPage implements OnInit {

  activites: Activite[] = [
    {
      id: 1,
      titre: 'Yoga',
      description: 'Séance de yoga pour débutants',
      type: 'Bien-être',
      coach_assigne: 'Alice Dupont'
    },
    {
      id: 2,
      titre: 'Crossfit',
      description: 'Entraînement intensif de Crossfit',
      type: 'Fitness',
      coach_assigne: 'Marc Lefèvre'
    }
  ];

  constructor(private moadlCtrl:ModalController) { }

  ngOnInit() {}

  async addActivite() {
    const modal = await this.moadlCtrl.create({
      component: ActiviteModalComponent,
      componentProps: { mode: 'add' },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.activite) {
        this.activites.push(result.data.activite);
        console.log('Nouvelle activité ajoutée :', result.data.activite);
      }
    });

    return await modal.present();
  }

  detailActivite(id: number) {
    // Logique pour afficher les détails d'une activité (modal ou page)
    const activite = this.activites.find(a => a.id === id);
    if (activite) {
      console.log('Détails de l\'activité :', activite);
      // Exemple : this.router.navigate(['/activite', id]);
    }
  }

  editActivite(id: number) {
    // Logique pour éditer l'activité sélectionnée
    const activite = this.activites.find(a => a.id === id);
    if (activite) {
      console.log('Éditer l\'activité :', activite);
      // Exemple : this.router.navigate(['/activite/editer', id]);
    }
  }

  deleteActivite(id: number) {
    // Confirmation avant suppression
    if (confirm('Voulez-vous vraiment supprimer cette activité ?')) {
      this.activites = this.activites.filter(a => a.id !== id);
      console.log('Activité supprimée avec l\'id:', id);
    }
  }
}
