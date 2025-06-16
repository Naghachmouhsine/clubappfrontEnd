import { Component, OnInit } from '@angular/core';
import { Reservation, ReservationService } from 'src/app/services/reservation.service';
import IonicModule from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';

@Component({
  selector: 'app-reservation',
  imports :[CommonModule,SharedIonicModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {

  reservations: Reservation[] = [];

  constructor(private reservationService :ReservationService) { }

  ngOnInit(): void {
    this.getReservations();
  }

  getReservations() {
    try {
      // Assuming you have a service to fetch reservations
      this.reservationService.getAll().subscribe({
        next: (data) => this.reservations = data,
        error: (err) => console.error(err)
      });

    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  }

  onStatutChange(reservation: Reservation, newStatut: string) {
    console.log(this.reservations);

  if (reservation) {
    reservation.creneau_date=reservation.creneau_date.split('T')[0];
    reservation.statut = newStatut;
    console.log('Statut mis à jour:', reservation);
    this.reservationService.update(reservation.id, reservation).subscribe({
      next: (res) => this.reservations=res,
      error: err => console.error('Erreur mise à jour statut :', err)
    });
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
