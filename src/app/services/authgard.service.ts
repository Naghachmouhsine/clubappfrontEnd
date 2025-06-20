import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private routes_roles: { [key: string]: string[] } = {
    'userprofile': ['admin','user','responsable', 'coach', 'adherent'],
    'dashboard/activites': ['admin', 'responsable', 'coach'],
    'dashboard/utilisateur': ['admin','user'],
    'dashboard/installation': ['admin', 'responsable'],
    'dashboard/creneaux': ['admin', 'responsable'],
    'reservation/activite-r': ['admin', 'responsable', 'coach'],
    'reservation/date-r': ['admin', 'responsable', 'coach'],
    'reservation/creneau-r': ['admin', 'responsable', 'coach'],
    'reservation/confirmation-r': ['admin', 'responsable', 'coach'],
    'reservation/home-r': ['admin', 'user', 'responsable', 'coach', 'adherent'],
    'reservation/reservation-date': ['admin', 'responsable', 'coach', 'adherent'],
    'dashboard/reservations': ['admin', 'responsable','user'],
  };

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(token)
    console.log(user)
    if (!token) {
      this.router.navigate(['/login'],
          { queryParams: { error: 'auth_required',message:"Vous devez être connecté pour accéder" } }
      );
      return false;
    }

    //route actuelle
    const curentPath = state.url.startsWith('/') ? state.url.slice(1) : state.url;
    const cleanPath = state.url.split('?')[0].replace(/^\/+/, ''); //supprimer les parametres de route

    // les rôles autorisés pour la route actuelle
    const roles = this.routes_roles[cleanPath];

    console.log('Current Path:', curentPath);
    console.log('User Role:', user); 
    console.log('Required Roles:', roles);
    console.log(cleanPath)
    if (roles && user && user.role && roles.includes(user.role)) {
      return true;
    } else {
      this.router.navigate(['/login'],
        { queryParams: { error: 'auth_required',message: "Vous n'avez pas accès à cette page",to:curentPath} }
      );
      return false;
    }
  }
}

