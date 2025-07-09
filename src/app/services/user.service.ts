import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface UserProfile {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  date_naissance: string;
  genre: string;
  statut_abonnement?: string;
  date_inscription?: string;
  specialite?: string;
  departement?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api'; // adapte selon ton backend

  // Stockage réactif du profil utilisateur
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ✅ Récupération HTTP du profil + mise à jour du BehaviorSubject
  loadUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/userprofile/${userId}`).pipe(
      tap(profile => this.userProfileSubject.next(profile))
    );
  }

  // ✅ Accès direct au profil stocké
  getCurrentUserProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }

  // ✅ Pour vider le profil (ex: logout)
  clearUserProfile(): void {
    this.userProfileSubject.next(null);
  }

  // ✅ Récupération simple du profil (sans mise à jour du BehaviorSubject)
  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/userprofile/${userId}`);
  }
}
