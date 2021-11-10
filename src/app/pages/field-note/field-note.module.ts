import { NoteModalModule } from './../../components/note-modal/note-modal.module';
import { FieldService } from '../../service/field.service';
import { LoadingService } from '../../service/loading.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavParams } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldNotePage } from './field-note.page';
import { Routes, RouterModule } from '@angular/router';
import { AppHeaderModule } from 'src/app/components/app-header/app-header.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { NoteModalComponent } from 'src/app/components/note-modal/note-modal';

const routes: Routes = [
  {
    path: '',
    component: FieldNotePage
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
    ReactiveFormsModule,
    NoteModalModule
  ],
  declarations: [FieldNotePage],
  providers: [LoadingService, FieldService, NavParams]
})
export class FieldNotePageModule {}
