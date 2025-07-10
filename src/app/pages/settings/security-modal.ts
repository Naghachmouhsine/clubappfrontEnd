import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-security-modal',
  standalone: true,
  templateUrl: './security-modal.html',
  styleUrls: ['./security-modal.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule, TranslateModule]
})
export class SecurityModalComponent implements OnInit {
  securityForm: FormGroup;
  loading = false;
  twoFactorEnabled = false;
  loginHistory: any[] = [];
  securityQuestions = [
    { id: 1, question: 'Quel est le nom de votre premier animal de compagnie ?' },
    { id: 2, question: 'Dans quelle ville êtes-vous né(e) ?' },
    { id: 3, question: 'Quel est le nom de jeune fille de votre mère ?' },
    { id: 4, question: 'Quel était le nom de votre école primaire ?' },
    { id: 5, question: 'Quel est votre plat préféré ?' }
  ];

  constructor(
    private fb: FormBuilder, 
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    // Récupérer les paramètres de sécurité depuis localStorage
    const savedSecurity = JSON.parse(localStorage.getItem('securitySettings') || '{}');
    this.twoFactorEnabled = savedSecurity.twoFactorEnabled || false;
    
    this.securityForm = this.fb.group({
      twoFactorAuth: [this.twoFactorEnabled],
      securityQuestion1: [savedSecurity.securityQuestion1 || ''],
      securityAnswer1: [savedSecurity.securityAnswer1 || '', Validators.required],
      securityQuestion2: [savedSecurity.securityQuestion2 || ''],
      securityAnswer2: [savedSecurity.securityAnswer2 || '', Validators.required],
      loginNotifications: [savedSecurity.loginNotifications ?? true],
      sessionTimeout: [savedSecurity.sessionTimeout || 30]
    });
    
    // Simuler l'historique de connexion
    this.loginHistory = [
      { date: new Date(), device: 'Chrome - Windows', location: 'Fès, Maroc', status: 'success' },
      { date: new Date(Date.now() - 86400000), device: 'Safari - iPhone', location: 'Fès, Maroc', status: 'success' },
      { date: new Date(Date.now() - 172800000), device: 'Firefox - Windows', location: 'Rabat, Maroc', status: 'failed' }
    ];
  }

  ngOnInit() {}

  async close() {
    await this.modalCtrl.dismiss();
  }

  async toggleTwoFactor() {
    if (!this.twoFactorEnabled) {
      const alert = await this.alertCtrl.create({
        header: 'Activer l\'authentification à deux facteurs',
        message: 'Vous recevrez un code par SMS à chaque connexion. Voulez-vous continuer ?',
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel'
          },
          {
            text: 'Activer',
            handler: () => {
              this.twoFactorEnabled = true;
              this.securityForm.patchValue({ twoFactorAuth: true });
              this.showToast('Authentification à deux facteurs activée', 'success');
            }
          }
        ]
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Désactiver l\'authentification à deux facteurs',
        message: 'Cela réduira la sécurité de votre compte. Êtes-vous sûr ?',
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel'
          },
          {
            text: 'Désactiver',
            handler: () => {
              this.twoFactorEnabled = false;
              this.securityForm.patchValue({ twoFactorAuth: false });
              this.showToast('Authentification à deux facteurs désactivée', 'warning');
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async clearLoginHistory() {
    const alert = await this.alertCtrl.create({
      header: 'Effacer l\'historique',
      message: 'Voulez-vous vraiment effacer tout l\'historique de connexion ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Effacer',
          handler: () => {
            this.loginHistory = [];
            this.showToast('Historique de connexion effacé', 'success');
          }
        }
      ]
    });
    await alert.present();
  }

  async submit() {
    if (this.securityForm.invalid) {
      this.showToast('Veuillez remplir tous les champs requis', 'danger');
      return;
    }

    this.loading = true;
    
    try {
      // Sauvegarder les paramètres de sécurité localement
      const securitySettings = {
        ...this.securityForm.value,
        twoFactorEnabled: this.twoFactorEnabled
      };
      localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
      
      // TODO: Appel API pour sauvegarder sur le serveur
      // await this.settingsService.updateSecuritySettings(securitySettings);
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.showToast('Paramètres de sécurité mis à jour avec succès', 'success');
      await this.modalCtrl.dismiss({ success: true });
    } catch (error) {
      await this.showToast('Erreur lors de la mise à jour des paramètres', 'danger');
    } finally {
      this.loading = false;
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  getStatusColor(status: string): string {
    return status === 'success' ? 'success' : 'danger';
  }

  getStatusIcon(status: string): string {
    return status === 'success' ? 'checkmark-circle' : 'close-circle';
  }
}