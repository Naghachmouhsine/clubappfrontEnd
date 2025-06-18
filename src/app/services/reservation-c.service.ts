// src/app/services/reservation-c.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ReservationData = {
  activite: string;
  date: string;
  creneau: string;
  installation: string;
};

@Injectable({
  providedIn: 'root'
})
export class ReservationCService {

  private reservation: ReservationData = {
    activite: '',
    date: '',
    creneau: '',
    installation: '',
  };

  constructor(private http: HttpClient) {}

  setReservation(key: keyof ReservationData, value: string) {
    this.reservation[key] = value;
  }

  getReservation() {
    return this.reservation;
  }

  reset() {
    this.reservation = {
      activite: '',
      date: '',
      creneau: '',
      installation: '',
    };
  }

  // ✅ Appel API pour récupérer les installations
  getInstallations(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/installations'); // modifie l’URL selon ton backend
  }
  getCreneauxDisponibles(activite: string, date: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/creneaux?activite=${activite}&date=${date}`);
  }
  getCreneauxDisponiblesByActivite(activite: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/creneaux?activite=${activite}`);
  }
  reserver(reservation: any): Observable<{ message: string; id: number }> {
    console.log(reservation)
    return this.http.post<{ message: string; id: number }>('http://localhost:3000/api/reservations', reservation);
  }
}
