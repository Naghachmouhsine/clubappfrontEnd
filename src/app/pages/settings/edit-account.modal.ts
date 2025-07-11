import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

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
  user: any;
  constructor(private fb: FormBuilder, private modalCtrl: ModalController, private serviceAuth: AuthService, private http: HttpClient) {
    this.serviceAuth.userConnecter$.subscribe(userConnecter => {
      this.user = userConnecter
    })
    console.log(this.user);
    this.accountForm = this.fb.group({
      nom: [this.user.nom || '', [Validators.required]],
      prenom: [this.user.prenom || '', [Validators.required]],
      email: [this.user.email || '', [Validators.required, Validators.email]],
      telephone: [this.user.telephone || '', [Validators.required]],
      profesion: [this.user.profesion || ''],
      date_naissance: [this.formatDateForInput(this.user.date_naissance) || '', [Validators.required]]
    });
  }

  async close() {
    await this.modalCtrl.dismiss();
  }
  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }
  async submit() {
    console.log(this.accountForm.value)
    this.errorMsg = '';
    if (this.accountForm.invalid) return;
    this.loading = true;
    const updatedData = this.accountForm.value;
    this.http.put(`http://localhost:3000/api/utilisateurs/${this.user.id}`, this.accountForm.value)
      .subscribe({
        next: () => {
          this.modalCtrl.dismiss(true);
          this.loading = false;
          const updatedUser = { ...this.user, ...updatedData };
          this.serviceAuth.setUser(updatedUser); 
        },
        error: (err) => {
          console.error(err);
          this.loading = false

          this.errorMsg = 'Une erreur est survenue lors de la mise à jour.'; // Tu peux aussi traduire ce message
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}
