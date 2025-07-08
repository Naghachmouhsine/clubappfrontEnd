import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonHeader, IonInput } from "@ionic/angular/standalone";
import { SharedIonicModule } from '../shared/shared-ionic.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-evenement-modal',
  templateUrl: './evenement-modal.component.html',
  styleUrls: ['./evenement-modal.component.scss'],
  imports : [SharedIonicModule,CommonModule,FormsModule]
})
export class EvenementModalComponent {
  @Input() evenement = { nom: '', description: '', date: '', lieu: '' };
  @Input() isEdit = false;

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submitForm() {
    this.modalCtrl.dismiss(this.evenement); // renvoie l'événement au parent
  }
}
