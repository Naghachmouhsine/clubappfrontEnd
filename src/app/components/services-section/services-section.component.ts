import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-services-section',
  templateUrl: './services-section.component.html',
  styleUrls: ['./services-section.component.scss'],
  imports: [CommonModule, TranslateModule]
})
export class ServicesSectionComponent implements OnInit, OnDestroy {
  services = [
    { title: 'home.services.reservation_title', desc: 'home.services.reservation_desc', icon: 'fas fa-calendar-check' },
    { title: 'home.services.cours_title', desc: 'home.services.cours_desc', icon: 'fas fa-chalkboard-teacher' },
    { title: 'home.services.events_title', desc: 'home.services.events_desc', icon: 'fas fa-trophy' },
    { title: 'home.services.clubhouse_title', desc: 'home.services.clubhouse_desc', icon: 'fas fa-home' }
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
