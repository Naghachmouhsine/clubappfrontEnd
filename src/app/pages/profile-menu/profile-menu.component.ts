import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedIonicModule } from '../../shared/shared-ionic.module';


@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [
    SharedIonicModule
  ],
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    console.log('Déconnexion...');
    this.router.navigate(['/login']);
  }
}
