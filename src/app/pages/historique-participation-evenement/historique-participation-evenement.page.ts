import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-historique-participation-evenement',
  templateUrl: './historique-participation-evenement.page.html',
  styleUrls: ['./historique-participation-evenement.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HistoriqueParticipationEvenementPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
