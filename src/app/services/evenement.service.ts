import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Evenement {
  id?: number;
  nom: string;
  description?: string;
  date: string;
  lieu?: string;
  image_url?: string; // nom de fichier (ex: "monimage.jpg")
  photoUrl?: string | null; // URL complète de l'image
}

// Interface pour les événements existants (avec ID obligatoire)
export interface EvenementExistant extends Evenement {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  // ✅ Ajouter un événement sans image
  ajouterEvenement(formEvenement: { nom: string; description: string; date: string; lieu: string; }): Observable<Evenement> {
    return this.http.post<Evenement>(this.apiUrl, formEvenement);
  }

  // ✅ Modifier un événement sans image
  modifierEvenement(id: any, formEvenement: { nom: string; description: string; date: string; lieu: string; }): Observable<Evenement> {
    return this.http.put<Evenement>(`${this.apiUrl}/${id}`, formEvenement);
  }

  private apiUrl = 'http://localhost:3000/api/evenements';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer tous les événements
  getEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(this.apiUrl).pipe(
      map(evenements => evenements.map(evenement => ({
        ...evenement,
        photoUrl: evenement.image_url ? this.getImageUrl(evenement.image_url) : null
      })))
    );
  }

  // ✅ Récupérer un événement par ID
  getEvenementParId(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.apiUrl}/${id}`).pipe(
      map(evenement => ({
        ...evenement,
        photoUrl: evenement.image_url ? this.getImageUrl(evenement.image_url) : null
      }))
    );
  }

  // ✅ Ajouter un événement avec image
  ajouterEvenementAvecImage(formData: FormData): Observable<Evenement> {
    return this.http.post<Evenement>(this.apiUrl, formData).pipe(
      map(evenement => ({
        ...evenement,
        photoUrl: evenement.image_url ? this.getImageUrl(evenement.image_url) : null
      }))
    );
  }

  // ✅ Modifier un événement avec ou sans nouvelle image
  modifierEvenementAvecImage(id: number, formData: FormData): Observable<Evenement> {
    return this.http.put<Evenement>(`${this.apiUrl}/${id}`, formData).pipe(
      map(evenement => ({
        ...evenement,
        photoUrl: evenement.image_url ? this.getImageUrl(evenement.image_url) : null
      }))
    );
  }

  // ✅ Supprimer un événement
  supprimerEvenement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ✅ Obtenir l'URL de l'image (à afficher dans le front)
  getImageUrl(imageFileName: string): string {
    if (!imageFileName) {
      console.warn('Nom de fichier image vide');
      return '';
    }

    let cleanFileName: string;
    
    // Cas 1: Le fichier commence par /uploads/ (chemin complet depuis la racine)
    if (imageFileName.startsWith('/uploads/')) {
      cleanFileName = imageFileName.substring(1); // Enlever le / du début
    }
    // Cas 2: Le fichier commence par uploads/ (chemin relatif)
    else if (imageFileName.startsWith('uploads/')) {
      cleanFileName = imageFileName;
    }
    // Cas 3: Juste le nom du fichier
    else {
      cleanFileName = `uploads/${imageFileName}`;
    }
    
    const url = `http://localhost:3000/${cleanFileName}`;
    console.log('Fichier original:', imageFileName);
    console.log('Fichier nettoyé:', cleanFileName);
    console.log('URL construite pour l\'image:', url);
    return url;
  }

  // ✅ Tester si une image existe
  testImageExists(imageUrl: string): Observable<boolean> {
    return new Observable(observer => {
      const img = new Image();
      img.onload = () => {
        observer.next(true);
        observer.complete();
      };
      img.onerror = () => {
        observer.next(false);
        observer.complete();
      };
      img.src = imageUrl;
    });
  }

}
