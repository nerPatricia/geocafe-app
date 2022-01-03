import { ToastService } from '../../service/toast.service';
import { SelectFieldsModalComponent } from './select-fields-modal';
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
  declarations: [SelectFieldsModalComponent],
  exports: [SelectFieldsModalComponent]
})
export class SelectFieldsModalModule {}
