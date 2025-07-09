import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evenement {
  id?: number;
  nom: string;
  description?: string;
  date: string;
  lieu?: string;
  image?: string; // nom de fichier (ex: "monimage.jpg")
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
    return this.http.get<Evenement[]>(this.apiUrl);
  }

  // ✅ Récupérer un événement par ID
  getEvenementParId(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.apiUrl}/${id}`);
  }

  // ✅ Ajouter un événement avec image
  ajouterEvenementAvecImage(formData: FormData): Observable<Evenement> {
    return this.http.post<Evenement>(this.apiUrl, formData);
  }

  // ✅ Modifier un événement avec ou sans nouvelle image
  modifierEvenementAvecImage(id: number, formData: FormData): Observable<Evenement> {
    return this.http.put<Evenement>(`${this.apiUrl}/${id}`, formData);
  }

  // ✅ Supprimer un événement
  supprimerEvenement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ✅ Obtenir l'URL de l'image (à afficher dans le front)
  getImageUrl(imageFileName: string): string {
    const url = `http://localhost:3000/uploads/${imageFileName}`;
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
