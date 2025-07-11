import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-activite-r',
  templateUrl: './activite-r.page.html',
  styleUrls: ['./activite-r.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class ActiviteRPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
