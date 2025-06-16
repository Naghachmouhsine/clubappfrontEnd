import { Component, OnInit } from '@angular/core';
import { DateService, DateSlot } from '../../../services/date.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-date-r',
  templateUrl: './date-r.page.html',
  styleUrls: ['./date-r.page.scss'],
  standalone:true,
    imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]

})
export class DateRPage implements OnInit {
  activites: any[] = [];
  datesDisponibles: string[] = [];
  creneauxDisponibles: any[] = [];

  activiteSelectionnee: any = null;
  dateSelectionnee: string = '';
  creneauSelectionne: any = null;

  options = {}; // options spécifiques, ex: { coursPrive: true }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.chargerActivites();
  }

  chargerActivites() {
    this.http.get('/api/activites').subscribe((data: any) => {
      this.activites = data;
    });
  }

  onActiviteChange() {
    this.dateSelectionnee = '';
    this.creneauxDisponibles = [];
    //this.courPrive = false; // reset options
    if (!this.activiteSelectionnee) return;
    this.http.get(`/api/activites/${this.activiteSelectionnee.id}/dates`).subscribe((dates: any) => {
      this.datesDisponibles = dates;
    });
  }

  onDateChange() {
    this.creneauxDisponibles = [];
    if (!this.dateSelectionnee || !this.activiteSelectionnee) return;
    this.http.get(`/api/activites/${this.activiteSelectionnee.id}/dates/${this.dateSelectionnee}/creneaux`).subscribe((creneaux: any) => {
      this.creneauxDisponibles = creneaux;
    });
  }

  reserver() {
    if (!this.activiteSelectionnee || !this.dateSelectionnee || !this.creneauSelectionne) {
      alert('Veuillez sélectionner tous les champs');
      return;
    }
    const reservation = {
      utilisateurId: 123, // récupère ID utilisateur connecté
      activiteId: this.activiteSelectionnee.id,
      date: this.dateSelectionnee,
      creneauId: this.creneauSelectionne.id,
      options: this.options
    };
    this.http.post('/api/reservations', reservation).subscribe(() => {
      alert('Réservation réussie !');
      // reset form
      this.activiteSelectionnee = null;
      this.dateSelectionnee = '';
      this.creneauSelectionne = null;
      this.options = {};
    }, () => {
      alert('Erreur lors de la réservation');
    });
  }
}