import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reservation, ReservationService } from 'src/app/services/reservation.service';
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';
import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-historique-reservation',
  templateUrl: './historique-reservation.page.html',
  styleUrls: ['./historique-reservation.page.scss'],
  imports: [SharedIonicModule, AppHeaderComponent, CommonModule, FormsModule, TranslateModule]
})
export class HistoriqueReservationPage implements OnInit {

  reservations: Reservation[] = [];

  user: any;
  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData)
      this.user = JSON.parse(userData);
    this.getReservations(this.user.id);
  }

  getReservations(idAdherant: number) {
    try {
      // Assuming you have a service to fetch reservations
      this.reservationService.getHistriqueReservation(idAdherant).subscribe({
        next: (data) => {this.reservations = data;console.log(this.reservations)},
        error: (err) => console.error(err)
      });

    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  }

  getStatutColor(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'confirmée':
        return 'confirme';
      case 'en attente':
        return 'en_attente';
      case 'annulée':
        return 'annuler';
      default:
        return 'annuler';
    }
  }

}
