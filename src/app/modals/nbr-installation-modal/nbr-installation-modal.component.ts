import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';

@Component({
  selector: 'app-nbr-installation-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, SharedIonicModule,FormsModule,ReactiveFormsModule],
  templateUrl: './nbr-installation-modal.component.html',
  styleUrls: ['./nbr-installation-modal.component.scss'],
})
export class NbrInstallationModalComponent implements OnInit {
  // @Input() mode = 'add';
  @Input() nbrMax=20;// nombre maximale qui doit user ne pas depaaser

  nbrForm!: FormGroup;

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.nbrForm = this.fb.group({
      nombre_installations: [1, [Validators.required, Validators.min(1),Validators.max(this.nbrMax)]],
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  submit() {
    if (this.nbrForm.valid) {
      this.modalCtrl.dismiss(this.nbrForm.value);
    }
  }
}
