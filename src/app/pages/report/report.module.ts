import { ChartModule } from 'angular-highcharts';
import { FieldService } from '../../service/field.service';
import { CampoModalModule } from '../../components/campo-modal/campo-modal.module';
import { LoadingService } from '../../service/loading.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavParams } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ReportPage } from './report.page';
import { Routes, RouterModule } from '@angular/router';
import { AppHeaderModule } from 'src/app/components/app-header/app-header.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { PixelTragectoryPage } from '../pixel-tragectory/pixel-tragectory.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

const routes: Routes = [
  {
    path: '',
    component: ReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppHeaderModule,
    RouterModule.forChild(routes),
    LeafletModule,
    LeafletDrawModule,
    CampoModalModule,
    ChartModule // add ChartModule to your imports
  ],
  declarations: [ReportPage, PixelTragectoryPage],
  providers: [LoadingService, FieldService, NavParams, ScreenOrientation]
})
export class ReportPageModule {}