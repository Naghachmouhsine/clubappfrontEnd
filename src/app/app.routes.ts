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
import { AuthGuard } from './services/authgard.service';

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
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/activites',  
    component:ActivitesPage,
    canActivate: [AuthGuard],
  },
  
  {
    path: 'dashboard/utilisateur',
    component:UtilisateurPage,
    canActivate: [AuthGuard],

  },
  {
    path: 'dashboard/reservations',
    component:ReservationComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'dashboard/installation',
    component:InstallationPage,
    canActivate: [AuthGuard],

  },
  {
    path: 'dashboard/creneaux',
    component:CreneauxPage,
    canActivate: [AuthGuard],
  },
  // Reservations : 
  {
    path: 'reservation/activite',
    component:ActiviteRPage,
    canActivate: [AuthGuard],

  },
  {
    path: 'reservation/date',
    component:DateRPage,
    canActivate: [AuthGuard],

  },
  {
    path: 'reservation/creneau',
    component:CreneauRPage,
    canActivate: [AuthGuard],
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
    canActivate : [AuthGuard]
  },
  {
    path : 'resultPayement',
    component : ReservationDatePage,
  }

];
