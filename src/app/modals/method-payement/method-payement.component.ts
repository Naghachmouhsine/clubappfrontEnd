import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-method-payement',
  imports : [CommonModule,SharedIonicModule,FormsModule],
  templateUrl: './method-payement.component.html',
  styleUrls: ['./method-payement.component.scss'],
})
export class MethodPayementComponent {

   methode: string = ''; 

  constructor(private router: Router,private modalCtrl:ModalController) {}

  // payer() {
  //   if (!this.methode) {
  //     alert('Veuillez sélectionner une méthode de paiement.');
  //     return;
  //   }
  //   console.log(this.methode)
  // }
  async close(isValide:boolean) {
    await this.modalCtrl.dismiss({isValide:isValide,method:this.methode});
  }


}
