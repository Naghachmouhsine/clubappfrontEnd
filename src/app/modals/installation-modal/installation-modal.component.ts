import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-installation-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './installation-modal.component.html',
  styleUrls: ['./installation-modal.component.scss'],
})
export class InstallationModalComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | 'detail' = 'add';
  @Input() installationId?: number;
  @Input() installationDetails?: any;

  installationForm!: FormGroup;
  isReadOnly = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.isReadOnly = this.mode === 'detail';

    this.installationForm = this.fb.group({
      nom: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      type: [{ value: '', disabled: this.isReadOnly }, Validators.required],
      capacite: [{ value: '', disabled: this.isReadOnly }, [Validators.required, Validators.min(1)]],
      disponibilite: [{ value: true, disabled: this.isReadOnly }]
    });

    if (this.mode === 'edit' || this.mode === 'detail') {
      this.loadInstallationDetails();
    }
  }

  loadInstallationDetails() {
    const data = this.installationDetails;
    if (data) {
      this.installationForm.patchValue({
        nom: data.nom,
        type: data.type,
        capacite: data.capacite,
        disponibilite: data.disponible?.toLowerCase() === 'oui'
      });
    }
  }

  dismissModal(data: any = null) {
    this.modalCtrl.dismiss(data);
  }

  async submitForm() {
    if (this.installationForm.invalid) return;

    const formData = this.installationForm.getRawValue();
    const body = {
      ...formData,
      disponible: formData.disponibilite ? 'oui' : 'non'
    };

    try {
      if (this.mode === 'add') {
        await this.http.post('http://localhost:3000/api/installations', body).toPromise();
      } else if (this.mode === 'edit' && this.installationId) {
        await this.http.put(`http://localhost:3000/api/installations/${this.installationId}`, body).toPromise();
      }

      const toast = await this.toastCtrl.create({
        message: this.mode === 'add' ? 'Installation ajoutée' : 'Installation mise à jour',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.dismissModal(true);

    } catch (err) {
      const toast = await this.toastCtrl.create({
        message: 'Erreur lors de la sauvegarde',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
