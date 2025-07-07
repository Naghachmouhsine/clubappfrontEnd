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
        'Couple',
        'Adulte seul',
        'Couple senior',
        'Senior seul',
        'Étudiant',
        'Jeune',
        'Enfant',
        'Nounou'
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
