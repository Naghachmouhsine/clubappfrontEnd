import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonContent, IonCard } from "@ionic/angular/standalone";
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';

@Component({
  selector: 'app-historique-participation-evenement',
  templateUrl: './historique-participation.page.html',
  styleUrls: ['./historique-participation-evenement.page.scss'],
  standalone: true,
  imports: [AppHeaderComponent, SharedIonicModule, CommonModule, FormsModule]
})
export class HistoriqueParticipationEvenementPage implements OnInit {

  viewType: 'evenements' | 'activites' = 'evenements';
  participation: any[] = [];
  activites: any[] = [];
  user: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData)
      this.user = JSON.parse(userData);

    this.getParticipation(this.user.id);
    this.loadActivie();
  }

  getParticipation(idAdherant: number) {
    this.http.get<any[]>(`http://localhost:3000/api/evenements/getParticipation/${idAdherant}`)
      .subscribe({
        next: (data) => this.participation = data,
        error: (err) => console.error(err)
      });
  }

  loadActivie() {
    this.http.get<any[]>("http://localhost:3000/api/getParticipationActivite/" + this.user.id)
      .subscribe({
        next: (res) => this.activites = res,
        error: (err) => console.error('Erreur chargement activités :', err)
      });
  }

  switchView(type: 'evenements' | 'activites') {
    this.viewType = type;
  }

  formatTime(timeStr: string): string {  //hh:mm:ss -> hh:mm
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  }

}
