import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DateSlot {
  id?: number;
  date: string;
  disponible: 'oui' | 'non';
}

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private apiUrl = 'http://localhost:3000/api/dates'; // adapte le port/url

  constructor(private http: HttpClient) {}

  getDates(): Observable<DateSlot[]> {
    return this.http.get<DateSlot[]>(this.apiUrl);
  }

  addDate(dateSlot: DateSlot): Observable<any> {
    return this.http.post(this.apiUrl, dateSlot);
  }

  updateDate(id: number, dateSlot: DateSlot): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dateSlot);
  }

  deleteDate(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
