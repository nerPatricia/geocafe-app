import { ToastService } from '../../service/toast.service';
import { LegendInfoModalComponent } from './legend-info-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ToastService],
  declarations: [LegendInfoModalComponent],
  exports: [LegendInfoModalComponent]
})
export class LegendInfoModalModule {}
