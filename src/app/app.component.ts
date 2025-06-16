import { Component } from '@angular/core';
import { IonicModule, MenuController, PopoverController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { ProfileMenuComponent } from './pages/profile-menu/profile-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common'; // <-- à importer



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      if (this.router.url === '/login') {
        this.menuCtrl.enable(false);
      } else {
        this.menuCtrl.enable(true);
      }
    });
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.menuCtrl.close();
  }

  async openProfileMenu(event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: ProfileMenuComponent,
      event: event,
      translucent: true,
    });
    await popover.present();
  }

  logout() {
    console.log('Déconnexion...');
    this.router.navigate(['/login']);
    this.menuCtrl.close();
  }

  isDashboardOpen = false;
  toggleDashboardSubmenu() {
    this.isDashboardOpen = !this.isDashboardOpen;
  }
}
