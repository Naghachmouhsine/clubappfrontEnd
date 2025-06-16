import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { MenuController } from '@ionic/angular';
import { AppHeaderComponent } from "../../components/app-header/app-header.component";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, CommonModule, FormsModule, AppHeaderComponent]
})
export class ContactPage implements OnInit {

  constructor(private menu: MenuController) { }

  ngOnInit() {
  }

  toggleMenu() {
    this.menu.toggle(); 
  }
  
}
