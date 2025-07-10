import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Evenement, EvenementService } from 'src/app/services/evenement.service';
import { UserService, UserProfile } from 'src/app/services/user.service';
import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { HttpClient } from '@angular/common/http';
import { AnyBuyerError } from '@stripe/stripe-js';
import { RecempenseService } from 'src/app/services/recempense.service';

@Component({
  selector: 'app-evenements',
  templateUrl: './evenements.page.html',
  styleUrls: ['./evenements.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppHeaderComponent,
    TranslateModule
  ]
})
export class EvenementsPage implements OnInit {

  evenements: Evenement[] = [];
  listeEvenements: Evenement[] = [];

  role: string = '';
  idAdherent: string = '';
  showFormModal = false;
  selectedEvenement: any = null;

  imageFile: File | null = null;
  imagePreview: string | null = null;
  router: any;

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;

      // Aperçu image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


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

  constructor(
    private evenementService: EvenementService,
    private userService: UserService,
    private http: HttpClient,
    private servicePoint:RecempenseService
  ) { }

  ngOnInit() {
    this.testerConnexionServeur();
    this.chargerEvenements();
    this.initialiserProfilUtilisateur();

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

  // Tester la connexion au serveur
  testerConnexionServeur() {
    this.http.get('http://localhost:3000/api/evenements').subscribe({
      next: (data) => {
        console.log('✅ Serveur backend accessible');
      },
      error: (err) => {
        console.error('❌ Serveur backend non accessible:', err);
        if (err.status === 0) {
          console.error('Vérifiez que le serveur est démarré sur http://localhost:3000');
        }
      }
    });
  }

  initialiserProfilUtilisateur() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.warn('⚠️ Aucun userId trouvé dans le localStorage. L’utilisateur est peut-être déconnecté ou non authentifié.');
      this.router.navigate(['/login']);
      return;
    }

    this.userService.loadUserProfile(userId).subscribe(
      (profile) => {
        this.role = profile.role.toLowerCase(); // Sécurité
        this.idAdherent = profile.id.toString();
        console.log('✅ Profil chargé :', this.role);
      },
      (error) => {
        console.error('Erreur lors du chargement du profil :', error);
      }
    );
  }


  chargerEvenements() {
    this.evenementService.getEvenements().subscribe({
      next: (evenements) => {
        console.log('Données reçues du backend:', evenements);

        // Mapper les événements avec les URLs complètes des images
        this.evenements = evenements.map(e => ({
          ...e,
          photoUrl: e.image ? this.evenementService.getImageUrl(e.image) : null
        }));

        // Aussi assigner à listeEvenements pour compatibilité
        this.listeEvenements = this.evenements;

        // Debug des URLs d'images
        this.evenements.forEach(evenement => {
          console.log(`Événement: ${evenement.nom}`);
          console.log(`Image filename: ${evenement.image}`);
          console.log(`Photo URL: ${evenement.photoUrl}`);
        });
      },
      error: (err) => {
        console.error('Erreur de chargement des événements', err);
        this.evenements = [];
        this.listeEvenements = [];
      }
    });
  }

  ouvrirFormulaire(evenement: any = null) {
    this.selectedEvenement = evenement;
    if (evenement) {
      this.formEvenement = {
        ...evenement,
        date: this.formatDateToInput(evenement.date)
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
      alert('Le nom et la date sont obligatoires.');
      return;
    }

    const isModification = !!this.selectedEvenement;

    if (this.imageFile) {
      const formData = new FormData();
      formData.append('nom', this.formEvenement.nom);
      formData.append('description', this.formEvenement.description);
      formData.append('date', this.formEvenement.date);
      formData.append('lieu', this.formEvenement.lieu);
      formData.append('image', this.imageFile); // nom du champ côté backend

      const request$ = isModification
        ? this.evenementService.modifierEvenementAvecImage(this.selectedEvenement.id, formData)
        : this.evenementService.ajouterEvenementAvecImage(formData);

      request$.subscribe({
        next: () => {
          this.chargerEvenements();
          this.fermerFormulaire();
          this.imageFile = null;
          this.imagePreview = null;
        },
        error: err => console.error('Erreur lors de l’enregistrement de l’événement', err)
      });
    } else {
      // Sans image, on envoie simplement les données texte
      const request$ = isModification
        ? this.evenementService.modifierEvenement(this.selectedEvenement.id, this.formEvenement)
        : this.evenementService.ajouterEvenement(this.formEvenement);

      request$.subscribe({
        next: () => {
          this.chargerEvenements();
          this.fermerFormulaire();
        },
        error: err => console.error('Erreur lors de l’enregistrement de l’événement', err)
      });
    }
  }


  demanderSuppression(id: number) {
    if (!id) {
      console.error('ID de l\'événement manquant');
      alert('Erreur: Impossible de supprimer cet événement (ID manquant)');
      return;
    }
    this.alertDelete = { evenementId: id, show: true };
  }

  // Méthode sécurisée pour la suppression depuis le template
  demanderSuppressionSecurise(evenement: Evenement) {
    if (!evenement.id) {
      console.error('ID de l\'événement manquant pour:', evenement.nom);
      alert('Erreur: Impossible de supprimer cet événement (ID manquant)');
      return;
    }
    this.demanderSuppression(evenement.id);
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

  participerEvenement(evenement: any) {
    console.log('Rôle actuel de l\'utilisateur :', this.role);
    if (this.role !== 'adherent') {
      alert('Seuls les adhérents peuvent participer à un événement.');
      return;
    }

    if (!this.idAdherent) {
      alert('Identifiant adhérent introuvable. Veuillez vous reconnecter.');
      return;
    }

    const participationData = {
      idAdherant: this.idAdherent,
      idEvenement: evenement.id
    };

    console.log(participationData)

    this.http.post<any>('http://localhost:3000/api/evenements/participer', participationData)
      .subscribe({
        next: (rep) => {
          if(rep.isParticiper && rep.message){
            alert(`${rep.message} : ${evenement.nom}`); // le message pour indiquer a user que deje participer dans evenement
          }else{
            if(rep.totalPoints)
              this.servicePoint.ajoutePoints(rep.totalPoints)
            alert(`Vous êtes inscrit à l'événement : ${evenement.nom}`);
          }
          this.chargerEvenements();
        },
        error: (err) => {
          console.error('Erreur participation:', err);
          alert('Une erreur est survenue lors de la participation. Veuillez réessayer.');
        }
      });
  }

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
    const [year, month, day] = inputDate.split('-');
    return `${year}-${month}-${day}`;
  }

  // Gestion des erreurs de chargement d'image
  onImageError(event: any, evenement: Evenement) {
    console.error(`Erreur de chargement de l'image pour l'événement ${evenement.nom}:`, evenement.photoUrl);
    console.error('URL tentée:', event.target.src);

    // Vérifier si le fichier existe vraiment
    if (evenement.image) {
      console.log('Nom du fichier image:', evenement.image);
      console.log('URL construite:', this.evenementService.getImageUrl(evenement.image));
    }

    // L'image par défaut sera affichée automatiquement grâce au template
    event.target.style.display = 'none';
  }

}
