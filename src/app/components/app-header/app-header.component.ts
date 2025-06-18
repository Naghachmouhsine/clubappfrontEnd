
import { IonicModule, MenuController } from '@ionic/angular'; // 👈 Import IonicModule
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true, // Déclare que ce composant est standalone
  imports: [IonicModule], // Import des composants Ionic nécessaires
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  @Input() nomPage='Home'
  constructor(private menuCtrl: MenuController,private route:Router) {} // Injection de MenuController

  toggleMenu() {
    this.menuCtrl.toggle(); // Ouvre ou ferme le menu
  }

  profile(){
    this.route.navigate(['/userprofile'])
  }
  logout(){
     localStorage.removeItem('token');
     localStorage.removeItem("user");
     this.route.navigate(["/login"])
  }
}
