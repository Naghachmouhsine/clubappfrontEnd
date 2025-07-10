import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-account-modal',
  standalone: true,
  templateUrl: './edit-account.modal.html',
  styleUrls: ['./edit-account.modal.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule, TranslateModule]
})
export class EditAccountModalComponent {
  accountForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(user);
    this.accountForm = this.fb.group({
      nom: [user.nom || '', [Validators.required]],
      prenom: [user.prenom || '', [Validators.required]],
      email: [user.email || '', [Validators.required, Validators.email]],
      telephone: [user.telephone || '', [Validators.required]],
      profesion: [user.profesion || '']
    });
  }

  async close() {
    await this.modalCtrl.dismiss();
  }

  async submit() {
    this.errorMsg = '';
    if (this.accountForm.invalid) return;
    this.loading = true;
    // Appel API à implémenter ici
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify(this.accountForm.value));
      this.loading = false;
      this.modalCtrl.dismiss({ success: true });
    }, 1200);
  }
}
