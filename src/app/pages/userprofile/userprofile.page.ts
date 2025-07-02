import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, IonicModule, AppHeaderComponent, TranslateModule],
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

  editProfile() {
    // À implémenter : ouvrir une modale ou naviguer vers une page d'édition
    alert('Fonctionnalité à venir : édition du profil');
  }

  changePassword() {
    // À implémenter : ouvrir une modale ou naviguer vers une page de changement de mot de passe
    alert('Fonctionnalité à venir : changement de mot de passe');
  }

  deleteAccount() {
    // À implémenter : confirmation puis suppression du compte
    alert('Fonctionnalité à venir : suppression du compte');
  }

}
