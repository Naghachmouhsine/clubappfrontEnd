import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedIonicModule } from '../shared/shared-ionic.module';
import { HeroSectionComponent } from '../components/hero-section/hero-section.component';
import { ServicesSectionComponent } from '../components/services-section/services-section.component';
import { AboutSectionComponent } from '../components/about-section/about-section.component';
import { GallerySectionComponent } from '../components/gallery-section/gallery-section.component';

import { FooterDarkComponent } from '../components/footer-dark/footer-dark.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',  
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, SharedIonicModule,
    HeroSectionComponent, ServicesSectionComponent, AboutSectionComponent, GallerySectionComponent, FooterDarkComponent
  ],
})
export class HomePage {
  constructor() {}
}
