
import { IonicModule, MenuController } from '@ionic/angular'; // 👈 Import IonicModule
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true, // Déclare que ce composant est standalone
  imports: [IonicModule], // Import des composants Ionic nécessaires
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {

  constructor(private menuCtrl: MenuController) {} // Injection de MenuController

  toggleMenu() {
    this.menuCtrl.toggle(); // Ouvre ou ferme le menu
  }
}
