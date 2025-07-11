import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedIonicModule } from '../shared/shared-ionic.module';
import { HeroSectionComponent } from '../components/hero-section/hero-section.component';
import { ServicesSectionComponent } from '../components/services-section/services-section.component';
import { AboutSectionComponent } from '../components/about-section/about-section.component';
import { GallerySectionComponent } from '../components/gallery-section/gallery-section.component';

import { FooterDarkComponent } from '../components/footer-dark/footer-dark.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',  
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, SharedIonicModule,TranslateModule,ReactiveFormsModule,
    HeroSectionComponent, ServicesSectionComponent, AboutSectionComponent, GallerySectionComponent, FooterDarkComponent
  ],
})
export class HomePage {
  contactForm: FormGroup;

   constructor(private fb: FormBuilder, private translate: TranslateService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['general', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      alert('Message envoyé avec succès!');
      this.contactForm.reset();
    }
  }

}
