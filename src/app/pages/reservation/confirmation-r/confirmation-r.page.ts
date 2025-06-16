import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-confirmation-r',
  templateUrl: './confirmation-r.page.html',
  styleUrls: ['./confirmation-r.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ConfirmationRPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
