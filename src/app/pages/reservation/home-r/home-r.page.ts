import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationCService } from 'src/app/services/reservation-c.service';

import { IonicModule } from '@ionic/angular';
import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';

@Component({
  selector: 'app-home-r',
  templateUrl: './home-r.page.html',
  styleUrls: ['./home-r.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppHeaderComponent
  ]
})
export class HomeRPage implements OnInit {

activites = [
  { nom: 'Tennis', emoji: '🎾', image: '../../../../assets/images/Tennis.jpg' },
  { nom: 'Padel', emoji: '🏓', image: '../../../../assets/images/Padel.jpg' },
  { nom: 'Piscine', emoji: '🏊', image: '../../../../assets/images/Piscine1.jpg' },
  { nom: 'Football', emoji: '⚽', image: '../../../../assets/images/Foot.jpg' },
  { nom: 'Fitness', emoji: '💪', image: '../../../../assets/images/Fitness.jpg' },
  { nom: 'Basket', emoji: '🏀', image: '../../../../assets/images/Basket.jpg' },
  { nom: 'Volley', emoji: '🏐', image: '../../../../assets/images/volley.jpg' },
  { nom: 'Pétanque', emoji: '🪀', image: '../../../../assets/images/Petanque.jpg' },
  { nom: 'Athlétisme', emoji: '🏃‍♂️', image: '../../../../assets/images/Athletisme.jpg' },
  { nom: 'Arts Martiaux', emoji: '🥋', image: '../../../../assets/images/Arts-Martiaux.jpg' }
];

  constructor(
    private reservationService: ReservationCService,
    private router: Router
  ) { }

  ngOnInit() { }

  choisirActivite(a: any) {
    this.reservationService.setReservation('activite', a.nom);
    this.router.navigateByUrl('/reservation/reservation-date');

  }
}
