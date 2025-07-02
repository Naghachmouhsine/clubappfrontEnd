import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonTextarea, IonButton,
    CommonModule, FormsModule
  ]
})
export class ContactPage implements OnInit {

  constructor(private menu: MenuController) { }

  ngOnInit() {
  }

  toggleMenu() {
    this.menu.toggle(); 
  }
  
}
