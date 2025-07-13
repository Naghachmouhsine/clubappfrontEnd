import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.page.html',
  styleUrls: ['./equipe.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class EquipePage implements OnInit {

  teamMembers = [
    {
      name: 'John Doe',
      position: 'Manager',
      email: 'john@example.com',
      category: 'management',
      photo: 'assets/images/team/john.jpg',
      description: 'Responsable de la gestion du club'
    },
    {
      name: 'Jane Smith',
      position: 'Coach',
      email: 'jane@example.com',
      category: 'coaching',
      photo: 'assets/images/team/jane.jpg',
      description: 'Entraîneur principal'
    }
  ];

  selectedCategory = 'all';
  filteredTeam = this.teamMembers;

  constructor() { }

  ngOnInit() {
    this.filterTeam();
  }

  contactMember(member: any) {
    // Logique pour contacter un membre
    console.log('Contacter:', member);
  }

  filterTeam() {
    if (this.selectedCategory === 'all') {
      this.filteredTeam = this.teamMembers;
    } else {
      this.filteredTeam = this.teamMembers.filter(member => member.category === this.selectedCategory);
    }
  }

}
