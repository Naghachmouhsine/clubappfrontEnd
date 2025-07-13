import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { IonHeader } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-information-reinscription',
  templateUrl: './information-reinscription.component.html',
  styleUrls: ['./information-reinscription.component.scss'],
  imports: [CommonModule, SharedIonicModule, SharedIonicModule,FormsModule,ReactiveFormsModule],
})
export class InformationReinscriptionComponent  {
    typesReinscription = [
        { key: 'couple', label: 'reinscription.types.couple' },
        { key: 'adulte_seul', label: 'reinscription.types.adulte_seul' },
        { key: 'couple_senior', label: 'reinscription.types.couple_senior' },
        { key: 'senior_seul', label: 'reinscription.types.senior_seul' },
        { key: 'etudiant', label: 'reinscription.types.etudiant' },
        { key: 'jeune', label: 'reinscription.types.jeune' },
        { key: 'enfant', label: 'reinscription.types.enfant' },
        { key: 'nounou', label: 'reinscription.types.nounou' }
      ];
  
 typeSelected: string = '';
 @Input() idAdherant=0
  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {}

  // toggleCategory(cat: string) {
  //   if (this.selectedCategories.has(cat)) {
  //     this.selectedCategories.delete(cat);
  //   } else {
  //     this.selectedCategories.add(cat);
  //   }
  // }

  // isChecked(cat: string): boolean {
  //   return this.selectedCategories.has(cat);
  // }

  dismiss(isValid:boolean) {
    this.modalCtrl.dismiss({isValid});
  }

saveConfig() {

  this.http.put('http://localhost:3000/api/reinscription', {idAdherant: this.idAdherant,typeReinscription: this.typeSelected })
    .subscribe({
      next: async () => this.dismiss(true),
      error: async () => this.dismiss(false)
    });
}

}
