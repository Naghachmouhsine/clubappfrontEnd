import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AppHeaderComponent } from "../components/app-header/app-header.component";
import { CommonModule } from '@angular/common';
import { SharedIonicModule } from '../shared/shared-ionic.module';

@Component({
  selector: 'app-home',
  // imports : [CommonModule,SharedIonicModule],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonContent,AppHeaderComponent],
})
export class HomePage {
  constructor() {}
}
