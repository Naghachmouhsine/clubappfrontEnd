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

  coaches :any[]=[]
  installation :any[]=[]

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
      installation: [null, Validators.required],
    });
    if (this.mode === 'detail' || this.mode === 'edit') {
      this.activiteForm.patchValue({
        titre: this.activite.titre,
        description: this.activite.description,
        type: this.activite.type,
        coach_assigné: this.activite.coach_assigné?.id, // selon structure
        installation: this.activite.installation?.id
      });
    }
  }

  ngOnInit() {
      this.getCoaches();
      this.getInstallation()
    if ((this.mode === 'edit' || this.mode === 'detail') && this.activite?.id) {
    } else if (this.mode === 'add') {
      // Mode ajout, reset formulaire
    this.activiteForm.reset();
    }
  }

  async close(reload = false) {
    await this.modalCtrl.dismiss({ reload });
  }
  getCoaches() {
    try {
    
      this.http.get<any>('http://localhost:3000/api/coaches').subscribe({
        next: (data) => {this.coaches = data;console.log(this.coaches)},
        error: (err) => console.error(err)
      });

    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  }
  getInstallation() {
    try {
    
      this.http.get<any>('http://localhost:3000/api/installation').subscribe({
        next: (data) => {this.installation = data;},
        error: (err) => console.error(err)
      });

    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  }
  submit() {
    if (this.activiteForm.invalid) {
      console.warn('Formulaire invalide');
      return;
    }

    const formData = { ...this.activiteForm.value };

    console.log(formData)

    if (this.mode === 'add') {
      this.http.post('http://localhost:3000/api/activite', formData).subscribe({
        next: () => this.close(true),
        error: (err) => console.error('Erreur ajout activité', err),
      });
    } else if (this.mode === 'edit') {
      // this.http.put(`http://localhost:3000/api/activites/${this.activite.id}`, formData).subscribe({
      //   next: () => this.close(true),
      //   error: (err) => console.error('Erreur modification activité', err),
      // });
    }
  }
}
