// src/app/shared/shared-ionic.module.ts
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
  exports: [
    IonicModule,
    CommonModule
  ]
})
export class SharedIonicModule {}
