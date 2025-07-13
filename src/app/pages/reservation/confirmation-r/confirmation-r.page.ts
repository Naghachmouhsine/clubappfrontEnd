import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-r',
  templateUrl: './confirmation-r.page.html',
  styleUrls: ['./confirmation-r.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class ConfirmationRPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
