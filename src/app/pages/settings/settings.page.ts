import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ChangePasswordModalComponent } from './change-password.modal';
import { EditAccountModalComponent } from './edit-account.modal';
import { ThemeService, ThemeType } from '../../services/theme.service';
import { LangService, LangType } from '../../services/lang.service';
import { ThemeModalComponent } from './theme-modal';
import { LanguageModalComponent } from './language-modal';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [AppHeaderComponent, TranslateModule, CommonModule, FormsModule, IonicModule]
})
export class SettingsPage implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private themeService: ThemeService,
    private langService: LangService
  ) { }

  ngOnInit() {
  }
  async editAccount() {
    const modal = await this.modalCtrl.create({
      component: EditAccountModalComponent,
      breakpoints: [0, 0.7, 1],
      initialBreakpoint: 0.7,
      cssClass: 'modal-rounded'
    });
    await modal.present();
  }
  async changePassword() {
    const modal = await this.modalCtrl.create({
      component: ChangePasswordModalComponent,
      breakpoints: [0, 0.7, 1],
      initialBreakpoint: 0.7,
      cssClass: 'modal-rounded'
    });
    await modal.present();
  }
  async changeTheme() {
    const modal = await this.modalCtrl.create({
      component: ThemeModalComponent,
      cssClass: 'modal-rounded',
      breakpoints: [0, 0.5, 0.7],
      initialBreakpoint: 0.5
    });
    await modal.present();
  }
  async changeLanguage() {
    const modal = await this.modalCtrl.create({
      component: LanguageModalComponent,
      cssClass: 'modal-rounded',
      breakpoints: [0, 0.5, 0.7],
      initialBreakpoint: 0.5
    });
    await modal.present();
  }
  async setTheme(theme: ThemeType) {
    this.themeService.setTheme(theme);
    const toast = await this.toastCtrl.create({
      message: `Thème changé : ${theme}`,
      duration: 1200,
      color: theme === 'dark' ? 'dark' : (theme === 'light' ? 'light' : 'medium')
    });
    toast.present();
  }
  async setLang(lang: LangType) {
    this.langService.setLang(lang);
    const toast = await this.toastCtrl.create({
      message: `Langue changée : ${lang}`,
      duration: 1200,
      color: 'primary'
    });
    toast.present();
  }
  editNotifications() {
    alert('Fonctionnalité à venir : notifications');
  }
  editSecurity() {
    alert('Fonctionnalité à venir : sécurité');
  }
  deleteAccount() {
    alert('Fonctionnalité à venir : suppression du compte');
  }

}
