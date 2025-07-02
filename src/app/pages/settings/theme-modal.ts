import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { ThemeService, ThemeType } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-theme-modal',
  standalone: true,
  templateUrl: './theme-modal.html',
  styleUrls: ['./theme-modal.scss'],
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class ThemeModalComponent {
  selectedTheme: ThemeType;
  constructor(
    private modalCtrl: ModalController,
    private themeService: ThemeService
  ) {
    this.selectedTheme = this.themeService.getTheme();
  }
  close() {
    this.modalCtrl.dismiss();
  }
  save() {
    this.themeService.setTheme(this.selectedTheme);
    this.modalCtrl.dismiss({ theme: this.selectedTheme });
  }
}
