import { FieldService } from '../../service/field.service';
import { CampoModalModule } from '../../components/campo-modal/campo-modal.module';
import { LoadingService } from '../../service/loading.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RelatorioPage } from './relatorio.page';
import { Routes, RouterModule } from '@angular/router';
import { AppHeaderModule } from 'src/app/components/app-header/app-header.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

const routes: Routes = [
  {
    path: '',
    component: RelatorioPage
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
    CampoModalModule
  ],
  declarations: [RelatorioPage],
  providers: [LoadingService, FieldService]
})
export class RelatorioPageModule {}
