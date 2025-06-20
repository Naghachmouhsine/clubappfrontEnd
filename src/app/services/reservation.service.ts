import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js';

export interface Reservation {
  id: number;
  id_utilisateur: number;
  id_creneau: number;
  statut: string;
  utilisateur_nom: string;
  utilisateur_email: string;
  creneau_date: string;
  date_jour_reservation: string;
  heure_debut: string;
  heure_fin: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = 'http://localhost:3000/api/reservations';

  constructor(private http: HttpClient) {}

  getAll() : Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  get(id: number) {
    return firstValueFrom(this.http.get<Reservation>(`${this.apiUrl}/${id}`));
  }

  create(data: Reservation) {
    return firstValueFrom(this.http.post(this.apiUrl, data));
  }

  update(id: number, data: Reservation) : Observable<Reservation[]> {
    return this.http.put<Reservation[]>(`${this.apiUrl}/${id}`, data);
  }
  delete(id: number) {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }
  async checkout() {
    const stripe = await loadStripe('pk_test_51RbpAT01dh9aAuAOVBYaFOAre88uGrhqLCIivOCjR3s4SVkYW7foe8gIJsN9G82LtIlmoLUj1C3Qa5Fm5ugGXK3c001ntOZj4j');

    this.http.post<{ id: string }>('http://localhost:3000/payementStrip', {montant : 200,infoReservatio:'test'})
      .subscribe(async (res) => {
        await stripe?.redirectToCheckout({ sessionId: res.id });
      });
  }
}
