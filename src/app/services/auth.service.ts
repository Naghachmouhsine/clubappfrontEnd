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
  private userConnecterSource = new BehaviorSubject<LoginResponse['user'] | null>(null);
  userConnecter$ = this.userConnecterSource.asObservable();

  private tokenSource = new BehaviorSubject<string | null>(this.getTokenFromStorage());
  token$ = this.tokenSource.asObservable();

  constructor(private http: HttpClient) {
    this.initializeFromStorage(); // synchroniser au démarrage
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return new Observable(observer => {
      this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).subscribe({
        next: response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userInfo', JSON.stringify(response.user));
          localStorage.setItem('userId', response.user.id.toString());
          localStorage.setItem('role', response.user.role);

          this.userInfo = response.user;
          this.isLoggedInSubject.next(true);
          this.userConnecterSource.next(response.user);
          this.tokenSource.next(response.token);

          observer.next(response);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');

    this.userInfo = null;
    this.isLoggedInSubject.next(false);
    this.userConnecterSource.next(null);
    this.tokenSource.next(null);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getTokenFromStorage(): string | null {
    return localStorage.getItem('token');
  }

  checkAuthStatus() {
    this.isLoggedInSubject.next(this.hasToken());
  }

  getUser(): LoginResponse['user'] | null {
    if (!this.userInfo) {
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        this.userInfo = JSON.parse(stored);
      }
    }
    return this.userInfo;
  }

  getToken(): string | null {
    return this.tokenSource.value;
  }

  getUserConnecter(): LoginResponse['user'] | null {
    return this.userConnecterSource.value;
  }

  initializeFromStorage() {
    const userString = localStorage.getItem('userInfo');
    const token = localStorage.getItem('token');

    if (userString && token) {
      const user = JSON.parse(userString);
      this.userInfo = user;
      this.userConnecterSource.next(user);
      this.tokenSource.next(token);
      this.isLoggedInSubject.next(true);
    }
  }
}
