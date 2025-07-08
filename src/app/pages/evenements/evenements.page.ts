import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EvenementService } from 'src/app/services/evenement.service';
import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-evenements',
  templateUrl: './evenements.page.html',
  styleUrls: ['./evenements.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppHeaderComponent
  ]
})
export class EvenementsPage implements OnInit {

  evenements: any[] = [];
  role: string = 'admin';
  showFormModal = false;
  selectedEvenement: any = null;

  formEvenement = {
    nom: '',
    description: '',
    date: '',
    lieu: ''
  };

  alertDelete = {
    evenementId: null as number | null,
    show: false
  };

  alertButtons: any[] = [];

  private formatDateToInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatInputToDate(inputDate: string): string {
    if (!inputDate) return '';
    const dateParts = inputDate.split('-');
    if (dateParts.length !== 3) return '';
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    return `${year}-${month}-${day}`;
  }

  constructor(private evenementService: EvenementService) {}

  ngOnInit() {
    this.chargerEvenements();
    this.alertButtons = [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: () => this.annulerSuppression()
      },
      {
        text: 'Supprimer',
        role: 'destructive',
        handler: () => this.supprimerEvenement()
      }
    ];
  }

  chargerEvenements() {
    this.evenementService.getEvenements().subscribe({
      next: data => this.evenements = data,
      error: err => console.error('Erreur de chargement des événements', err)
    });
  }

  ouvrirFormulaire(evenement: any = null) {
    this.selectedEvenement = evenement;
    if (evenement) {
      this.formEvenement = {
        ...evenement,
        date: this.formatDateToInput(evenement.date)  // formate la date
      };
    } else {
      this.formEvenement = { nom: '', description: '', date: '', lieu: '' };
    }
    this.showFormModal = true;
  }

  fermerFormulaire() {
    this.showFormModal = false;
    this.selectedEvenement = null;
    this.formEvenement = { nom: '', description: '', date: '', lieu: '' };
  }

  soumettreFormulaire() {
    if (!this.formEvenement.nom || !this.formEvenement.date) {
      alert('Nom et date obligatoires');
      return;
    }

    if (this.selectedEvenement) {
      this.evenementService.modifierEvenement(this.selectedEvenement.id, this.formEvenement).subscribe({
        next: () => {
          this.chargerEvenements();
          this.fermerFormulaire();
        },
        error: err => {
          console.error(err);
          alert("Erreur lors de la modification.");
        }
      });
    } else {
      this.evenementService.ajouterEvenement(this.formEvenement).subscribe({
        next: () => {
          this.chargerEvenements();
          this.fermerFormulaire();
        },
        error: err => {
          console.error(err);
          alert("Erreur lors de l'ajout.");
        }
      });
    }
  }

  demanderSuppression(id: number) {
    this.alertDelete = { evenementId: id, show: true };
  }

  supprimerEvenement() {
    if (this.alertDelete.evenementId === null) return;
    this.evenementService.supprimerEvenement(this.alertDelete.evenementId).subscribe({
      next: () => {
        this.chargerEvenements();
        this.alertDelete = { evenementId: null, show: false };
      },
      error: err => {
        console.error(err);
        alert("Erreur lors de la suppression.");
      }
    });
  }

  annulerSuppression() {
    this.alertDelete = { evenementId: null, show: false };
  }
}
