import { LoadingService } from 'src/app/service/loading.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NotesPage } from './notes.page';
import { Routes, RouterModule } from '@angular/router';
import { AppHeaderModule } from 'src/app/components/app-header/app-header.module';
import { NoteModalModule } from 'src/app/components/note-modal/note-modal.module';

const routes: Routes = [
  {
    path: '',
    component: NotesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppHeaderModule,
    NoteModalModule,
    RouterModule.forChild(routes)
  ],
  providers: [LoadingService],
  declarations: [NotesPage]
})
export class NotesPageModule {}
