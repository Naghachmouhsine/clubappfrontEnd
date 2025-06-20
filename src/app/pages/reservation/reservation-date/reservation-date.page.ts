import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ReservationCService, ReservationData } from 'src/app/services/reservation-c.service';
import { ToastController } from '@ionic/angular';
import { LoginPage } from '../../login/login.page';
import { InformationReservationModalComponent } from 'src/app/modals/nbr-installation-modal/information-reservation-modal.component';
import { AppHeaderComponent } from "../../../components/app-header/app-header.component";
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MethodPayementComponent } from 'src/app/modals/method-payement/method-payement.component';
@Component({
  selector: 'app-reservation-date',
  templateUrl: './reservation-date.page.html',
  styleUrls: ['./reservation-date.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, AppHeaderComponent]
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
  sessions: any[] = []; //tout les crenaux
  sessionsByDate: any[] = []; //les crenaux filitre par date


  loading = false;

  constructor(private reservationService: ReservationCService,
    private modal: ModalController,
    private toastController: ToastController,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(token)
    console.log(user)
    this.route.queryParams.subscribe(params => {
      const status = params['status'];
    if(params['status']){
      if (status === 'success') {
        this.presentToast("Votre paiement a été enregistré avec succès.", "success");
      } else if (status === 'cancel') {
        this.presentToast("Le paiement a été annulé par l'utilisateur.", "danger");
      } else {
        this.presentToast("Statut de paiement inconnu. Veuillez réessayer.", "danger");
      }
    }if(params["activiter"]){
      this.reservation.activite=params["activiter"]
    }
    });


    // this.reservation = this.reservationService.getReservation();
    this.generateWeekDates();
    // this.loadSessionsForDate(this.selectedDate);
    this.loadSession(); //charger tout les creneaux disponible pour un ativites 

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
    console.log(date)
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

  async stripPayement() {
    const stripe = await loadStripe('pk_test_51RbpAT01dh9aAuAOVBYaFOAre88uGrhqLCIivOCjR3s4SVkYW7foe8gIJsN9G82LtIlmoLUj1C3Qa5Fm5ugGXK3c001ntOZj4j');

    this.http.post<{ id: string }>('http://localhost:3000/api/payementStrip', { montant: 200, infoReservation: 'test' })
      .subscribe(async (res) => {
        await stripe?.redirectToCheckout({ sessionId: res.id.toString() });
      });
  }

  async openModalPyement(){
    const modal = await this.modal.create({
      component: MethodPayementComponent
    });
    modal.onDidDismiss().then((result) => {
      console.log(result)
      if(result.data && result.data.isValide){
    
          if (result.data.method=== 'stripe') {
            this.stripPayement()
            
          } else if (result.data.method === 'paypal') {
           
          } else if (result.data.method=== 'cmi') {
           
          }
      }

    });
    return await modal.present();
  }

  async opemModalInformationReservation(reservation: any) {
    const modal = await this.modal.create({
      component: InformationReservationModalComponent,
      componentProps: { nbrMax: reservation.nbr },
      cssClass: 'custom-modal-size'
    });
    modal.onDidDismiss().then((result) => {
      console.log(result)
      if (result.data) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log(user)
        this.openModalPyement()
        if (!token) // verfier si l'adherant est connecté
          this.loginModal(reservation, result.data.nombre_installations)
        else // adhrerant deja connecter
          this.reserver(reservation, user.id, result.data.nombre_installations)
      }
    });
    return await modal.present();
  }

  async loginModal(reservation: any, nbrDinstallation: number) { // doit faire la connexion pour reserver


    const modal = await this.modal.create({
      component: LoginPage,
      componentProps: { isModal: true }
    });
    modal.onDidDismiss().then((result) => {
      console.log(result)
      if (result.data && result.data.loginValide) {
        this.reserver(reservation, result.data.user.id, nbrDinstallation)
      }
    });
    return await modal.present();
  }

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }
  loadSessionsForDate(date: Date) { //charger tout les creneaux disponible pour un ativites dans un date specefique (selectionner par user)
    this.loading = true;
    const dateString = date.toISOString().split('T')[0];
    // this.reservation.date = dateString;

    // this.reservationService.getCreneauxDisponibles(this.reservation.activite, dateString)
    //   .subscribe({
    //     next: (data) => {
    //       this.sessions=data
    //       this.loading = false;
    //     },
    //     error: (err) => {
    //       console.error('Erreur lors du chargement des créneaux :', err);
    //       this.sessions = [];
    //       this.loading = false;
    //     }
    //   });
    console.log("selected")
    console.log(this.sessions)
    console.log(dateString)
    this.sessionsByDate = this.sessions.filter(s => s.date == dateString)
    console.log(this.sessionsByDate)


  }

  loadSession() { //charger tout les creneaux disponible pour un ativites 
    this.loading = true;

    this.reservationService.getCreneauxDisponiblesByActivite(this.reservation.activite)
      .subscribe({
        next: (data) => {
          this.sessions = data.map(s => ({
            ...s,
            date: new Date(s.date).toISOString().split('T')[0] //  "YYYY-MM-DD"
          }));
          this.sessionsByDate = this.sessions;
          this.loading = false;
          console.log(data)
        },
        error: (err) => {
          console.error('Erreur lors du chargement des créneaux :', err);
          this.sessions = [];
          this.loading = false;
        }
      });
  }


  reserver(session: any, adherantId: number, nbrDinstallation: number) {
    const reservation = {
      "id_installation": session.id_installation,
      "nbr_installation_reserver": session.nbr - nbrDinstallation,//modification nombre d'installation apres reservation
      "id_utilisateur": adherantId, //doit remplacer par id user authentifier
      "id_creneau": session.id,
      "statut": "en attente"  // par defaut en attente
    }
    this.reservationService.reserver(reservation).subscribe({
      next: (response) => {
        console.log(response)
        // alert("Votre réservation a été enregistrée.")
        this.presentToast("Votre réservation a été enregistrée", 'success')
        this.loadSession()
      },
      error: (err) => {
        console.error("Erreur lors de la réservation :", err);
        // alert("La réservation n'a pas pu être effectuée. Veuillez réessayer.")
        this.presentToast("La réservation n'a pas pu être effectuée. Veuillez réessayer.", 'danger')

      }
    });
  }
  getIconName(installation: string): string {
    switch (installation.toLowerCase()) {
      case 'foot':
        return 'football-outline';
      case 'tennis':
        return 'tennisball-outline';
      case 'basket':
        return 'basket-outline';
      case 'piscine':
        return 'water-outline';
      case 'musculation':
        return 'barbell-outline';
      default:
        return 'location-outline'
    }
  }

}
