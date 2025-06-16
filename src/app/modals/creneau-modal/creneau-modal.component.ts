import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creneau-modal',
  templateUrl: './creneau-modal.component.html',
  styleUrls: ['./creneau-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, ReactiveFormsModule],
})
export class CreneauModalComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | 'detail' = 'add';
  @Input() creneau: any;
  @Input() installations: any[] = [];
  @Input() creneauxDetails?: any; // pour mode detail

  creneauForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.creneauForm = this.fb.group({
      date: [null, Validators.required],
      heure_debut: ['', Validators.required],
      heure_fin: ['', Validators.required],
      installation_id: ['', Validators.required],
      disponible: [true, Validators.required],
    }, { validators: this.heureFinApresHeureDebut });
  }

  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }
  ngOnInit() {
    if ((this.mode === 'edit' || this.mode === 'detail') && this.creneau?.id) {
    // Faire la requête GET pour récupérer les données complètes du créneau
    this.http.get(`http://localhost:3000/api/creneaux/${this.creneau.id}`).subscribe({
      next: (data: any) => {
        this.creneau = data; // mise à jour de l'objet creneau avec les données reçues

        // Patch du formulaire avec les données du serveur
        this.creneauForm.patchValue({
          date: this.formatDateForInput(this.creneau.date),
          heure_debut: this.creneau.heure_debut,
          heure_fin: this.creneau.heure_fin,
          installation_id: this.creneau.installation_id,
          disponible: this.creneau.disponible === 'oui' || this.creneau.disponible === true,
        });

        if (this.mode === 'detail') {
          this.creneauForm.disable();
        }
      },
      error: err => {
        console.error('Erreur lors du chargement du créneau', err);
      }
    });
  } else if (this.mode === 'add') {
    // Mode ajout, on ne charge rien
    // Si tu veux, tu peux reset le formulaire
    this.creneauForm.reset({ disponible: true });
  }
  }

  heureFinApresHeureDebut(group: FormGroup) {
    const debut = group.get('heure_debut')?.value;
    const fin = group.get('heure_fin')?.value;
    if (!debut || !fin) return null;

    // Retourne une erreur si heure_fin <= heure_debut
    return fin > debut ? null : { invalidTime: true };
  }

  async close(reload = false) {
    await this.modalCtrl.dismiss({ reload });
  }

  submit() {
    if (this.creneauForm.invalid) {
      console.warn('Formulaire invalide');
      return;
    }

    const heureDebut = this.creneauForm.value.heure_debut?.slice(0, 5);
    const heureFin = this.creneauForm.value.heure_fin?.slice(0, 5);

    const formData = {
      ...this.creneauForm.value,
      heure_debut: heureDebut,
      heure_fin: heureFin,
      installation_id: Number(this.creneauForm.value.installation_id),
      disponible: this.creneauForm.value.disponible ? 'oui' : 'non',
    };
    console.log('FormData envoyé pour édition :', formData); // AJOUTE CECI

    if (this.mode === 'add') {
      this.http.post('http://localhost:3000/api/creneaux', formData).subscribe({
        next: () => this.close(true),
        error: (err) => console.error('Erreur ajout créneau', err),
      });
    } else if (this.mode === 'edit') {
      this.http.put(`http://localhost:3000/api/creneaux/${this.creneau.id}`, formData).subscribe({
        next: () => this.close(true),
        error: (err) => console.error('Erreur modification créneau', err),
      });
    }
  }
  
}
