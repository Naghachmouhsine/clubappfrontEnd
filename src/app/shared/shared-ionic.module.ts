// src/app/shared/shared-ionic.module.ts
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  exports: [
    IonicModule,
    CommonModule,
    TranslateModule
  ]
})
export class SharedIonicModule {}
