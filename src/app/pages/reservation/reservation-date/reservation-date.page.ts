import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ReservationCService, ReservationData } from 'src/app/services/reservation-c.service';

@Component({
  selector: 'app-reservation-date',
  templateUrl: './reservation-date.page.html',
  styleUrls: ['./reservation-date.page.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule, FormsModule]
})
export class ReservationDatePage implements OnInit {

  reservation: ReservationData = {
    activite: '',
    date: '',
    creneau: '',
    installation: ''
  };

  selectedDate: Date = new Date();
  weekDates: Date[] = [];
  sessions: any[] = [];
  loading = false;

  constructor(private reservationService: ReservationCService) {}

  ngOnInit() {
    this.reservation = this.reservationService.getReservation();
    this.generateWeekDates();
    this.loadSessionsForDate(this.selectedDate);
  }

  generateWeekDates() {
    const today = new Date();
    this.weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() + i);
      return d;
    });
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.loadSessionsForDate(date);
  }

  prevDates() {
    this.shiftDates(-7);
  }

  nextDates() {
    this.shiftDates(7);
  }

  shiftDates(days: number) {
    this.weekDates = this.weekDates.map(date => {
      const d = new Date(date);
      d.setDate(d.getDate() + days);
      return d;
    });
    this.selectDate(this.weekDates[0]);
  }

  loadSessionsForDate(date: Date) {
    this.loading = true;
    const dateString = date.toISOString().split('T')[0];
    this.reservation.date = dateString;

    this.reservationService.getCreneauxDisponibles(this.reservation.activite, dateString)
      .subscribe({
        next: (data) => {
          this.sessions = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des créneaux :', err);
          this.sessions = [];
          this.loading = false;
        }
      });
  }
}
