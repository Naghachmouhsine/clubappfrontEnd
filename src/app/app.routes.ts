import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { AuthGuard } from './services/authgard.service';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: "forgot-password",
    loadComponent : () =>import('./pages/mot-passe-oublie/mot-passe-oublie.component').then(m=>m.MotPasseOublieComponent),

  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.page').then(m => m.ContactPage),
  },
  {
    path: 'userprofile',
    loadComponent: () => import('./pages/userprofile/userprofile.page').then(m => m.UserprofilePage),
    canActivate: [AuthGuard],
  },

  // Dashboard
  {
    path: 'dashboard/activites',
    loadComponent: () => import('./pages/dashboard/activites/activites.page').then(m => m.ActivitesPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/utilisateur',
    loadComponent: () => import('./pages/dashboard/utilisateur/utilisateur.page').then(m => m.UtilisateurPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/reservations',
    loadComponent: () => import('./pages/dashboard/reservation/reservation.component').then(m => m.ReservationComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/installation',
    loadComponent: () => import('./pages/dashboard/installation/installation.page').then(m => m.InstallationPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/creneaux',
    loadComponent: () => import('./pages/dashboard/creneaux/creneaux.page').then(m => m.CreneauxPage),
    canActivate: [AuthGuard],
  },
  {
    path : 'dashboard/adherants',
    loadComponent: () => import('./pages/dashboard/adherant/adherant.component').then(m => m.AdherantComponent),
    canActivate: [AuthGuard],
  },
  // Réservation
  {
    path: 'reservation/activite',
    loadComponent: () => import('./pages/reservation/activite-r/activite-r.page').then(m => m.ActiviteRPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'reservation/date',
    loadComponent: () => import('./pages/reservation/date-r/date-r.page').then(m => m.DateRPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'reservation/creneau',
    loadComponent: () => import('./pages/reservation/creneau-r/creneau-r.page').then(m => m.CreneauRPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'reservation/confirmation',
    loadComponent: () => import('./pages/reservation/confirmation-r/confirmation-r.page').then(m => m.ConfirmationRPage),
  },
  {
    path: 'reservation/home',
    loadComponent: () => import('./pages/reservation/home-r/home-r.page').then(m => m.HomeRPage),
  },
  {
    path: 'reservation/reservation-date',
    loadComponent: () => import('./pages/reservation/reservation-date/reservation-date.page').then(m => m.ReservationDatePage),
  },
  {
    path: 'resultPayement',
    loadComponent: () => import('./pages/reservation/reservation-date/reservation-date.page').then(m => m.ReservationDatePage),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.page').then( m => m.ResetPasswordPage)
  },
  {
    path: 'recompenses',
    loadComponent: () => import('./pages/recompenses/recompenses.page').then( m => m.RecompensesPage)
  },
  {
    path: 'historique-reservation',
    loadComponent: () => import('./pages/historique-reservation/historique-reservation.page').then( m => m.HistoriqueReservationPage),
    canActivate: [AuthGuard],
    
  },
  {
    path: 'historique-participation-evenement',
    loadComponent: () => import('./pages/historique-participation/historique-participation.page').then( m => m.HistoriqueParticipationEvenementPage)
  },

  // 👉 Routes ajoutées pour les services de la page d'accueil
  {
    path: 'equipe',
    loadComponent: () => import('./pages/equipe/equipe.page').then(m => m.EquipePage),
  },
  {
    path: 'evenements',
    loadComponent: () => import('./pages/evenements/evenements.page').then(m => m.EvenementsPage),
  },
  {
    path: 'clubhouse',
    loadComponent: () => import('./pages/clubhouse/clubhouse.page').then(m => m.ClubhousePage),
  },
  {
    path: 'evenements',
    loadComponent: () => import('./pages/evenements/evenements.page').then( m => m.EvenementsPage)
  },
  {
    path: 'equipe',
    loadComponent: () => import('./pages/equipe/equipe.page').then( m => m.EquipePage)
  },
  {
    path: 'clubhouse',
    loadComponent: () => import('./pages/clubhouse/clubhouse.page').then( m => m.ClubhousePage)
  },
  {
    path: 'participe-activite',
    loadComponent: () => import('./pages/participe-activite/participe-activite.page').then( m => m.ParticipeActivitePage)
  },  {
    path: 'statistique-admin',
    loadComponent: () => import('./pages/dashboard/statistique-admin/statistique-admin.page').then( m => m.StatistiqueAdminPage)
  }


];
