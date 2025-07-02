import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer-dark',
  templateUrl: './footer-dark.component.html',
  styleUrls: ['./footer-dark.component.scss'],
  standalone: true,
  imports: [TranslateModule]
})
export class FooterDarkComponent implements OnInit, OnDestroy {
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
