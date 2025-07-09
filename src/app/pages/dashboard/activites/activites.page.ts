import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';
import { ModalController } from '@ionic/angular';
import { ActiviteModalComponent } from 'src/app/modals/activite-modal/activite-modal.component';
import { AppHeaderComponent } from '../../../components/app-header/app-header.component';
import { HttpClient } from '@angular/common/http';

interface Activite {
  id: number;
  titre: string;
  description: string;
  type: string;
  coach_assigne: string;
}

@Component({
  selector: 'app-activites',
  standalone: true,
  imports: [CommonModule, SharedIonicModule, AppHeaderComponent],
  templateUrl: './activites.page.html',
  styleUrls: ['./activites.page.scss'],
})
export class ActivitesPage implements OnInit {

  activites: any[]=[]
  user:any;
  constructor(private moadlCtrl:ModalController,private http:HttpClient) { }

  ngOnInit() {
    const userData = localStorage.getItem('user'); 
    if (userData){
      this.user = JSON.parse(userData);
      console.log(this.user)
      if(this.user.role==="coach")
        this.loadActivie(this.user.id)  // dans le cas de coach, affiche just les activites assigie a lui meme
      else
        this.loadActivie()
    }else
      this.loadActivie()

  }
  loadActivie(idCoach:any=NaN){
      let api=""
      if(this.user.role==="coach")
        api="http://localhost:3000/api/getAllActivite/"+this.user.id
      else
        api="http://localhost:3000/api/getAllActivite/0" //tous les activites (pour admin)
      this.http.get<any[]>(api)
      .subscribe({
        next: (res) => this.activites = res,
        error: (err) => console.error('Erreur chargement activitges :', err)
      });
  }
  async addActivite() {
    const modal = await this.moadlCtrl.create({
      component: ActiviteModalComponent,
      componentProps: { mode: 'add' },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.loadActivie()
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
