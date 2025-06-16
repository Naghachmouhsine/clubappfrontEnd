import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class UserModalComponent {
  @Input() userId!: number;
  @Input() mode!: 'edit' | 'detail' | 'add'; // mode: 'edit', 'detail', or 'add'
  user: any = {};

  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  ngOnInit() {
    if (this.mode === 'edit' || this.mode === 'detail') {
      this.http.get(`http://localhost:3000/api/utilisateurs/${this.userId}`)
        .subscribe((res: any) => this.user = res);
    } else if (this.mode === 'add') {
      this.user = {
        id: null,
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        role: 'adherent'
      };
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  save() {
    if (this.mode === 'edit') {
      const updatedUser = {
        ...this.user,
        email: undefined, // email non modifiable
        id: undefined     // id non modifiable
      };

      this.http.put(`http://localhost:3000/api/utilisateurs/${this.userId}`, updatedUser)
        .subscribe(() => {
          this.modalCtrl.dismiss(true); // true = mise à jour faite
        });
    } else if (this.mode === 'add') {
      this.http.post(`http://localhost:3000/api/utilisateurs`, this.user)
        .subscribe(() => {
          this.modalCtrl.dismiss(true); // true = ajout fait
        });
    }
  }
}
