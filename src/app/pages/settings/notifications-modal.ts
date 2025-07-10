import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications-modal',
  standalone: true,
  templateUrl: './notifications-modal.html',
  styleUrls: ['./notifications-modal.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule, TranslateModule]
})
export class NotificationsModalComponent implements OnInit {
  notificationsForm: FormGroup;
  loading = false;
 
  constructor(
    private fb: FormBuilder, 
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    // Récupérer les préférences depuis localStorage
    const savedPrefs = JSON.parse(localStorage.getItem('notificationPrefs') || '{}');
    
    this.notificationsForm = this.fb.group({
      emailNotifications: [savedPrefs.emailNotifications ?? true],
      pushNotifications: [savedPrefs.pushNotifications ?? true],
      reservationConfirmation: [savedPrefs.reservationConfirmation ?? true],
      eventReminders: [savedPrefs.eventReminders ?? true],
      promotionalEmails: [savedPrefs.promotionalEmails ?? false],
      weeklyNewsletter: [savedPrefs.weeklyNewsletter ?? false],
      maintenanceAlerts: [savedPrefs.maintenanceAlerts ?? true]
    });
  }

  ngOnInit() {}

  async close() {
    await this.modalCtrl.dismiss();
  }

  async submit() {
    this.loading = true;
    
    try {
      // Sauvegarder les préférences localement
      const preferences = this.notificationsForm.value;
      localStorage.setItem('notificationPrefs', JSON.stringify(preferences));
      
      // TODO: Appel API pour sauvegarder sur le serveur
      // await this.settingsService.updateNotificationPreferences(preferences);
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const toast = await this.toastCtrl.create({
        message: 'Préférences de notifications mises à jour avec succès',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
      
      await this.modalCtrl.dismiss({ success: true });
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Erreur lors de la mise à jour des préférences',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    } finally {
      this.loading = false;
    }
  }
}