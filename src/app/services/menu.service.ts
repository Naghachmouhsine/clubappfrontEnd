import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private openMenuSource = new Subject<void>();
  openMenu$ = this.openMenuSource.asObservable();

  constructor(private menuCtrl: MenuController) {}

  triggerOpenMenu(menuId: string = 'main-content') {
    console.log('Attempting to toggle menu with ID:', menuId); // Débogage
    this.menuCtrl.toggle(menuId).then(() => {
      console.log('Menu toggled successfully');
    }).catch(err => {
      console.error('Error toggling menu:', err); // Capture les erreurs
    });
    this.openMenuSource.next();
  }
}