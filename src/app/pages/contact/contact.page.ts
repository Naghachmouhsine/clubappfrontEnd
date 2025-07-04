import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonTextarea, 
  IonSelect, 
  IonSelectOption 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton, 
    IonIcon, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonTextarea, 
    IonSelect, 
    IonSelectOption,
    TranslateModule
  ]
})
export class ContactPage {

  contacts = [
  {
    name: 'Yassine El Amrani',
    position: 'Responsable Accueil',
    role: 'Gestion des réservations',
    email: 'yassine.amrani@rtc-fes.ma',
    phone: '+212 6 12 34 56 78',
    photo: 'assets/images/user_img.jpg'
  },
  {
    name: 'Nadia Benali',
    position: 'Responsable Communication',
    role: 'Relations presse et événements',
    email: 'nadia.benali@rtc-fes.ma',
    phone: '+212 6 23 45 67 89',
    photo: 'assets/images/user_img.jpg'
  },
  {
    name: 'Ahmed Lakhlifi',
    position: 'Entraîneur Principal',
    role: 'Encadrement sportif',
    email: 'ahmed.lakhlifi@rtc-fes.ma',
    phone: '+212 6 34 56 78 90',
    photo: 'assets/images/user_img.jpg'
  },
  {
    name: 'Sara El Idrissi',
    position: 'Responsable Adhésions',
    role: 'Gestion des membres',
    email: 'sara.idrissi@rtc-fes.ma',
    phone: '+212 6 45 67 89 01',
    photo: 'assets/images/user_img.jpg'
  },
  {
    name: 'Mohamed Tazi',
    position: 'Responsable Technique',
    role: 'Maintenance et infrastructure',
    email: 'mohamed.tazi@rtc-fes.ma',
    phone: '+212 6 56 78 90 12',
    photo: 'assets/images/user_img.jpg'
  },
  {
    name: 'Fatima Zahra Bennis',
    position: 'Assistante Accueil',
    role: 'Support aux visiteurs',
    email: 'fatima.bennis@rtc-fes.ma',
    phone: '+212 6 67 89 01 23',
    photo: 'assets/images/user_img.jpg'
  }
];


  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['general', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      alert('Message envoyé avec succès!');
      this.contactForm.reset();
    }
  }

  openChat(contact: any) {
    console.log('Opening chat with', contact.name);
  }

  addToContacts(contact: any) {
    console.log('Adding to contacts:', contact.name);
  }



  showAll = false;

get visibleContacts() {
  return this.showAll ? this.contacts : this.contacts.slice(0, 3);
}

toggleViewMore() {
  this.showAll = !this.showAll;
}

callContact(phone: string) {
  window.open(`tel:${phone}`, '_system'); // lance l'appel téléphonique
}

viewDetails(contact: any) {
  console.log('Voir détails pour :', contact.name);
  // Tu peux ici ouvrir une modale, ou naviguer vers une page de profil avec des infos supplémentaires
}


}