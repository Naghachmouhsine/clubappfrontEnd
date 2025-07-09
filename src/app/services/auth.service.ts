import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    nom: string;
    prenom: string;
    telephone: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userInfo: LoginResponse['user'] | null = null;

  constructor(private http: HttpClient) {}

  // 🔐 Authentifier l’utilisateur

  login(email: string, password: string): Observable<LoginResponse> {
  return new Observable((observer) => {
    this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userInfo', JSON.stringify(response.user));
        localStorage.setItem('userId', response.user.id.toString());  // ✅ AJOUTÉ
        localStorage.setItem('role', response.user.role);             // ✅ AJOUTÉ
        this.userInfo = response.user;
        this.isLoggedInSubject.next(true);
        observer.next(response);
        observer.complete();
      },
      error: (err) => observer.error(err)
    });
  });
}


  // 📤 Déconnexion
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    this.userInfo = null;
    this.isLoggedInSubject.next(false);
  }

  // ✅ Vérifie présence du token
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // 🔁 Rafraîchir le status (ex: au démarrage)
  checkAuthStatus() {
    this.isLoggedInSubject.next(this.hasToken());
  }

  // 👤 Récupère les infos utilisateur
  getUser(): LoginResponse['user'] | null {
    if (!this.userInfo) {
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        this.userInfo = JSON.parse(stored);
      }
    }
    return this.userInfo;
  }

  // 🔒 Récupère le token (si besoin pour les headers)
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
