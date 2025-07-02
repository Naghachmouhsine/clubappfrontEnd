import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent implements OnInit, OnDestroy {
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
