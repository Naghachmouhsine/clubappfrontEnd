import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  templateUrl: './change-password.modal.html',
  styleUrls: ['./change-password.modal.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule, TranslateModule]
})
export class ChangePasswordModalComponent {
  passwordForm: FormGroup;
  hideOld = true;
  hideNew = true;
  hideConfirm = true;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  async close() {
    await this.modalCtrl.dismiss();
  }

  async submit() {
    this.errorMsg = '';
    if (this.passwordForm.invalid) return;
    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.errorMsg = 'settings.passwords_no_match';
      return;
    }
    this.loading = true;
    // Appel API à implémenter ici
    setTimeout(() => {
      this.loading = false;
      this.modalCtrl.dismiss({ success: true });
    }, 1200);
  }
}
