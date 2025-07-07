import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonHeader } from "@ionic/angular/standalone";
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';

@Component({
  selector: 'app-edit-adherent-moda',
  templateUrl: './edit-adherent-moda.component.html',
  styleUrls: ['./edit-adherent-moda.component.scss'],
  imports: [SharedIonicModule,CommonModule, FormsModule],
})
export class EditAdherentModalComponent {
  @Input() adherent: any = {};

  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  async save() {
    const payload = {
      ...this.adherent
    };
    console.log(payload)
    try {
      await this.http.put('http://localhost:3000/api/updateTotalPoints/' + this.adherent.id, {totalPoints : payload.totalPoints}).toPromise();
      this.modalCtrl.dismiss({ updated: true });
    } catch (err) {
      console.error('Erreur lors de la mise à jour :', err);
      this.modalCtrl.dismiss({ updated: false });
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

}