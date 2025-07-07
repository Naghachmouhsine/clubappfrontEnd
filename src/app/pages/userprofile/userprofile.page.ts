import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, IonicModule, AppHeaderComponent, TranslateModule],
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss']
})
export class UserprofilePage implements OnInit {

  user: any = {};
  loading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userId = JSON.parse(userData).id; 
      if (userId) {
        this.loadUserProfile(userId);
      } else {
        this.errorMessage = 'ID utilisateur introuvable.';
      }
    } else {
      this.errorMessage = 'Utilisateur non connecté.';
    }
  }

  loadUserProfile(userId: number) {
    this.loading = true;
    this.http.get(`http://localhost:3000/api/userprofile/${userId}`)
      .subscribe({
        next: (data) => {
          this.user = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du profil', err);
          this.errorMessage = 'Erreur lors du chargement du profil utilisateur.';
          this.loading = false;
        }
      });
  }

  editProfile() {
    alert('Fonctionnalité à venir : édition du profil');
  }

  deleteProfile() {
    alert('Fonctionnalité à venir : suppression du compte');
  }

  changePassword() {
    alert('Fonctionnalité à venir : changement de mot de passe');
  }

  goBack() {
    window.history.back();
  }

}
