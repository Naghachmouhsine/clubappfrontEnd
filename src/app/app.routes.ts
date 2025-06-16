import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { SettingsPage } from './pages/settings/settings.page';
import { HomePage } from './home/home.page';
import { ContactPage } from './pages/contact/contact.page';
import { UserprofilePage } from './pages/userprofile/userprofile.page';
import { ActivitesPage } from './pages/dashboard/activites/activites.page';
import { UtilisateurPage } from './pages/dashboard/utilisateur/utilisateur.page';
import { InstallationPage } from './pages/dashboard/installation/installation.page';
import { CreneauxPage } from './pages/dashboard/creneaux/creneaux.page';
import { ActiviteRPage } from './pages/reservation/activite-r/activite-r.page';
import { DateRPage } from './pages/reservation/date-r/date-r.page';
import { CreneauRPage } from './pages/reservation/creneau-r/creneau-r.page';
import { ConfirmationRPage } from './pages/reservation/confirmation-r/confirmation-r.page';
import { HomeRPage } from './pages/reservation/home-r/home-r.page';
import { ReservationDatePage } from './pages/reservation/reservation-date/reservation-date.page';
import { ReservationComponent } from './pages/dashboard/reservation/reservation.component';

export const routes: Routes = [
  {
    path: 'home',
    component:HomePage,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component:LoginPage,
  },
  {
    path: 'register',
    component:RegisterPage,
  },
  {
    path: 'settings',
    component:SettingsPage,
  },
  
  {
    path: 'contact',
    component:ContactPage,
  },
  {
    path: 'userprofile',
    component:UserprofilePage,
  },
  
  {
    path: 'dashboard/activites',  
    component:ActivitesPage,
  },
  
  {
    path: 'dashboard/utilisateur',
    component:UtilisateurPage,
  },
  {
    path: 'dashboard/reservations',
    component:ReservationComponent
  },
  {
    path: 'dashboard/installation',
    component:InstallationPage,
  },
  {
    path: 'dashboard/creneaux',
    component:CreneauxPage,
  },
  // Reservations : 
  {
    path: 'reservation/activite',
    component:ActiviteRPage,
  },
  {
    path: 'reservation/date',
    component:DateRPage,
  },
  {
    path: 'reservation/creneau',
    component:CreneauRPage,
  },
  {
    path: 'reservation/confirmation',
    component:ConfirmationRPage,
  },
  {
    path: 'reservation/home',
    component:HomeRPage,
  },
 
  {
    path: 'reservation/reservation-date',
    component:ReservationDatePage,
    //loadComponent: () => import('./pages/reservation/reservation-date/reservation-date.page').then( m => m.ReservationDatePage)
  },
];
