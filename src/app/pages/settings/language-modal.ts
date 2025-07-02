import { Component } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { LangService, LangType } from '../../services/lang.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-modal',
  standalone: true,
  templateUrl: './language-modal.html',
  styleUrls: ['./language-modal.scss'],
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class LanguageModalComponent {
  selectedLang: LangType;
  constructor(
    private modalCtrl: ModalController,
    private langService: LangService
  ) {
    this.selectedLang = this.langService.getLang();
  }
  close() {
    this.modalCtrl.dismiss();
  }
  save() {
    this.langService.setLang(this.selectedLang);
    this.modalCtrl.dismiss({ lang: this.selectedLang });
  }
}
