import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-creneau-r',
  templateUrl: './creneau-r.page.html',
  styleUrls: ['./creneau-r.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CreneauRPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
