declare var paypal: any;

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ReservationCService, ReservationData } from 'src/app/services/reservation-c.service';
import { ToastController } from '@ionic/angular';
import { LoginPage } from '../../login/login.page';
import { InformationReservationModalComponent } from 'src/app/modals/nbr-installation-modal/information-reservation-modal.component';
import { AppHeaderComponent } from '../../../components/app-header/app-header.component';
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
  token = ""
  user: any = {}

  loading = false;

  constructor(private reservationService: ReservationCService,
    private modal: ModalController,
    private toastController: ToastController,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.token = localStorage.getItem('token') || "";
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.route.queryParams.subscribe(params => {
      if (params['status']) {
        const status = params['status'];
        if(params['idRes']){
          const idRes=params["idRes"] //idReservation pour modifier etat reservation en confirme si status payement succus
          let etatReservation="en attente"
          if (status === 'success') {
          // this.presentToast("Votre paiement a été enregistré avec succès.", "success");
          etatReservation="confirmée"
          this.presentToast("Votre réservation a été enregistrée", 'success')
           this.reservationService.updateStatus(idRes,etatReservation).subscribe({
      next: (res) => this.presentToast("Votre réservation a été enregistrée", 'success'),
      error: err => console.error('Erreur mise à jour statut :', err)
    });
        } else if (status === 'cancel') {
          this.presentToast("Le paiement a été annulé par l'utilisateur.", "danger");
        } else {
          this.presentToast("Statut de paiement inconnu. Veuillez réessayer.", "danger");
        }
        }
 
      } if (params["activiter"]) {
        this.reservation.activite = params["activiter"]
      }
    });


    // this.reservation = this.reservationService.getReservation();
    this.generateWeekDates();
    // this.loadSessionsForDate(this.selectedDate);
    this.loadSession(); //charger tout les creneaux disponible pour un ativites 

  }

    async reservervation(session: any) { // processus de reservation cote frontEnd
    if (!this.token) { // verfier la connextion user
      const loginResult = await this.loginModal();
      if (!loginResult || !loginResult.loginValide) return;
      this.token = loginResult.token;
      this.user = loginResult.user;
    }

    const infoResult = await this.openModalConfirmerReservation(session);
    // if (!infoResult || !infoResult.valid) return;*   
    const reservation = {
      "id_installation": session.id_installation,
      "nbr_installation_reserver": session.nbr - infoResult.nombre_installations,//modification nombre d'installation apres reservation
      "id_utilisateur": this.user.id,
      "id_creneau": session.id,
      "nbr_personn": infoResult.nombre_personne,
      "statut": "en attente", // par defaut en attente
      "infoReservation": "reservation test",
      "activite": this.reservation.activite
    }
    const payResult = await this.openModalPyement(); // modal pour choisir user la methode de payement
    if (payResult) {
      if (payResult.method === "stripe")
        this.stripPayement(reservation)
      if(payResult.method==="paypal")
        this.paypalePayement(reservation)
    }
    if (payResult && payResult.method === 'cache') {
      this.reserver(reservation)
    }
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


  async stripPayement(reservation:any) {
    const stripe = await loadStripe('pk_test_51RbpAT01dh9aAuAOVBYaFOAre88uGrhqLCIivOCjR3s4SVkYW7foe8gIJsN9G82LtIlmoLUj1C3Qa5Fm5ugGXK3c001ntOZj4j');
    this.reserver(reservation, stripe)
  }

async paypalePayement(reservation:any) {

 const amount=12
 console.log(1)
  // 1. Créer une commande PayPal via backend
  const response = await this.http.post<any>('http://localhost:3000/api/create-paypal-order', { amount }).toPromise();
 console.log(2)

  // 2. Intégrer le bouton PayPal dans le DOM (par exemple via modal ou div dédiée)
  paypal.Buttons({
    createOrder: () => {
      return response.orderID;
    },
    onApprove: async (data: any, actions: any) => {
      // 3. Capturer la commande
      const capture = await this.http.post<any>('http://localhost:3000/api/capture-paypal-order', {
        orderID: data.orderID
      }).toPromise();

      console.log("✅ Paiement capturé :", capture);
   
      this.reserver(reservation);
    },
    onError: (err: any) => {
      console.error("❌ Erreur de paiement PayPal :", err);
    }
  }).render("#paypal-button-container");
}


  // async openModalPyement(){
  //   const modal = await this.modal.create({
  //     component: MethodPayementComponent
  //   });
  //   modal.onDidDismiss().then((result) => {
  //     console.log(result)
  //     if(result.data && result.data.isValide){

  //         if (result.data.method=== 'stripe') {
  //           this.stripPayement()

  //         } else if (result.data.method === 'paypal') {

  //         } else if (result.data.method=== 'cmi') {

  //         }else if(result.data.method="cache"){

  //         }
  //     }

  //   });
  //   return await modal.present();
  // }

  // async openModalConfirmerReservation(reservation: any) {
  //   if (this.token) // verfier si l'adherant est connecté
  //         this.loginModal()
  //   const modal = await this.modal.create({
  //     component: InformationReservationModalComponent,
  //     componentProps: { nbrMax: reservation.nbr, nombre_personne : reservation.capacite},
  //     cssClass: 'custom-modal-size'
  //   });
  //   modal.onDidDismiss().then((result) => {

  //     if (result.data) {

  //     }
  //   });
  //   return await modal.present();
  // }
  async openModalPyement(): Promise<any> {
    const modal = await this.modal.create({
      component: MethodPayementComponent
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    return data;
  }
  async openModalConfirmerReservation(session: any) {
    const modal = await this.modal.create({
      component: InformationReservationModalComponent,
      componentProps: {
        nbrMax: session.nbr,
        nombre_personne: session.capacite
      },
      cssClass: 'custom-modal-size'
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    return data;
  }

 
  async loginModal(): Promise<any> {
    const modal = await this.modal.create({
      component: LoginPage,
      componentProps: { isModal: true }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    return data;
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

  reserver(reservation: any, stripe: any = NaN) {
    this.reservationService.reserver(reservation).subscribe({
      next: (response) => {
        console.log(response)
        reservation.id=response.id
        console.log(reservation)
        if (stripe) {
          this.http.post<{ id: string }>('http://localhost:3000/api/payementStripe', { reservation })
            .subscribe(async (res) => {
              await stripe?.redirectToCheckout({ sessionId: res.id.toString() });
            });
        }
        else
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
