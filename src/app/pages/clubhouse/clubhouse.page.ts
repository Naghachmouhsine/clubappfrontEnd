import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-clubhouse',
  templateUrl: './clubhouse.page.html',
  styleUrls: ['./clubhouse.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class ClubhousePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
