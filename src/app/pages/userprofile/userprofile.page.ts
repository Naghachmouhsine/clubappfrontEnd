import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // Assurez-vous d'importer IonicModule
import { CommonModule } from '@angular/common';  // Importez CommonModule pour les fonctionnalités de base d'Angular

@Component({
  selector: 'app-userprofile',
  standalone: true,  // Assurez-vous que le composant est standalone
  imports: [CommonModule, IonicModule],  // Ajoutez IonicModule ici
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss']
})
export class UserprofilePage implements OnInit {

  user = {
    name: 'John Smith',
    email: 'test@gmail.com',
    phone: '987 654 3210',
    skills: [
      { name: 'Web Applications', percentage: 85 },
      { name: 'Website Design', percentage: 78 },
      { name: 'Automation & Testing', percentage: 47 },
      { name: 'UI/UX', percentage: 65 }
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
