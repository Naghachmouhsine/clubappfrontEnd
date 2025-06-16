import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedIonicModule } from 'src/app/shared/shared-ionic.module';

@Component({
  selector: 'app-activite-modal',
  templateUrl: './activite-modal.component.html',
  styleUrls: ['./activite-modal.component.scss'],
  standalone: true,
  imports: [SharedIonicModule, FormsModule, CommonModule, ReactiveFormsModule],
})
export class ActiviteModalComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | 'detail' = 'add';
  @Input() activite: any;

  coaches = [
    { id: 1, nom: 'Alice Dupont' },
    { id: 2, nom: 'Marc Lefèvre' },
    { id: 3, nom: 'Sophie Martin' },
    { id: 4, nom: 'Jean Durand' },
  ]

  activiteForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.activiteForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      coach_assigne: [null, Validators.required],
    });
    if (this.mode === 'detail' || this.mode === 'edit') {
      this.activiteForm.patchValue({
        titre: this.activite.titre,
        description: this.activite.description,
        type: this.activite.type,
        coach_assigné: this.activite.coach_assigné?.id // selon structure
      });
    }
  }

  ngOnInit() {
    // if ((this.mode === 'edit' || this.mode === 'detail') && this.activite?.id) {

    //   this.http.get(`http://localhost:3000/api/activites/${this.activite.id}`).subscribe({
    //     next: (data: any) => {
    //       this.activite = data;

    //       // Remplir le formulaire avec les données reçues
    //       this.activiteForm.patchValue({
    //         titre: this.activite.titre,
    //         description: this.activite.description,
    //         type: this.activite.type,
    //         coach_assigné: this.activite.coach_assigné,
    //       });

    //       if (this.mode === 'detail') {
    //         this.activiteForm.disable();
    //       }
    //     },
    //     error: err => {
    //       console.error('Erreur lors du chargement de l\'activité', err);
    //     }
    //   });
    // } else if (this.mode === 'add') {
    //   // Mode ajout, reset formulaire
    // this.activiteForm.reset();
    // }
  }

  async close(reload = false) {
    await this.modalCtrl.dismiss({ reload });
  }

  submit() {
    if (this.activiteForm.invalid) {
      console.warn('Formulaire invalide');
      return;
    }

    const formData = { ...this.activiteForm.value };

  

    // if (this.mode === 'add') {
    //   this.http.post('http://localhost:3000/api/activites', formData).subscribe({
    //     next: () => this.close(true),
    //     error: (err) => console.error('Erreur ajout activité', err),
    //   });
    // } else if (this.mode === 'edit') {
    //   this.http.put(`http://localhost:3000/api/activites/${this.activite.id}`, formData).subscribe({
    //     next: () => this.close(true),
    //     error: (err) => console.error('Erreur modification activité', err),
    //   });
    // }
  }
}
