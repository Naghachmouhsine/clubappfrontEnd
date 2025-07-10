import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';
import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { ChartsModule } from './chart.module';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-statistique-admin',
  templateUrl: './statistique-admin.page.html',
  styleUrls: ['./statistique-admin.page.scss'],
  imports: [SharedIonicModule, CommonModule, FormsModule, AppHeaderComponent, ChartsModule]
})
export class StatistiqueAdminPage implements OnInit {

  stats = {
    adherents: 0,
    coachs: 0,
    reservations: 0,
    evenements: 0,
    activites : 0
  };

  public barChartLabels: string[] = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Réservations',
        data: [],
        backgroundColor: '#4880ff',
      },
    ],
  };

// public doughnutChartData: ChartData<'doughnut'> = {
//   labels: [],
//   datasets: [{
//     data: [],
//     backgroundColor: ['#2dd36f', '#ffc409', '#eb445a'], // confirmée, en attente, annulée
//   }]
// };

// public doughnutChartOptions: ChartOptions<'doughnut'> = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: { position: 'bottom' }
//   }
// };

 title = 'ng2-charts-demo';

  public doughnutChartLabels: string[] = [  ];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
      { data: [  ], label: 'Repartition des status' },
    ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false
  };


  constructor(private http: HttpClient, private route: Router) { }
  ngOnInit() {
    this.getNbrTotalReservation()
    this.getNbrTotalAdherant()
    this.loadReservationsParMois()
    this.getNbrParticipationEvenement()
    this.getNbrParticipationActivite()
    this.loadStatutsReservations()
  }

  navigateTo(route: string) {
    this.route.navigate([route])
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
loadStatutsReservations() {
 this.http.get<{ labels: string[], data: number[] }>('http://localhost:3000/api/statistique/statutsReservations')
    .subscribe({
      next: res => {
        console.log(res)
        this.doughnutChartLabels=res.labels
        this.doughnutChartDatasets[0].data=res.data
      },
      error: err => console.error('Erreur chargement stats :', err)
    });
}


  loadReservationsParMois() {
    this.http.get<any>('http://localhost:3000/api/statistique/reservationsParMois').subscribe({
      next: (res) => {
        this.barChartLabels = res.labels;
        this.barChartData = {
          labels: res.labels,
          datasets: [
            {
              label: 'Réservations',
              data: res.data,
              backgroundColor: '#3880ff',
            },
          ],
        };
      },
      error: (err) => console.error('Erreur chargement graphique:', err)
    });
  }
  getNbrTotalReservation() {
    this.http.get<any>('http://localhost:3000/api/statistique/totaleReservation').subscribe({
      next: res => {
        console.log(res)
        this.stats.reservations = res.nbrTotale
      },
      error: err => {

      }
    });
  }

  getNbrTotalAdherant() {
    this.http.get<any>('http://localhost:3000/api/statistique/totaleAdherent').subscribe({
      next: res => {
        console.log(res)
        this.stats.adherents = res.nbrAdherent
      },
      error: err => {

      }
    });
  }

  getNbrParticipationEvenement() {
    this.http.get<any>('http://localhost:3000/api/statistique/totaleParticipationEvenement').subscribe({
      next: res => {
        console.log(res)
        this.stats.evenements = res.nbrParticipationEvenement
      },
      error: err => {

      }
    });
  }

    getNbrParticipationActivite() {
    this.http.get<any>('http://localhost:3000/api/statistique/totaleParticipationActivite').subscribe({
      next: res => {
        console.log(res)
        this.stats.activites = res.nbrParticipationActivte
      },
      error: err => {

      }
    });
  }
}
