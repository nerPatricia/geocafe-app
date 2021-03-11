import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CampoModalComponent } from './campo-modal';


@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [CampoModalComponent],
  exports: [CampoModalComponent]
})
export class CampoModalModule {}
