import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  contacts = [
    { name: 'Yassine El Amrani', role: 'Responsable Accueil', email: 'yassine.amrani@rtc-fes.ma', phone: '+212612345678', about: 'Frontend Developer', image: 'assets/images/user_img.jpg' },
    { name: 'John Smith', role: 'Digital Strategist', email: 'test@gmail.com', phone: '+212987654321', about: 'Frontend Developer', image: 'assets/images/msg2.png' },
    { name: 'Sarah Johnson', role: 'Marketing Manager', email: 'sarah.j@rtc-fes.ma', phone: '+212623456789', about: 'Marketing Specialist', image: 'assets/images/user_img2.jpg' },
    { name: 'Ahmed Benali', role: 'Coach Principal', email: 'ahmed.b@rtc-fes.ma', phone: '+212634567890', about: 'Tennis Coach', image: 'assets/images/user_img3.jpg' },
    { name: 'Fatima Zahra', role: 'Event Coordinator', email: 'fatima.z@rtc-fes.ma', phone: '+212645678901', about: 'Event Planner', image: 'assets/images/user_img4.jpg' },
    { name: 'Mohamed Amine', role: 'Facility Manager', email: 'mohamed.a@rtc-fes.ma', phone: '+212656789012', about: 'Operations Lead', image: 'assets/images/user_img5.jpg' }
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
FN:${contact.name}
ORG:Royal Tennis Club de Fès
TITLE:${contact.role}
EMAIL:${contact.email}
TEL:${contact.phone}
END:VCARD`;
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contact.name}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form Submitted:', form.value);
      form.reset();
    }
  }
}