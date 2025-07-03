import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonContent, IonTitle, IonModal, IonButton, IonIcon } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonContent, IonTitle, IonModal, IonButton, IonIcon]
})
export class ContactPage implements OnInit {
  showCardModal = false;
  selectedContact: any = null;
  formData = {
    nom: '',
    email: '',
    telephone: '',
    message: ''
  };

  contacts = [
    {
      id: 'yassine',
      nom: 'Yassine El Amrani',
      poste: 'Responsable Accueil',
      email: 'yassine.amrani@rtc-fes.ma',
      telephone: '+212612345678',
      image: 'assets/images/user_img.jpg'
    },
    {
      id: 'ahmed',
      nom: 'Ahmed Bennani',
      poste: 'Directeur Technique',
      email: 'ahmed.bennani@rtc-fes.ma',
      telephone: '+212611223344',
      image: 'assets/images/staff2.jpg'
    },
    {
      id: 'karim',
      nom: 'Karim Alaoui',
      poste: 'Entraîneur Principal',
      email: 'karim.alaoui@rtc-fes.ma',
      telephone: '+212655667788',
      image: 'assets/images/staff3.jpg'
    },
    {
      id: 'fatima',
      nom: 'Fatima Zahra',
      poste: 'Responsable Événements',
      email: 'fatima.zahra@rtc-fes.ma',
      telephone: '+212699887766',
      image: 'assets/images/staff4.jpg'
    },
    {
      id: 'omar',
      nom: 'Omar Tahiri',
      poste: 'Responsable Maintenance',
      email: 'omar.tahiri@rtc-fes.ma',
      telephone: '+212677554433',
      image: 'assets/images/staff5.jpg'
    },
    {
      id: 'aicha',
      nom: 'Aicha Benali',
      poste: 'Secrétaire Générale',
      email: 'aicha.benali@rtc-fes.ma',
      telephone: '+212644332211',
      image: 'assets/images/staff6.jpg'
    }
  ];

  constructor(private menu: MenuController) {}

  ngOnInit() {}

  toggleMenu() {
    this.menu.toggle('main-content');
  }

  openCardModal(contact: any) {
    this.selectedContact = contact;
    this.showCardModal = true;
  }

  downloadVCard(contact: any) {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.nom}
ORG:Royal Tennis Club de Fès
TITLE:${contact.poste}
EMAIL:${contact.email}
TEL:${contact.telephone}
ADR:;;123 Avenue du Tennis;Fès;;;Maroc
END:VCARD`;
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contact.nom}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  onSubmit() {
    if (this.formData.nom && this.formData.email && this.formData.message) {
      console.log('Formulaire soumis :', this.formData);
      this.formData = { nom: '', email: '', telephone: '', message: '' };
    }
  }
}

export { ContactPage }; // Export explicite pour éviter TS2306