import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';
import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';
import { RecempenseService } from 'src/app/services/recempense.service';

@Component({
  selector: 'app-recompenses',
  templateUrl: './recompenses.page.html',
  styleUrls: ['./recompenses.page.scss'],
  standalone: true,
  imports: [AppHeaderComponent, SharedIonicModule, FormsModule, CommonModule]
})
export class RecompensesPage implements OnInit {

  recompenses: any[] = [];
  userPoints = 0;
  idAdherant = null;

  constructor(private http: HttpClient, private toastCtrl: ToastController, private servicePoints: RecempenseService) { }

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.idAdherant = user.id;

      this.servicePoints.points$.subscribe(points => {
        this.userPoints = points || 0;
        this.loadRecompenses();
      });


    }
  }

  loadRecompenses() {
    this.http.get<any[]>(`http://localhost:3000/api/getAllRecempense`)
      .subscribe({
        next: (data) => {
          this.recompenses=data
          this.recompenses = this.recompenses.map(r => {
            const actif = this.userPoints >= r.seuil;
            const maxObtenable = Math.floor(this.userPoints / r.seuil);
            return {
              ...r,
              actif,
              maxObtenable
            };
          });

          console.log(this.recompenses)
        },
        error: (err) => {
          console.error('Erreur chargement récompenses:', err);
        }
      });
  }

  async obtenirRecompense(rec: any) {
    const payload = {
      idAdherant: this.idAdherant,
      idRecompense: rec.id,
      points: rec.seuil
    };
    console.log(rec)
    console.log(payload)
    try {
      await this.http.post('http://localhost:3000/api/ajouterRecempense', payload).toPromise();
      this.servicePoints.deductPoints(rec.seuil)
      rec.obtenu = true;


    } catch (err) {
      console.error('Erreur lors de l’obtention :', err);
      const toast = await this.toastCtrl.create({
        message: 'Erreur serveur, réessayer plus tard.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
