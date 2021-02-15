import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EventDetailPage } from './event-detail.page';
import { Routes, RouterModule } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { AppHeaderModule } from 'src/app/components/app-header/app-header.module';

const routes: Routes = [
  {
    path: '',
    component: EventDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppHeaderModule,
    RouterModule.forChild(routes)
  ],
  providers: [Geolocation, NativeGeocoder],
  declarations: [EventDetailPage]
})
export class EventDetailPageModule {}
