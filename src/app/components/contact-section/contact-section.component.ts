import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-section',
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss'],
  standalone: true,
  imports: [TranslateModule]
})
export class ContactSectionComponent implements OnInit, OnDestroy {
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
