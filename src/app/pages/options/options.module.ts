import { LegendInfoModalModule } from './../../components/legend-info-modal/legend-info-modal.modules';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { OptionsPage } from './options.page';
import { Routes, RouterModule } from '@angular/router';
import { AppHeaderModule } from 'src/app/components/app-header/app-header.module';

const routes: Routes = [
  {
    path: '',
    component: OptionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppHeaderModule,
    RouterModule.forChild(routes),
    LegendInfoModalModule
  ],
  declarations: [OptionsPage]
})
export class OptionsPageModule {}
