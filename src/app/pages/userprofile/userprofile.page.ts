import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // Assurez-vous d'importer IonicModule
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from "../../components/app-header/app-header.component";  // Importez CommonModule pour les fonctionnalités de base d'Angular

@Component({
  selector: 'app-userprofile',
  standalone: true,  // Assurez-vous que le composant est standalone
  imports: [CommonModule, IonicModule, AppHeaderComponent],  // Ajoutez IonicModule ici
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss']
})
export class UserprofilePage implements OnInit {

 user: any = {};

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
    console.log(this.user)
  }

}
