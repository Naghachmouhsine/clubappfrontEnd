import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonDatetime } from "@ionic/angular/standalone";
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';

@Component({
  selector: 'app-date-heure-participation-modal',
  templateUrl: './date-heure-participation-modal.component.html',
  styleUrls: ['./date-heure-participation-modal.component.scss'],
  imports : [SharedIonicModule,CommonModule,FormsModule,ReactiveFormsModule]
})
export class DateHeureParticipationModalComponent implements OnInit {
   creneauForm!: FormGroup;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.creneauForm = this.fb.group({
      date: ['', Validators.required],
      heure_debut: ['', Validators.required]
    });
  }

  validerParticipation() {
    if (this.creneauForm.valid) {
      const { date, heure_debut } = this.creneauForm.value;
      this.modalController.dismiss({
        date,
        time: heure_debut
      });
    } else {
      this.creneauForm.markAllAsTouched();
    }
  }

  annuler() {
    this.modalController.dismiss(null);
  }
}
