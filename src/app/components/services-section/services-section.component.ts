import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-services-section',
  templateUrl: './services-section.component.html',
  styleUrls: ['./services-section.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class ServicesSectionComponent implements OnInit, OnDestroy {
  services = [
    {
      title: 'home.services.reservation_title',
      desc: 'home.services.reservation_desc',
      icon: 'fas fa-calendar-check',
      route: '/reservation/home'
    },
    {
      title: 'home.services.cours_title',
      desc: 'home.services.cours_desc',
      icon: 'fas fa-chalkboard-teacher',
      route: '/equipe' // ou /cours si tu veux une page dédiée aux cours
    },
    {
      title: 'home.services.events_title',
      desc: 'home.services.events_desc',
      icon: 'fas fa-trophy',
      route: '/evenements'
    },
    {
      title: 'home.services.clubhouse_title',
      desc: 'home.services.clubhouse_desc',
      icon: 'fas fa-home',
      route: '/clubhouse' // tu peux créer cette page ensuite
    }
  ];

  private langSub: any;

  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.langSub) this.langSub.unsubscribe();
  }

  naviguerVers(route: string) {
    this.router.navigateByUrl(route);
  }
}
