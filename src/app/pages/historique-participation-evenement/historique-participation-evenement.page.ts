import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';
import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-historique-participation-evenement',
  templateUrl: './historique-participation-evenement.page.html',
  styleUrls: ['./historique-participation-evenement.page.scss'],
  standalone: true,
  imports: [SharedIonicModule, AppHeaderComponent, CommonModule, FormsModule, TranslateModule]
})
export class HistoriqueParticipationEvenementPage implements OnInit {

  participation: any[]= [];

  user: any;
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData)
      this.user = JSON.parse(userData);
    this.getParticipation(this.user.id);
  }

  getParticipation(idAdherant: number) {
    try {
      // Assuming you have a service to fetch reservations
      this.http.get<any[]>("http://localhost:3000/api/evenements/getParticipation/"+idAdherant).subscribe({
        next: (data) => {this.participation = data},
        error: (err) => console.error(err)
      });

    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  }

}
