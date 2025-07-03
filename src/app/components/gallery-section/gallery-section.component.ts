import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-gallery-section',
  templateUrl: './gallery-section.component.html',
  styleUrls: ['./gallery-section.component.scss'],
  imports: [CommonModule, TranslateModule]
})
export class GallerySectionComponent implements OnInit, OnDestroy {
  images = [
    'assets/images/Tennis.jpg',
    'assets/images/g1.jpg',
    'assets/images/g2.jpg',
    'assets/images/g3.jpg',
    'assets/images/g4.jpg',
    'assets/images/g5.jpg',
    'assets/images/g6.jpg',
    'assets/images/g7.jpg',
    'assets/images/g8.jpg',
    'assets/images/g9.jpg',
    'assets/images/g10.jpg',
    'assets/images/g11.jpg',
    'assets/images/g12.jpg',
    'assets/images/g13.jpg',
    'assets/images/g14.jpg',
    'assets/images/g15.jpg',
    'assets/images/g16.jpg',
    'assets/images/Piscine.jpg',
    'assets/images/Piscine1.jpg',
    'assets/images/Padel.jpg',
    'assets/images/volley.jpg',
    'assets/images/Foot.jpg',
    'assets/images/Basket.jpg',
    'assets/images/Athletisme.jpg',
    'assets/images/Arts-Martiaux.jpg',
    'assets/images/Petanque.jpg'
  ];
  private langSub: any;
  constructor(private translate: TranslateService, private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.cdr.markForCheck();
    });
  }
  ngOnDestroy() {
    if (this.langSub) this.langSub.unsubscribe();
  }
}
